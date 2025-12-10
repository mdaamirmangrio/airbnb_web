const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


router.get("/", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("show.ejs", { listing });
});

router.get("/new/data", (req, res) => {
  res.render("new.ejs");
});

router.delete("/:id/review/:reviewId", async (req, res) => {
let {id, reviewId} = req.params;
await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
await Review.findByIdAndDelete(reviewId);
res.redirect(`/listing/${id}`);
})

router.post("/new/add", async (req, res) => {
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

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit.ejs", { listing });
});

router.put("/:id/edit", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  res.redirect("/listing");
});

router.post("/:id/review", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const { rating, comment } = req.body.review;
  const newReview = new Review({
    rating,
    comment,
  });
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listing/${id}`);
});

router.delete("/:id/delete", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});


module.exports = router;