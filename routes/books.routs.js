const express = require("express");
const router = express.Router();
const Book = require("../models/Book.js");
const isSignedIn = require("../middleware/is-signed-in.js");
const upload = require("../middleware/multer.js");

router.get("/new", isSignedIn, (req, res) => {
  res.render("books/new.ejs");
});

router.post("/", isSignedIn, upload.single("image"), async (req, res) => {
  await Book.create({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    isbn: req.body.isbn,
    image: req.file ? `/uploads/${req.file.filename}` : "",
    owner: req.session.user._id,
  });
  res.redirect("/books");
});

router.get("/", isSignedIn, async (req, res) => {
  const books = await Book.find({ owner: req.session.user._id });
  res.render("myBooks.ejs", { books });
});

router.get("/:bookId", isSignedIn, async (req, res) => {
  const book = await Book.findById(req.params.bookId).populate("owner");
  res.render("show.ejs", { book });
});

module.exports = router;
