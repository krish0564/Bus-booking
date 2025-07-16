const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../database/sequalize");

const Route = sequelize.define("Route", {
  origin: { type: DataTypes.STRING, allowNull: false },
  destination: { type: DataTypes.STRING, allowNull: false },
});
module.exports = Route;
