const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../database/sequalize");

const Departure = sequelize.define("Departure", {
  departure_time: { type: DataTypes.DATE, allowNull: false },
  arrival_time: { type: DataTypes.DATE, allowNull: false },
  busId: { type: DataTypes.INTEGER, allowNull: false },
  routeId: { type: DataTypes.INTEGER, allowNull: false },
});

Departure.associate = (models) => {
  Departure.belongsTo(models.Bus, { foreignKey: "busId", onDelete: "CASCADE" });
  Departure.belongsTo(models.Route, {
    foreignKey: "routeId",
    onDelete: "CASCADE",
  });
};

module.exports = Departure;
