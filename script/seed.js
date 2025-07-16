require("dotenv").config();
const bcrypt = require("bcryptjs");
const {
  sequelize,
  User,
  Bus,
  Route,
  Departure,
  Seat,
} = require("../models/RelationalModel");

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // DANGER: Deletes existing tables

    // // 1. Create Users
    // const admin = await User.create({
    //   email: "admin@bus.com",
    //   password: await bcrypt.hash("admin123", 10),
    //   role: "ADMIN",
    // });

    // const user = await User.create({
    //   email: "user@bus.com",
    //   password: await bcrypt.hash("user123", 10),
    //   role: "USER",
    // });

    // 2. Create Route
    const route = await Route.create({
      origin: "Delhi",
      destination: "Jaipur",
    });

    // 3. Create Bus
    const bus = await Bus.create({
      bus_number: "DL01A1234",
      total_seats: 40,
    });

    // 4. Create Departure (6 hours from now)
    const now = new Date();
    const departure = await Departure.create({
      routeId: route.id,
      busId: bus.id,
      departure_time: new Date(now.getTime() + 6 * 60 * 60 * 1000),
      arrival_time: new Date(now.getTime() + 10 * 60 * 60 * 1000),
    });

    // 5. Create 40 seats
    const seatPromises = [];
    for (let i = 1; i <= bus.total_seats; i++) {
      seatPromises.push(
        Seat.create({ seatNumber: i, departureId: departure.id })
      );
    }
    await Promise.all(seatPromises);

    console.log("✅ Seed complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
