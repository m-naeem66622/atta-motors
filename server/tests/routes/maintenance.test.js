const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../index");
const Maintenance = require("../../api/models/maintenance.model");
const User = require("../../api/models/user.model");
const { generateToken } = require("../../api/utils/jwt.util");

let testUser;
let adminUser;
let userToken;
let adminToken;
let testMaintenance;

beforeAll(async () => {
    // Use local MongoDB with a test database
    const uri = "mongodb://localhost:27017/atta_motors_test";

    console.log("Connecting to local MongoDB test database:", uri);

    // Connect to the local test database
    await mongoose.connect(uri);

    // Create a test user
    testUser = await User.create({
        username: "testmaintenanceuser",
        name: "TEST USER",
        email: "testmaintenance@example.com",
        phone: "1234567890",
        password: "password123",
        role: "USER",
    });

    // Create an admin user
    adminUser = await User.create({
        username: "adminuser",
        name: "ADMIN USER",
        email: "admin@example.com",
        phone: "9876543210",
        password: "admin123",
        role: "ADMIN",
    });

    // Generate auth tokens - make sure to include the role
    userToken = generateToken(testUser._id, testUser.role);
    adminToken = generateToken(adminUser._id, adminUser.role);

    // Create a test maintenance appointment
    testMaintenance = await Maintenance.create({
        userId: testUser._id,
        maintenanceType: "routine",
        specificService: "Oil Change",
        appointmentDate: new Date(),
        appointmentTime: "10:00 AM",
        status: "Scheduled",
        vehicle: {
            make: "Toyota",
            model: "Corolla",
            year: "2020",
            registration: "ABC-123",
        },
        customer: {
            name: "Test User",
            email: "testmaintenance@example.com",
            phone: "1234567890",
        },
        additionalNotes: "Test maintenance appointment",
    });
});

afterAll(async () => {
    // Clean up collections
    await Maintenance.deleteMany({});
    await User.deleteMany({});

    // Disconnect from the database
    await mongoose.disconnect();
});

describe("Maintenance API Tests", () => {
    describe("GET /api/maintenance/availability", () => {
        let today;
        let tomorrow;
        let dayAfterTomorrow;

        beforeEach(() => {
            // Setup dates for testing
            const now = new Date();
            today = now.toISOString().split("T")[0];

            now.setDate(now.getDate() + 1);
            tomorrow = now.toISOString().split("T")[0];

            now.setDate(now.getDate() + 1);
            dayAfterTomorrow = now.toISOString().split("T")[0];
        });

        it("should return availability for today's date", async () => {
            const res = await request(app)
                .get("/api/maintenance/availability")
                .query({ date: today });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.data).toHaveProperty("availability");
            expect(res.body.data).toHaveProperty("date");
            expect(res.body.data.date).toBe(today);

            // Verify structure of availability data
            expect(res.body.data.availability).toHaveProperty("morning");
            expect(res.body.data.availability).toHaveProperty("afternoon");
            expect(res.body.data.availability).toHaveProperty("evening");

            // Each time slot should have time and available properties
            expect(
                Array.isArray(res.body.data.availability.morning)
            ).toBeTruthy();
            res.body.data.availability.morning.forEach((slot) => {
                expect(slot).toHaveProperty("time");
                expect(slot).toHaveProperty("available");
                expect(typeof slot.available).toBe("boolean");
            });
        });

        it("should show correct availability with existing appointments", async () => {
            // Create a specific appointment to test availability
            const appointmentTime = "10:00 AM";
            await Maintenance.create({
                userId: testUser._id,
                maintenanceType: "routine",
                specificService: "Oil Change",
                appointmentDate: new Date(tomorrow), // Use tomorrow's date
                appointmentTime: appointmentTime,
                status: "Scheduled",
                vehicle: {
                    make: "Toyota",
                    model: "Corolla",
                    year: "2020",
                    registration: "TEST-123",
                },
                customer: {
                    name: "Test User",
                    email: "test@example.com",
                    phone: "1234567890",
                },
            });

            // Check availability for tomorrow
            const res = await request(app)
                .get("/api/maintenance/availability")
                .query({ date: tomorrow });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");

            // Find the specific time slot and verify it's marked as unavailable
            const morningSlots = res.body.data.availability.morning;
            const bookedSlot = morningSlots.find(
                (slot) => slot.time === appointmentTime
            );
            expect(bookedSlot).toBeDefined();
            expect(bookedSlot.available).toBe(false);

            // Other slots should still be available
            const otherSlots = morningSlots.filter(
                (slot) => slot.time !== appointmentTime
            );
            expect(otherSlots.some((slot) => slot.available)).toBeTruthy();
        });

        it("should handle multiple booked slots on the same day", async () => {
            // Book multiple slots for day after tomorrow
            const bookedTimes = ["09:00 AM", "01:00 PM", "05:00 PM"];

            // Create appointments for each time
            for (const time of bookedTimes) {
                await Maintenance.create({
                    userId: testUser._id,
                    maintenanceType: "routine",
                    specificService: "Oil Change",
                    appointmentDate: new Date(dayAfterTomorrow),
                    appointmentTime: time,
                    status: "Scheduled",
                    vehicle: {
                        make: "Toyota",
                        model: "Corolla",
                        year: "2020",
                        registration: "TEST-456",
                    },
                    customer: {
                        name: "Test User",
                        email: "test@example.com",
                        phone: "1234567890",
                    },
                });
            }

            // Check availability
            const res = await request(app)
                .get("/api/maintenance/availability")
                .query({ date: dayAfterTomorrow });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");

            // Get all slots from different periods
            const allSlots = [
                ...res.body.data.availability.morning,
                ...res.body.data.availability.afternoon,
                ...res.body.data.availability.evening,
            ];

            // Verify booked slots are unavailable
            for (const time of bookedTimes) {
                const slot = allSlots.find((s) => s.time === time);
                expect(slot).toBeDefined();
                expect(slot.available).toBe(false);
            }

            // Count available and unavailable slots
            const unavailableCount = allSlots.filter(
                (slot) => !slot.available
            ).length;
            expect(unavailableCount).toBeGreaterThanOrEqual(bookedTimes.length);

            // Some slots should still be available
            expect(allSlots.some((slot) => slot.available)).toBeTruthy();
        });

        it("should not mark cancelled appointments as unavailable", async () => {
            // Create a cancelled appointment
            const cancelledTime = "11:00 AM";
            await Maintenance.create({
                userId: testUser._id,
                maintenanceType: "routine",
                specificService: "Oil Change",
                appointmentDate: new Date(tomorrow),
                appointmentTime: cancelledTime,
                status: "Cancelled", // This is cancelled
                vehicle: {
                    make: "Toyota",
                    model: "Corolla",
                    year: "2020",
                    registration: "TEST-789",
                },
                customer: {
                    name: "Test User",
                    email: "test@example.com",
                    phone: "1234567890",
                },
            });

            // Check availability
            const res = await request(app)
                .get("/api/maintenance/availability")
                .query({ date: tomorrow });

            expect(res.statusCode).toBe(200);

            // Find the specific time slot and verify it's still available (since it was cancelled)
            const morningSlots = res.body.data.availability.morning;
            const cancelledSlot = morningSlots.find(
                (slot) => slot.time === cancelledTime
            );
            expect(cancelledSlot).toBeDefined();
            expect(cancelledSlot.available).toBe(true);
        });

        it("should handle dates with no bookings", async () => {
            // Use a date far in the future to ensure no bookings
            const farFutureDate = new Date();
            farFutureDate.setMonth(farFutureDate.getMonth() + 6);
            const futureDateString = farFutureDate.toISOString().split("T")[0];

            const res = await request(app)
                .get("/api/maintenance/availability")
                .query({ date: futureDateString });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");

            // Get all slots from all periods
            const allSlots = [
                ...res.body.data.availability.morning,
                ...res.body.data.availability.afternoon,
                ...res.body.data.availability.evening,
            ];

            // All slots should be available
            expect(allSlots.every((slot) => slot.available)).toBeTruthy();
        });

        it("should return error for invalid date format", async () => {
            const res = await request(app)
                .get("/api/maintenance/availability")
                .query({ date: "invalid-date" });

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe("FAILED");
        });

        it("should return error for missing date parameter", async () => {
            const res = await request(app).get("/api/maintenance/availability");

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe("FAILED");
        });
    });

    describe("POST /api/maintenance", () => {
        it("should create a new maintenance appointment with valid data", async () => {
            const newMaintenance = {
                maintenanceType: "mechanical",
                specificService: "Brake Repair",
                appointmentDate: new Date().toISOString().split("T")[0],
                appointmentTime: "02:00 PM",
                vehicle: {
                    make: "Honda",
                    model: "Accord",
                    year: "2019",
                    registration: "XYZ-789",
                },
                customer: {
                    name: "Test User",
                    email: "testmaintenance@example.com",
                    phone: "1234567890",
                },
                additionalNotes: "New test appointment",
            };

            const res = await request(app)
                .post("/api/maintenance")
                .set("Authorization", `Bearer ${userToken}`)
                .send(newMaintenance);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.data.maintenanceType).toBe("mechanical");
            expect(res.body.data.specificService).toBe("Brake Repair");
            expect(res.body.data.status).toBe("Scheduled");
        });

        it("should return 400 for invalid data", async () => {
            const invalidMaintenance = {
                // Missing required fields
                specificService: "Brake Repair",
                appointmentTime: "02:00 PM",
            };

            const res = await request(app)
                .post("/api/maintenance")
                .set("Authorization", `Bearer ${userToken}`)
                .send(invalidMaintenance);

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe("FAILED");
        });

        it("should return 401 for unauthorized request", async () => {
            const newMaintenance = {
                maintenanceType: "mechanical",
                specificService: "Brake Repair",
                appointmentDate: new Date().toISOString().split("T")[0],
                appointmentTime: "02:00 PM",
            };

            const res = await request(app)
                .post("/api/maintenance")
                .send(newMaintenance);

            expect(res.statusCode).toBe(401);
        });
    });

    describe("GET /api/maintenance/history", () => {
        it("should return maintenance history for authenticated user", async () => {
            const res = await request(app)
                .get("/api/maintenance/history")
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");
            expect(Array.isArray(res.body.data)).toBeTruthy();

            // All maintenance appointments should belong to the test user
            res.body.data.forEach((appointment) => {
                expect(appointment.userId.toString()).toBe(
                    testUser._id.toString()
                );
            });
        });

        it("should filter history by status", async () => {
            const res = await request(app)
                .get("/api/maintenance/history")
                .query({ status: "Scheduled" })
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");

            // All returned appointments should have the requested status
            res.body.data.forEach((appointment) => {
                expect(appointment.status).toBe("Scheduled");
            });
        });

        it("should return 401 for unauthenticated request", async () => {
            const res = await request(app).get("/api/maintenance/history");

            expect(res.statusCode).toBe(401);
        });
    });

    describe("GET /api/maintenance/:id", () => {
        it("should return a single maintenance appointment by id", async () => {
            const res = await request(app)
                .get(`/api/maintenance/${testMaintenance._id}`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.data._id).toBe(testMaintenance._id.toString());
            expect(res.body.data.maintenanceType).toBe("routine");
        });

        it("should return 404 for non-existent maintenance appointment", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/maintenance/${fakeId}`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.status).toBe("FAILED");
        });

        it("should allow admin to access any maintenance appointment", async () => {
            const res = await request(app)
                .get(`/api/maintenance/${testMaintenance._id}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");
        });

        it("should return 403 when trying to access someone else's appointment", async () => {
            // Create another user with correct role
            const anotherUser = await User.create({
                username: "anotheruser",
                name: "ANOTHER USER",
                email: "another@example.com",
                phone: "5556667777",
                password: "password123",
                role: "USER",
            });

            // Generate token for the other user with role
            const anotherToken = generateToken(
                anotherUser._id,
                anotherUser.role
            );

            const res = await request(app)
                .get(`/api/maintenance/${testMaintenance._id}`)
                .set("Authorization", `Bearer ${anotherToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body.status).toBe("FAILED");
        });
    });

    describe("PUT /api/maintenance/:id", () => {
        it("should update maintenance appointment with valid data", async () => {
            const updateData = {
                additionalNotes: "Updated test notes",
            };

            const res = await request(app)
                .put(`/api/maintenance/${testMaintenance._id}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.data.additionalNotes).toBe("Updated test notes");
        });

        it("should allow user to cancel their appointment", async () => {
            const updateData = {
                status: "Cancelled",
            };

            const res = await request(app)
                .put(`/api/maintenance/${testMaintenance._id}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.data.status).toBe("Cancelled");
        });

        it("should not allow regular user to mark as completed", async () => {
            // Create a new appointment first
            const newMaintenance = await Maintenance.create({
                userId: testUser._id,
                maintenanceType: "electrical",
                specificService: "Battery Replacement",
                appointmentDate: new Date(),
                appointmentTime: "11:00 AM",
                status: "Scheduled",
                vehicle: {
                    make: "Toyota",
                    model: "Camry",
                    year: "2021",
                    registration: "DEF-456",
                },
                customer: {
                    name: "Test User",
                    email: "testmaintenance@example.com",
                    phone: "1234567890",
                },
            });

            const updateData = {
                status: "Completed",
            };

            const res = await request(app)
                .put(`/api/maintenance/${newMaintenance._id}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(403);
            expect(res.body.status).toBe("FAILED");
        });

        it("should allow admin to mark as completed", async () => {
            // Create a new appointment first
            const newMaintenance = await Maintenance.create({
                userId: testUser._id,
                maintenanceType: "electrical",
                specificService: "Battery Replacement",
                appointmentDate: new Date(),
                appointmentTime: "01:00 PM",
                status: "Scheduled",
                vehicle: {
                    make: "Toyota",
                    model: "Camry",
                    year: "2021",
                    registration: "GHI-789",
                },
                customer: {
                    name: "Test User",
                    email: "testmaintenance@example.com",
                    phone: "1234567890",
                },
            });

            const updateData = {
                status: "Completed",
                technician: "John Smith",
                cost: "$150",
                notes: "Service completed successfully",
            };

            const res = await request(app)
                .put(`/api/maintenance/${newMaintenance._id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.data.status).toBe("Completed");
            expect(res.body.data.technician).toBe("John Smith");
        });

        it("should return 403 when trying to update someone else's appointment", async () => {
            const anotherUser = await User.findOne({ username: "anotheruser" });
            const anotherToken = generateToken(anotherUser._id);

            const updateData = {
                additionalNotes: "Trying to update someone else's appointment",
            };

            const res = await request(app)
                .put(`/api/maintenance/${testMaintenance._id}`)
                .set("Authorization", `Bearer ${anotherToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(403);
            expect(res.body.status).toBe("FAILED");
        });
    });

    describe("DELETE /api/maintenance/:id/cancel", () => {
        it("should cancel maintenance appointment", async () => {
            // Create a new appointment first since we already cancelled the test one
            const newMaintenance = await Maintenance.create({
                userId: testUser._id,
                maintenanceType: "computerized",
                specificService: "Computer Diagnostics",
                appointmentDate: new Date(),
                appointmentTime: "03:00 PM",
                status: "Scheduled",
                vehicle: {
                    make: "Nissan",
                    model: "Altima",
                    year: "2018",
                    registration: "JKL-012",
                },
                customer: {
                    name: "Test User",
                    email: "testmaintenance@example.com",
                    phone: "1234567890",
                },
            });

            const res = await request(app)
                .delete(`/api/maintenance/${newMaintenance._id}/cancel`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.data.status).toBe("Cancelled");
        });

        it("should not allow cancellation of completed appointment", async () => {
            // Create and complete a maintenance appointment
            const completedMaintenance = await Maintenance.create({
                userId: testUser._id,
                maintenanceType: "routine",
                specificService: "Tire Rotation",
                appointmentDate: new Date(),
                appointmentTime: "09:00 AM",
                status: "Completed", // Already completed
                vehicle: {
                    make: "Honda",
                    model: "Civic",
                    year: "2019",
                    registration: "MNO-345",
                },
                customer: {
                    name: "Test User",
                    email: "testmaintenance@example.com",
                    phone: "1234567890",
                },
            });

            const res = await request(app)
                .delete(`/api/maintenance/${completedMaintenance._id}/cancel`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe("FAILED");
        });

        it("should return 403 when trying to cancel someone else's appointment", async () => {
            // Create an appointment for admin user
            const adminMaintenance = await Maintenance.create({
                userId: adminUser._id,
                maintenanceType: "routine",
                specificService: "Oil Change",
                appointmentDate: new Date(),
                appointmentTime: "09:00 AM",
                status: "Scheduled",
                vehicle: {
                    make: "BMW",
                    model: "X5",
                    year: "2022",
                    registration: "PQR-678",
                },
                customer: {
                    name: "Admin User",
                    email: "admin@example.com",
                    phone: "9876543210",
                },
            });

            const res = await request(app)
                .delete(`/api/maintenance/${adminMaintenance._id}/cancel`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body.status).toBe("FAILED");
        });
    });

    describe("GET /api/maintenance/admin/all", () => {
        it("should return all maintenance appointments for admin", async () => {
            const res = await request(app)
                .get("/api/maintenance/admin/all")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });

        it("should filter appointments by status for admin", async () => {
            const res = await request(app)
                .get("/api/maintenance/admin/all")
                .query({ status: "Scheduled" })
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("SUCCESS");

            // All returned appointments should have the requested status
            if (res.body.data.length > 0) {
                res.body.data.forEach((appointment) => {
                    expect(appointment.status).toBe("Scheduled");
                });
            }
        });

        it("should return 403 for non-admin user", async () => {
            const res = await request(app)
                .get("/api/maintenance/admin/all")
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body.status).toBe("FAILED");
        });
    });
});
