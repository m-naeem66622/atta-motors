import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Car, Fuel, Gauge, MapPin } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppState } from "@/hooks";
import { fetchVehicles } from "@/redux/store";
import { SearchParams } from "@/d";
import { FormatterDate } from "@/utils";
import { Badge } from "@/components/ui/badge";

const { VITE_APP_IMAGE_URL } = import.meta.env;

export const VehicleListings: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { vehicles } = useAppState();
    const { isLoading, meta, searchParams } = vehicles;

    const [filters, setFilters] = useState<SearchParams>(
        searchParams || {
            page: 1,
            limit: 12,
            minPrice: 0,
            maxPrice: 100000,
            minYear: 2000,
            maxYear: new Date().getFullYear(),
        }
    );

    useEffect(() => {
        dispatch(fetchVehicles({ page: filters.page, limit: filters.limit }));
    }, [dispatch, filters.page, filters.limit]);

    const handleViewVehicle = (id: string) => {
        navigate(`/vehicle/${id}`);
    };

    const renderVehicleGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.vehicles.map((vehicle) => (
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
                                <Calendar
                                    size={14}
                                    className="mr-2 text-gray-500"
                                />
                                {vehicle.year}
                            </div>
                            {vehicle.mileage && (
                                <div className="flex items-center">
                                    <Gauge
                                        size={14}
                                        className="mr-2 text-gray-500"
                                    />
                                    {vehicle.mileage.toLocaleString()} mi
                                </div>
                            )}
                            <div className="flex items-center">
                                <Fuel
                                    size={14}
                                    className="mr-2 text-gray-500"
                                />
                                {vehicle.fuelType}
                            </div>
                            <div className="flex items-center">
                                <Car size={14} className="mr-2 text-gray-500" />
                                {vehicle.transmission}
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            Listed on:{" "}
                            {FormatterDate.formatDate(vehicle.createdAt)}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button
                            variant="outline"
                            onClick={() => handleViewVehicle(vehicle._id)}
                        >
                            View Details
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );

    const renderPagination = () => {
        if (!meta) return null;

        const currentPage = parseInt(meta.page) || 1;
        const totalPages = meta.pageCount || 1;

        return (
            <div className="flex justify-center mt-8 gap-2">
                <Button
                    variant="outline"
                    onClick={() =>
                        setFilters({
                            ...filters,
                            page: Math.max(1, currentPage - 1),
                        })
                    }
                    disabled={currentPage <= 1}
                >
                    Previous
                </Button>
                <div className="flex items-center mx-4">
                    Page {currentPage} of {totalPages}
                </div>
                <Button
                    variant="outline"
                    onClick={() =>
                        setFilters({
                            ...filters,
                            page: Math.min(totalPages, currentPage + 1),
                        })
                    }
                    disabled={currentPage >= totalPages}
                >
                    Next
                </Button>
            </div>
        );
    };

    return (
        <div className="container mx-auto py-8">
            {isLoading ? (
                <div className="flex justify-center my-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : vehicles.vehicles && vehicles.vehicles.length > 0 ? (
                <>
                    {renderVehicleGrid()}
                    {renderPagination()}
                </>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">
                        No vehicles found
                    </h3>
                    <p className="text-gray-500">
                        Try adjusting your filters or check back later
                    </p>
                </div>
            )}
        </div>
    );
};
