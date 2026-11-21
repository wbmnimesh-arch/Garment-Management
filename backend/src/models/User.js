const mongoose = require("mongoose");

const ROLES = ["The Owner", "The Manager", "Human Resources", "The Employee"];

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  employeeId: { type: String, required: true, trim: true, lowercase: true, maxlength: 40, unique: true },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ROLES, required: true, default: "The Employee" },
  status: { type: String, enum: ["pending", "active", "disabled"], default: "pending" },
}, { timestamps: true, versionKey: false });

module.exports = { User: mongoose.model("User", userSchema), ROLES };
