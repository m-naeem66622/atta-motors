"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Car,
    Search,
    Filter,
    Plus,
    ChevronDown,
    Calendar,
    Fuel,
    Gauge,
    MapPin,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { VehicleSortOrder } from "@/utils/vehicleFilters";
import { useAppDispatch, useAppState } from "@/hooks";
import { fetchVehicles, deleteVehicle } from "@/redux/vehicles/operations";
import type { SearchParams } from "@/d";
import { toast } from "@/hooks/use-toast";
import { getFirstImageUrl } from "@/utils/imageUtils";

export const AdminVehicles = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { vehicles, isLoading, isDeleting, meta } = useAppState().vehicles;

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        minYear: "",
        maxYear: "",
        fuelType: "",
        status: "",
    });
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [sortOrder, setSortOrder] = useState<VehicleSortOrder>("newest");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
        useState<boolean>(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

    // Construct search params for API call
    const getSearchParams = useCallback((): SearchParams => {
        const params: SearchParams = {
            page: currentPage,
            limit: 12,
        };

        // Add search term if present
        if (searchTerm) {
            params.search = searchTerm;
        } // Add price range if present
        if (filters.minPrice) {
            params.min_price = parseInt(filters.minPrice);
        }
        if (filters.maxPrice) {
            params.max_price = parseInt(filters.maxPrice);
        }

        // Add year range filter
        // The backend expects either a specific year, or we'll need to implement a custom range filter
        if (
            filters.minYear &&
            filters.maxYear &&
            filters.minYear === filters.maxYear
        ) {
            // If min and max year are the same, use the single year filter
            params.year = parseInt(filters.minYear);
        } else {
            // For now, we'll use the first value as a basic filter
            // In a future enhancement, we could add minYear/maxYear support to the backend
            if (filters.minYear) {
                params.min_year = parseInt(filters.minYear);
            }
            if (filters.maxYear) {
                params.max_year = parseInt(filters.maxYear);
            }
        }

        // Add fuel type if present and not "any"
        if (filters.fuelType && filters.fuelType !== "any") {
            params.fuelType = filters.fuelType;
        }

        // Add status if present and not "any"
        if (filters.status && filters.status !== "any") {
            params.status = filters.status;
        }

        // Add sort param
        let sortParam = "";
        switch (sortOrder) {
            case "newest":
                sortParam = "createdAt:desc";
                break;
            case "oldest":
                sortParam = "createdAt:asc";
                break;
            case "price_low":
                sortParam = "price:asc";
                break;
            case "price_high":
                sortParam = "price:desc";
                break;
        }
        params.sort = sortParam;

        return params;
    }, [searchTerm, filters, sortOrder, currentPage]);

    // Fetch vehicles on initial load and when params change
    useEffect(() => {
        dispatch(fetchVehicles(getSearchParams()));
    }, [dispatch, getSearchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Reset page to 1 when searching
        setCurrentPage(1);
        // The useEffect will trigger API call with updated searchTerm
    };

    const handleFilterChange = (name: string, value: string) => {
        // Reset page to 1 when filter changes
        setCurrentPage(1);
        setFilters((prev) => ({ ...prev, [name]: value }));
        // The useEffect will trigger API call with updated filters
    };

    const handleCreateVehicle = () => {
        navigate("/admin/vehicles/new");
    };

    const handleEditVehicle = (id: string) => {
        navigate(`/admin/vehicles/${id}/edit`);
    };

    const handleViewVehicle = (id: string) => {
        navigate(`/admin/vehicles/${id}`);
    };

    const handleDeleteVehicle = (id: string) => {
        // Open dialog and set vehicle ID to delete
        setVehicleToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteVehicle = () => {
        if (vehicleToDelete) {
            dispatch(deleteVehicle(vehicleToDelete))
                .unwrap()
                .then(() => {
                    toast({
                        title: "Vehicle deleted",
                        description: "Vehicle has been successfully deleted",
                        variant: "default",
                    });
                    // Refresh the vehicles list
                    dispatch(fetchVehicles(getSearchParams()));
                    // Close dialog
                    setIsDeleteDialogOpen(false);
                    setVehicleToDelete(null);
                })
                .catch(() => {
                    toast({
                        title: "Error",
                        description: "Failed to delete vehicle",
                        variant: "destructive",
                    });
                });
        }
    };

    const handlePreviousPage = () => {
        if (meta && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (meta && meta.hasNextPage) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        const normalizedStatus = status?.toUpperCase() || "";

        switch (normalizedStatus) {
            case "ACTIVE":
            case "AVAILABLE":
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        {normalizedStatus === "ACTIVE" ? "Active" : "Available"}
                    </Badge>
                );
            case "SOLD":
                return (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        Sold
                    </Badge>
                );
            case "PENDING":
            case "RESERVED":
                return (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        {normalizedStatus === "PENDING"
                            ? "Pending"
                            : "Reserved"}
                    </Badge>
                );
            case "DRAFT":
                return (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        Draft
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        {status}
                    </Badge>
                );
        }
    };

    // Loading state
    const renderLoading = () => (
        <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                    Loading vehicles...
                </p>
            </div>
        </div>
    );

    // Error state when no vehicles are found
    const renderEmpty = () => (
        <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-2 text-center">
                <Car className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No vehicles found</h3>
                <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filters
                </p>
                <Button
                    className="mt-2"
                    variant="outline"
                    onClick={() => {
                        setSearchTerm("");
                        setFilters({
                            minPrice: "",
                            maxPrice: "",
                            minYear: "",
                            maxYear: "",
                            fuelType: "",
                            status: "",
                        });
                    }}
                >
                    Reset Filters
                </Button>
            </div>
        </div>
    );

    // Pagination component
    const renderPagination = () => {
        if (!meta) return null;

        return (
            <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                    Showing{" "}
                    {meta.itemCount > 0
                        ? (currentPage - 1) * parseInt(meta.limit.toString()) +
                          1
                        : 0}{" "}
                    -{" "}
                    {Math.min(
                        currentPage * parseInt(meta.limit.toString()),
                        meta.itemCount
                    )}{" "}
                    of {meta.itemCount} vehicles
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled={currentPage <= 1}
                        onClick={handlePreviousPage}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        disabled={!meta.hasNextPage}
                        onClick={handleNextPage}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    };

    const getImageUrl = (path: string) => {
        return getFirstImageUrl([path]);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Vehicle Inventory
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your vehicle listings
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2">
                    <Button onClick={handleCreateVehicle}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Vehicle
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Search & Filter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <form
                            onSubmit={handleSearch}
                            className="flex-1 flex gap-2"
                        >
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <Input
                                    type="text"
                                    placeholder="Search by make, model, or keyword"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit" variant="default">
                                Search
                            </Button>
                        </form>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={18} className="mr-2" />
                                Filters
                                <ChevronDown
                                    size={16}
                                    className={`ml-2 transition-transform ${
                                        showFilters ? "rotate-180" : ""
                                    }`}
                                />
                            </Button>
                            <div className="flex border rounded-md">
                                <Button
                                    variant={
                                        viewMode === "grid"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    className="rounded-r-none"
                                    onClick={() => setViewMode("grid")}
                                >
                                    Grid
                                </Button>
                                <Button
                                    variant={
                                        viewMode === "table"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    className="rounded-l-none"
                                    onClick={() => setViewMode("table")}
                                >
                                    Table
                                </Button>
                            </div>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Price
                                </label>
                                <Input
                                    type="number"
                                    placeholder="Min $"
                                    value={filters.minPrice}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "minPrice",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Price
                                </label>
                                <Input
                                    type="number"
                                    placeholder="Max $"
                                    value={filters.maxPrice}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "maxPrice",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Year
                                </label>
                                <Input
                                    type="number"
                                    placeholder="From Year"
                                    value={filters.minYear}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "minYear",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Year
                                </label>
                                <Input
                                    type="number"
                                    placeholder="To Year"
                                    value={filters.maxYear}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "maxYear",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fuel Type
                                </label>
                                <Select
                                    value={filters.fuelType}
                                    onValueChange={(value: string) =>
                                        handleFilterChange("fuelType", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any</SelectItem>
                                        <SelectItem value="Petrol">
                                            Petrol
                                        </SelectItem>
                                        <SelectItem value="Diesel">
                                            Diesel
                                        </SelectItem>
                                        <SelectItem value="Hybrid">
                                            Hybrid
                                        </SelectItem>
                                        <SelectItem value="Electric">
                                            Electric
                                        </SelectItem>
                                        <SelectItem value="CNG">CNG</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(value: string) =>
                                        handleFilterChange("status", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any</SelectItem>
                                        <SelectItem value="available">
                                            Available
                                        </SelectItem>
                                        <SelectItem value="reserved">
                                            Reserved
                                        </SelectItem>
                                        <SelectItem value="sold">
                                            Sold
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Vehicle Listings */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                        {meta?.itemCount || 0} Vehicles
                    </h2>
                    <Select
                        value={sortOrder}
                        onValueChange={(value) =>
                            setSortOrder(value as VehicleSortOrder)
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="price_low">
                                Price: Low to High
                            </SelectItem>
                            <SelectItem value="price_high">
                                Price: High to Low
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isLoading ? (
                    renderLoading()
                ) : vehicles && vehicles.length === 0 ? (
                    renderEmpty()
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles &&
                            vehicles.map((vehicle) => (
                                <Card
                                    key={vehicle._id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative">
                                        <img
                                            src={getImageUrl(
                                                vehicle.images?.[0] || ""
                                            )}
                                            alt={vehicle.title}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://placehold.co/400x300";
                                            }}
                                        />
                                        <div className="absolute top-2 right-2">
                                            {getStatusBadge(vehicle.status)}
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">
                                                {vehicle.title}
                                            </CardTitle>
                                            <div className="font-bold">
                                                $
                                                {vehicle.price.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <MapPin
                                                size={14}
                                                className="mr-1"
                                            />
                                            {vehicle.location ||
                                                "Location not specified"}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                                            <div className="flex items-center">
                                                <Calendar
                                                    size={14}
                                                    className="mr-2 text-gray-500"
                                                />
                                                {vehicle.year}
                                            </div>
                                            <div className="flex items-center">
                                                <Gauge
                                                    size={14}
                                                    className="mr-2 text-gray-500"
                                                />
                                                {vehicle.mileage?.toLocaleString() ||
                                                    "N/A"}{" "}
                                                mi
                                            </div>
                                            <div className="flex items-center">
                                                <Fuel
                                                    size={14}
                                                    className="mr-2 text-gray-500"
                                                />
                                                {vehicle.fuelType || "N/A"}
                                            </div>
                                            <div className="flex items-center">
                                                <Car
                                                    size={14}
                                                    className="mr-2 text-gray-500"
                                                />
                                                {vehicle.transmission || "N/A"}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Added:{" "}
                                            {formatDate(vehicle.createdAt)}
                                        </div>
                                        <div className="flex justify-between mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleViewVehicle(
                                                        vehicle._id
                                                    )
                                                }
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleEditVehicle(
                                                                vehicle._id
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDeleteVehicle(
                                                                vehicle._id
                                                            )
                                                        }
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left font-medium p-2 pl-0">
                                        ID
                                    </th>
                                    <th className="text-left font-medium p-2">
                                        Vehicle
                                    </th>
                                    <th className="text-left font-medium p-2">
                                        Price
                                    </th>
                                    <th className="text-left font-medium p-2">
                                        Year
                                    </th>
                                    <th className="text-left font-medium p-2">
                                        Mileage
                                    </th>
                                    <th className="text-left font-medium p-2">
                                        Fuel Type
                                    </th>
                                    <th className="text-left font-medium p-2">
                                        Added
                                    </th>
                                    <th className="text-left font-medium p-2">
                                        Status
                                    </th>
                                    <th className="text-right font-medium p-2 pr-0">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles &&
                                    vehicles.map((vehicle) => (
                                        <tr
                                            key={vehicle._id}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="p-2 pl-0">
                                                {vehicle._id.slice(-8)}
                                            </td>
                                            <td className="p-2">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={getImageUrl(
                                                            vehicle
                                                                .images?.[0] ||
                                                                ""
                                                        )}
                                                        alt={vehicle.title}
                                                        className="h-10 w-16 object-cover rounded"
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                "https://placehold.co/400x300";
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="font-medium">
                                                            {vehicle.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {vehicle.location ||
                                                                "Location not specified"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                $
                                                {vehicle.price.toLocaleString()}
                                            </td>
                                            <td className="p-2">
                                                {vehicle.year}
                                            </td>
                                            <td className="p-2">
                                                {vehicle.mileage?.toLocaleString() ||
                                                    "N/A"}{" "}
                                                mi
                                            </td>
                                            <td className="p-2">
                                                {vehicle.fuelType || "N/A"}
                                            </td>
                                            <td className="p-2">
                                                {formatDate(vehicle.createdAt)}
                                            </td>
                                            <td className="p-2">
                                                {getStatusBadge(vehicle.status)}
                                            </td>
                                            <td className="p-2 pr-0 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleViewVehicle(
                                                                vehicle._id
                                                            )
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditVehicle(
                                                                vehicle._id
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteVehicle(
                                                                vehicle._id
                                                            )
                                                        }
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {renderPagination()}

                {/* Delete Confirmation */}
                {isDeleting && (
                    <div className="flex justify-center mt-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                        <span className="text-sm">Deleting vehicle...</span>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Are you sure you want to delete this vehicle?
                            </DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete the vehicle listing and
                                remove it from our servers.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDeleteVehicle}
                            >
                                Delete Vehicle
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};
