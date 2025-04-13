// Vehicle Seeder
const mongoose = require("mongoose");
const Vehicle = require("../api/models/vehicle.model");
const User = require("../api/models/user.model");
const { connectDB, disconnectDB } = require("../api/config/db");

async function seedVehicles() {
    try {
        await connectDB(); // Connect to the database

        // Get users to assign as vehicle owners
        const users = await User.find({ role: "USER" });

        if (users.length === 0) {
            throw new Error(
                "No users found. Please run the user seeder first."
            );
        }

        // Clear existing vehicles
        await Vehicle.deleteMany({});
        console.log("Deleted existing vehicles");

        // Sample vehicle data
        const vehicles = [
            {
                title: "2020 Toyota Corolla",
                make: "Toyota",
                model: "Corolla",
                year: 2020,
                price: 18500,
                description:
                    "Well-maintained Toyota Corolla with low mileage. Fuel efficient and reliable for daily commuting.",
                images: ["toyota_corolla_1.jpg", "toyota_corolla_2.jpg"],
                mileage: 35000,
                condition: "New",
                transmission: "Automatic",
                fuelType: "Petrol",
                owner: users[0]._id,
                status: "ACTIVE",
                location: "Los Angeles, CA",
            },
            {
                title: "2021 Honda Civic",
                make: "Honda",
                model: "Civic",
                year: 2021,
                price: 22000,
                description:
                    "Like-new Honda Civic with modern features and excellent fuel economy.",
                images: ["honda_civic_1.jpg", "honda_civic_2.jpg"],
                mileage: 12000,
                condition: "New",
                transmission: "CVT",
                fuelType: "Petrol",
                owner: users[1]._id,
                status: "ACTIVE",
                location: "Chicago, IL",
            },
            {
                title: "2019 Ford F-150",
                make: "Ford",
                model: "F-150",
                year: 2019,
                price: 35000,
                description:
                    "Powerful Ford F-150 with towing package and bed liner. Perfect for work and recreation.",
                images: ["ford_f150_1.jpg", "ford_f150_2.jpg"],
                mileage: 45000,
                condition: "New",
                transmission: "Automatic",
                fuelType: "Petrol",
                owner: users[2]._id,
                status: "ACTIVE",
                location: "Houston, TX",
            },
            {
                title: "2022 Tesla Model 3",
                make: "Tesla",
                model: "Model 3",
                year: 2022,
                price: 49000,
                description:
                    "Premium Tesla Model 3 with autopilot features and long-range battery.",
                images: ["tesla_model3_1.jpg", "tesla_model3_2.jpg"],
                mileage: 5000,
                condition: "New",
                transmission: "Automatic",
                fuelType: "Electric",
                owner: users[0]._id,
                status: "ACTIVE",
                location: "San Francisco, CA",
            },
            {
                title: "2020 BMW X5",
                make: "BMW",
                model: "X5",
                year: 2020,
                price: 58000,
                description:
                    "Luxury BMW X5 SUV with premium features and excellent condition.",
                images: ["bmw_x5_1.jpg", "bmw_x5_2.jpg"],
                mileage: 25000,
                condition: "New",
                transmission: "Automatic",
                fuelType: "Diesel",
                owner: users[1]._id,
                status: "ACTIVE",
                location: "Miami, FL",
            },
            {
                title: "2021 Hyundai Tucson",
                make: "Hyundai",
                model: "Tucson",
                year: 2021,
                price: 28000,
                description:
                    "Modern Hyundai Tucson with advanced safety features and spacious interior.",
                images: ["hyundai_tucson_1.jpg", "hyundai_tucson_2.jpg"],
                mileage: 18000,
                condition: "New",
                transmission: "Automatic",
                fuelType: "Petrol",
                owner: users[2]._id,
                status: "ACTIVE",
                location: "Seattle, WA",
            },
            {
                title: "2018 Chevrolet Malibu",
                make: "Mercedes-Benz",
                model: "C-Class",
                year: 2019,
                price: 39000,
                description:
                    "Elegant Mercedes-Benz C-Class with premium interior and smooth driving experience.",
                images: ["mercedes_cclass_1.jpg", "mercedes_cclass_2.jpg"],
                mileage: 30000,
                condition: "New",
                transmission: "Automatic",
                fuelType: "Petrol",
                owner: users[3]._id,
                status: "ACTIVE",
                location: "New York, NY",
            },
            {
                title: "2022 Toyota RAV4",
                make: "Toyota",
                model: "RAV4",
                year: 2022,
                price: 32000,
                description:
                    "Latest model Toyota RAV4 with hybrid engine and advanced tech features.",
                images: ["toyota_rav4_1.jpg", "toyota_rav4_2.jpg"],
                mileage: 8000,
                condition: "New",
                transmission: "CVT",
                fuelType: "Hybrid",
                owner: users[0]._id,
                status: "ACTIVE",
                location: "Denver, CO",
            },
            {
                title: "2020 Audi Q5",
                make: "Audi",
                model: "Q5",
                year: 2020,
                price: 45000,
                description:
                    "Premium Audi Q5 with quattro all-wheel drive and luxury appointments.",
                images: ["audi_q5_1.jpg", "audi_q5_2.jpg"],
                mileage: 22000,
                condition: "New",
                transmission: "Automatic",
                fuelType: "Petrol",
                owner: users[1]._id,
                status: "ACTIVE",
                location: "Austin, TX",
            },
            {
                title: "2021 Honda CR-V",
                make: "Honda",
                model: "CR-V",
                year: 2021,
                price: 29500,
                description:
                    "Spacious Honda CR-V with excellent reliability and family-friendly features.",
                images: ["honda_crv_1.jpg", "honda_crv_2.jpg"],
                mileage: 15000,
                condition: "New",
                transmission: "CVT",
                fuelType: "Petrol",
                owner: users[2]._id,
                status: "SOLD",
                location: "Atlanta, GA",
            },
        ];

        // Insert vehicles
        const createdVehicles = await Vehicle.insertMany(vehicles);
        console.log(`${createdVehicles.length} vehicles seeded successfully`);

        return createdVehicles;
    } catch (error) {
        console.error("Error seeding vehicles:", error);
        throw error;
    }
}

// If this script is run directly
if (require.main === module) {
    seedVehicles()
        .then(() => {
            console.log("Vehicle seeding completed successfully");
            disconnectDB();
        })
        .catch((err) => {
            console.error("Error in vehicle seeding:", err);
            disconnectDB();
            process.exit(1);
        });
}

module.exports = seedVehicles;
