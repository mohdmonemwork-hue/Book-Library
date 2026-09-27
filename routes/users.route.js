const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const Book = require("../models/Book.js");
const isSignedIn = require("../middleware/is-signed-in.js");

router.get("/:userId", isSignedIn, async (req, res) => {
  const profile = await User.findById(req.params.userId);
  const books = await Book.find({ owner: profile._id });

  res.render("users/profiles.ejs", {
    profile,
    bookCount: books.length,
  });
});

module.exports = router;
