const express = require("express");
require("dotenv").config();
const app = express();
const listings = require("./routes/listings")
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
const Review = require("./models/reviews.js");

app.use(express.json());

PORT = process.env.PORT || 3000;


main()
  .then((res) => {
    console.log("databse connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

app.get("/" , (req, res) => {
  res.send("<h1>Welcome to Home Page</h1><a href='/listing'>Go to Listings</a>");
});


app.use("/listing", listings);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
