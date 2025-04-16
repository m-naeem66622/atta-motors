"use client";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    Fuel,
    Gauge,
    Settings,
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ImageIcon,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Mock vehicle data
const vehicleData = {
    id: "VEH-4567",
    title: "2022 Toyota RAV4 XLE",
    price: 32500,
    location: "San Francisco, CA",
    year: 2022,
    mileage: 15000,
    fuelType: "Gasoline",
    transmission: "Automatic",
    condition: "Excellent",
    exteriorColor: "Pearl White",
    interiorColor: "Black Leather",
    vin: "1HGCM82633A123456",
    engine: "2.5L 4-Cylinder",
    drivetrain: "AWD",
    features: [
        "Adaptive Cruise Control",
        "Lane Departure Warning",
        "Blind Spot Monitoring",
        "Apple CarPlay & Android Auto",
        "Sunroof",
        "Heated Seats",
        "Backup Camera",
        "Keyless Entry",
        "Push Button Start",
        "Bluetooth",
    ],
    description:
        "This 2022 Toyota RAV4 XLE is in excellent condition with low mileage. It comes with a comprehensive package of safety and convenience features, including Toyota Safety Sense 2.0, a power moonroof, and dual-zone automatic climate control. The vehicle has been well-maintained and has a clean history report.",
    images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
    ],
    status: "active",
    added: "2025-04-14T08:30:00Z",
    lastUpdated: "2025-04-15T10:15:00Z",
    views: 245,
    inquiries: 12,
};

export const AdminVehicleDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("details");
    const [activeImage, setActiveImage] = useState(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleGoBack = () => {
        navigate("/admin/vehicles");
    };

    const handleEdit = () => {
        navigate(`/admin/vehicles/${id}/edit`);
    };

    const handleDelete = () => {
        // Implement delete functionality
        console.log("Deleting vehicle:", id);
        setIsDeleteDialogOpen(false);
        navigate("/admin/vehicles");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        onClick={handleGoBack}
                        className="mr-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Vehicles
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {vehicleData.title}
                    </h1>
                    <div className="ml-4">
                        {getStatusBadge(vehicleData.status)}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleEdit}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Vehicle
                    </Button>
                    <Dialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Vehicle
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Are you sure you want to delete this
                                    vehicle?
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
                                    onClick={handleDelete}
                                >
                                    Delete Vehicle
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Images and Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="p-0">
                            <div className="relative">
                                <img
                                    src={
                                        vehicleData.images[activeImage] ||
                                        "/placeholder.svg"
                                    }
                                    alt={vehicleData.title}
                                    className="w-full h-[400px] object-cover"
                                />
                            </div>
                            <div className="p-4 flex gap-2 overflow-x-auto">
                                {vehicleData.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer border-2 ${
                                            activeImage === index
                                                ? "border-black"
                                                : "border-transparent"
                                        }`}
                                        onClick={() => setActiveImage(index)}
                                    >
                                        <img
                                            src={image || "/placeholder.svg"}
                                            alt={`${
                                                vehicleData.title
                                            } - Image ${index + 1}`}
                                            className="w-20 h-20 object-cover"
                                        />
                                    </div>
                                ))}
                                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 cursor-pointer">
                                    <Plus className="h-6 w-6 text-gray-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs
                        defaultValue="details"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">
                                Vehicle Details
                            </TabsTrigger>
                            <TabsTrigger value="features">Features</TabsTrigger>
                            <TabsTrigger value="description">
                                Description
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Vehicle Specifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">
                                                Year
                                            </p>
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                <p>{vehicleData.year}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">
                                                Mileage
                                            </p>
                                            <div className="flex items-center">
                                                <Gauge className="h-4 w-4 mr-2 text-gray-400" />
                                                <p>
                                                    {vehicleData.mileage.toLocaleString()}{" "}
                                                    miles
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">
                                                Fuel Type
                                            </p>
                                            <div className="flex items-center">
                                                <Fuel className="h-4 w-4 mr-2 text-gray-400" />
                                                <p>{vehicleData.fuelType}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">
                                                Transmission
                                            </p>
                                            <div className="flex items-center">
                                                <Settings className="h-4 w-4 mr-2 text-gray-400" />
                                                <p>
                                                    {vehicleData.transmission}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">
                                                VIN
                                            </p>
                                            <p>{vehicleData.vin}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">
                                                Engine
                                            </p>
                                            <p>{vehicleData.engine}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">
                                                Drivetrain
                                            </p>
                                            <p>{vehicleData.drivetrain}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">
                                                Condition
                                            </p>
                                            <p>{vehicleData.condition}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">
                                                Exterior Color
                                            </p>
                                            <p>{vehicleData.exteriorColor}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">
                                                Interior Color
                                            </p>
                                            <p>{vehicleData.interiorColor}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="features">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Features & Options</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {vehicleData.features.map(
                                            (feature, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                                    <span>{feature}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="description">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Vehicle Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-line">
                                        {vehicleData.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column - Status and Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Listing Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Price:</span>
                                <span className="text-xl font-bold">
                                    ${vehicleData.price.toLocaleString()}
                                </span>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Status:
                                    </span>
                                    <div className="flex items-center">
                                        {getStatusIcon(vehicleData.status)}
                                        <span className="ml-1 capitalize">
                                            {vehicleData.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Location:
                                    </span>
                                    <span>{vehicleData.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Added:
                                    </span>
                                    <span>{formatDate(vehicleData.added)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Last Updated:
                                    </span>
                                    <span>
                                        {formatDate(vehicleData.lastUpdated)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Listing Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span>Page Views</span>
                                    <span className="font-medium">
                                        {vehicleData.views}
                                    </span>
                                </div>
                                <Progress value={75} className="h-2" />
                                <p className="text-xs text-gray-500">
                                    75% more views than similar listings
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span>Inquiries</span>
                                    <span className="font-medium">
                                        {vehicleData.inquiries}
                                    </span>
                                </div>
                                <Progress value={60} className="h-2" />
                                <p className="text-xs text-gray-500">
                                    60% more inquiries than similar listings
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={handleEdit}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Details
                            </Button>
                            <Button className="w-full" variant="outline">
                                <ImageIcon className="mr-2 h-4 w-4" />
                                Manage Photos
                            </Button>
                            {vehicleData.status === "active" ? (
                                <Button className="w-full" variant="outline">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Deactivate Listing
                                </Button>
                            ) : (
                                <Button className="w-full" variant="outline">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Activate Listing
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
