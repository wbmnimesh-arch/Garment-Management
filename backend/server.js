
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const { securityHeaders, checkOrigin } = require("./middleware/security");

const connectDB = require("./config/db");

const app = express();
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters.");
}
if (process.env.NODE_ENV === "production" && !process.env.CLIENT_ORIGIN) {
  throw new Error("CLIENT_ORIGIN must be set in production.");
}
if (process.env.TRUST_PROXY_HOPS) {
  const hops = Number.parseInt(process.env.TRUST_PROXY_HOPS, 10);
  if (!Number.isInteger(hops) || hops < 1) throw new Error("TRUST_PROXY_HOPS must be a positive integer.");
  app.set("trust proxy", hops);
}

app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(checkOrigin);

app.use(express.json({ limit: "10kb" }));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "CUT FREE Backend is Running!",
  });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }
  console.error("Request failed:", error.message);
  return res.status(500).json({ message: "An unexpected server error occurred." });
});

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
};

startServer();
