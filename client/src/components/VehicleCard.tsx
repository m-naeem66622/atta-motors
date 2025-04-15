import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Car, Fuel, Gauge, MapPin } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormatterDate } from "@/utils";
import { Vehicle } from "@/d";

const { VITE_APP_IMAGE_URL } = import.meta.env;

interface VehicleCardProps {
    vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
    return (
        <Card
            key={vehicle._id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div className="aspect-video w-full overflow-hidden">
                {vehicle.images && vehicle.images.length > 0 ? (
                    <img
                        src={`${VITE_APP_IMAGE_URL}/${vehicle.images[0]}`}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.src =
                                "https://placehold.co/600x400/png";
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                    </div>
                )}
            </div>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </CardTitle>
                    <Badge
                        variant="outline"
                        className="bg-black text-white border-black"
                    >
                        ${vehicle.price.toLocaleString()}
                    </Badge>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-1" />
                    {vehicle.location}
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-gray-500" />
                        {vehicle.year}
                    </div>
                    {vehicle.mileage && (
                        <div className="flex items-center">
                            <Gauge size={14} className="mr-2 text-gray-500" />
                            {vehicle.mileage.toLocaleString()} mi
                        </div>
                    )}
                    <div className="flex items-center">
                        <Fuel size={14} className="mr-2 text-gray-500" />
                        {vehicle.fuelType}
                    </div>
                    <div className="flex items-center">
                        <Car size={14} className="mr-2 text-gray-500" />
                        {vehicle.transmission}
                    </div>
                </div>
                <div className="text-xs text-gray-500">
                    Listed on: {FormatterDate.formatDate(vehicle.createdAt)}
                </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link to={`/vehicles/${vehicle._id}`} className="w-full">
                    <Button className="w-full" variant="outline">
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};
