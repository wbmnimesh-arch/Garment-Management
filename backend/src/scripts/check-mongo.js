require("dotenv").config();

const loadConfig = require("../config/env");
const { connectDatabase, mongoose } = require("../config/database");

const config = loadConfig();
connectDatabase(config.mongoUri, config.mongoDbName)
  .then(() => console.log("MongoDB check succeeded."))
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => mongoose.disconnect());
