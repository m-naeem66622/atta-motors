"use client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Car,
    Wrench,
    Users,
    TrendingUp,
    ArrowRight,
    Clock,
    Loader2,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppState } from "@/hooks";
import { getAdminOverview } from "@/redux/store";

const { VITE_APP_IMAGE_URL } = import.meta.env;

export const AdminOverview = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { admin } = useAppState();

    // Fetch overview data when component mounts
    useEffect(() => {
        dispatch(getAdminOverview());
    }, [dispatch]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // const formatTime = (dateString: string) => {
    //     const date = new Date(dateString);
    //     return date.toLocaleTimeString("en-US", {
    //         hour: "2-digit",
    //         minute: "2-digit",
    //     });
    // };

    const getStatusBadge = (status: string) => {
        const normalizedStatus = status?.toUpperCase() || "";

        switch (normalizedStatus) {
            case "PENDING":
                return (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Pending
                    </Badge>
                );
            case "SCHEDULED":
                return (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Scheduled
                    </Badge>
                );
            case "APPROVED":
                return (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Approved
                    </Badge>
                );
            case "COMPLETED":
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        Completed
                    </Badge>
                );
            case "REJECTED":
            case "CANCELLED":
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                        {normalizedStatus === "CANCELLED"
                            ? "Cancelled"
                            : "Rejected"}
                    </Badge>
                );
            case "ACTIVE":
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        Active
                    </Badge>
                );
            case "INACTIVE":
                return (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        Inactive
                    </Badge>
                );
            case "SUSPENDED":
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                        Suspended
                    </Badge>
                );
            case "SOLD":
                return (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
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
                return (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back, Admin! Here's what's happening today.
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/admin/vehicles/new")}
                    >
                        Add Vehicle
                    </Button>
                    <Button onClick={() => navigate("/admin/maintenance")}>
                        Manage Maintenance
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Vehicles Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center">
                                <div className="mr-3 rounded-full p-2 bg-blue-500 text-white">
                                    <Car className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium">
                                    Total Vehicles
                                </p>
                            </div>
                            <div className="flex items-center text-sm text-green-600">
                                <TrendingUp className="mr-1 h-4 w-4" />
                                +12%
                            </div>
                        </div>
                        <div className="text-2xl font-bold">
                            {admin.isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : admin.overview?.totalVehicles !== undefined ? (
                                admin.overview.totalVehicles
                            ) : (
                                "124" // Fallback value
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance Requests Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center">
                                <div className="mr-3 rounded-full p-2 bg-purple-500 text-white">
                                    <Wrench className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium">
                                    Maintenance Requests
                                </p>
                            </div>
                            <div className="flex items-center text-sm text-green-600">
                                <TrendingUp className="mr-1 h-4 w-4" />
                                +5%
                            </div>
                        </div>
                        <div className="text-2xl font-bold">
                            {admin.isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : admin.overview?.maintenanceRequests !==
                              undefined ? (
                                admin.overview.maintenanceRequests
                            ) : (
                                "45" // Fallback value
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Active Users Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center">
                                <div className="mr-3 rounded-full p-2 bg-green-500 text-white">
                                    <Users className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium">
                                    Active Users
                                </p>
                            </div>
                            <div className="flex items-center text-sm text-green-600">
                                <TrendingUp className="mr-1 h-4 w-4" />
                                +18%
                            </div>
                        </div>
                        <div className="text-2xl font-bold">
                            {admin.isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : admin.overview?.activeUsers !== undefined ? (
                                admin.overview.activeUsers
                            ) : (
                                "2,453" // Fallback value
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Approvals Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center">
                                <div className="mr-3 rounded-full p-2 bg-amber-500 text-white">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium">
                                    Pending Approvals
                                </p>
                            </div>
                            <div className="flex items-center text-sm text-green-600">
                                <TrendingUp className="mr-1 h-4 w-4" />
                                +5%
                            </div>
                        </div>
                        <div className="text-2xl font-bold">
                            {admin.isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : admin.overview?.pendingApprovals !==
                              undefined ? (
                                admin.overview.pendingApprovals
                            ) : (
                                "12" // Fallback value
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Data Tables */}
            <div className="space-y-6">
                {/* Recent Maintenance Requests */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Maintenance Requests</CardTitle>
                            <CardDescription>
                                Latest service requests from customers
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/admin/maintenance")}
                        >
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {admin.isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-500">
                                    Loading maintenance requests...
                                </span>
                            </div>
                        ) : admin.overview.recentAppointments &&
                          admin.overview.recentAppointments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left font-medium p-2 pl-0">
                                                ID
                                            </th>
                                            <th className="text-left font-medium p-2">
                                                Customer
                                            </th>
                                            <th className="text-left font-medium p-2">
                                                Vehicle
                                            </th>
                                            <th className="text-left font-medium p-2">
                                                Service
                                            </th>
                                            <th className="text-left font-medium p-2">
                                                Date
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
                                        {admin.overview.recentAppointments.map(
                                            (request) => (
                                                <tr
                                                    key={request._id}
                                                    className="border-b last:border-0 hover:bg-gray-50"
                                                >
                                                    <td className="p-2 pl-0">
                                                        {request._id.substring(
                                                            9,
                                                            17
                                                        )}
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage
                                                                    src="/placeholder.svg"
                                                                    alt={
                                                                        request
                                                                            .customer
                                                                            .name
                                                                    }
                                                                />
                                                                <AvatarFallback>
                                                                    {request.customer.name.charAt(
                                                                        0
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">
                                                                    {
                                                                        request
                                                                            .customer
                                                                            .name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        request
                                                                            .customer
                                                                            .email
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-2">
                                                        {`${request.vehicle.year} ${request.vehicle.make} ${request.vehicle.model}`}
                                                    </td>
                                                    <td className="p-2">
                                                        {
                                                            request.specificService
                                                        }
                                                    </td>
                                                    <td className="p-2">
                                                        {formatDate(
                                                            request.appointmentDate
                                                        )}
                                                    </td>
                                                    <td className="p-2">
                                                        {getStatusBadge(
                                                            request.status
                                                        )}
                                                    </td>
                                                    <td className="p-2 pr-0 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/maintenance/${request._id}`
                                                                )
                                                            }
                                                        >
                                                            Details
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    No maintenance requests found.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Vehicle Listings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Vehicle Listings</CardTitle>
                            <CardDescription>
                                Latest vehicles added to inventory
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/admin/vehicles")}
                        >
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {admin.isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-500">
                                    Loading vehicles...
                                </span>
                            </div>
                        ) : admin.overview.recentVehicles &&
                          admin.overview.recentVehicles.length > 0 ? (
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
                                        {admin.overview.recentVehicles.map(
                                            (vehicle) => (
                                                <tr
                                                    key={vehicle._id}
                                                    className="border-b last:border-0 hover:bg-gray-50"
                                                >
                                                    <td className="p-2 pl-0">
                                                        {vehicle._id.substring(
                                                            9,
                                                            17
                                                        )}
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={`${VITE_APP_IMAGE_URL}/${vehicle.images?.[0]}`}
                                                                alt={
                                                                    vehicle.title
                                                                }
                                                                className="h-10 w-16 object-cover rounded"
                                                            />
                                                            <p className="font-medium">
                                                                {vehicle.title}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="p-2">
                                                        $
                                                        {vehicle.price.toLocaleString()}
                                                    </td>
                                                    <td className="p-2">
                                                        {formatDate(
                                                            vehicle.createdAt
                                                        )}
                                                    </td>
                                                    <td className="p-2">
                                                        {getStatusBadge(
                                                            vehicle.status
                                                        )}
                                                    </td>
                                                    <td className="p-2 pr-0 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/vehicles/${vehicle._id}`
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    No vehicles found.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Users */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Users</CardTitle>
                            <CardDescription>
                                Latest registered users
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/admin/users")}
                        >
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {admin.isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-500">
                                    Loading users...
                                </span>
                            </div>
                        ) : admin.overview.recentUsers &&
                          admin.overview.recentUsers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left font-medium p-2 pl-0">
                                                ID
                                            </th>
                                            <th className="text-left font-medium p-2">
                                                User
                                            </th>
                                            <th className="text-left font-medium p-2">
                                                Email
                                            </th>
                                            <th className="text-left font-medium p-2">
                                                Joined
                                            </th>
                                            {/* Will add status column later */}
                                            {/* <th className="text-left font-medium p-2">
                                                Status
                                            </th> */}
                                            <th className="text-right font-medium p-2 pr-0">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admin.overview.recentUsers.map(
                                            (user) => (
                                                <tr
                                                    key={user._id}
                                                    className="border-b last:border-0 hover:bg-gray-50"
                                                >
                                                    <td className="p-2 pl-0">
                                                        {user._id.substring(
                                                            9,
                                                            17
                                                        )}
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage
                                                                    src={
                                                                        user.avatar ||
                                                                        "/placeholder.svg"
                                                                    }
                                                                    alt={
                                                                        user.name
                                                                    }
                                                                />
                                                                <AvatarFallback>
                                                                    {user.name.charAt(
                                                                        0
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <p className="font-medium">
                                                                {user.name}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="p-2">
                                                        {user.email}
                                                    </td>
                                                    <td className="p-2">
                                                        {formatDate(
                                                            user.createdAt
                                                        )}
                                                    </td>
                                                    {/* <td className="p-2">
                                                        {getStatusBadge(
                                                            user.active
                                                                ? "active"
                                                                : "inactive"
                                                        )}
                                                    </td> */}
                                                    <td className="p-2 pr-0 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/users/${user._id}`
                                                                )
                                                            }
                                                        >
                                                            Manage
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No users found.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
