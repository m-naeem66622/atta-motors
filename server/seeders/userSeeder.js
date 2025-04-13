// User Seeder
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../api/models/user.model");
const { connectDB, disconnectDB } = require("../api/config/db");

const users = [
    {
        username: "admin",
        name: "ADMIN USER",
        phone: "1234567890",
        email: "admin@attamotors.com",
        address: "123 Admin Street, Admin City",
        role: "ADMIN",
        password: "12345678", // will be hashed by the model pre-save hook
    },
    {
        username: "johndoe",
        name: "JOHN DOE",
        phone: "9876543210",
        email: "john@example.com",
        address: "456 User Avenue, User Town",
        role: "USER",
        password: "12345678",
    },
    {
        username: "janedoe",
        name: "JANE DOE",
        phone: "5551234567",
        email: "jane@example.com",
        address: "789 Seller Road, Seller City",
        role: "USER",
        password: "12345678",
    },
    {
        username: "bobsmith",
        name: "BOB SMITH",
        phone: "7778889999",
        email: "bob@example.com",
        address: "101 Dealer Drive, Dealer Town",
        role: "USER",
        password: "12345678",
    },
    {
        username: "alicegreen",
        name: "ALICE GREEN",
        phone: "4443332222",
        email: "alice@example.com",
        address: "202 Buyer Boulevard, Buyer City",
        role: "USER",
        password: "12345678",
    },
];

async function seedUsers() {
    try {
        await connectDB(); // Connect to the database

        // Clear existing users
        await User.deleteMany({});
        console.log("Deleted existing users");

        // Insert new users
        // const createdUsers = await User.insertMany();
        let createdUsers = [];
        for (const user of users) {
            const newUser = new User(user);
            createdUsers.push(newUser);
            await newUser.save();
        }
        console.log(`${createdUsers.length} users seeded successfully`);

        // Return the created users for reference
        return createdUsers;
    } catch (error) {
        console.error("Error seeding users:", error);
        throw error;
    }
}

// If this script is run directly
if (require.main === module) {
    seedUsers()
        .then(() => {
            console.log("User seeding completed successfully");
            disconnectDB();
        })
        .catch((err) => {
            console.error("Error in user seeding:", err);
            disconnectDB();
            process.exit(1);
        });
}

module.exports = seedUsers;
