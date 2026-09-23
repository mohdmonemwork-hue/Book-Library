const express = require("express");
const router = express.Router();
const Group = require("../models/Group.js");
const Book = require("../models/Book.js");
const isSignedIn = require("../middleware/is-signed-in.js");

//admin see groups
router.get("/", isSignedIn, async (req, res) => {
  let groups;
  //admin see groups
  if (req.session.user.role === "super_admin") {
    groups = await Group.find();
  } else {
    //User see their groupss
    groups = await Group.find({ members: req.session.user._id });
  }
  res.render("groups/MainGroups.ejs", { groups });
});

//user see
router.get("/:groupId", isSignedIn, async (req, res) => {
  const group = await Group.findById(req.params.groupId).populate("members");
  const isAdmin = req.session.user.role === "super_admin";
  if (!group) {
    return res.redirect("/groups");
  }

  const isMember = group.members.some((member) => {
    return member._id.equals(req.session.user._id);
  });

  // check that he is a memeber
  if (!isMember && !isAdmin) {
    return res.redirect("/groups");
  }

  const memberIds = group.members.map((member) => {
    return member._id;
  });
  const books = await Book.find().where("owner").in(memberIds);
  res.render("groups/show.ejs", { group, books });
});

module.exports = router;
