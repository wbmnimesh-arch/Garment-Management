const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const COOKIE_NAME = "cutfree_session";

function cookieOptions(config) {
  return { httpOnly: true, secure: config.nodeEnv === "production", sameSite: "strict", path: "/", maxAge: 8 * 60 * 60 * 1000 };
}

function readCookie(req) {
  const part = (req.headers.cookie || "").split(";").map((item) => item.trim()).find((item) => item.startsWith(`${COOKIE_NAME}=`));
  if (!part) return null;
  try { return decodeURIComponent(part.slice(COOKIE_NAME.length + 1)); } catch { return null; }
}

function createAuth(config) {
  async function requireAuth(req, res, next) {
    try {
      const token = readCookie(req);
      if (!token) return res.status(401).json({ message: "Please sign in." });
      const payload = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });
      const user = await User.findById(payload.sub);
      if (!user || user.status !== "active") return res.status(401).json({ message: "Your session is no longer active." });
      req.user = user;
      return next();
    } catch {
      return res.status(401).json({ message: "Please sign in again." });
    }
  }

  function allowRoles(...roles) {
    return (req, res, next) => roles.includes(req.user?.role)
      ? next()
      : res.status(403).json({ message: "You do not have permission to do that." });
  }

  return { requireAuth, allowRoles, cookieOptions, cookieName: COOKIE_NAME };
}

module.exports = createAuth;
