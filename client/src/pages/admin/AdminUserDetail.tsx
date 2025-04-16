"use client";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Clock,
    Shield,
    CheckCircle2,
    XCircle,
    AlertCircle,
    UserCheck,
    UserX,
    Wrench,
    MessageSquare,
    FileText,
    Lock,
    Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock user data
const userData = {
    id: "USR-7890",
    name: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, San Francisco, CA 94105",
    joined: "2025-04-14T08:30:00Z",
    status: "active",
    avatar: "/placeholder.svg",
    lastLogin: "2025-04-15T10:15:00Z",
    maintenanceRequests: [
        {
            id: "MNT-1234",
            service: "Oil Change & Filter Replacement",
            date: "2025-04-15T10:30:00Z",
            status: "pending",
            vehicle: "2020 Toyota Camry",
        },
        {
            id: "MNT-1230",
            service: "Brake System Inspection",
            date: "2025-03-10T14:00:00Z",
            status: "completed",
            vehicle: "2020 Toyota Camry",
        },
    ],
    vehicles: [
        {
            id: "VEH-5678",
            title: "2020 Toyota Camry",
            image: "/placeholder.svg?height=100&width=150",
        },
    ],
    activityLog: [
        {
            date: "2025-04-15T10:15:00Z",
            action: "User Login",
            details: "User logged in from IP 192.168.1.1",
        },
        {
            date: "2025-04-14T15:30:00Z",
            action: "Profile Updated",
            details: "User updated their phone number",
        },
        {
            date: "2025-04-14T09:45:00Z",
            action: "Maintenance Request",
            details: "User scheduled an oil change appointment",
        },
        {
            date: "2025-04-10T11:20:00Z",
            action: "User Login",
            details: "User logged in from IP 192.168.1.1",
        },
        {
            date: "2025-04-05T16:15:00Z",
            action: "Account Created",
            details: "User created their account",
        },
    ],
};

export const AdminUserDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("profile");
    const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
    const [suspensionReason, setSuspensionReason] = useState("");
    const [permissions, setPermissions] = useState({
        canBookMaintenance: true,
        canViewVehicles: true,
        canContactSupport: true,
    });

    const handleGoBack = () => {
        navigate("/admin/users");
    };

    const handleSuspend = () => {
        console.log("Suspending user:", id, "with reason:", suspensionReason);
        setIsSuspendDialogOpen(false);
        setSuspensionReason("");
        // Here you would update the status and redirect or refresh
    };

    const handleActivate = () => {
        console.log("Activating user:", id);
        // Here you would update the status and redirect or refresh
    };

    const handlePermissionChange = (permission: string, value: boolean) => {
        setPermissions((prev) => ({
            ...prev,
            [permission]: value,
        }));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
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
            case "inactive":
                return (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        Inactive
                    </Badge>
                );
            case "suspended":
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                        Suspended
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Pending
                    </Badge>
                );
            case "completed":
                return (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Completed
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
            case "inactive":
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
            case "suspended":
                return <XCircle className="h-5 w-5 text-red-500" />;
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
                        Back to Users
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">
                        User Profile: {userData.name}
                    </h1>
                    <div className="ml-4">
                        {getStatusBadge(userData.status)}
                    </div>
                </div>
                <div className="flex gap-2">
                    {userData.status === "active" ? (
                        <Dialog
                            open={isSuspendDialogOpen}
                            onOpenChange={setIsSuspendDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    <UserX className="mr-2 h-4 w-4" />
                                    Suspend Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Suspend User Account
                                    </DialogTitle>
                                    <DialogDescription>
                                        Please provide a reason for suspending
                                        this user account. The user will not be
                                        able to access their account while
                                        suspended.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reason">
                                            Suspension Reason
                                        </Label>
                                        <Textarea
                                            id="reason"
                                            placeholder="Enter the reason for suspension..."
                                            value={suspensionReason}
                                            onChange={(e) =>
                                                setSuspensionReason(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setIsSuspendDialogOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleSuspend}
                                    >
                                        Suspend Account
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Button
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleActivate}
                        >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate Account
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile and Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs
                        defaultValue="profile"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="activity">
                                Activity Log
                            </TabsTrigger>
                            <TabsTrigger value="maintenance">
                                Maintenance Requests
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex flex-col items-center md:items-start">
                                            <Avatar className="h-24 w-24 mb-4">
                                                <AvatarImage
                                                    src={
                                                        userData.avatar ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={userData.name}
                                                />
                                                <AvatarFallback>
                                                    {userData.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="text-center md:text-left">
                                                <h3 className="text-xl font-bold">
                                                    {userData.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    User ID: {userData.id}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Email
                                                    </p>
                                                    <div className="flex items-center">
                                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                        <p>{userData.email}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Phone
                                                    </p>
                                                    <div className="flex items-center">
                                                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                        <p>{userData.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Address
                                                    </p>
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                                        <p>
                                                            {userData.address}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        Joined
                                                    </p>
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                        <p>
                                                            {formatDate(
                                                                userData.joined
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Vehicles</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {userData.vehicles.length > 0 ? (
                                        <div className="space-y-4">
                                            {userData.vehicles.map(
                                                (vehicle) => (
                                                    <div
                                                        key={vehicle.id}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={
                                                                    vehicle.image ||
                                                                    "/placeholder.svg"
                                                                }
                                                                alt={
                                                                    vehicle.title
                                                                }
                                                                className="w-16 h-10 object-cover rounded"
                                                            />
                                                            <div>
                                                                <p className="font-medium">
                                                                    {
                                                                        vehicle.title
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    ID:{" "}
                                                                    {vehicle.id}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/vehicles/${vehicle.id}`
                                                                )
                                                            }
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-gray-500">
                                            <Car className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                            <p>
                                                No vehicles associated with this
                                                user
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="activity">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Activity Log</CardTitle>
                                    <CardDescription>
                                        Recent user activity and system events
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {userData.activityLog.map(
                                            (activity, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-4"
                                                >
                                                    <div className="mt-1">
                                                        <div className="bg-gray-100 rounded-full p-2">
                                                            {activity.action ===
                                                            "User Login" ? (
                                                                <User className="h-4 w-4 text-blue-500" />
                                                            ) : activity.action ===
                                                              "Profile Updated" ? (
                                                                <FileText className="h-4 w-4 text-green-500" />
                                                            ) : activity.action ===
                                                              "Maintenance Request" ? (
                                                                <Wrench className="h-4 w-4 text-purple-500" />
                                                            ) : (
                                                                <Clock className="h-4 w-4 text-gray-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium">
                                                                {
                                                                    activity.action
                                                                }
                                                            </p>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {formatDateTime(
                                                                    activity.date
                                                                )}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm">
                                                            {activity.details}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="maintenance">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Maintenance Requests</CardTitle>
                                    <CardDescription>
                                        Service requests submitted by this user
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {userData.maintenanceRequests.length > 0 ? (
                                        <div className="space-y-4">
                                            {userData.maintenanceRequests.map(
                                                (request) => (
                                                    <div
                                                        key={request.id}
                                                        className="border rounded-lg p-4"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="font-medium">
                                                                    {
                                                                        request.service
                                                                    }
                                                                </h4>
                                                                <p className="text-sm text-gray-500">
                                                                    {
                                                                        request.vehicle
                                                                    }
                                                                </p>
                                                            </div>
                                                            {getStatusBadge(
                                                                request.status
                                                            )}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            <span>
                                                                {formatDateTime(
                                                                    request.date
                                                                )}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/maintenance/${request.id}`
                                                                )
                                                            }
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-gray-500">
                                            <Wrench className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                            <p>
                                                No maintenance requests from
                                                this user
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column - Status and Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(userData.status)}
                                <span className="font-medium capitalize">
                                    {userData.status}
                                </span>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Last Login:
                                    </span>
                                    <span>
                                        {formatDateTime(userData.lastLogin)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Account Created:
                                    </span>
                                    <span>{formatDate(userData.joined)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Maintenance Requests:
                                    </span>
                                    <span>
                                        {userData.maintenanceRequests.length}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Permissions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Wrench className="h-4 w-4 text-gray-500" />
                                    <Label htmlFor="canBookMaintenance">
                                        Book Maintenance
                                    </Label>
                                </div>
                                <Switch
                                    id="canBookMaintenance"
                                    checked={permissions.canBookMaintenance}
                                    onCheckedChange={(checked) =>
                                        handlePermissionChange(
                                            "canBookMaintenance",
                                            checked
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4 text-gray-500" />
                                    <Label htmlFor="canViewVehicles">
                                        View Vehicles
                                    </Label>
                                </div>
                                <Switch
                                    id="canViewVehicles"
                                    checked={permissions.canViewVehicles}
                                    onCheckedChange={(checked) =>
                                        handlePermissionChange(
                                            "canViewVehicles",
                                            checked
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-gray-500" />
                                    <Label htmlFor="canContactSupport">
                                        Contact Support
                                    </Label>
                                </div>
                                <Switch
                                    id="canContactSupport"
                                    checked={permissions.canContactSupport}
                                    onCheckedChange={(checked) =>
                                        handlePermissionChange(
                                            "canContactSupport",
                                            checked
                                        )
                                    }
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Save Permissions</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full" variant="outline">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send Message
                            </Button>
                            <Button className="w-full" variant="outline">
                                <Lock className="mr-2 h-4 w-4" />
                                Reset Password
                            </Button>
                            <Button className="w-full" variant="outline">
                                <Shield className="mr-2 h-4 w-4" />
                                Security Audit
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
