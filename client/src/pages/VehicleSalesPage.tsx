import type React from "react";
// import { useState } from "react";
// import { Search, Filter, ChevronDown } from "lucide-react";
import { Particles, VehicleListings } from "@/components";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const VehicleSalesPage: React.FC = () => {
    // const [searchTerm, setSearchTerm] = useState<string>("");
    // const [filters, setFilters] = useState({
    //     minPrice: "",
    //     maxPrice: "",
    //     minYear: "",
    //     maxYear: "",
    //     fuelType: "",
    // });
    // const [showFilters, setShowFilters] = useState<boolean>(false);

    // const handleSearch = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     // Implement search functionality

    // };

    // const handleFilterChange = (name: string, value: string) => {
    //     setFilters((prev) => ({ ...prev, [name]: value }));
    // };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-gray-500 to-zinc-900 p-4 text-white py-8 px-4 relative overflow-hidden">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold mb-6">
                        Vehicle Sales & Purchase
                    </h1>

                    {/* <div className="flex flex-col md:flex-row gap-4">
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
                                    className="pl-10 bg-white text-gray-800"
                                />
                            </div>
                            <Button type="submit" variant="default">
                                Search
                            </Button>
                        </form>
                        <Button
                            variant="outline"
                            className="bg-white text-black hover:bg-gray-100 border-gray-300"
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
                    </div> */}

                    {/* {showFilters && (
                        <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
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
                                    className="text-gray-800"
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
                                    className="text-gray-800"
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
                                    className="text-gray-800"
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
                                    className="text-gray-800"
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
                                    <SelectTrigger className="text-gray-800">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any</SelectItem>
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
                        </div>
                    )} */}
                </div>

                <Particles
                    className="absolute inset-0"
                    quantity={1000}
                    ease={10}
                    color="#000000"
                    refresh
                />
            </div>

            <div className="container mx-auto max-w-6xl py-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Available Vehicles
                    </h2>
                    <div className="flex items-center gap-4">
                        <Select defaultValue="newest">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">
                                    Newest First
                                </SelectItem>
                                <SelectItem value="oldest">
                                    Oldest First
                                </SelectItem>
                                <SelectItem value="price_low">
                                    Price: Low to High
                                </SelectItem>
                                <SelectItem value="price_high">
                                    Price: High to Low
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <VehicleListings />
            </div>
        </div>
    );
};
