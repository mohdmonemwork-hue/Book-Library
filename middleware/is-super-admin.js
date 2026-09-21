const isSuperAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "super_admin") {
    return next();
  }
  res.redirect("/");
};

module.exports = isSuperAdmin;
