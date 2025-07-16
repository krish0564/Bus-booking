const { Bus, Route, Departure } = require("../models/RelationalModel");

exports.createBus = async (req, res) => {
  try {
    const { bus_number, total_seats } = req.body;
    if (!bus_number || !total_seats) {
      return res
        .status(400)
        .json({ error: "bus_number and total_seats are required" });
    }

    const bus = await Bus.create({ bus_number, total_seats });
    res.status(201).json(bus);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create bus", details: err.message });
  }
};

exports.createRoute = async (req, res) => {
  try {
    const { origin, destination, distance_km, duration_minutes } = req.body;
    if (!origin || !destination) {
      return res
        .status(400)
        .json({ error: "origin and destination are required" });
    }

    const route = await Route.create({
      origin,
      destination,
      distance_km,
      duration_minutes,
    });
    res.status(201).json(route);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create route", details: err.message });
  }
};

exports.createDeparture = async (req, res) => {
  try {
    const { routeId, busId, departure_time, arrival_time } = req.body;
    if (!routeId || !busId || !departure_time || !arrival_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const departure = await Departure.create({
      routeId,
      busId,
      departure_time,
      arrival_time,
    });
    res.status(201).json(departure);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create departure", details: err.message });
  }
};
