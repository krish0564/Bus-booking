const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const Seat = sequelize.define("Seat", {
  seatNumber: { type: DataTypes.INTEGER },
  status: {
    type: DataTypes.ENUM("AVAILABLE", "RESERVED", "BOOKED"),
    defaultValue: "AVAILABLE",
  },
  reservedUntil: { type: DataTypes.DATE },
});

Seat.associate = (models) => {
  Seat.belongsTo(models.Departure, { foreignKey: "departureId" });

  Seat.belongsToMany(models.Booking, {
    through: "BookingSeats",
    foreignKey: "seatId",
  });
};
Seat.init(
  {
    seatNumber: { type: DataTypes.INTEGER },
    status: {
      type: DataTypes.ENUM("AVAILABLE", "RESERVED", "BOOKED"),
      defaultValue: "AVAILABLE",
    },
    reservedUntil: { type: DataTypes.DATE },
  },
  {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ["seatNumber", "departureId"],
      },
    ],
  }
);

module.exports = Seat;
