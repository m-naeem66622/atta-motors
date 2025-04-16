"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    ChevronDown,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Eye,
    UserCog,
    UserX,
    UserCheck,
    Calendar,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for users
const users = [
    {
        id: "USR-7890",
        name: "Robert Wilson",
        email: "robert@example.com",
        phone: "(555) 123-4567",
        joined: "2025-04-14T08:30:00Z",
        status: "active",
        avatar: "/placeholder.svg",
        lastLogin: "2025-04-15T10:15:00Z",
        maintenanceRequests: 2,
    },
    {
        id: "USR-7891",
        name: "Jennifer Lopez",
        email: "jennifer@example.com",
        phone: "(555) 987-6543",
        joined: "2025-04-13T14:20:00Z",
        status: "active",
        avatar: "/placeholder.svg",
        lastLogin: "2025-04-15T09:30:00Z",
        maintenanceRequests: 4,
    },
    {
        id: "USR-7892",
        name: "David Kim",
        email: "david@example.com",
        phone: "(555) 456-7890",
        joined: "2025-04-12T10:15:00Z",
        status: "suspended",
        avatar: "/placeholder.svg",
        lastLogin: "2025-04-13T16:45:00Z",
        maintenanceRequests: 1,
    },
    {
        id: "USR-7893",
        name: "Maria Garcia",
        email: "maria@example.com",
        phone: "(555) 234-5678",
        joined: "2025-04-10T16:45:00Z",
        status: "inactive",
        avatar: "/placeholder.svg",
        lastLogin: "2025-04-11T11:20:00Z",
        maintenanceRequests: 3,
    },
    {
        id: "USR-7894",
        name: "James Johnson",
        email: "james@example.com",
        phone: "(555) 876-5432",
        joined: "2025-04-09T09:30:00Z",
        status: "active",
        avatar: "/placeholder.svg",
        lastLogin: "2025-04-15T14:10:00Z",
        maintenanceRequests: 2,
    },
    {
        id: "USR-7895",
        name: "Emily Davis",
        email: "emily@example.com",
        phone: "(555) 345-6789",
        joined: "2025-04-08T11:20:00Z",
        status: "active",
        avatar: "/placeholder.svg",
        lastLogin: "2025-04-14T17:30:00Z",
        maintenanceRequests: 1,
    },
    {
        id: "USR-7896",
        name: "Michael Chen",
        email: "michael@example.com",
        phone: "(555) 567-8901",
        joined: "2025-04-07T13:45:00Z",
        status: "suspended",
        avatar: "/placeholder.svg",
        lastLogin: "2025-04-10T09:15:00Z",
        maintenanceRequests: 0,
    },
    {
        id: "USR-7897",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "(555) 678-9012",
        joined: "2025-04-06T15:30:00Z",
        status: "active",
        avatar: "/placeholder.svg",
        lastLogin: "2025-04-15T08:45:00Z",
        maintenanceRequests: 5,
    },
];

export const AdminUsers = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filters, setFilters] = useState({
        status: "",
        joinedFrom: "",
        joinedTo: "",
    });
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("all");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality
        console.log("Searching for:", searchTerm);
    };

    const handleFilterChange = (name: string, value: string) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleViewUser = (id: string) => {
        navigate(`/admin/users/${id}`);
    };

    const handleActivateUser = (id: string) => {
        // Implement activate functionality
        console.log("Activating user:", id);
    };

    const handleSuspendUser = (id: string) => {
        // Implement suspend functionality
        console.log("Suspending user:", id);
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

    const filteredUsers = users.filter((user) => {
        // Filter by tab
        if (activeTab !== "all" && user.status !== activeTab) {
            return false;
        }

        // Filter by search term
        if (
            searchTerm &&
            !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !user.id.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            return false;
        }

        // Filter by status
        if (filters.status && user.status !== filters.status) {
            return false;
        }

        // Filter by joined date range
        if (filters.joinedFrom) {
            const fromDate = new Date(filters.joinedFrom);
            const joinedDate = new Date(user.joined);
            if (joinedDate < fromDate) {
                return false;
            }
        }

        if (filters.joinedTo) {
            const toDate = new Date(filters.joinedTo);
            const joinedDate = new Date(user.joined);
            if (joinedDate > toDate) {
                return false;
            }
        }

        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        User Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage user accounts and permissions
                    </p>
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
                                    placeholder="Search by name, email, or ID"
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
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                                        <SelectItem value="any">Any</SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Inactive
                                        </SelectItem>
                                        <SelectItem value="suspended">
                                            Suspended
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Joined From
                                </label>
                                <Input
                                    type="date"
                                    value={filters.joinedFrom}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "joinedFrom",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Joined To
                                </label>
                                <Input
                                    type="date"
                                    value={filters.joinedTo}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "joinedTo",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Users List */}
            <div>
                <Tabs
                    defaultValue="all"
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                        <TabsTrigger value="all">All Users</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
                        <TabsTrigger value="suspended">Suspended</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab}>
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
                                            Phone
                                        </th>
                                        <th className="text-left font-medium p-2">
                                            Joined
                                        </th>
                                        <th className="text-left font-medium p-2">
                                            Last Login
                                        </th>
                                        <th className="text-left font-medium p-2">
                                            Activity
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
                                    {filteredUsers.map((user) => (
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
                                                {user.phone}
                                            </td>
                                            <td className="p-2">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                    <span>
                                                        {formatDate(
                                                            user.joined
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                {formatDate(user.lastLogin)}
                                            </td>
                                            <td className="p-2">
                                                <div className="text-sm">
                                                    <div>
                                                        Maintenance Requests:{" "}
                                                        {
                                                            user.maintenanceRequests
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                {getStatusBadge(user.status)}
                                            </td>
                                            <td className="p-2 pr-0 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleViewUser(
                                                                user.id
                                                            )
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
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
                                                                    handleViewUser(
                                                                        user.id
                                                                    )
                                                                }
                                                            >
                                                                <UserCog className="mr-2 h-4 w-4" />
                                                                View Profile
                                                            </DropdownMenuItem>
                                                            {(user.status ===
                                                                "inactive" ||
                                                                user.status ===
                                                                    "suspended") && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleActivateUser(
                                                                            user.id
                                                                        )
                                                                    }
                                                                >
                                                                    <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                                                                    Activate
                                                                    Account
                                                                </DropdownMenuItem>
                                                            )}
                                                            {user.status ===
                                                                "active" && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleSuspendUser(
                                                                            user.id
                                                                        )
                                                                    }
                                                                >
                                                                    <UserX className="mr-2 h-4 w-4 text-red-500" />
                                                                    Suspend
                                                                    Account
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
