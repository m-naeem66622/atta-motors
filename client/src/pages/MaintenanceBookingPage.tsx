import type React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaintenanceBookingForm } from "@/components";
import { Helmet } from "react-helmet-async";

// Import the maintenance types data
const maintenanceTypes = [
    {
        id: "routine",
        title: "Routine Maintenance",
        description:
            "Regular service checks to keep your vehicle running smoothly",
        icon: null, // We don't need the icon here
        services: [
            "Oil Change",
            "Filter Replacement",
            "Fluid Check",
            "Tire Rotation",
            "Brake Inspection",
        ],
        estimatedTime: "1-2 hours",
        price: "From $80",
    },
    {
        id: "mechanical",
        title: "Mechanical Maintenance",
        description: "Repairs and maintenance for mechanical components",
        icon: null,
        services: [
            "Engine Repair",
            "Transmission Service",
            "Suspension Work",
            "Brake System Repair",
            "Exhaust System",
        ],
        estimatedTime: "2-5 hours",
        price: "From $150",
    },
    {
        id: "electrical",
        title: "Electrical Maintenance",
        description: "Diagnosis and repair of electrical systems",
        icon: null,
        services: [
            "Battery Service",
            "Alternator Repair",
            "Starter Motor",
            "Lighting Systems",
            "Power Windows",
        ],
        estimatedTime: "1-3 hours",
        price: "From $120",
    },
    {
        id: "computerized",
        title: "Computerized Maintenance",
        description: "Diagnostics and repairs for vehicle computer systems",
        icon: null,
        services: [
            "Computer Diagnostics",
            "ECU Programming",
            "Sensor Replacement",
            "System Updates",
            "Performance Tuning",
        ],
        estimatedTime: "1-4 hours",
        price: "From $100",
    },
    {
        id: "denting",
        title: "Denting Maintenance",
        description: "Repair of dents and body damage",
        icon: null,
        services: [
            "Dent Removal",
            "Panel Beating",
            "Frame Straightening",
            "Collision Repair",
            "Hail Damage Repair",
        ],
        estimatedTime: "1-5 days",
        price: "From $200",
    },
    {
        id: "painting",
        title: "Painting Maintenance",
        description: "Professional painting and finishing services",
        icon: null,
        services: [
            "Full Body Paint",
            "Spot Painting",
            "Clear Coat Application",
            "Color Matching",
            "Rust Treatment",
        ],
        estimatedTime: "2-7 days",
        price: "From $300",
    },
];

export const MaintenanceBookingPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedService = queryParams.get("service") || "";

    const handleGoBack = () => {
        navigate("/maintenance");
    };

    return (
        <>
            <Helmet>
                <title>Book Maintenance Appointment | Atta Motors</title>
            </Helmet>
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="container mx-auto max-w-6xl">
                    <Button
                        variant="ghost"
                        onClick={handleGoBack}
                        className="mb-6 text-black hover:text-gray-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Maintenance Services
                    </Button>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-black px-6 py-4">
                            <h1 className="text-2xl font-bold text-white">
                                Book Maintenance Appointment
                            </h1>
                            <p className="text-gray-300">
                                Schedule your vehicle maintenance in a few
                                simple steps
                            </p>
                        </div>

                        <div className="p-6">
                            <MaintenanceBookingForm
                                onCancel={handleGoBack}
                                maintenanceTypes={maintenanceTypes}
                                initialServiceType={selectedService}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
