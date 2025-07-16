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
  expiresAt: { type: DataTypes.DATE }, // use
});

Booking.associate = (models) => {
  Booking.belongsTo(models.User, { foreignKey: "userId" });
  Booking.belongsTo(models.Departure, { foreignKey: "departureId" });
  // Many-to-Many: Booking <-> Seats
  Booking.belongsToMany(models.Seat, {
    through: "BookingSeats",
    foreignKey: "bookingId",
  });
};

module.exports = Booking;
