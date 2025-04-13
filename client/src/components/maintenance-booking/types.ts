import { z } from "zod";
import type React from "react";

// Form schema
export const bookingSchema = z.object({
    // Step 1: Service Selection
    maintenanceType: z.string().min(1, "Please select a maintenance type"),
    specificService: z.string().min(1, "Please select a specific service"),

    // Step 2: Date & Time
    appointmentDate: z.date({
        required_error: "Please select a date",
    }),
    appointmentTime: z.string().min(1, "Please select a time slot"),

    // Step 3: Vehicle Information
    vehicleMake: z.string().min(1, "Vehicle make is required"),
    vehicleModel: z.string().min(1, "Vehicle model is required"),
    vehicleYear: z.string().min(1, "Vehicle year is required"),
    vehicleRegistration: z.string().min(1, "Registration number is required"),

    // Step 4: Contact Information
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    additionalNotes: z.string().optional(),
});

export type FormValues = z.infer<typeof bookingSchema>;

export interface MaintenanceType {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    services: string[];
    estimatedTime: string;
    price: string;
}

export interface MaintenanceBookingFormProps {
    onCancel: () => void;
    maintenanceTypes: MaintenanceType[];
    initialServiceType?: string;
}

// Mock data for unavailable dates
export const unavailableDates = [
    new Date(new Date().setDate(new Date().getDate() + 2)),
    new Date(new Date().setDate(new Date().getDate() + 5)),
    new Date(new Date().setDate(new Date().getDate() + 9)),
];

// Mock data for time slot availability
export const timeSlotAvailability = {
    morning: [
        { time: "08:00 AM", available: true },
        { time: "09:00 AM", available: true },
        { time: "10:00 AM", available: false },
        { time: "11:00 AM", available: true },
    ],
    afternoon: [
        { time: "12:00 PM", available: true },
        { time: "01:00 PM", available: false },
        { time: "02:00 PM", available: true },
        { time: "03:00 PM", available: true },
    ],
    evening: [
        { time: "04:00 PM", available: true },
        { time: "05:00 PM", available: false },
        { time: "06:00 PM", available: true },
        { time: "07:00 PM", available: true },
    ],
};
