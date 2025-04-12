import type React from "react";
import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  Car,
  Calendar,
  Fuel,
  Gauge,
  MapPin,
  Phone,
  Heart,
  Check,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import VehicleListingForm from "@/components/VehicleListingForm"
import { useNavigate } from "react-router-dom";

// Mock data for vehicle listings
const vehicleListings = [
  {
    id: 1,
    title: "2020 Toyota Camry XSE",
    price: 25999,
    location: "San Francisco, CA",
    year: 2020,
    mileage: 35000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    image:
      "https://vehicle-images.dealerinspire.com/1fa8-11001767/4T1K61AK5MU427942/f148855efa3e2d4cbec643d25ff42064.jpg",
    seller: {
      name: "John Smith",
      phone: "(555) 123-4567",
      rating: 4.8,
    },
    description:
      "Excellent condition Toyota Camry XSE with premium features including leather seats, sunroof, and advanced safety package. One owner, all maintenance records available. Recently serviced with new brakes and tires.",
  },
  {
    id: 2,
    title: "2018 Honda Accord Sport",
    price: 22500,
    location: "Los Angeles, CA",
    year: 2018,
    mileage: 45000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    image:
      "https://static0.carbuzzimages.com/wordpress/wp-content/uploads/gallery-images/original/628000/200/628266.jpg",
    seller: {
      name: "Sarah Johnson",
      phone: "(555) 987-6543",
      rating: 4.5,
    },
    description:
      "Well-maintained Honda Accord Sport with turbocharged engine, Apple CarPlay, Android Auto, and Honda Sensing safety suite. Clean title, no accidents.",
  },
  {
    id: 3,
    title: "2021 Tesla Model 3",
    price: 42000,
    location: "Seattle, WA",
    year: 2021,
    mileage: 15000,
    fuelType: "Electric",
    transmission: "Automatic",
    image: "https://media.carsandbids.com/cdn-cgi/image/width=1800,quality=70/da4b9237bacccdf19c0760cab7aec4a8359010b0/photos/3zP0vlMz-Ch9TKJzKk5.jpg",
    seller: {
      name: "Michael Chen",
      phone: "(555) 456-7890",
      rating: 4.9,
    },
    description:
      "Like-new Tesla Model 3 Standard Range Plus. Autopilot, premium sound system, and white interior. Includes home charging equipment and remaining manufacturer warranty.",
  },
  {
    id: 4,
    title: "2017 Ford F-150 XLT",
    price: 29500,
    location: "Dallas, TX",
    year: 2017,
    mileage: 60000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    image: "https://cdn.dealeraccelerate.com/adrenalin/1/1578/42596/1920x1440/2017-ford-f-150-xlt-sport",
    seller: {
      name: "Robert Williams",
      phone: "(555) 234-5678",
      rating: 4.6,
    },
    description:
      "Powerful Ford F-150 XLT with 5.0L V8 engine, 4x4, towing package, and bed liner. Well-maintained with regular service history. New all-terrain tires.",
  },
  {
    id: 5,
    title: "2019 Subaru Outback",
    price: 26750,
    location: "Denver, CO",
    year: 2019,
    mileage: 38000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    image: "https://read.opensooq.com/wp-content/uploads/2021/08/%D9%85%D9%88%D8%A7%D8%B5%D9%81%D8%A7%D8%AA-%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9-%D8%B3%D9%88%D8%A8%D8%A7%D8%B1%D9%88-%D8%A2%D9%88%D8%AA%D8%A8%D8%A7%D9%83-2016.webp",
    seller: {
      name: "Jennifer Lopez",
      phone: "(555) 876-5432",
      rating: 4.7,
    },
    description:
      "Adventure-ready Subaru Outback with all-wheel drive, roof rails, and spacious interior. Perfect for outdoor enthusiasts. Includes winter tire set and roof cargo box.",
  },
  {
    id: 6,
    title: "2022 Hyundai Tucson Limited",
    price: 32500,
    location: "Chicago, IL",
    year: 2022,
    mileage: 12000,
    fuelType: "Hybrid",
    transmission: "Automatic",
    image: "https://www.federalwaymirror.com/wp-content/uploads/2021/08/26063595_web1_larrylark-hyundai-allkc-210807-tucson_1.jpeg",
    seller: {
      name: "David Kim",
      phone: "(555) 345-6789",
      rating: 4.9,
    },
    description:
      "Nearly new Hyundai Tucson Limited Hybrid with panoramic sunroof, leather seats, and advanced driver assistance features. Excellent fuel economy and still under factory warranty.",
  },
];

export const VehicleSalesPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>("buy")
  const [_, setSelectedVehicle] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    fuelType: "",
  })
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [showListingForm, setShowListingForm] = useState<boolean>(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateListing = () => {
    navigate("/create-vehicle-listing")
  }

  const filteredVehicles = vehicleListings.filter((vehicle) => {
    // Filter by search term
    if (
      searchTerm &&
      !vehicle.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by price range
    if (filters.minPrice && vehicle.price < Number.parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && vehicle.price > Number.parseInt(filters.maxPrice)) {
      return false;
    }

    // Filter by year range
    if (filters.minYear && vehicle.year < Number.parseInt(filters.minYear)) {
      return false;
    }
    if (filters.maxYear && vehicle.year > Number.parseInt(filters.maxYear)) {
      return false;
    }

    // Filter by fuel type
    if (filters.fuelType && vehicle.fuelType !== filters.fuelType) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-6">Vehicle Sales & Purchase</h1>

          <Tabs
            defaultValue="buy"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="buy">Buy a Vehicle</TabsTrigger>
              <TabsTrigger value="sell">Sell Your Vehicle</TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      type="text"
                      placeholder="Search by make, model, or keyword"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                        handleFilterChange("minPrice", e.target.value)
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
                        handleFilterChange("maxPrice", e.target.value)
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
                        handleFilterChange("minYear", e.target.value)
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
                        handleFilterChange("maxYear", e.target.value)
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
                        <SelectItem value="Gasoline">Gasoline</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
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
                    <h2 className="text-2xl font-bold mb-2">Sell Your Vehicle</h2>
                    <p className="text-gray-600">
                      List your vehicle on CarHub and reach thousands of potential buyers in your area.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold text-xl">1</span>
                      </div>
                      <h3 className="font-semibold mb-2">Create Your Listing</h3>
                      <p className="text-sm text-gray-600">
                        Fill out the vehicle details and upload photos to showcase your car.
                </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold text-xl">2</span>
                      </div>
                      <h3 className="font-semibold mb-2">Connect with Buyers</h3>
                      <p className="text-sm text-gray-600">Receive inquiries and communicate with interested buyers.</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold text-xl">3</span>
                      </div>
                      <h3 className="font-semibold mb-2">Complete the Sale</h3>
                      <p className="text-sm text-gray-600">Finalize the transaction and transfer ownership safely.</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                    <h3 className="font-semibold mb-4">Why Sell with CarHub?</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Reach thousands of verified buyers in your local area</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Professional listing with up to 20 photos</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Secure messaging system to communicate with buyers</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>Guidance on pricing and completing the sale safely</span>
                      </li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <Button size="lg" className="px-8" onClick={handleCreateListing}>
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
                {filteredVehicles.length} Vehicles Available
              </h2>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.title}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 rounded-full"
                    >
                      <Heart size={18} />
                    </Button>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{vehicle.title}</CardTitle>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
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
                      <div className="flex items-center">
                        <Gauge size={14} className="mr-2 text-gray-500" />
                        {vehicle.mileage.toLocaleString()} mi
                      </div>
                      <div className="flex items-center">
                        <Fuel size={14} className="mr-2 text-gray-500" />
                        {vehicle.fuelType}
                      </div>
                      <div className="flex items-center">
                        <Car size={14} className="mr-2 text-gray-500" />
                        {vehicle.transmission}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedVehicle(vehicle)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{vehicle.title}</DialogTitle>
                          <DialogDescription>
                            Listed by {vehicle.seller.name} • Rating:{" "}
                            {vehicle.seller.rating}/5
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <img
                              src={vehicle.image || "/placeholder.svg"}
                              alt={vehicle.title}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between">
                                <span className="font-semibold">Price:</span>
                                <span className="font-bold text-blue-600">
                                  ${vehicle.price.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">Year:</span>
                                <span>{vehicle.year}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">Mileage:</span>
                                <span>
                                  {vehicle.mileage.toLocaleString()} miles
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">
                                  Fuel Type:
                                </span>
                                <span>{vehicle.fuelType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">
                                  Transmission:
                                </span>
                                <span>{vehicle.transmission}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">Location:</span>
                                <span>{vehicle.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-2">
                                Description
                              </h3>
                              <p className="text-gray-700">
                                {vehicle.description}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h3 className="font-semibold text-lg mb-2">
                                Contact Seller
                              </h3>
                              <div className="flex items-center mb-2">
                                <Phone
                                  size={16}
                                  className="mr-2 text-gray-500"
                                />
                                <span>{vehicle.seller.phone}</span>
                              </div>
                              <Button className="w-full">Message Seller</Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button>Contact Seller</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Vehicle Listing Form Dialog */}
      <Dialog open={showListingForm} onOpenChange={setShowListingForm}>
        <DialogContent className="max-w-4xl p-0">
          <VehicleListingForm onClose={() => setShowListingForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
