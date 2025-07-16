const {
  sequelize,
  Booking,
  Seat,
  Departure,
  Bus,
  Route,
} = require("../models/RelationalModel");

exports.reserveSeats = async (req, res) => {
  const userId = req.user.id;
  const { departure_id, seats } = req.body;

  if (
    !departure_id ||
    !Array.isArray(seats) ||
    seats.length < 1 ||
    seats.length > 4
  ) {
    return res
      .status(400)
      .json({ error: "departure_id and 1–4 seat numbers required" });
  }

  const t = await sequelize.transaction();
  try {
    const departure = await Departure.findByPk(departure_id, {
      include: Bus,
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!departure || !departure.Bus) {
      await t.rollback();
      return res.status(404).json({ error: "Departure or Bus not found" });
    }

    const totalSeats = departure.Bus.total_seats;

    if (seats.some((s) => s < 1 || s > totalSeats)) {
      await t.rollback();
      return res.status(400).json({ error: "Invalid seat number(s)" });
    }

    const conflictingSeats = await Seat.findAll({
      where: {
        departureId: departure_id,
        seatNumber: seats,
      },
      include: {
        model: Booking,
        where: {
          departureId: departure_id,
          status: ["RESERVED", "BOOKED"],
        },
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (conflictingSeats.length > 0) {
      await t.rollback();
      return res
        .status(409)
        .json({ error: "Some seat(s) already reserved/ booked" });
    }

    const booking = await Booking.create(
      {
        userId,
        departureId: departure_id,
        status: "RESERVED",
      },
      { transaction: t }
    );

    const seatRecords = await Seat.findAll({
      where: {
        departureId: departure_id,
        seatNumber: seats,
      },
      transaction: t,
    });

    await booking.addSeats(seatRecords, { transaction: t });

    await t.commit();
    res.status(201).json({ message: "Seats reserved", booking_id: booking.id });
  } catch (err) {
    await t.rollback();
    res
      .status(500)
      .json({ error: "Failed to reserve seats", details: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  const userId = req.user.id;
  const bookingId = req.params.booking_id;

  try {
    const booking = await Booking.findOne({
      where: { id: bookingId, userId },
      include: { model: Departure },
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status === "CANCELLED") {
      return res.status(400).json({ error: "Already cancelled" });
    }

    const now = new Date();
    const departureTime = new Date(booking.Departure.departure_time);
    const diffMinutes = (departureTime - now) / (60 * 1000);

    if (diffMinutes < 30) {
      return res
        .status(400)
        .json({ error: "Cannot cancel within 30 minutes of departure" });
    }

    booking.status = "CANCELLED";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Cancel failed", details: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  const userId = req.user.id;
  const bookingId = req.params.booking_id;

  try {
    const booking = await Booking.findOne({
      where: { id: bookingId, userId },
      include: [
        {
          model: Seat,
          attributes: ["seatNumber"],
        },
        {
          model: Departure,
          include: [Bus, Route],
        },
      ],
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json({
      id: booking.id,
      status: booking.status,
      seats: booking.Seats.map((s) => s.seatNumber),
      departure: {
        time: booking.Departure.departure_time,
        bus: booking.Departure.Bus?.bus_number,
        route: {
          from: booking.Departure.Route?.origin,
          to: booking.Departure.Route?.destination,
        },
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch booking", details: err.message });
  }
};
