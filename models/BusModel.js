const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const Bus = sequelize.define("Bus", {
  bus_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  total_seats: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 40 },
});

module.exports = Bus;
