require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected");

    // Initialize only after connection
    await Listing.insertMany(initData.data);
    console.log("✅ Data was initialized");
  } catch (err) {
    console.log("❌ Error:", err);
  } finally {
    mongoose.connection.close(); // optional: close after seeding
  }
}

main();
