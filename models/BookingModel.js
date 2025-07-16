const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const Booking = sequelize.define("Booking", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM("RESERVED", "BOOKED", "CANCELLED"),
    defaultValue: "RESERVED",
  },
  booking_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  departureId: { type: DataTypes.INTEGER, allowNull: false },
  expiresAt: { type: DataTypes.DATE },
});

Booking.associate = (models) => {
  Booking.belongsTo(models.User, { foreignKey: "userId" });
  Booking.belongsTo(models.Departure, { foreignKey: "departureId" });

  Booking.belongsToMany(models.Seat, {
    through: "BookingSeats",
    foreignKey: "bookingId",
  });
};

module.exports = Booking;
