import { z } from "zod";

export const createVehicleSchema = z.object({
    // Basic Info
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.string().min(4, "Year must be a valid year"),
    price: z.string().min(1, "Price is required"),
    title: z.string().min(1, "Title is required"),

    // Vehicle Details
    mileage: z.string().optional(),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    condition: z.string().optional(),
    exteriorColor: z.string().optional(),
    interiorColor: z.string().optional(),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),

    // Contact Info
    location: z.string().min(1, "Location is required"),
    contactPhone: z.string().min(1, "Contact phone is required"),
    contactEmail: z.string().email("Invalid email address").optional(),
    preferredContact: z.enum(["phone", "email"]),
});

export type VehicleFormValues = z.infer<typeof createVehicleSchema>;
