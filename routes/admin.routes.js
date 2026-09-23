const express = require("express");
const router = express.Router();
const Group = require("../models/Group.js");
const User = require("../models/User.js");
const isSignedIn = require("../middleware/is-signed-in.js");
const isSuperAdmin = require("../middleware/is-super-admin.js");

// Go to the admin

router.get("/", isSignedIn, isSuperAdmin, async (req, res) => {
  const groups = await Group.find();
  const users = await User.find();
  res.render("admin/adminDashboard.ejs", {
    groups,
    userCount: users.length,
  });
});

router.get("/groups/new", isSignedIn, isSuperAdmin, (req, res) => {
  res.render("admin/CreateGroup.ejs");
});

module.exports = router;
