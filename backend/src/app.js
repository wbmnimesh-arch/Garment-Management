const express = require("express");
const cors = require("cors");
const { setSecurityHeaders, allowSameOrigin } = require("./middleware/security");
const createAuth = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const { mongoose } = require("./config/database");

function createApp(config) {
  const app = express();
  if (config.trustProxyHops > 0) app.set("trust proxy", config.trustProxyHops);
  app.disable("x-powered-by");
  app.use(setSecurityHeaders);
  app.use(cors({ origin: config.clientOrigin, credentials: true }));
  app.use(allowSameOrigin(config.clientOrigin));
  app.use(express.json({ limit: "10kb" }));

  const auth = createAuth(config);
  app.get("/api/health", (req, res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ status: mongoose.connection.readyState === 1 ? "ok" : "database unavailable" }));
  app.use("/api/auth", authRoutes(config, auth));
  app.use("/api/admin", adminRoutes(auth));
  app.get("/", (req, res) => res.json({ message: "CUT FREE Backend is Running!" }));

  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) return res.status(400).json({ message: "Request body must contain valid JSON." });
    console.error("Request failed:", error.message);
    return res.status(500).json({ message: "An unexpected server error occurred." });
  });
  return app;
}

module.exports = createApp;
