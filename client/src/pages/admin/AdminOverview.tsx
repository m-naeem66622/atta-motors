"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Car,
    Wrench,
    Users,
    DollarSign,
    TrendingUp,
    TrendingDown,
    BarChart3,
    ArrowRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for stats
const statsData = [
    {
        title: "Total Vehicles",
        value: "124",
        change: "+12%",
        increasing: true,
        icon: <Car className="h-5 w-5" />,
        color: "bg-blue-500",
    },
    {
        title: "Maintenance Requests",
        value: "45",
        change: "+5%",
        increasing: true,
        icon: <Wrench className="h-5 w-5" />,
        color: "bg-purple-500",
    },
    {
        title: "Active Users",
        value: "2,453",
        change: "+18%",
        increasing: true,
        icon: <Users className="h-5 w-5" />,
        color: "bg-green-500",
    },
    {
        title: "Pending Approvals",
        value: "12",
        change: "+5%",
        increasing: true,
        icon: <Clock className="h-5 w-5" />,
        color: "bg-amber-500",
    },
];

// Mock data for recent maintenance requests
const recentMaintenanceRequests = [
    {
        id: "MNT-1234",
        customer: {
            name: "John Smith",
            email: "john@example.com",
            avatar: "/placeholder.svg",
        },
        vehicle: "2020 Toyota Camry",
        service: "Oil Change & Filter Replacement",
        status: "pending",
        date: "2025-04-15T10:30:00Z",
    },
    {
        id: "MNT-1235",
        customer: {
            name: "Sarah Johnson",
            email: "sarah@example.com",
            avatar: "/placeholder.svg",
        },
        vehicle: "2019 Honda Accord",
        service: "Brake System Repair",
        status: "approved",
        date: "2025-04-16T14:00:00Z",
    },
    {
        id: "MNT-1236",
        customer: {
            name: "Michael Chen",
            email: "michael@example.com",
            avatar: "/placeholder.svg",
        },
        vehicle: "2021 Tesla Model 3",
        service: "Battery Inspection",
        status: "completed",
        date: "2025-04-14T09:15:00Z",
    },
    {
        id: "MNT-1237",
        customer: {
            name: "Emily Davis",
            email: "emily@example.com",
            avatar: "/placeholder.svg",
        },
        vehicle: "2018 Ford F-150",
        service: "Transmission Service",
        status: "rejected",
        date: "2025-04-13T11:45:00Z",
    },
];

// Mock data for recent vehicle listings
const recentVehicleListings = [
    {
        id: "VEH-4567",
        title: "2022 Toyota RAV4 XLE",
        price: 32500,
        status: "active",
        added: "2025-04-14T08:30:00Z",
        image: "/placeholder.svg?height=100&width=150",
    },
    {
        id: "VEH-4568",
        title: "2021 Honda CR-V Touring",
        price: 29800,
        status: "active",
        added: "2025-04-13T14:20:00Z",
        image: "/placeholder.svg?height=100&width=150",
    },
    {
        id: "VEH-4569",
        title: "2020 Ford Mustang GT",
        price: 38500,
        status: "pending",
        added: "2025-04-12T10:15:00Z",
        image: "/placeholder.svg?height=100&width=150",
    },
    {
        id: "VEH-4570",
        title: "2019 Chevrolet Silverado LT",
        price: 34200,
        status: "sold",
        added: "2025-04-10T16:45:00Z",
        image: "/placeholder.svg?height=100&width=150",
    },
];

// Mock data for recent users
const recentUsers = [
    {
        id: "USR-7890",
        name: "Robert Wilson",
        email: "robert@example.com",
        joined: "2025-04-14T08:30:00Z",
        status: "active",
        avatar: "/placeholder.svg",
    },
    {
        id: "USR-7891",
        name: "Jennifer Lopez",
        email: "jennifer@example.com",
        joined: "2025-04-13T14:20:00Z",
        status: "active",
        avatar: "/placeholder.svg",
    },
    {
        id: "USR-7892",
        name: "David Kim",
        email: "david@example.com",
        joined: "2025-04-12T10:15:00Z",
        status: "suspended",
        avatar: "/placeholder.svg",
    },
    {
        id: "USR-7893",
        name: "Maria Garcia",
        email: "maria@example.com",
        joined: "2025-04-10T16:45:00Z",
        status: "inactive",
        avatar: "/placeholder.svg",
    },
];

export const AdminOverview = () => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState("week");

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
            case "approved":
            case "completed":
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Pending
                    </Badge>
                );
            case "rejected":
            case "suspended":
            case "inactive":
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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
            case "approved":
            case "completed":
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "pending":
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case "rejected":
            case "suspended":
            case "inactive":
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
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
                {statsData.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center">
                                    <div
                                        className={`mr-3 rounded-full p-2 ${stat.color} text-white`}
                                    >
                                        {stat.icon}
                                    </div>
                                    <p className="text-sm font-medium">
                                        {stat.title}
                                    </p>
                                </div>
                                <div
                                    className={`flex items-center text-sm ${
                                        stat.increasing
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {stat.increasing ? (
                                        <TrendingUp className="mr-1 h-4 w-4" />
                                    ) : (
                                        <TrendingDown className="mr-1 h-4 w-4" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts and Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart */}
                <Card className="lg:col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle>Vehicle Inventory Overview</CardTitle>
                            <CardDescription>
                                Monthly vehicle listings and maintenance
                            </CardDescription>
                        </div>
                        <Tabs defaultValue={period} onValueChange={setPeriod}>
                            <TabsList className="grid grid-cols-3 h-8">
                                <TabsTrigger value="week" className="text-xs">
                                    Week
                                </TabsTrigger>
                                <TabsTrigger value="month" className="text-xs">
                                    Month
                                </TabsTrigger>
                                <TabsTrigger value="year" className="text-xs">
                                    Year
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[240px] flex items-center justify-center bg-gray-50 rounded-md">
                            <div className="text-center">
                                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">
                                    Sales chart visualization
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest actions and updates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-blue-100 p-2">
                                    <Car className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        New vehicle listed
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        2022 Toyota RAV4 XLE added to inventory
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        2 hours ago
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-green-100 p-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        Vehicle updated
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        2019 Honda Civic price updated to
                                        $18,500
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        5 hours ago
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-purple-100 p-2">
                                    <Wrench className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        Maintenance completed
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Oil change for 2020 Toyota Camry
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Yesterday
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-amber-100 p-2">
                                    <Users className="h-4 w-4 text-amber-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        New user registered
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Robert Wilson created an account
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Yesterday
                                    </p>
                                </div>
                            </div>
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
                                    {recentMaintenanceRequests.map(
                                        (request) => (
                                            <tr
                                                key={request.id}
                                                className="border-b last:border-0 hover:bg-gray-50"
                                            >
                                                <td className="p-2 pl-0">
                                                    {request.id}
                                                </td>
                                                <td className="p-2">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage
                                                                src={
                                                                    request
                                                                        .customer
                                                                        .avatar ||
                                                                    "/placeholder.svg"
                                                                }
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
                                                    {request.vehicle}
                                                </td>
                                                <td className="p-2">
                                                    {request.service}
                                                </td>
                                                <td className="p-2">
                                                    {formatDate(request.date)}
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
                                                                `/admin/maintenance/${request.id}`
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
                                    {recentVehicleListings.map((vehicle) => (
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
                                                {formatDate(vehicle.added)}
                                            </td>
                                            <td className="p-2">
                                                {getStatusBadge(vehicle.status)}
                                            </td>
                                            <td className="p-2 pr-0 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/vehicles/${vehicle.id}`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                                        <th className="text-left font-medium p-2">
                                            Status
                                        </th>
                                        <th className="text-right font-medium p-2 pr-0">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="p-2 pl-0">
                                                {user.id}
                                            </td>
                                            <td className="p-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage
                                                            src={
                                                                user.avatar ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={user.name}
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
                                                {formatDate(user.joined)}
                                            </td>
                                            <td className="p-2">
                                                {getStatusBadge(user.status)}
                                            </td>
                                            <td className="p-2 pr-0 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/users/${user.id}`
                                                        )
                                                    }
                                                >
                                                    Manage
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
