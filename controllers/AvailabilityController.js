const { Seat, Departure, Booking, Bus } = require("../models/RelationalModel");

exports.getAvailableSeats = async (req, res) => {
  try {
    const { departure_id } = req.query;
    if (!departure_id) {
      return res.status(400).json({ error: "departure_id is required" });
    }

    const departure = await Departure.findByPk(departure_id, {
      include: Bus,
    });
    if (!departure) {
      return res.status(404).json({ error: "Departure not found" });
    }

    const totalSeats = departure.Bus.total_seats;

    const bookedSeats = await Seat.findAll({
      where: { departureId: departure_id },
      include: {
        model: Booking,
        where: {
          departureId: departure_id,
          status: ["RESERVED", "BOOKED"],
        },
      },
    });

    const takenSeatNumbers = bookedSeats.map((seat) => seat.seatNumber);

    const availableSeats = Array.from(
      { length: totalSeats },
      (_, i) => i + 1
    ).filter((num) => !takenSeatNumbers.includes(num));

    res.json({ availableSeats });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
