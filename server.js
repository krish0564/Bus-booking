const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cron = require("node-cron");
const expireReservedBookings = require("./jobs/expireReservedBookings");

const cookieParser = require("cookie-parser");
const sequelize = require("./database/sequalize");
const UserRoutes = require("./Routes/UserRoutes");
const adminRoutes = require("./Routes/AdminRoutes");
const availabilityRoutes = require("./Routes/AvailabilityRoutes");
const bookingRoutes = require("./Routes/BookingRoutes");

const db = require("./models/RelationalModel");

const app = express();

app.use(cookieParser());

const port = 4000;

app.use(express.json());
app.use("/api/user", UserRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/booking", bookingRoutes);

// Run job every minute
cron.schedule("* * * * *", () => {
  console.log("Running expiration check...");
  expireReservedBookings();
});
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
  db.sequelize.sync({ alter: true }).then(() => {
    console.log("DB synced with models and relationships");
  });
});
