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
    Clock,
    Eye,
    CheckCheck,
    X,
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

// Mock data for maintenance requests
const maintenanceRequests = [
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
        notes: "Customer requested synthetic oil",
        price: 95.0,
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
        notes: "Front brake pads and rotors need replacement",
        price: 320.0,
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
        notes: "Routine battery health check",
        price: 150.0,
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
        notes: "Service not available for this model",
        price: 0.0,
    },
    {
        id: "MNT-1238",
        customer: {
            name: "Robert Wilson",
            email: "robert@example.com",
            avatar: "/placeholder.svg",
        },
        vehicle: "2022 Hyundai Tucson",
        service: "Tire Rotation",
        status: "pending",
        date: "2025-04-17T13:30:00Z",
        notes: "Customer will provide own tires",
        price: 60.0,
    },
    {
        id: "MNT-1239",
        customer: {
            name: "Jennifer Lopez",
            email: "jennifer@example.com",
            avatar: "/placeholder.svg",
        },
        vehicle: "2020 BMW X5",
        service: "Air Conditioning Service",
        status: "approved",
        date: "2025-04-18T15:45:00Z",
        notes: "AC not cooling properly",
        price: 220.0,
    },
    {
        id: "MNT-1240",
        customer: {
            name: "David Kim",
            email: "david@example.com",
            avatar: "/placeholder.svg",
        },
        vehicle: "2019 Audi Q5",
        service: "Engine Diagnostics",
        status: "completed",
        date: "2025-04-12T10:00:00Z",
        notes: "Check engine light is on",
        price: 180.0,
    },
    {
        id: "MNT-1241",
        customer: {
            name: "Maria Garcia",
            email: "maria@example.com",
            avatar: "/placeholder.svg",
        },
        vehicle: "2021 Mazda CX-5",
        service: "Wheel Alignment",
        status: "pending",
        date: "2025-04-19T09:00:00Z",
        notes: "Vehicle pulling to the right",
        price: 120.0,
    },
];

export const AdminMaintenance = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filters, setFilters] = useState({
        status: "",
        dateFrom: "",
        dateTo: "",
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

    const handleViewRequest = (id: string) => {
        navigate(`/admin/maintenance/${id}`);
    };

    const handleApproveRequest = (id: string) => {
        // Implement approve functionality
        console.log("Approving request:", id);
    };

    const handleRejectRequest = (id: string) => {
        // Implement reject functionality
        console.log("Rejecting request:", id);
    };

    const handleCompleteRequest = (id: string) => {
        // Implement complete functionality
        console.log("Completing request:", id);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        Approved
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
            case "rejected":
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                        Rejected
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "pending":
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case "completed":
                return <CheckCheck className="h-5 w-5 text-blue-500" />;
            case "rejected":
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const filteredRequests = maintenanceRequests.filter((request) => {
        // Filter by tab
        if (activeTab !== "all" && request.status !== activeTab) {
            return false;
        }

        // Filter by search term
        if (
            searchTerm &&
            !request.customer.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) &&
            !request.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !request.service.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !request.id.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            return false;
        }

        // Filter by status
        if (filters.status && request.status !== filters.status) {
            return false;
        }

        // Filter by date range
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            const requestDate = new Date(request.date);
            if (requestDate < fromDate) {
                return false;
            }
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            const requestDate = new Date(request.date);
            if (requestDate > toDate) {
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
                        Maintenance Requests
                    </h1>
                    <p className="text-muted-foreground">
                        Manage customer maintenance appointments
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
                                    placeholder="Search by customer, vehicle, or service"
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
                                        <SelectItem value="">Any</SelectItem>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="approved">
                                            Approved
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Completed
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            Rejected
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date From
                                </label>
                                <Input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "dateFrom",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date To
                                </label>
                                <Input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "dateTo",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Maintenance Requests */}
            <div>
                <Tabs
                    defaultValue="all"
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-5 mb-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
                                            Customer
                                        </th>
                                        <th className="text-left font-medium p-2">
                                            Vehicle
                                        </th>
                                        <th className="text-left font-medium p-2">
                                            Service
                                        </th>
                                        <th className="text-left font-medium p-2">
                                            Date & Time
                                        </th>
                                        <th className="text-left font-medium p-2">
                                            Price
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
                                    {filteredRequests.map((request) => (
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
                                                                request.customer
                                                                    .avatar ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={
                                                                request.customer
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
                                                                request.customer
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                request.customer
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
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                    <span>
                                                        {formatDate(
                                                            request.date
                                                        )}
                                                    </span>
                                                    <span className="text-gray-500 mx-1">
                                                        •
                                                    </span>
                                                    <span>
                                                        {formatTime(
                                                            request.date
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                ${request.price.toFixed(2)}
                                            </td>
                                            <td className="p-2">
                                                {getStatusBadge(request.status)}
                                            </td>
                                            <td className="p-2 pr-0 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleViewRequest(
                                                                request.id
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
                                                            {request.status ===
                                                                "pending" && (
                                                                <>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleApproveRequest(
                                                                                request.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                                                        Approve
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleRejectRequest(
                                                                                request.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="mr-2 h-4 w-4 text-red-500" />
                                                                        Reject
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                            {request.status ===
                                                                "approved" && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleCompleteRequest(
                                                                            request.id
                                                                        )
                                                                    }
                                                                >
                                                                    <CheckCheck className="mr-2 h-4 w-4 text-blue-500" />
                                                                    Mark as
                                                                    Completed
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
