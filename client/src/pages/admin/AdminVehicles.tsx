"use client";

import type React from "react";

import { useState } from "react";
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
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Mock data for vehicle listings
const vehicleListings = [
    {
        id: "VEH-4567",
        title: "2022 Toyota RAV4 XLE",
        price: 32500,
        location: "San Francisco, CA",
        year: 2022,
        mileage: 15000,
        fuelType: "Gasoline",
        transmission: "Automatic",
        image: "/placeholder.svg?height=200&width=300",
        status: "active",
        added: "2025-04-14T08:30:00Z",
    },
    {
        id: "VEH-4568",
        title: "2021 Honda CR-V Touring",
        price: 29800,
        location: "Los Angeles, CA",
        year: 2021,
        mileage: 22000,
        fuelType: "Gasoline",
        transmission: "Automatic",
        image: "/placeholder.svg?height=200&width=300",
        status: "active",
        added: "2025-04-13T14:20:00Z",
    },
    {
        id: "VEH-4569",
        title: "2020 Ford Mustang GT",
        price: 38500,
        location: "Seattle, WA",
        year: 2020,
        mileage: 18000,
        fuelType: "Gasoline",
        transmission: "Manual",
        image: "/placeholder.svg?height=200&width=300",
        status: "pending",
        added: "2025-04-12T10:15:00Z",
    },
    {
        id: "VEH-4570",
        title: "2019 Chevrolet Silverado LT",
        price: 34200,
        location: "Dallas, TX",
        year: 2019,
        mileage: 45000,
        fuelType: "Gasoline",
        transmission: "Automatic",
        image: "/placeholder.svg?height=200&width=300",
        status: "sold",
        added: "2025-04-10T16:45:00Z",
    },
    {
        id: "VEH-4571",
        title: "2023 Tesla Model Y",
        price: 52800,
        location: "San Jose, CA",
        year: 2023,
        mileage: 5000,
        fuelType: "Electric",
        transmission: "Automatic",
        image: "/placeholder.svg?height=200&width=300",
        status: "active",
        added: "2025-04-09T09:30:00Z",
    },
    {
        id: "VEH-4572",
        title: "2020 BMW X5 xDrive40i",
        price: 48500,
        location: "Miami, FL",
        year: 2020,
        mileage: 28000,
        fuelType: "Gasoline",
        transmission: "Automatic",
        image: "/placeholder.svg?height=200&width=300",
        status: "active",
        added: "2025-04-08T11:20:00Z",
    },
];

export const AdminVehicles = () => {
    const navigate = useNavigate();
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality
        console.log("Searching for:", searchTerm);
    };

    const handleFilterChange = (name: string, value: string) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
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
        // Implement delete functionality
        console.log("Deleting vehicle:", id);
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
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        Active
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Pending
                    </Badge>
                );
            case "sold":
                return (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Sold
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "pending":
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case "sold":
                return <XCircle className="h-5 w-5 text-blue-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    const filteredVehicles = vehicleListings.filter((vehicle) => {
        // Filter by search term
        if (
            searchTerm &&
            !vehicle.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            return false;
        }

        // Filter by price range
        if (
            filters.minPrice &&
            vehicle.price < Number.parseInt(filters.minPrice)
        ) {
            return false;
        }
        if (
            filters.maxPrice &&
            vehicle.price > Number.parseInt(filters.maxPrice)
        ) {
            return false;
        }

        // Filter by year range
        if (
            filters.minYear &&
            vehicle.year < Number.parseInt(filters.minYear)
        ) {
            return false;
        }
        if (
            filters.maxYear &&
            vehicle.year > Number.parseInt(filters.maxYear)
        ) {
            return false;
        }

        // Filter by fuel type
        if (filters.fuelType && vehicle.fuelType !== filters.fuelType) {
            return false;
        }

        // Filter by status
        if (filters.status && vehicle.status !== filters.status) {
            return false;
        }

        return true;
    });

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
                                    onValueChange={(value) =>
                                        handleFilterChange("fuelType", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Any</SelectItem>
                                        <SelectItem value="Gasoline">
                                            Gasoline
                                        </SelectItem>
                                        <SelectItem value="Diesel">
                                            Diesel
                                        </SelectItem>
                                        <SelectItem value="Electric">
                                            Electric
                                        </SelectItem>
                                        <SelectItem value="Hybrid">
                                            Hybrid
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(value) =>
                                        handleFilterChange("status", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Any</SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Pending
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
                        {filteredVehicles.length} Vehicles
                    </h2>
                    <Select defaultValue="newest">
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

                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVehicles.map((vehicle) => (
                            <Card
                                key={vehicle.id}
                                className="overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            vehicle.image || "/placeholder.svg"
                                        }
                                        alt={vehicle.title}
                                        className="w-full h-48 object-cover"
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
                                            ${vehicle.price.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <MapPin size={14} className="mr-1" />
                                        {vehicle.location}
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
                                            {vehicle.mileage.toLocaleString()}{" "}
                                            mi
                                        </div>
                                        <div className="flex items-center">
                                            <Fuel
                                                size={14}
                                                className="mr-2 text-gray-500"
                                            />
                                            {vehicle.fuelType}
                                        </div>
                                        <div className="flex items-center">
                                            <Car
                                                size={14}
                                                className="mr-2 text-gray-500"
                                            />
                                            {vehicle.transmission}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Added: {formatDate(vehicle.added)}
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleViewVehicle(vehicle.id)
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
                                                            vehicle.id
                                                        )
                                                    }
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDeleteVehicle(
                                                            vehicle.id
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
                                {filteredVehicles.map((vehicle) => (
                                    <tr
                                        key={vehicle.id}
                                        className="border-b last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="p-2 pl-0">
                                            {vehicle.id}
                                        </td>
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        vehicle.image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={vehicle.title}
                                                    className="h-10 w-16 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="font-medium">
                                                        {vehicle.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {vehicle.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            ${vehicle.price.toLocaleString()}
                                        </td>
                                        <td className="p-2">{vehicle.year}</td>
                                        <td className="p-2">
                                            {vehicle.mileage.toLocaleString()}{" "}
                                            mi
                                        </td>
                                        <td className="p-2">
                                            {vehicle.fuelType}
                                        </td>
                                        <td className="p-2">
                                            {formatDate(vehicle.added)}
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
                                                            vehicle.id
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
                                                            vehicle.id
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
                                                            vehicle.id
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
            </div>
        </div>
    );
};
