const Sequelize = require("sequelize");
const sequelize = require("../database/sequalize");

// Import models
const User = require("./UserModel");
const Route = require("./RouteModel");
const Departure = require("./DepartureModel");
const Seat = require("./SeatModel");
const Booking = require("./BookingModel");
const Bus = require("./BusModel");

// Define all associations centrally

// 1. Bus ↔ Departure
Bus.hasMany(Departure, { foreignKey: "busId", onDelete: "CASCADE" });
Departure.belongsTo(Bus, { foreignKey: "busId", onDelete: "CASCADE" });

// 2. Route ↔ Departure
Route.hasMany(Departure, { foreignKey: "routeId", onDelete: "CASCADE" });
Departure.belongsTo(Route, { foreignKey: "routeId", onDelete: "CASCADE" });

// 3. Departure ↔ Seat
Departure.hasMany(Seat, { foreignKey: "departureId", onDelete: "CASCADE" });
Seat.belongsTo(Departure, { foreignKey: "departureId", onDelete: "CASCADE" });

// 4. User ↔ Booking
User.hasMany(Booking, { foreignKey: "userId", onDelete: "CASCADE" });
Booking.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// 5. Booking ↔ Seat (many-to-many)
Booking.belongsToMany(Seat, {
  through: "BookingSeats",
  foreignKey: "bookingId",
});
Seat.belongsToMany(Booking, {
  through: "BookingSeats",
  foreignKey: "seatId",
});

// Group all models in a single object
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
