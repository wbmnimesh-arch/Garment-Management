const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    employeeId: { type: String, required: true, trim: true, lowercase: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: ["The Owner", "The Manager", "Human Resources", "The Employee"] },
    status: { type: String, enum: ["pending", "active", "disabled"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
