const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../index");
const Vehicle = require("../../api/models/vehicle.model");
const User = require("../../api/models/user.model");
const { generateToken } = require("../../api/utils/jwt.util");

let testUser;
let authToken;
let testVehicle;

beforeAll(async () => {
    // Use local MongoDB with a test database
    const uri = "mongodb://localhost:27017/atta_motors_test";

    console.log("Connecting to local MongoDB test database:", uri);

    // Connect to the local test database
    await mongoose.connect(uri);

    // Create a test user
    testUser = await User.create({
        username: "testvehicleuser",
        name: "TEST USER",
        email: "testvehicle@example.com",
        phone: "1234567890",
        password: "password123",
    });

    // Generate auth token for the test user
    authToken = generateToken(testUser._id);

    // Create a test vehicle
    testVehicle = await Vehicle.create({
        title: "Test Vehicle",
        make: "Toyota",
        model: "Corolla",
        year: 2020,
        price: 25000,
        description: "Test vehicle for sale",
        condition: "Like New",
        mileage: 15000,
        owner: testUser._id,
    });
});

afterAll(async () => {
    // Clean up collections
    await Vehicle.deleteMany({});
    await User.deleteMany({});

    // Disconnect from the database
    await mongoose.disconnect();
});

describe("GET /api/vehicles", () => {
    it("should return all vehicles", async () => {
        const res = await request(app).get("/api/vehicles");

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("SUCCESS");
        expect(Array.isArray(res.body.data)).toBeTruthy();
        expect(res.body.data.length).toBeGreaterThan(0);
    });
});

describe("GET /api/vehicles/:id", () => {
    it("should return a single vehicle by id", async () => {
        const res = await request(app).get(`/api/vehicles/${testVehicle._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("SUCCESS");
        expect(res.body.data._id).toBe(testVehicle._id.toString());
        expect(res.body.data.make).toBe("Toyota");
    });

    it("should return 404 for non-existent vehicle", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/vehicles/${fakeId}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.status).toBe("FAILED");
    });
});

describe("POST /api/vehicles", () => {
    it("should create a new vehicle with valid data", async () => {
        const newVehicle = {
            title: "New Vehicle",
            make: "Honda",
            model: "Civic",
            year: 2021,
            price: 28000,
            description: "Brand new Honda Civic",
            condition: "New",
            mileage: 0,
            transmission: "Automatic",
            fuelType: "Petrol",
        };

        const res = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${authToken}`)
            .send(newVehicle);

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe("SUCCESS");
        expect(res.body.data.make).toBe("Honda");
        // expect(res.body.data.owner.toString()).toBe(testUser._id.toString());
    });

    it("should return 400 for invalid data", async () => {
        const invalidVehicle = {
            // Missing required fields
            model: "Missing Make",
            price: 15000,
        };

        const res = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${authToken}`)
            .send(invalidVehicle);

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe("FAILED");
    });

    it("should return 401 for unauthorized request", async () => {
        const newVehicle = {
            make: "Ford",
            model: "Mustang",
            year: 2022,
            price: 45000,
        };

        const res = await request(app).post("/api/vehicles").send(newVehicle);

        expect(res.statusCode).toBe(401);
    });
});

describe("PUT /api/vehicles/:id", () => {
    it("should update vehicle with valid data", async () => {
        const updateData = {
            price: 23000,
            description: "Updated description for test",
        };

        const res = await request(app)
            .put(`/api/vehicles/${testVehicle._id}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send(updateData);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("SUCCESS");
        expect(res.body.data.price).toBe(23000);
        expect(res.body.data.description).toBe("Updated description for test");
    });

    it("should return 403 when trying to update someone else's vehicle", async () => {
        // Create another user
        const anotherUser = await User.create({
            username: "anotheruser",
            name: "ANOTHER USER",
            email: "another@example.com",
            phone: "9876543210",
            password: "password123",
        });

        // Generate token for the other user
        const anotherToken = generateToken(anotherUser._id);

        const res = await request(app)
            .put(`/api/vehicles/${testVehicle._id}`)
            .set("Authorization", `Bearer ${anotherToken}`)
            .send({ price: 20000 });

        expect(res.statusCode).toBe(403);
        expect(res.body.status).toBe("FAILED");
    });
});

describe("DELETE /api/vehicles/:id", () => {
    it("should return 403 when trying to delete someone else's vehicle", async () => {
        // Using the other user's token
        const anotherUser = await User.findOne({ username: "anotheruser" });
        const anotherToken = generateToken(anotherUser._id);

        const res = await request(app)
            .delete(`/api/vehicles/${testVehicle._id}`)
            .set("Authorization", `Bearer ${anotherToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.status).toBe("FAILED");
    });

    it("should delete vehicle successfully", async () => {
        const res = await request(app)
            .delete(`/api/vehicles/${testVehicle._id}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("SUCCESS");

        // Verify the vehicle is deleted
        const deletedVehicle = await Vehicle.findOne({
            _id: testVehicle._id,
            isDeleted: false,
        });
        expect(deletedVehicle).toBeNull();
    });
});

describe("GET /api/vehicles/user/me", () => {
    it("should return current user's vehicles", async () => {
        // Create a few vehicles for the test user first
        await Vehicle.create([
            {
                title: "Test Vehicle 1",
                make: "Toyota",
                model: "Camry",
                year: 2019,
                price: 22000,
                owner: testUser._id,
            },
            {
                title: "Test Vehicle 2",
                make: "Honda",
                model: "Accord",
                year: 2020,
                price: 24000,
                owner: testUser._id,
            },
        ]);

        const res = await request(app)
            .get("/api/vehicles/user/me")
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("SUCCESS");
        expect(Array.isArray(res.body.data)).toBeTruthy();

        // All vehicles should belong to the test user
        res.body.data.forEach((vehicle) => {
            expect(vehicle.owner.toString()).toBe(testUser._id.toString());
        });
    });

    it("should return 401 for unauthenticated request", async () => {
        const res = await request(app).get("/api/vehicles/user/me");

        expect(res.statusCode).toBe(401);
    });
});

// describe("GET /api/vehicles/search", () => {
//     it("should return vehicles matching search criteria", async () => {
//         // Create test vehicles with specific attributes for searching
//         await Vehicle.create([
//             {
//                 title: "BMW X5 SUV",
//                 make: "BMW",
//                 model: "X5",
//                 year: 2021,
//                 price: 65000,
//                 condition: "Fair",
//                 bodyType: "SUV",
//                 transmission: "Automatic",
//                 fuelType: "Diesel",
//                 owner: testUser._id,
//             },
//             {
//                 title: "Mercedes C-Class Sedan",
//                 make: "Mercedes",
//                 model: "C-Class",
//                 year: 2022,
//                 price: 55000,
//                 condition: "New",
//                 bodyType: "Sedan",
//                 transmission: "Automatic",
//                 fuelType: "Petrol",
//                 owner: testUser._id,
//             },
//         ]);

//         // Test search by make
//         const makeSearch = await request(app)
//             .get("/api/vehicles/search")
//             .query({ make: "BMW" });

//         expect(makeSearch.statusCode).toBe(200);
//         expect(makeSearch.body.status).toBe("SUCCESS");
//         expect(makeSearch.body.data.some((v) => v.make === "BMW")).toBeTruthy();
//         expect(
//             makeSearch.body.data.every((v) => v.make === "BMW")
//         ).toBeTruthy();

//         // Test search by price range
//         const priceSearch = await request(app)
//             .get("/api/vehicles/search")
//             .query({ minPrice: 60000, maxPrice: 70000 });

//         expect(priceSearch.statusCode).toBe(200);
//         expect(priceSearch.body.status).toBe("SUCCESS");
//         expect(
//             priceSearch.body.data.every(
//                 (v) => v.price >= 60000 && v.price <= 70000
//             )
//         ).toBeTruthy();

//         // Test search by multiple criteria
//         const multiSearch = await request(app)
//             .get("/api/vehicles/search")
//             .query({
//                 condition: "New",
//                 transmission: "Automatic",
//                 fuelType: "Petrol",
//             });

//         expect(multiSearch.statusCode).toBe(200);
//         expect(multiSearch.body.status).toBe("SUCCESS");
//         expect(
//             multiSearch.body.data.some(
//                 (v) =>
//                     v.condition === "New" &&
//                     v.transmission === "Automatic" &&
//                     v.fuelType === "Petrol"
//             )
//         ).toBeTruthy();
//     });
// });
