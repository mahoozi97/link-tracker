// middleware to check the authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
};

const requireAdminAuth = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/auth/login");
  }
  next();
};

module.exports =  { requireAuth, requireAdminAuth };