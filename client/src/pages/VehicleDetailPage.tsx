import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Gauge,
    Fuel,
    Car,
    Check,
    Heart,
    Share,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
    User,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppState } from "@/hooks";
import { fetchVehicleById } from "@/redux/store";
import { AppRoutes } from "@/router";
import { toast } from "@/hooks/use-toast";
import { FormatterDate } from "@/utils";

// Environment variables
const { VITE_APP_IMAGE_URL } = import.meta.env;

// Fallback data for similar vehicles
const similarVehicles = [
    {
        id: 1,
        title: "2019 Toyota Camry",
        price: 20500,
        image: "/placeholder.svg?height=150&width=250",
        mileage: 42000,
        location: "San Diego, CA",
    },
    {
        id: 2,
        title: "2021 Honda Civic",
        price: 19800,
        image: "/placeholder.svg?height=150&width=250",
        mileage: 28000,
        location: "Los Angeles, CA",
    },
    {
        id: 3,
        title: "2020 Mazda 3",
        price: 18200,
        image: "/placeholder.svg?height=150&width=250",
        mileage: 32000,
        location: "Irvine, CA",
    },
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const VehicleDetailPage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { vehicles } = useAppState();
    const { isLoading, foundVehicle: vehicle } = vehicles;

    // Fetch the vehicle data based on the ID
    useEffect(() => {
        if (id) {
            dispatch(fetchVehicleById(id));
        }
    }, [id, dispatch]);

    const handleGoBack = () => {
        navigate(AppRoutes.vehicleSales);
    };

    const nextImage = () => {
        if (!vehicle || !vehicle.images) return;
        setCurrentImageIndex((prevIndex) =>
            prevIndex === (vehicle.images?.length ?? 0) - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        if (!vehicle || !vehicle.images) return;
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? (vehicle.images?.length ?? 0) - 1 : prevIndex - 1
        );
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast({
            title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
            description: isWishlisted
                ? "This vehicle has been removed from your saved items."
                : "This vehicle has been added to your saved items.",
        });
    };

    // If still loading, show a loading indicator
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
                    <p className="text-gray-500">Loading vehicle details...</p>
                </div>
            </div>
        );
    }

    // If vehicle not found, show error message
    if (!vehicle) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
                <h1 className="text-2xl font-bold">Vehicle Not Found</h1>
                <p className="text-gray-500">
                    Sorry, the vehicle you're looking for may have been sold or
                    removed.
                </p>
                <Button onClick={() => navigate(AppRoutes.vehicleSales)}>
                    View All Vehicles
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                <Button variant="ghost" onClick={handleGoBack} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Listings
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left and Center */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="relative bg-white rounded-xl overflow-hidden shadow-md">
                            <div className="relative aspect-[16/9] bg-gray-100">
                                {vehicle.images && vehicle.images.length > 0 ? (
                                    <img
                                        src={
                                            vehicle.images[currentImageIndex]
                                                ? `${VITE_APP_IMAGE_URL}/${vehicle.images[currentImageIndex]}`
                                                : "/placeholder.svg"
                                        }
                                        alt={vehicle.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "https://placehold.co/600x400/png";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-gray-400">
                                            No images available
                                        </span>
                                    </div>
                                )}

                                {/* Image Navigation - Only show if there are multiple images */}
                                {vehicle.images &&
                                    vehicle.images.length > 1 && (
                                        <>
                                            <div className="absolute inset-0 flex items-center justify-between px-4">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="rounded-full bg-white/80 hover:bg-white"
                                                    onClick={prevImage}
                                                >
                                                    <ChevronLeft className="h-6 w-6" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="rounded-full bg-white/80 hover:bg-white"
                                                    onClick={nextImage}
                                                >
                                                    <ChevronRight className="h-6 w-6" />
                                                </Button>
                                            </div>

                                            {/* Image Counter */}
                                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                                {currentImageIndex + 1} /{" "}
                                                {vehicle.images.length}
                                            </div>
                                        </>
                                    )}
                            </div>

                            {/* Thumbnail Navigation */}
                            {vehicle.images && vehicle.images.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto">
                                    {vehicle.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentImageIndex(index)
                                            }
                                            className={`flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${
                                                currentImageIndex === index
                                                    ? "border-black"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <img
                                                src={`${VITE_APP_IMAGE_URL}/${image}`}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://placehold.co/200x150/png";
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Vehicle Details */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Vehicle Specifications
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <Car className="h-4 w-4 mr-1" />
                                        Make
                                    </p>
                                    <p className="font-medium">
                                        {vehicle.make}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <Car className="h-4 w-4 mr-1" />
                                        Model
                                    </p>
                                    <p className="font-medium">
                                        {vehicle.model}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Year
                                    </p>
                                    <p className="font-medium">
                                        {vehicle.year}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <Gauge className="h-4 w-4 mr-1" />
                                        Mileage
                                    </p>
                                    <p className="font-medium">
                                        {vehicle.mileage
                                            ? vehicle.mileage.toLocaleString()
                                            : "N/A"}{" "}
                                        miles
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <Car className="h-4 w-4 mr-1" />
                                        Transmission
                                    </p>
                                    <p className="font-medium">
                                        {vehicle.transmission || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <Fuel className="h-4 w-4 mr-1" />
                                        Fuel Type
                                    </p>
                                    <p className="font-medium">
                                        {vehicle.fuelType || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <Check className="h-4 w-4 mr-1" />
                                        Condition
                                    </p>
                                    <p className="font-medium">
                                        {vehicle.condition || "N/A"}
                                    </p>
                                </div>
                                {vehicle.exteriorColor && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            Exterior Color
                                        </p>
                                        <p className="font-medium">
                                            {vehicle.exteriorColor}
                                        </p>
                                    </div>
                                )}
                                {vehicle.interiorColor && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            Interior Color
                                        </p>
                                        <p className="font-medium">
                                            {vehicle.interiorColor}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-6" />

                            <h2 className="text-xl font-semibold mb-4">
                                Description
                            </h2>
                            <p className="text-gray-700 whitespace-pre-line">
                                {vehicle.description ||
                                    "No description provided."}
                            </p>

                            <Separator className="my-6" />

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div>
                                    Listed on{" "}
                                    {FormatterDate.formatDate(
                                        vehicle.createdAt
                                    )}
                                </div>
                                <div>
                                    Vehicle ID: {vehicle._id.substring(0, 8)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right */}
                    <div className="space-y-6">
                        {/* Price and Actions */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <h1 className="text-2xl font-bold mb-2">
                                        {vehicle.title}
                                    </h1>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <MapPin size={14} className="mr-1" />
                                        {vehicle.location ||
                                            "Location not specified"}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-3xl font-bold">
                                        ${vehicle.price.toLocaleString()}
                                    </div>
                                    {vehicle.condition && (
                                        <Badge
                                            variant="outline"
                                            className={`${
                                                vehicle.condition === "New"
                                                    ? "bg-green-100 text-green-800 border-green-200"
                                                    : "bg-blue-100 text-blue-800 border-blue-200"
                                            }`}
                                        >
                                            {vehicle.condition}
                                        </Badge>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-y-2 text-sm mb-6">
                                    <div className="flex items-center">
                                        <Calendar
                                            size={16}
                                            className="mr-2 text-gray-500"
                                        />
                                        {vehicle.year}
                                    </div>
                                    {vehicle.mileage && (
                                        <div className="flex items-center">
                                            <Gauge
                                                size={16}
                                                className="mr-2 text-gray-500"
                                            />
                                            {vehicle.mileage.toLocaleString()}{" "}
                                            mi
                                        </div>
                                    )}
                                    {vehicle.fuelType && (
                                        <div className="flex items-center">
                                            <Fuel
                                                size={16}
                                                className="mr-2 text-gray-500"
                                            />
                                            {vehicle.fuelType}
                                        </div>
                                    )}
                                    {vehicle.transmission && (
                                        <div className="flex items-center">
                                            <Car
                                                size={16}
                                                className="mr-2 text-gray-500"
                                            />
                                            {vehicle.transmission}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Button className="w-full">
                                        Contact Seller
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={toggleWishlist}
                                        >
                                            <Heart
                                                className={`mr-2 h-4 w-4 ${
                                                    isWishlisted
                                                        ? "fill-red-500 text-red-500"
                                                        : ""
                                                }`}
                                            />
                                            {isWishlisted ? "Saved" : "Save"}
                                        </Button>
                                        <Button variant="outline">
                                            <Share className="mr-2 h-4 w-4" />
                                            Share
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seller Information */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold mb-4">
                                    Seller Information
                                </h2>
                                {vehicle.owner ? (
                                    <>
                                        <div className="flex items-center mb-4">
                                            <Avatar className="h-12 w-12 mr-4">
                                                <AvatarImage
                                                    src={
                                                        vehicle.owner.avatar ||
                                                        undefined
                                                    }
                                                    alt={vehicle.owner.name}
                                                />
                                                <AvatarFallback>
                                                    {vehicle.owner.name ? (
                                                        vehicle.owner.name
                                                            .substring(0, 1)
                                                            .toUpperCase()
                                                    ) : (
                                                        <User className="h-6 w-6" />
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">
                                                    {vehicle.owner.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Member since{" "}
                                                    {formatDate(
                                                        vehicle.owner.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {(vehicle.contactPhone ||
                                            vehicle.owner.phone) && (
                                            <div className="space-y-3 mb-4">
                                                {(vehicle.contactPhone ||
                                                    vehicle.owner.phone) && (
                                                    <div className="flex items-center text-sm">
                                                        <Phone className="h-4 w-4 mr-3 text-gray-500" />
                                                        {vehicle.contactPhone ||
                                                            vehicle.owner.phone}
                                                    </div>
                                                )}
                                                {(vehicle.contactEmail ||
                                                    vehicle.owner.email) && (
                                                    <div className="flex items-center text-sm">
                                                        <Mail className="h-4 w-4 mr-3 text-gray-500" />
                                                        {vehicle.contactEmail ||
                                                            vehicle.owner.email}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-gray-500 text-sm">
                                        Seller information not available
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Similar Vehicles */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold mb-4">
                                    Similar Vehicles
                                </h2>
                                <div className="space-y-4">
                                    {similarVehicles.map((vehicle) => (
                                        <div
                                            key={vehicle.id}
                                            className="flex gap-3"
                                        >
                                            <img
                                                src={
                                                    vehicle.image ||
                                                    "/placeholder.svg"
                                                }
                                                alt={vehicle.title}
                                                className="w-20 h-16 object-cover rounded-md flex-shrink-0"
                                            />
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-medium text-sm truncate">
                                                    {vehicle.title}
                                                </h3>
                                                <p className="text-sm font-bold">
                                                    $
                                                    {vehicle.price.toLocaleString()}
                                                </p>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <Gauge
                                                        size={12}
                                                        className="mr-1"
                                                    />
                                                    <span className="mr-2">
                                                        {vehicle.mileage.toLocaleString()}{" "}
                                                        mi
                                                    </span>
                                                    <MapPin
                                                        size={12}
                                                        className="mr-1"
                                                    />
                                                    <span className="truncate">
                                                        {vehicle.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
