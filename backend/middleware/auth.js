const jwt = require("jsonwebtoken");
const User = require("../models/User");

function readCookie(req, name) {
  const pair = (req.headers.cookie || "").split(";").map((value) => value.trim()).find((value) => value.startsWith(`${name}=`));
  if (!pair) return null;
  try { return decodeURIComponent(pair.slice(name.length + 1)); } catch { return null; }
}

async function requireAuth(req, res, next) {
  try {
    if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Authentication is not configured." });
    const token = readCookie(req, "cutfree_session");
    if (!token) return res.status(401).json({ message: "Please sign in." });
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    const user = await User.findById(payload.sub);
    if (!user || user.status !== "active") return res.status(401).json({ message: "Your session is no longer active." });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Please sign in again." });
  }
}

function allowRoles(...roles) {
  return (req, res, next) => roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ message: "You do not have permission to do that." });
}

module.exports = { requireAuth, allowRoles };
