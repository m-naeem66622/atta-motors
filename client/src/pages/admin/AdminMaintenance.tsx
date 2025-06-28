"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    ChevronDown,
    MoreHorizontal,
    CheckCircle2,
    Eye,
    CheckCheck,
    X,
    Calendar,
    Loader2,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppState } from "@/hooks/useAppState";
import {
    getAllMaintenanceAppointments,
    updateMaintenanceAppointment,
} from "@/redux/maintenance/operations";
import { toast } from "@/hooks/use-toast";
import type { MaintenanceAppointment } from "@/d";

// No need for mock data anymore as we'll use real data from the API

export const AdminMaintenance = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { maintenance } = useAppState();
    const { isLoading, isUpdating, appointments, meta, error } = maintenance;

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filters, setFilters] = useState({
        status: "",
        dateFrom: "",
        dateTo: "",
    });
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit] = useState<number>(10);

    // Fetch maintenance appointments when component mounts or filters change
    const fetchAppointments = useCallback(() => {
        const statusParam = activeTab !== "all" ? activeTab : filters.status;
        dispatch(
            getAllMaintenanceAppointments({
                status: statusParam || undefined,
                dateFrom: filters.dateFrom || undefined,
                dateTo: filters.dateTo || undefined,
                search: searchTerm || undefined,
                page: currentPage,
                limit,
            })
        );
    }, [dispatch, activeTab, filters, searchTerm, currentPage, limit]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when searching
        fetchAppointments();
    };

    const handleFilterChange = (name: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value === "any" ? "" : value,
        }));
        setCurrentPage(1); // Reset to first page when filtering
    };

    const handleViewRequest = (id: string) => {
        navigate(`/admin/maintenance/${id}`);
    };

    const handleStatusUpdate = (id: string, status: string) => {
        dispatch(
            updateMaintenanceAppointment({
                id,
                data: { status },
            })
        ).then(() => {
            let message = "";
            switch (status) {
                case "Pending":
                    message = "Appointment is now pending";
                    break;
                case "Scheduled":
                    message = "Appointment is now scheduled";
                    break;
                case "Completed":
                    message = "Appointment marked as completed";
                    break;
                case "Cancelled":
                    message = "Appointment has been cancelled";
                    break;
                default:
                    message = `Status updated to ${status}`;
            }

            toast({
                title: "Status Updated",
                description: message,
            });
            fetchAppointments();
        });
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
            case "Pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Pending
                    </Badge>
                );
            case "Scheduled":
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        Scheduled
                    </Badge>
                );
            case "Completed":
                return (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Completed
                    </Badge>
                );
            case "Cancelled":
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                        Cancelled
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Get vehicle display name from maintenance appointment
    const getVehicleDisplay = (appointment: MaintenanceAppointment) => {
        const { vehicle } = appointment;
        return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

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
                            <Button
                                type="submit"
                                variant="default"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    "Search"
                                )}
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
                                        <SelectItem value="any">Any</SelectItem>{" "}
                                        <SelectItem value="Pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="Scheduled">
                                            Scheduled
                                        </SelectItem>
                                        <SelectItem value="Completed">
                                            Completed
                                        </SelectItem>
                                        <SelectItem value="Cancelled">
                                            Cancelled
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
                        <TabsTrigger value="Pending">Pending</TabsTrigger>
                        <TabsTrigger value="Scheduled">Scheduled</TabsTrigger>
                        <TabsTrigger value="Completed">Completed</TabsTrigger>
                        <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab}>
                        {isLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span className="ml-2">
                                    Loading maintenance requests...
                                </span>
                            </div>
                        ) : error ? (
                            <div className="text-center p-4 text-red-500">
                                Error loading maintenance requests:{" "}
                                {error.toString()}
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center p-4">
                                No maintenance requests found.
                            </div>
                        ) : (
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
                                        {appointments.map((appointment) => (
                                            <tr
                                                key={appointment._id}
                                                className="border-b last:border-0 hover:bg-gray-50"
                                            >
                                                <td className="p-2 pl-0">
                                                    {appointment._id.slice(-8)}
                                                </td>
                                                <td className="p-2">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback>
                                                                {appointment.customer.name.charAt(
                                                                    0
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">
                                                                {
                                                                    appointment
                                                                        .customer
                                                                        .name
                                                                }
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    appointment
                                                                        .customer
                                                                        .email
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    {getVehicleDisplay(
                                                        appointment
                                                    )}
                                                </td>
                                                <td className="p-2">
                                                    {
                                                        appointment.specificService
                                                    }
                                                </td>
                                                <td className="p-2">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        <span>
                                                            {formatDate(
                                                                appointment.appointmentDate
                                                            )}
                                                        </span>
                                                        <span className="text-gray-500 mx-1">
                                                            •
                                                        </span>
                                                        <span>
                                                            {
                                                                appointment.appointmentTime
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    {appointment.cost
                                                        ? `$${appointment.cost}`
                                                        : "Not set"}
                                                </td>
                                                <td className="p-2">
                                                    {getStatusBadge(
                                                        appointment.status
                                                    )}
                                                </td>
                                                <td className="p-2 pr-0 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleViewRequest(
                                                                    appointment._id
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
                                                                    disabled={
                                                                        isUpdating
                                                                    }
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>
                                                                    Actions
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                {/* Show available status transitions based on current status */}
                                                                {appointment.status !==
                                                                    "Pending" && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleStatusUpdate(
                                                                                appointment._id,
                                                                                "Pending"
                                                                            )
                                                                        }
                                                                    >
                                                                        <CheckCircle2 className="mr-2 h-4 w-4 text-yellow-500" />
                                                                        Mark as
                                                                        Pending
                                                                    </DropdownMenuItem>
                                                                )}

                                                                {appointment.status !==
                                                                    "Scheduled" && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleStatusUpdate(
                                                                                appointment._id,
                                                                                "Scheduled"
                                                                            )
                                                                        }
                                                                    >
                                                                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                                                        Mark as
                                                                        Scheduled
                                                                    </DropdownMenuItem>
                                                                )}

                                                                {appointment.status !==
                                                                    "Completed" && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleStatusUpdate(
                                                                                appointment._id,
                                                                                "Completed"
                                                                            )
                                                                        }
                                                                    >
                                                                        <CheckCheck className="mr-2 h-4 w-4 text-blue-500" />
                                                                        Mark as
                                                                        Completed
                                                                    </DropdownMenuItem>
                                                                )}

                                                                {appointment.status !==
                                                                    "Cancelled" && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleStatusUpdate(
                                                                                appointment._id,
                                                                                "Cancelled"
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="mr-2 h-4 w-4 text-red-500" />
                                                                        Cancel
                                                                        Appointment
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

                                {/* Pagination */}
                                {meta && (
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Showing {appointments.length} of{" "}
                                            {meta.itemCount} records
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage - 1
                                                    )
                                                }
                                                disabled={
                                                    !meta.hasPreviousPage ||
                                                    isLoading
                                                }
                                            >
                                                Previous
                                            </Button>
                                            <div className="text-sm">
                                                Page {currentPage} of{" "}
                                                {meta.pageCount || 1}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage + 1
                                                    )
                                                }
                                                disabled={
                                                    !meta.hasNextPage ||
                                                    isLoading
                                                }
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
