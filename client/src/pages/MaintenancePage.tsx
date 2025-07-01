import type React from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Wrench,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

export const MaintenancePage: React.FC = () => {
    const navigate = useNavigate();

    const maintenanceTypes = [
        {
            id: "routine",
            title: "Routine Maintenance",
            description:
                "Regular service checks to keep your vehicle running smoothly",
            icon: <CheckCircle className="h-10 w-10 text-green-500" />,
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
            icon: <Wrench className="h-10 w-10 text-blue-500" />,
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
            icon: <AlertCircle className="h-10 w-10 text-yellow-500" />,
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
            icon: <Calendar className="h-10 w-10 text-purple-500" />,
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
            icon: <Clock className="h-10 w-10 text-orange-500" />,
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
            icon: <CheckCircle className="h-10 w-10 text-red-500" />,
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

    const handleBookService = (serviceId: string) => {
        navigate(`/account/maintenance/create?service=${serviceId}`);
    };

    const handleViewHistory = () => {
        navigate("/account/maintenance/history");
    };

    return (
        <>
            <Helmet>
                <title>Maintenance Services | Atta Motors</title>
            </Helmet>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-3xl font-bold mb-4">
                                Vehicle Maintenance Services
                            </h1>
                            <p className="text-gray-600 max-w-3xl mx-auto">
                                Keep your vehicle in top condition with our
                                professional maintenance services. Our certified
                                technicians use the latest tools and genuine
                                parts to ensure quality service.
                            </p>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">Our Services</h2>
                            <Button
                                variant="outline"
                                onClick={handleViewHistory}
                            >
                                View Maintenance History
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {maintenanceTypes.map((type) => (
                                <Card
                                    key={type.id}
                                    className="overflow-hidden hover:shadow-lg transition-all"
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl mb-1">
                                                    {type.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    {type.description}
                                                </CardDescription>
                                            </div>
                                            <div>{type.icon}</div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <div className="space-y-2 mb-4">
                                            <p className="text-sm font-medium">
                                                Services include:
                                            </p>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {type.services.map(
                                                    (service, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-center"
                                                        >
                                                            <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                                            {service}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {type.estimatedTime}
                                            </div>
                                            <div className="font-medium">
                                                {type.price}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <div className="px-6 pb-6">
                                        <Button
                                            className="w-full"
                                            onClick={() =>
                                                handleBookService(type.id)
                                            }
                                        >
                                            Book Appointment{" "}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="bg-black text-white rounded-lg p-8 text-center mt-12">
                            <h2 className="text-2xl font-bold mb-4">
                                Need Emergency Service?
                            </h2>
                            <p className="mb-6">
                                Our technicians are available for urgent repairs
                                and roadside assistance.
                            </p>
                            <Button
                                variant="outline"
                                className="bg-transparent text-white border-white hover:bg-white hover:text-black"
                            >
                                Call Emergency Service
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
