require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../config/db");

async function bootstrapOwner() {
  const { BOOTSTRAP_OWNER_NAME, BOOTSTRAP_OWNER_ID, BOOTSTRAP_OWNER_EMAIL, BOOTSTRAP_OWNER_PASSWORD } = process.env;
  if (![BOOTSTRAP_OWNER_NAME, BOOTSTRAP_OWNER_ID, BOOTSTRAP_OWNER_EMAIL, BOOTSTRAP_OWNER_PASSWORD].every(Boolean)) {
    throw new Error("Set the four BOOTSTRAP_OWNER_* variables for this one-time setup.");
  }
  if (BOOTSTRAP_OWNER_PASSWORD.length < 16) throw new Error("The initial Owner password must contain at least 16 characters.");
  await connectDB();
  const ownerExists = await User.exists({ role: "The Owner", status: "active" });
  if (ownerExists) throw new Error("An active Owner already exists; bootstrap is disabled.");
  const normalizedId = BOOTSTRAP_OWNER_ID.trim().toLowerCase();
  const normalizedEmail = BOOTSTRAP_OWNER_EMAIL.trim().toLowerCase();
  if (await User.exists({ $or: [{ employeeId: normalizedId }, { email: normalizedEmail }] })) {
    throw new Error("The provided Employee ID or email is already in use.");
  }
  const password = await bcrypt.hash(BOOTSTRAP_OWNER_PASSWORD, 12);
  await User.create({ fullName: BOOTSTRAP_OWNER_NAME.trim(), employeeId: normalizedId, email: normalizedEmail, password, role: "The Owner", status: "active" });
  console.log("Initial Owner created. Remove BOOTSTRAP_OWNER_* values from the environment now.");
}

bootstrapOwner().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(async () => {
  await require("mongoose").disconnect();
});
