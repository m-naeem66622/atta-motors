import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppState } from "@/hooks";
import { fetchVehicles } from "@/redux/store";
import { SearchParams } from "@/d";
import { Button, VehicleCard } from "@/components";

export const VehicleListings: React.FC = () => {
    const dispatch = useAppDispatch();
    const { vehicles } = useAppState();
    const { isLoading, meta, searchParams } = vehicles;

    const [filters, setFilters] = useState<SearchParams>(
        searchParams || {
            page: 1,
            limit: 12,
            min_price: 0,
            max_price: 100000,
            min_year: 2000,
            max_year: new Date().getFullYear(),
        }
    );

    useEffect(() => {
        dispatch(fetchVehicles({ page: filters.page, limit: filters.limit }));
    }, [dispatch, filters.page, filters.limit]);

    const renderVehicleGrid = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
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
