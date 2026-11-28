const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { rateLimit } = require("../middleware/security");

const emailPattern = /^\S+@\S+\.\S+$/;
// Compare against a real bcrypt hash when the ID is unknown so failed logins
// take roughly the same time and do not reveal whether an account exists.
const dummyPasswordHash = bcrypt.hashSync("cutfree-invalid-login-placeholder", 12);

function authRoutes(config, auth) {
  const router = express.Router();

  router.post("/register", rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: "Too many registration attempts. Try again later." }), async (req, res) => {
    try {
      const { fullName, employeeId, email, password } = req.body || {};
      if (![fullName, employeeId, email, password].every((value) => typeof value === "string" && value.trim())) {
        return res.status(400).json({ message: "Please provide all required fields." });
      }
      if (fullName.trim().length > 100 || employeeId.trim().length > 40 || email.trim().length > 254) {
        return res.status(400).json({ message: "One or more fields are too long." });
      }
      if (!emailPattern.test(email.trim())) return res.status(400).json({ message: "Enter a valid email address." });
      if (password.length < 12 || password.length > 128 || Buffer.byteLength(password, "utf8") > 72) {
        return res.status(400).json({ message: "Use a password with 12–72 characters." });
      }

      const normalizedId = employeeId.trim().toLowerCase();
      const normalizedEmail = email.trim().toLowerCase();
      const exists = await User.exists({ $or: [{ employeeId: normalizedId }, { email: normalizedEmail }] });
      if (exists) return res.status(409).json({ message: "That Employee ID or email is already registered." });

      await User.create({ fullName: fullName.trim(), employeeId: normalizedId, email: normalizedEmail, password: await bcrypt.hash(password, 12), role: "The Employee", status: "pending" });
      return res.status(201).json({ message: "Account request submitted. HR must activate it before you can sign in." });
    } catch (error) {
      if (error.code === 11000) return res.status(409).json({ message: "That Employee ID or email is already registered." });
      console.error("Registration failed:", error.message);
      return res.status(500).json({ message: "Could not create your account. Please try again." });
    }
  });

  router.post("/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 8, message: "Too many sign-in attempts. Try again in 15 minutes." }), async (req, res) => {
    try {
      const { employeeId, password, role } = req.body || {};
      if (typeof employeeId !== "string" || !employeeId.trim() || typeof password !== "string" || !password || password.length > 128 || Buffer.byteLength(password, "utf8") > 72) {
        return res.status(400).json({ message: "Enter your Employee ID and password." });
      }
      const user = await User.findOne({ employeeId: employeeId.trim().toLowerCase() }).select("+password");
      const passwordMatches = await bcrypt.compare(password, user?.password || dummyPasswordHash);
      if (!user || !passwordMatches) return res.status(401).json({ message: "Invalid Employee ID or password." });
      if (user.status !== "active") return res.status(403).json({ message: user.status === "pending" ? "Your account is awaiting HR activation." : "Your account is disabled. Contact HR." });
      if (role && role !== user.role) return res.status(403).json({ message: "This account does not have the selected role." });

      const token = jwt.sign({ sub: user.id }, config.jwtSecret, {
        algorithm: "HS256",
        expiresIn: "8h",
        issuer: "cutfree-api",
        audience: "cutfree-web",
      });
      res.cookie(auth.cookieName, token, auth.cookieOptions(config));
      return res.json({ message: "Signed in successfully.", user: { id: user.id, fullName: user.fullName, employeeId: user.employeeId, email: user.email, role: user.role } });
    } catch (error) {
      console.error("Sign in failed:", error.message);
      return res.status(500).json({ message: "Could not sign in. Please try again." });
    }
  });

  router.post("/logout", (req, res) => {
    res.clearCookie(auth.cookieName, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      path: "/",
    });
    return res.json({ message: "Signed out." });
  });

  router.get("/me", auth.requireAuth, (req, res) => {
    const { id, fullName, employeeId, email, role } = req.user;
    return res.json({ user: { id, fullName, employeeId, email, role } });
  });

  return router;
}

module.exports = authRoutes;
