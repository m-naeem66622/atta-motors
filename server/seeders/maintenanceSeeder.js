// filepath: /home/CODE_PLAYGROUND/Reactjs+Nodejs/atta-motors/server/seeders/maintenanceSeeder.js
// Maintenance Seeder
const mongoose = require("mongoose");
const Maintenance = require("../api/models/maintenance.model");
const User = require("../api/models/user.model");
const { connectDB, disconnectDB } = require("../api/config/db");

async function seedMaintenanceRecords() {
    try {
        await connectDB(); // Connect to the database

        // Get users to assign as maintenance requesters
        const users = await User.find({ role: "USER" });

        if (users.length === 0) {
            throw new Error(
                "No users found. Please run the user seeder first."
            );
        }

        console.log("Fetched users for maintenance records:", users);

        // Clear existing maintenance records
        await Maintenance.deleteMany({});
        console.log("Deleted existing maintenance records");

        // Sample maintenance data - generate 20 records (about 5 for each non-admin user)
        const maintenanceRecords = [
            // User 1 (johndoe) - 5 records
            {
                userId: users[0]._id,
                maintenanceType: "routine",
                specificService: "Oil Change and Filter Replacement",
                appointmentDate: new Date(2025, 4, 15), // May 15, 2025
                appointmentTime: "10:00 AM",
                status: "Scheduled",
                vehicle: {
                    make: "Toyota",
                    model: "Corolla",
                    year: "2020",
                    registration: "ABC-123",
                },
                customer: {
                    name: users[0].name,
                    email: users[0].email,
                    phone: users[0].phone,
                },
                technician: "Mike Johnson",
                cost: "5000",
                notes: "Regular maintenance service",
                additionalNotes: "Customer requested air filter check as well",
            },
            {
                userId: users[0]._id,
                maintenanceType: "mechanical",
                specificService: "Brake Pad Replacement",
                appointmentDate: new Date(2025, 4, 20), // May 20, 2025
                appointmentTime: "2:30 PM",
                status: "Pending",
                vehicle: {
                    make: "Toyota",
                    model: "Corolla",
                    year: "2020",
                    registration: "ABC-123",
                },
                customer: {
                    name: users[0].name,
                    email: users[0].email,
                    phone: users[0].phone,
                },
                technician: null,
                cost: null,
                notes: "Customer reported squeaking noise when braking",
                additionalNotes: "",
            },
            {
                userId: users[0]._id,
                maintenanceType: "electrical",
                specificService: "Headlight Replacement",
                appointmentDate: new Date(2025, 4, 25), // May 25, 2025
                appointmentTime: "1:00 PM",
                status: "Scheduled",
                vehicle: {
                    make: "Toyota",
                    model: "Corolla",
                    year: "2020",
                    registration: "ABC-123",
                },
                customer: {
                    name: users[0].name,
                    email: users[0].email,
                    phone: users[0].phone,
                },
                technician: "Sarah Williams",
                cost: "3500",
                notes: "Left headlight not working",
                additionalNotes: "",
            },
            {
                userId: users[0]._id,
                maintenanceType: "routine",
                specificService: "Tire Rotation and Alignment",
                appointmentDate: new Date(2025, 6, 10), // July 10, 2025
                appointmentTime: "11:00 AM",
                status: "Pending",
                vehicle: {
                    make: "Toyota",
                    model: "Corolla",
                    year: "2020",
                    registration: "ABC-123",
                },
                customer: {
                    name: users[0].name,
                    email: users[0].email,
                    phone: users[0].phone,
                },
                technician: null,
                cost: null,
                notes: "Recommended rotation after 10,000 km",
                additionalNotes: "",
            },
            {
                userId: users[0]._id,
                maintenanceType: "computerized",
                specificService: "ECU Update",
                appointmentDate: new Date(2025, 7, 5), // Aug 5, 2025
                appointmentTime: "9:00 AM",
                status: "Scheduled",
                vehicle: {
                    make: "Toyota",
                    model: "Corolla",
                    year: "2020",
                    registration: "ABC-123",
                },
                customer: {
                    name: users[0].name,
                    email: users[0].email,
                    phone: users[0].phone,
                },
                technician: "Alex Chen",
                cost: "8000",
                notes: "Software update for fuel efficiency",
                additionalNotes: "",
            },

            // User 2 (janedoe) - 5 records
            {
                userId: users[1]._id,
                maintenanceType: "electrical",
                specificService: "Battery Replacement",
                appointmentDate: new Date(2025, 4, 10), // May 10, 2025
                appointmentTime: "9:00 AM",
                status: "Completed",
                vehicle: {
                    make: "Honda",
                    model: "Civic",
                    year: "2019",
                    registration: "DEF-456",
                },
                customer: {
                    name: users[1].name,
                    email: users[1].email,
                    phone: users[1].phone,
                },
                technician: "Sarah Williams",
                cost: "8000",
                notes: "Battery was completely drained",
                additionalNotes: "Performed alternator check as well",
            },
            {
                userId: users[1]._id,
                maintenanceType: "painting",
                specificService: "Full Body Paint",
                appointmentDate: new Date(2025, 5, 25), // June 25, 2025
                appointmentTime: "9:30 AM",
                status: "Scheduled",
                vehicle: {
                    make: "Honda",
                    model: "Civic",
                    year: "2019",
                    registration: "DEF-456",
                },
                customer: {
                    name: users[1].name,
                    email: users[1].email,
                    phone: users[1].phone,
                },
                technician: "David Lee",
                cost: "45000",
                notes: "Customer wants to change color from silver to black",
                additionalNotes: "Premium paint quality requested",
            },
            {
                userId: users[1]._id,
                maintenanceType: "mechanical",
                specificService: "Transmission Fluid Change",
                appointmentDate: new Date(2025, 5, 15), // June 15, 2025
                appointmentTime: "3:30 PM",
                status: "Scheduled",
                vehicle: {
                    make: "Honda",
                    model: "Civic",
                    year: "2019",
                    registration: "DEF-456",
                },
                customer: {
                    name: users[1].name,
                    email: users[1].email,
                    phone: users[1].phone,
                },
                technician: "Mike Johnson",
                cost: "7500",
                notes: "Scheduled maintenance at 50,000 km",
                additionalNotes: "",
            },
            {
                userId: users[1]._id,
                maintenanceType: "denting",
                specificService: "Door Panel Repair",
                appointmentDate: new Date(2025, 6, 20), // July 20, 2025
                appointmentTime: "10:30 AM",
                status: "Pending",
                vehicle: {
                    make: "Honda",
                    model: "Civic",
                    year: "2019",
                    registration: "DEF-456",
                },
                customer: {
                    name: users[1].name,
                    email: users[1].email,
                    phone: users[1].phone,
                },
                technician: null,
                cost: null,
                notes: "Shopping cart damage to passenger door",
                additionalNotes: "",
            },
            {
                userId: users[1]._id,
                maintenanceType: "routine",
                specificService: "Air Filter Replacement",
                appointmentDate: new Date(2025, 7, 25), // Aug 25, 2025
                appointmentTime: "1:30 PM",
                status: "Scheduled",
                vehicle: {
                    make: "Honda",
                    model: "Civic",
                    year: "2019",
                    registration: "DEF-456",
                },
                customer: {
                    name: users[1].name,
                    email: users[1].email,
                    phone: users[1].phone,
                },
                technician: "Sarah Williams",
                cost: "2500",
                notes: "Annual air filter change",
                additionalNotes: "",
            },

            // User 3 (bobsmith) - 5 records
            {
                userId: users[2]._id,
                maintenanceType: "denting",
                specificService: "Front Bumper Repair",
                appointmentDate: new Date(2025, 5, 12), // June 12, 2025
                appointmentTime: "3:00 PM",
                status: "Pending",
                vehicle: {
                    make: "Ford",
                    model: "Focus",
                    year: "2021",
                    registration: "GHI-789",
                },
                customer: {
                    name: users[2].name,
                    email: users[2].email,
                    phone: users[2].phone,
                },
                technician: null,
                cost: null,
                notes: "Minor collision damage to front bumper",
                additionalNotes: "",
            },
            {
                userId: users[2]._id,
                maintenanceType: "electrical",
                specificService: "Radio Replacement",
                appointmentDate: new Date(2025, 4, 30), // April 30, 2025
                appointmentTime: "2:00 PM",
                status: "Completed",
                vehicle: {
                    make: "Ford",
                    model: "Focus",
                    year: "2021",
                    registration: "GHI-789",
                },
                customer: {
                    name: users[2].name,
                    email: users[2].email,
                    phone: users[2].phone,
                },
                technician: "Alex Chen",
                cost: "12000",
                notes: "Upgraded to touchscreen infotainment system",
                additionalNotes: "Includes Bluetooth and GPS",
            },
            {
                userId: users[2]._id,
                maintenanceType: "mechanical",
                specificService: "Clutch Replacement",
                appointmentDate: new Date(2025, 6, 5), // July 5, 2025
                appointmentTime: "9:00 AM",
                status: "Scheduled",
                vehicle: {
                    make: "Ford",
                    model: "Focus",
                    year: "2021",
                    registration: "GHI-789",
                },
                customer: {
                    name: users[2].name,
                    email: users[2].email,
                    phone: users[2].phone,
                },
                technician: "Mike Johnson",
                cost: "25000",
                notes: "Clutch slipping during gear changes",
                additionalNotes: "Will check flywheel condition as well",
            },
            {
                userId: users[2]._id,
                maintenanceType: "routine",
                specificService: "Brake Fluid Flush",
                appointmentDate: new Date(2025, 7, 15), // Aug 15, 2025
                appointmentTime: "11:30 AM",
                status: "Scheduled",
                vehicle: {
                    make: "Ford",
                    model: "Focus",
                    year: "2021",
                    registration: "GHI-789",
                },
                customer: {
                    name: users[2].name,
                    email: users[2].email,
                    phone: users[2].phone,
                },
                technician: "Sarah Williams",
                cost: "4500",
                notes: "Regular maintenance schedule",
                additionalNotes: "",
            },
            {
                userId: users[2]._id,
                maintenanceType: "computerized",
                specificService: "ABS Module Diagnosis",
                appointmentDate: new Date(2025, 8, 10), // Sept 10, 2025
                appointmentTime: "10:00 AM",
                status: "Pending",
                vehicle: {
                    make: "Ford",
                    model: "Focus",
                    year: "2021",
                    registration: "GHI-789",
                },
                customer: {
                    name: users[2].name,
                    email: users[2].email,
                    phone: users[2].phone,
                },
                technician: null,
                cost: null,
                notes: "ABS warning light is on",
                additionalNotes: "Customer reports no issues with braking",
            },

            // User 4 (alicegreen) - 5 records
            {
                userId: users[3]._id,
                maintenanceType: "routine",
                specificService: "Full Service",
                appointmentDate: new Date(2025, 4, 18), // May 18, 2025
                appointmentTime: "9:00 AM",
                status: "Scheduled",
                vehicle: {
                    make: "Mercedes",
                    model: "C-Class",
                    year: "2022",
                    registration: "JKL-101",
                },
                customer: {
                    name: users[3].name,
                    email: users[3].email,
                    phone: users[3].phone,
                },
                technician: "David Lee",
                cost: "15000",
                notes: "Annual comprehensive service",
                additionalNotes: "Car is under warranty",
            },
            {
                userId: users[3]._id,
                maintenanceType: "computerized",
                specificService: "Navigation System Update",
                appointmentDate: new Date(2025, 5, 20), // June 20, 2025
                appointmentTime: "11:00 AM",
                status: "Scheduled",
                vehicle: {
                    make: "Mercedes",
                    model: "C-Class",
                    year: "2022",
                    registration: "JKL-101",
                },
                customer: {
                    name: users[3].name,
                    email: users[3].email,
                    phone: users[3].phone,
                },
                technician: "Alex Chen",
                cost: "6000",
                notes: "Latest map update and software upgrade",
                additionalNotes: "",
            },
            {
                userId: users[3]._id,
                maintenanceType: "mechanical",
                specificService: "Suspension Check",
                appointmentDate: new Date(2025, 6, 15), // July 15, 2025
                appointmentTime: "2:00 PM",
                status: "Pending",
                vehicle: {
                    make: "Mercedes",
                    model: "C-Class",
                    year: "2022",
                    registration: "JKL-101",
                },
                customer: {
                    name: users[3].name,
                    email: users[3].email,
                    phone: users[3].phone,
                },
                technician: null,
                cost: null,
                notes: "Customer reports unusual noise when going over bumps",
                additionalNotes: "",
            },
            {
                userId: users[3]._id,
                maintenanceType: "electrical",
                specificService: "Smart Key Reprogramming",
                appointmentDate: new Date(2025, 7, 10), // Aug 10, 2025
                appointmentTime: "10:30 AM",
                status: "Pending",
                vehicle: {
                    make: "Mercedes",
                    model: "C-Class",
                    year: "2022",
                    registration: "JKL-101",
                },
                customer: {
                    name: users[3].name,
                    email: users[3].email,
                    phone: users[3].phone,
                },
                technician: null,
                cost: null,
                notes: "Key fob not working consistently",
                additionalNotes:
                    "Customer has two keys that need reprogramming",
            },
            {
                userId: users[3]._id,
                maintenanceType: "denting",
                specificService: "Minor Scratch Repair",
                appointmentDate: new Date(2025, 8, 5), // Sept 5, 2025
                appointmentTime: "1:00 PM",
                status: "Scheduled",
                vehicle: {
                    make: "Mercedes",
                    model: "C-Class",
                    year: "2022",
                    registration: "JKL-101",
                },
                customer: {
                    name: users[3].name,
                    email: users[3].email,
                    phone: users[3].phone,
                },
                technician: "David Lee",
                cost: "8000",
                notes: "Small scratch on rear passenger door",
                additionalNotes: "Touch-up paint to match exactly",
            },
        ];

        // Insert maintenance records
        let createdRecords = [];
        for (const record of maintenanceRecords) {
            const newRecord = new Maintenance(record);
            createdRecords.push(newRecord);
            await newRecord.save();
        }

        console.log(
            `${createdRecords.length} maintenance records seeded successfully`
        );

        // Return the created records for reference
        return createdRecords;
    } catch (error) {
        console.error("Error seeding maintenance records:", error);
        throw error;
    }
}

// If this script is run directly
if (require.main === module) {
    seedMaintenanceRecords()
        .then(() => {
            console.log("Maintenance record seeding completed successfully");
            disconnectDB();
        })
        .catch((err) => {
            console.error("Error in maintenance seeding:", err);
            disconnectDB();
            process.exit(1);
        });
}

module.exports = seedMaintenanceRecords;
