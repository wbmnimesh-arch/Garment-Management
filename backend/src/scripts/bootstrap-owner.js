require("dotenv").config();

const bcrypt = require("bcryptjs");
const { connectDatabase, mongoose } = require("../config/database");
const loadConfig = require("../config/env");
const { User } = require("../models/User");

async function bootstrapOwner() {
  const config = loadConfig();
  const { BOOTSTRAP_OWNER_NAME, BOOTSTRAP_OWNER_ID, BOOTSTRAP_OWNER_EMAIL, BOOTSTRAP_OWNER_PASSWORD } = process.env;
  if (![BOOTSTRAP_OWNER_NAME, BOOTSTRAP_OWNER_ID, BOOTSTRAP_OWNER_EMAIL, BOOTSTRAP_OWNER_PASSWORD].every(Boolean)) {
    throw new Error("Set all four BOOTSTRAP_OWNER_* values in backend/.env for this one-time setup.");
  }
  if (BOOTSTRAP_OWNER_PASSWORD.length < 16 || Buffer.byteLength(BOOTSTRAP_OWNER_PASSWORD, "utf8") > 72) {
    throw new Error("The initial Owner password must be 16–72 UTF-8 bytes.");
  }
  await connectDatabase(config.mongoUri, config.mongoDbName);
  if (await User.exists({ role: "The Owner", status: "active" })) throw new Error("An active Owner already exists; bootstrap is disabled.");
  const employeeId = BOOTSTRAP_OWNER_ID.trim().toLowerCase();
  const email = BOOTSTRAP_OWNER_EMAIL.trim().toLowerCase();
  if (await User.exists({ $or: [{ employeeId }, { email }] })) throw new Error("The provided Employee ID or email is already in use.");

  await User.create({
    fullName: BOOTSTRAP_OWNER_NAME.trim(), employeeId, email,
    password: await bcrypt.hash(BOOTSTRAP_OWNER_PASSWORD, 12),
    role: "The Owner", status: "active",
  });
  console.log("Initial Owner created. Remove the BOOTSTRAP_OWNER_* values from .env now.");
}

bootstrapOwner().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});
