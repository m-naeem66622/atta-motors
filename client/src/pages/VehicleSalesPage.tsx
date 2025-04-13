import type React from "react";
import { useState } from "react";
import { Search, Filter, Plus, ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "@/router";
import { VehicleListings } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const VehicleSalesPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>("buy");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        minYear: "",
        maxYear: "",
        fuelType: "",
    });
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality
        console.log("Searching for:", searchTerm);
    };

    const handleFilterChange = (name: string, value: string) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateListing = () => {
        navigate(AppRoutes.createVehicle);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold mb-6">
                        Vehicle Sales & Purchase
                    </h1>

                    <Tabs
                        defaultValue="buy"
                        className="w-full"
                        onValueChange={setActiveTab}
                    >
                        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                            <TabsTrigger value="buy">Buy a Vehicle</TabsTrigger>
                            <TabsTrigger value="sell">
                                Sell Your Vehicle
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="buy" className="space-y-4">
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
                                            className="pl-10 bg-white text-gray-800"
                                        />
                                    </div>
                                    <Button type="submit">Search</Button>
                                </form>
                                <Button
                                    variant="outline"
                                    className="bg-white text-blue-600 hover:bg-blue-50"
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
                            </div>

                            {showFilters && (
                                <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-5 gap-4">
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
                                                handleFilterChange(
                                                    "fuelType",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="text-gray-800">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="any">
                                                    Any
                                                </SelectItem>
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
                            )}
                        </TabsContent>

                        <TabsContent value="sell">
                            <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
                                <div className="max-w-3xl mx-auto">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold mb-2">
                                            Sell Your Vehicle
                                        </h2>
                                        <p className="text-gray-600">
                                            List your vehicle on Atta Motors and
                                            reach thousands of potential buyers
                                            in your area.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-blue-600 font-bold text-xl">
                                                    1
                                                </span>
                                            </div>
                                            <h3 className="font-semibold mb-2">
                                                Create Your Listing
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Fill out the vehicle details and
                                                upload photos to showcase your
                                                car.
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-blue-600 font-bold text-xl">
                                                    2
                                                </span>
                                            </div>
                                            <h3 className="font-semibold mb-2">
                                                Connect with Buyers
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Receive inquiries and
                                                communicate with interested
                                                buyers.
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-blue-600 font-bold text-xl">
                                                    3
                                                </span>
                                            </div>
                                            <h3 className="font-semibold mb-2">
                                                Complete the Sale
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Finalize the transaction and
                                                transfer ownership safely.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                                        <h3 className="font-semibold mb-4">
                                            Why Sell with Atta Motors?
                                        </h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    Reach thousands of verified
                                                    buyers in your local area
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    Professional listing with up
                                                    to 20 photos
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    Secure messaging system to
                                                    communicate with buyers
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    Guidance on pricing and
                                                    completing the sale safely
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="text-center">
                                        <Button
                                            size="lg"
                                            className="px-8"
                                            onClick={handleCreateListing}
                                        >
                                            <Plus size={18} className="mr-2" />
                                            Create Listing
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl py-8 px-4">
                {activeTab === "buy" && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Available Vehicles
                            </h2>
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

                        <VehicleListings />
                    </>
                )}
            </div>
        </div>
    );
};
