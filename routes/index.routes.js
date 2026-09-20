const router = require("express").Router();
const Book = require("../models/Book.js");

router.get("/", async (req, res) => {
  let favoriteBooks = [];
  if (req.session.user) {
    favoriteBooks = await Book.find({
      owner: req.session.user._id,
      favorite: true,
    });
  }
  res.render("homepage.ejs", { favoriteBooks });
});

module.exports = router;
