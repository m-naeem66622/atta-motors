require("dotenv").config();
const fs = require("fs");
const express = require("express");
const { connectDB } = require("./api/config/db");
const {
    notFound,
    errorHandler,
} = require("./api/middlewares/error.middleware");
const winston = require("winston");
const expressWinston = require("express-winston");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

const loggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} - ${level}: ${message}`;
        }),
        winston.format.colorize({ all: true })
    ),
};

if (process.env.DEBUG !== "true") {
    loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressWinston.logger(loggerOptions));
app.use("/api/public", express.static("public"));

const indexRoutes = require("./api/routes/index.route");
app.use("/api", indexRoutes);

app.use(notFound);
app.use(errorHandler);

// Only start the server if this file is run directly (not imported by tests)
if (require.main === module) {
    // Connect to the database
    connectDB();

    app.listen(port, () => {
        // Create empty directories. e.g. logs
        const dirs = ["logs", "public"];
        dirs.forEach((dir) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });
        console.log(`Server is running on port ${port}`);
    });
}

// Export the app for testing
module.exports = app;
