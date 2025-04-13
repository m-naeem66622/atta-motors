const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        make: { type: String, required: true, trim: true },
        model: { type: String, required: true, trim: true },
        year: { type: Number, required: true },
        price: { type: Number, required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        images: { type: [String], default: [] },
        mileage: { type: Number },
        transmission: { type: String, enum: ["Automatic", "Manual", "CVT"] },
        fuelType: {
            type: String,
            enum: ["Petrol", "Diesel", "Hybrid", "Electric", "CNG"],
        },
        condition: {
            type: String,
            enum: ["New", "Like New", "Excellent", "Good", "Fair", "Salvage"],
            default: "Used",
        },
        interiorColor: { type: String, trim: true },
        exteriorColor: { type: String, trim: true },
        location: { type: String, trim: true },
        contactPhone: { type: String, trim: true },
        contactEmail: { type: String, trim: true },
        isFeatured: { type: Boolean, default: false },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "SOLD", "PENDING", "DRAFT"],
            default: "ACTIVE",
        },
        // title, interior color, exterior color
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
