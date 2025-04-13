require("dotenv").config();

const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose.set("debug", { shell: true });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("MongoDB Disconnected");
    } catch (error) {
        console.error("Failed to disconnect from the database:", error);
        process.exit(1);
    }
};

module.exports = { connectDB, disconnectDB };
