const Sequelize = require("sequelize");
const sequelize = require("../database/sequalize");

const User = require("./UserModel");
const Route = require("./RouteModel");
const Departure = require("./DepartureModel");
const Seat = require("./SeatModel");
const Booking = require("./BookingModel");
const Bus = require("./BusModel");

// Define all associations centrally

Bus.hasMany(Departure, { foreignKey: "busId", onDelete: "CASCADE" });
Departure.belongsTo(Bus, { foreignKey: "busId", onDelete: "CASCADE" });

Route.hasMany(Departure, { foreignKey: "routeId", onDelete: "CASCADE" });
Departure.belongsTo(Route, { foreignKey: "routeId", onDelete: "CASCADE" });

Departure.hasMany(Seat, { foreignKey: "departureId", onDelete: "CASCADE" });
Seat.belongsTo(Departure, { foreignKey: "departureId", onDelete: "CASCADE" });

User.hasMany(Booking, { foreignKey: "userId", onDelete: "CASCADE" });
Booking.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

Booking.belongsToMany(Seat, {
  through: "BookingSeats",
  foreignKey: "bookingId",
});
Seat.belongsToMany(Booking, {
  through: "BookingSeats",
  foreignKey: "seatId",
});

const db = {
  Sequelize,
  sequelize,
  User,
  Route,
  Bus,
  Departure,
  Seat,
  Booking,
};

module.exports = db;
