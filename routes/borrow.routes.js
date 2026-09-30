const express = require("express");
const router = express.Router();
const BorrowREQ = require("../models/BorrowREQ.js");
const Group = require("../models/Group.js");
const Book = require("../models/Book.js");
const isSignedIn = require("../middleware/is-signed-in.js");

router.get("/", isSignedIn, async (req, res) => {
  const Receive = await BorrowREQ.find({ owner: req.session.user._id })
    .populate("book")
    .populate("requester");

  const request = await BorrowREQ.find({ requester: req.session.user._id })
    .populate("book")
    .populate("owner");

  res.render("borrow/borrows.ejs", {
    Receive: Receive.filter((r) => r.book && r.requester),
    request: request.filter((r) => r.book && r.owner),
  });
});

router.post("/", isSignedIn, async (req, res) => {
  const book = await Book.findById(req.body.bookId);
  const myId = req.session.user._id.toString();
  const ownerId = book.owner.toString();

  const groups = await Group.find();
  let sharedGroup;

  for (let group of groups) {
    const memberIds = group.members.map((id) => id.toString());
    if (memberIds.includes(myId) && memberIds.includes(ownerId)) {
      sharedGroup = group;
      break;
    }
  }

  await BorrowREQ.create({
    book: book._id,
    requester: req.session.user._id,
    owner: book.owner,
    group: sharedGroup._id,
  });

  res.redirect("/borrow");
});

router.put("/:id/approve", isSignedIn, async (req, res) => {
  const request = await BorrowREQ.findById(req.params.id);

  if (request.owner.toString() !== req.session.user._id.toString()) {
    return res.redirect("/borrow");
  }

  request.status = "approved";
  await request.save();

  await Book.findByIdAndUpdate(request.book, { status: "borrowed" });
  res.redirect("/borrow");
});

router.put("/:id/reject", isSignedIn, async (req, res) => {
  const request = await BorrowREQ.findById(req.params.id);

  if (request.owner.toString() !== req.session.user._id.toString()) {
    return res.redirect("/borrow");
  }

  request.status = "rejected";
  await request.save();

  res.redirect("/borrow");
});

router.put("/:id/return", isSignedIn, async (req, res) => {
  const request = await BorrowREQ.findById(req.params.id);

  if (request.owner.toString() !== req.session.user._id.toString()) {
    return res.redirect("/borrow");
  }
  request.status = "returned";
  request.returnDate = new Date();
  await request.save();

  await Book.findByIdAndUpdate(request.book, { status: "available" });
  res.redirect("/borrow");
});

module.exports = router;
