const { Op } = require("sequelize");
const { Booking } = require("../models/RelationalModel");

const expireReservedBookings = async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const expired = await Booking.update(
      { status: "CANCELLED" },
      {
        where: {
          status: "RESERVED",
          createdAt: { [Op.lt]: fiveMinutesAgo },
        },
      }
    );

    if (expired[0] > 0) {
      console.log(`Expired ${expired[0]} reserved booking(s).`);
    }
  } catch (err) {
    console.error("Error expiring reservations:", err.message);
  }
};

module.exports = expireReservedBookings;
