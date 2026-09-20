const express = require("express");
const router = express.Router();
const Book = require("../models/Book.js");
const isSignedIn = require("../middleware/is-signed-in.js");
const upload = require("../middleware/multer.js");

router.get("/new", isSignedIn, (req, res) => {
  res.render("new.ejs");
});

router.post("/", isSignedIn, upload.single("image"), async (req, res) => {
  await Book.create({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    isbn: req.body.isbn,
    image: req.file ? `/uploads/${req.file.filename}` : "",
    favorite: req.body.favorite === "on",
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

router.get("/:bookId/edit", isSignedIn, async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  res.render("edit.ejs", { book });
});

router.put("/:bookId", isSignedIn, upload.single("image"), async (req, res) => {
  const book = await Book.findById(req.params.bookId);

  book.title = req.body.title;
  book.author = req.body.author;
  book.genre = req.body.genre;
  book.isbn = req.body.isbn;
  book.favorite = req.body.favorite === "on";
  if (req.file) {
    book.image = `/uploads/${req.file.filename}`;
  }

  await book.save();
  res.redirect(`/books/${book._id}`);
});

router.delete("/:bookId", isSignedIn, async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  await book.deleteOne();
  res.redirect("/books");
});

module.exports = router;
