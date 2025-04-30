"use client";

import { useState, useEffect } from "react";
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
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppState } from "@/hooks";
import { fetchVehicleById, deleteVehicle } from "@/redux/vehicles/operations";
import { toast } from "@/hooks/use-toast";

// Environment variables
const { VITE_APP_IMAGE_URL } = import.meta.env;

// Define image path function
const getImagePath = (path: string) => {
    if (!path) return "/placeholder.svg";
    return path.startsWith("http") ? path : `${VITE_APP_IMAGE_URL}/${path}`;
};

export const AdminVehicleDetail = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState("details");
    const [activeImage, setActiveImage] = useState(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { foundVehicle: vehicle, isLoading, error } = useAppState().vehicles;

    useEffect(() => {
        if (id) {
            dispatch(fetchVehicleById(id));
        }
    }, [id, dispatch]);

    const handleGoBack = () => {
        navigate("/admin/vehicles");
    };

    const handleEdit = () => {
        navigate(`/admin/vehicles/${id}/edit`);
    };

    const handleDelete = () => {
        if (id) {
            dispatch(deleteVehicle(id))
                .unwrap()
                .then(() => {
                    toast({
                        title: "Vehicle deleted",
                        description: "Vehicle has been successfully deleted",
                    });
                    setIsDeleteDialogOpen(false);
                    navigate("/admin/vehicles");
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
        const normalizedStatus = status?.toUpperCase() || "";

        switch (normalizedStatus) {
            case "ACTIVE":
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        Active
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Pending
                    </Badge>
                );
            case "SOLD":
                return (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Sold
                    </Badge>
                );
            case "DRAFT":
                return (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        Draft
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status || "Unknown"}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        const normalizedStatus = status?.toUpperCase() || "";

        switch (normalizedStatus) {
            case "ACTIVE":
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "PENDING":
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case "SOLD":
                return <XCircle className="h-5 w-5 text-blue-500" />;
            case "DRAFT":
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="flex justify-center items-center w-full py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center w-full py-12">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                        Error Loading Vehicle
                    </h3>
                    <p className="text-gray-500">
                        Unable to load vehicle data. Please try again.
                    </p>
                    <Button onClick={handleGoBack} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Vehicles
                    </Button>
                </div>
            ) : vehicle ? (
                <>
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
                                {vehicle.title}
                            </h1>
                            <div className="ml-4">
                                {getStatusBadge(vehicle.status)}
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
                                            This action cannot be undone. This
                                            will permanently delete the vehicle
                                            listing and remove it from our
                                            servers.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setIsDeleteDialogOpen(false)
                                            }
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
                                                vehicle.images &&
                                                vehicle.images.length > 0
                                                    ? getImagePath(
                                                          vehicle.images[
                                                              activeImage
                                                          ]
                                                      )
                                                    : "/placeholder.svg"
                                            }
                                            alt={vehicle.title}
                                            className="w-full h-[400px] object-cover"
                                        />
                                    </div>
                                    <div className="p-4 flex gap-2 overflow-x-auto">
                                        {vehicle.images &&
                                        vehicle.images.length > 0 ? (
                                            vehicle.images.map(
                                                (image, index) => (
                                                    <div
                                                        key={index}
                                                        className={`cursor-pointer border-2 ${
                                                            activeImage ===
                                                            index
                                                                ? "border-black"
                                                                : "border-transparent"
                                                        }`}
                                                        onClick={() =>
                                                            setActiveImage(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src={getImagePath(
                                                                image
                                                            )}
                                                            alt={`${
                                                                vehicle.title
                                                            } - Image ${
                                                                index + 1
                                                            }`}
                                                            className="w-20 h-20 object-cover"
                                                        />
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-20">
                                                <p className="text-gray-500">
                                                    No images available
                                                </p>
                                            </div>
                                        )}
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
                                    <TabsTrigger value="features">
                                        Features
                                    </TabsTrigger>
                                    <TabsTrigger value="description">
                                        Description
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="details"
                                    className="space-y-4"
                                >
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
                                                        Make
                                                    </p>
                                                    <div className="flex items-center">
                                                        <p>{vehicle.make}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Model
                                                    </p>
                                                    <div className="flex items-center">
                                                        <p>{vehicle.model}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Year
                                                    </p>
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                        <p>{vehicle.year}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Mileage
                                                    </p>
                                                    <div className="flex items-center">
                                                        <Gauge className="h-4 w-4 mr-2 text-gray-400" />
                                                        <p>
                                                            {vehicle.mileage
                                                                ? vehicle.mileage.toLocaleString()
                                                                : "N/A"}{" "}
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
                                                        <p>
                                                            {vehicle.fuelType ||
                                                                "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Transmission
                                                    </p>
                                                    <div className="flex items-center">
                                                        <Settings className="h-4 w-4 mr-2 text-gray-400" />
                                                        <p>
                                                            {vehicle.transmission ||
                                                                "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Condition
                                                    </p>
                                                    <p>
                                                        {vehicle.condition ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Exterior Color
                                                    </p>
                                                    <p>
                                                        {vehicle.exteriorColor ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Interior Color
                                                    </p>
                                                    <p>
                                                        {vehicle.interiorColor ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Owner
                                                    </p>
                                                    <p>
                                                        {vehicle.owner?.name ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="features">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Features & Options
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {vehicle.description ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <div className="col-span-2">
                                                        <p className="text-gray-500">
                                                            Vehicle features
                                                            will be available in
                                                            a future update.
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">
                                                    No features listed for this
                                                    vehicle.
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="description">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Vehicle Description
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="whitespace-pre-line">
                                                {vehicle.description ||
                                                    "No description available for this vehicle."}
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
                                        <span className="font-medium">
                                            Price:
                                        </span>
                                        <span className="text-xl font-bold">
                                            ${vehicle.price.toLocaleString()}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Status:
                                            </span>
                                            <div className="flex items-center">
                                                {getStatusIcon(vehicle.status)}
                                                <span className="ml-1 capitalize">
                                                    {vehicle.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Location:
                                            </span>
                                            <span>
                                                {vehicle.location ||
                                                    "Not specified"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Added:
                                            </span>
                                            <span>
                                                {formatDate(vehicle.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Last Updated:
                                            </span>
                                            <span>
                                                {formatDate(vehicle.updatedAt)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                ID:
                                            </span>
                                            <span>{vehicle._id}</span>
                                        </div>
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
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                    >
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        Manage Photos
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center w-full py-12">
                    <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                        Vehicle Not Found
                    </h3>
                    <p className="text-gray-500">
                        The vehicle you're looking for could not be found.
                    </p>
                    <Button onClick={handleGoBack} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Vehicles
                    </Button>
                </div>
            )}
        </div>
    );
};
