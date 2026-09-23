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

router.delete(
  "/groups/:groupId",
  isSignedIn,
  isSuperAdmin,
  async (req, res) => {
    const group = await Group.findById(req.params.groupId);
    await group.deleteOne();
    res.redirect("/admin");
  },
);

router.post("/groups", isSignedIn, isSuperAdmin, async (req, res) => {
  await Group.create({
    name: req.body.name,
    description: req.body.description,
    createdBy: req.session.user._id,
    members: [],
  });
  res.redirect("/admin");
});

router.get(
  "/groups/:groupId/edit",
  isSignedIn,
  isSuperAdmin,
  async (req, res) => {
    const group = await Group.findById(req.params.groupId).populate("members");

    res.render("admin/editMemebers.ejs", { group });
  },
);

router.post(
  "/groups/:groupId/members",
  isSignedIn,
  isSuperAdmin,
  async (req, res) => {
    const group = await Group.findById(req.params.groupId);

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.send("User not found.");

    const alreadyMember = group.members.some((id) => {
      return id.toString() === user._id.toString();
    });

    if (!alreadyMember) {
      group.members.push(user._id);
      await group.save();
    }

    res.redirect(`/admin/groups/${group._id}/edit`);
  },
);

router.delete(
  "/groups/:groupId/members/:userId",
  isSignedIn,
  isSuperAdmin,
  async (req, res) => {
    const group = await Group.findById(req.params.groupId);

    group.members = group.members.filter((id) => {
      return id.toString() !== req.params.userId;
    });

    await group.save();
    res.redirect(`/admin/groups/${group._id}/edit`);
  },
);
module.exports = router;
