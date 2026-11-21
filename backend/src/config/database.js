const mongoose = require("mongoose");

async function connectDatabase(uri, dbName = "cutfree") {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 12000 });
    console.log(`MongoDB connected to database: ${mongoose.connection.name}`);
  } catch (error) {
    if (["AuthenticationFailed", "MongoServerError"].includes(error.name) && (error.code === 18 || /bad auth|authentication failed/i.test(error.message))) {
      throw new Error("MongoDB rejected the database username or password. Check the Atlas Database User and MONGO_URI in backend/.env. If the password contains URI symbols, URL-encode it.");
    }
    if (error.name === "MongooseServerSelectionError") {
      throw new Error("Cannot reach MongoDB. Check the Atlas Network Access allowlist and confirm the cluster is running.");
    }
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}

module.exports = { connectDatabase, mongoose };
