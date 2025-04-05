require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var cron = require("node-cron");
const auth = require("./middleware/auth");
const mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");

// import routes
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const profileRoute = require("./routes/profileRoute");
const roomRoute = require("./routes/roomRoute");
const itemRoute = require("./routes/itemRoute");
const orderRoute = require("./routes/OrderRoute");
const roomTypeRoute = require("./routes/roomTypeRoute");
const bookingRoute = require("./routes/bookingRoute");
const serviceTransferRoute = require("./routes/serviceTransferRoute");
const itemCategoryRoute = require("./routes/itemCategoryRoute");
const amenityRoute = require("./routes/AmenityRoute");
const kitchenBarRoute = require("./routes/KitchenBarCategoryRoute");
const kitchenBarPresetsRoute = require("./routes/KitchenBarPresetRoute");
const kitchenBarOrderRoute = require("./routes/KitchenBarOrderRoute");
const serviceOrderRoute = require("./routes/ServiceOrderRoute");
const faciltyRoute = require("./routes/FacilityRoute");
const faciltyBookingRoute = require("./routes/facilityBookingRoute");
const whatsappRoute = require("./routes/whatsappRoute");
const messageRoute = require("./routes/messagesRoute");
const { CreateDummyOrders } = require("./tasks/CreateDummyOrders");
const {
  CreateDummyServiceOrders,
} = require("./tasks/CreateDummyServiceOrders");

const app = express();

// use cors so the front end can post data to this backend
app.use(cors());

// bodyParser settings for proper data decodin form frontend
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// limit size of data that can bebsent from the front end
app.use(express.json({ limit: "50mb" }));

// use the imported routes
// app.use("/api", userRoute)
app.use("/api/users", userRoute);
app.use("/api/amenities", amenityRoute);
app.use("/api/admins", adminRoute);
app.use("/api/profiles", profileRoute);
app.use("/api/roomtypes", roomTypeRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/services", serviceTransferRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/items", itemRoute);
app.use("/api/item-categories", itemCategoryRoute);
app.use("/api/orders", orderRoute);
app.use("/api/kitchen-bar-categories", kitchenBarRoute);
app.use("/api/kitchen-bar-presets", kitchenBarPresetsRoute);
app.use("/api/kitchen-bar-order", kitchenBarOrderRoute);
app.use("/api/service-order", serviceOrderRoute);
app.use("/api/facilities", faciltyRoute);
app.use("/api/facility-bookings", faciltyBookingRoute);
app.use("/api/whatsapp", whatsappRoute);
app.use("/api/messages", messageRoute);

app.get("/welcome", auth, (req, res) => {
  res.status(200).send(req.user);
});

// set a default message in case an invalid route is entered.
// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

// CreateDummyOrders().then(r => {
//   console.log({r})
// }).catch(err => {
//   console.log({err})
// })

// CreateDummyServiceOrders().then(r => {
//   console.log({r})
// }).catch(err => {
//   console.log({err})
// })

module.exports = app;
