import type React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { VehicleListingForm } from "@/components";
import { AppRoutes } from "@/router";

export const CreateVehicleListingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                <Link to={AppRoutes.vehicleSales}>
                    <Button
                        variant="ghost"
                        className="mb-6 text-blue-600 hover:text-blue-800"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Vehicle Sales
                    </Button>
                </Link>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">
                            Create Vehicle Listing
                        </h1>
                        <p className="text-white text-opacity-80">
                            Fill out the form below to list your vehicle for
                            sale
                        </p>
                    </div>

                    <div className="p-6">
                        <VehicleListingForm />
                    </div>
                </div>
            </div>
        </div>
    );
};
