const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

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

app.get("/" , (req, res) => {
  res.send("<h1>Welcome to Home Page</h1><a href='/listing'>Go to Listings</a>");
});

app.get("/listing", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
});

app.get("/listing/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("show.ejs", { listing });
});

app.get("/listing/new/data", (req, res) => {
  res.render("new.ejs");
});

app.post("/listing/new/add", async (req, res) => {
  const { title, imagelink, description, price, country, location } =
    req.body.listing;
  const newListing = new Listing({
    title: title,
    image: {
      url: imagelink,
      filename: "no filename",
    },
    description: description,
    price: price,
    country: country,
    location: location,
  });
  
  await newListing.save();
  res.redirect("/listing");
});

app.get("/listing/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit.ejs", { listing });
});

app.put("/listing/:id/edit", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  res.redirect("/listing");
});

app.delete("/listing/:id/delete", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
