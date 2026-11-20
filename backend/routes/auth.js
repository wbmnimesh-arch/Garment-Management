const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");
const { rateLimit } = require("../middleware/security");

const router = express.Router();
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 8 * 60 * 60 * 1000,
});
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 8, message: "Too many sign-in attempts. Try again in 15 minutes." });
const signupLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: "Too many registration attempts. Try again later." });

router.post("/register", signupLimit, async (req, res) => {
  try {
    const { fullName, employeeId, email, password } = req.body || {};
    if (![fullName, employeeId, email, password].every((value) => typeof value === "string" && value.trim())) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }
    if (fullName.trim().length > 100 || employeeId.trim().length > 40 || email.trim().length > 254) {
      return res.status(400).json({ message: "One or more fields are too long." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return res.status(400).json({ message: "Enter a valid email address." });
    if (password.length < 12 || password.length > 128 || Buffer.byteLength(password, "utf8") > 72) return res.status(400).json({ message: "Use a password with 12–72 characters." });

    const normalizedId = employeeId.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ $or: [{ employeeId: normalizedId }, { email: normalizedEmail }] });
    if (existing) return res.status(409).json({ message: "That Employee ID or email is already registered." });

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ fullName: fullName.trim(), employeeId: normalizedId, email: normalizedEmail, password: hashedPassword, role: "The Employee", status: "pending" });
    return res.status(201).json({ message: "Account request submitted. HR must activate it before you can sign in." });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "That Employee ID or email is already registered." });
    console.error("Registration failed:", error.message);
    return res.status(500).json({ message: "Could not create your account. Please try again." });
  }
});

router.post("/login", loginLimit, async (req, res) => {
  try {
    const { employeeId, password } = req.body || {};
    if (typeof employeeId !== "string" || !employeeId.trim() || typeof password !== "string" || !password || password.length > 128 || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({ message: "Enter your Employee ID and password." });
    }
    const user = await User.findOne({ employeeId: employeeId.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid Employee ID or password." });
    if (user.status !== "active") return res.status(403).json({ message: user.status === "pending" ? "Your account is awaiting HR activation." : "Your account is disabled. Contact HR." });
    if (req.body.role && req.body.role !== user.role) return res.status(403).json({ message: "This account does not have the selected role." });
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) return res.status(500).json({ message: "Server authentication is not configured." });

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "8h" });
    res.cookie("cutfree_session", token, cookieOptions());
    return res.json({ message: "Signed in successfully.", user: { id: user.id, fullName: user.fullName, employeeId: user.employeeId, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({ message: "Could not sign in. Please try again." });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("cutfree_session", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/" });
  return res.json({ message: "Signed out." });
});

router.get("/me", requireAuth, (req, res) => {
  const { id, fullName, employeeId, email, role } = req.user;
  res.json({ user: { id, fullName, employeeId, email, role } });
});

module.exports = router;
