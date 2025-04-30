import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Car,
    Wrench,
    User,
    Phone,
    Mail,
    CheckCircle2,
    XCircle,
    AlertCircle,
    CheckCheck,
    X,
    DollarSign,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    getMaintenanceAppointment,
    updateMaintenanceAppointment,
} from "@/redux/maintenance/operations";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppState } from "@/hooks/useAppState";
import { toast } from "@/hooks/use-toast";

export const AdminMaintenanceDetail = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { maintenance } = useAppState();
    const { currentAppointment, isLoading, isUpdating, error } = maintenance;
    const { id } = useParams();

    const [notes, setNotes] = useState("");
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [updatedPrice, setUpdatedPrice] = useState("");
    const [technician, setTechnician] = useState("");

    // Fetch maintenance appointment details when component mounts
    useEffect(() => {
        if (id) {
            dispatch(getMaintenanceAppointment(id));
        }
    }, [dispatch, id]);

    // Update local state when appointment data is fetched
    useEffect(() => {
        if (currentAppointment) {
            setNotes(currentAppointment.notes || "");
            setUpdatedPrice(currentAppointment.cost || "");
            setTechnician(currentAppointment.technician || "");
        }
    }, [currentAppointment]);

    const handleGoBack = () => {
        navigate("/admin/maintenance");
    };

    const handleTechnicianAndPrice = () => {
        if (id) {
            dispatch(
                updateMaintenanceAppointment({
                    id,
                    data: {
                        status: "Scheduled",
                        cost: updatedPrice,
                        technician,
                    },
                })
            ).then(() => {
                toast({
                    title: "Success",
                    description: "Maintenance request approved successfully",
                });
                setIsApproveDialogOpen(false);
            });
        }
    };

    const handleStatusUpdate = (status: string) => {
        if (id) {
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
            });
        }
    };

    const handleSaveNotes = () => {
        if (id) {
            dispatch(
                updateMaintenanceAppointment({
                    id,
                    data: { notes: notes.trim() },
                })
            ).then(() => {
                toast({
                    title: "Success",
                    description: "Notes saved successfully",
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
        });
    };

    const formatTime = (time: string) => {
        // Just return the time string as it's already in the correct format
        return time;
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

    // Get vehicle display name from maintenance appointment
    const getVehicleDisplay = () => {
        if (!currentAppointment) return "";
        const { vehicle } = currentAppointment;
        return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pending":
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case "Scheduled":
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "Completed":
                return <CheckCheck className="h-5 w-5 text-blue-500" />;
            case "Cancelled":
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    // If still loading, show loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading maintenance details...</span>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <Button
                        variant="ghost"
                        onClick={handleGoBack}
                        className="mr-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Maintenance
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-red-500 text-center">
                            <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                Error Loading Details
                            </h3>
                            <p>{error.toString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // If no appointment is found
    if (!currentAppointment) {
        return (
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <Button
                        variant="ghost"
                        onClick={handleGoBack}
                        className="mr-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Maintenance
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <AlertCircle className="mx-auto h-12 w-12 mb-4 text-amber-500" />
                            <h3 className="text-lg font-semibold mb-2">
                                Maintenance Request Not Found
                            </h3>
                            <p>
                                The requested maintenance details could not be
                                found.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        onClick={handleGoBack}
                        className="mr-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Maintenance
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Maintenance Request {currentAppointment._id.slice(-8)}
                    </h1>
                    <div className="ml-4">
                        {getStatusBadge(currentAppointment.status)}
                    </div>
                </div>
                {/* Always show action buttons, regardless of status */}
                <div className="flex gap-2">
                    {/* Edit Maintenance Details (always available) */}
                    <Dialog
                        open={isApproveDialogOpen}
                        onOpenChange={setIsApproveDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button variant="outline" disabled={isUpdating}>
                                {isUpdating ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <User className="mr-2 h-4 w-4" />
                                )}
                                {currentAppointment.technician
                                    ? "Edit Technician"
                                    : "Assign Technician"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Edit Maintenance Details
                                </DialogTitle>
                                <DialogDescription>
                                    Update the technician and price information
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="technician">
                                        Assigned Technician
                                    </Label>
                                    <Input
                                        id="technician"
                                        type="text"
                                        value={technician}
                                        onChange={(e) =>
                                            setTechnician(e.target.value)
                                        }
                                        placeholder="Enter technician name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        type="text"
                                        value={updatedPrice}
                                        onChange={(e) =>
                                            setUpdatedPrice(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setIsApproveDialogOpen(false)
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleTechnicianAndPrice}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Update Status - always available regardless of current status */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={
                                    currentAppointment.status === "Scheduled"
                                        ? "default"
                                        : "secondary"
                                }
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    getStatusIcon(currentAppointment.status)
                                )}
                                <span className="ml-2">Update Status</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Pending option - shown if not already pending */}
                            {currentAppointment.status !== "Pending" && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleStatusUpdate("Pending")
                                    }
                                >
                                    <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                                    Mark as Pending
                                </DropdownMenuItem>
                            )}

                            {/* Schedule option - shown if not already scheduled */}
                            {currentAppointment.status !== "Scheduled" && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleStatusUpdate("Scheduled")
                                    }
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                    Mark as Scheduled
                                </DropdownMenuItem>
                            )}

                            {/* Complete option - shown if not already completed */}
                            {currentAppointment.status !== "Completed" && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleStatusUpdate("Completed")
                                    }
                                >
                                    <CheckCheck className="mr-2 h-4 w-4 text-blue-500" />
                                    Mark as Completed
                                </DropdownMenuItem>
                            )}

                            {/* Cancel option - shown if not already cancelled */}
                            {currentAppointment.status !== "Cancelled" && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleStatusUpdate("Cancelled")
                                    }
                                    className="text-red-500"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel Appointment
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Cancellation Dialog - available through dropdown, but defined here
                    <Dialog
                        open={isRejectDialogOpen}
                        onOpenChange={setIsRejectDialogOpen}
                    >
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Cancel Maintenance Appointment
                                </DialogTitle>
                                <DialogDescription>
                                    Please provide a reason for cancellation.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reason">
                                        Cancellation Reason
                                    </Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Enter the reason for cancellation..."
                                        value={rejectionReason}
                                        onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsRejectDialogOpen(false)}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleReject}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        "Cancel Appointment"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">
                                        Service Type
                                    </p>
                                    <div className="flex items-center">
                                        <Wrench className="h-4 w-4 mr-2 text-gray-400" />
                                        <p>
                                            {currentAppointment.maintenanceType}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">
                                        Specific Service
                                    </p>
                                    <div className="flex items-center">
                                        <Wrench className="h-4 w-4 mr-2 text-gray-400" />
                                        <p>
                                            {currentAppointment.specificService}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">
                                        Appointment Date
                                    </p>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        <p>
                                            {formatDate(
                                                currentAppointment.appointmentDate
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">
                                        Appointment Time
                                    </p>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                        <p>
                                            {formatTime(
                                                currentAppointment.appointmentTime
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">
                                        Price
                                    </p>
                                    <div className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                        <p>
                                            {currentAppointment.cost
                                                ? `$${currentAppointment.cost}`
                                                : "Not set"}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">
                                        Assigned Technician
                                    </p>
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-2 text-gray-400" />
                                        <p>
                                            {currentAppointment.technician ||
                                                "Not assigned yet"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-500">
                                    Notes
                                </p>
                                <p className="text-sm">
                                    {currentAppointment.notes ||
                                        "No notes provided."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vehicle Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Car className="h-4 w-4 mr-2 text-gray-400" />
                                        <p className="font-medium">
                                            {getVehicleDisplay()}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">
                                                Make:
                                            </p>
                                            <p>
                                                {
                                                    currentAppointment.vehicle
                                                        .make
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">
                                                Model:
                                            </p>
                                            <p>
                                                {
                                                    currentAppointment.vehicle
                                                        .model
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">
                                                Year:
                                            </p>
                                            <p>
                                                {
                                                    currentAppointment.vehicle
                                                        .year
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">
                                                Registration:
                                            </p>
                                            <p>
                                                {
                                                    currentAppointment.vehicle
                                                        .registration
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>
                                            {currentAppointment.customer.name.charAt(
                                                0
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {currentAppointment.customer.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                        <p>
                                            {currentAppointment.customer.email}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                        <p>
                                            {currentAppointment.customer.phone}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column - Status and Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(currentAppointment.status)}
                                <span className="font-medium capitalize">
                                    {currentAppointment.status}
                                </span>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Request ID:
                                    </span>
                                    <span className="font-mono text-sm">
                                        {currentAppointment._id}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Created:
                                    </span>
                                    <span>
                                        {formatDateTime(
                                            currentAppointment.createdAt
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Updated:
                                    </span>
                                    <span>
                                        {formatDateTime(
                                            currentAppointment.updatedAt
                                        )}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Add internal notes about this request..."
                                className="min-h-[100px]"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            <Button
                                className="w-full mt-2"
                                onClick={handleSaveNotes}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Save Notes"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// "use client"

// import { useState } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import {
//   ArrowLeft,
//   Calendar,
//   Clock,
//   Car,
//   Wrench,
//   User,
//   Phone,
//   Mail,
//   FileText,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   MessageSquare,
//   Send,
//   CheckCheck,
//   X,
//   DollarSign,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// // Mock maintenance request data
// const maintenanceData = {
//   id: "MNT-1234",
//   customer: {
//     id: "USR-7890",
//     name: "John Smith",
//     email: "john@example.com",
//     phone: "(555) 123-4567",
//     avatar: "/placeholder.svg",
//   },
//   vehicle: {
//     id: "VEH-4567",
//     title: "2020 Toyota Camry",
//     year: 2020,
//     make: "Toyota",
//     model: "Camry",
//     vin: "1HGCM82633A123456",
//   },
//   service: "Oil Change & Filter Replacement",
//   status: "pending",
//   date: "2025-04-15T10:30:00Z",
//   notes: "Customer requested synthetic oil. Vehicle has approximately 35,000 miles.",
//   price: 95.0,
//   estimatedDuration: "1 hour",
//   technician: {
//     id: "TECH-001",
//     name: "Michael Johnson",
//     specialization: "General Maintenance",
//     avatar: "/placeholder.svg",
//   },
//   history: [
//     {
//       date: "2025-04-14T15:45:00Z",
//       action: "Request Created",
//       user: "John Smith",
//       notes: "Customer submitted maintenance request online",
//     },
//     {
//       date: "2025-04-14T16:30:00Z",
//       action: "Request Received",
//       user: "System",
//       notes: "Maintenance request received and queued for review",
//     },
//   ],
//   messages: [
//     {
//       id: "MSG-001",
//       date: "2025-04-14T16:45:00Z",
//       from: "customer",
//       message: "Hi, I'd like to confirm that you'll be using synthetic oil for the oil change.",
//     },
//     {
//       id: "MSG-002",
//       date: "2025-04-14T17:10:00Z",
//       from: "admin",
//       message: "Yes, we'll be using synthetic oil as requested. Is there a specific brand you prefer?",
//     },
//     {
//       id: "MSG-003",
//       date: "2025-04-14T17:25:00Z",
//       from: "customer",
//       message: "Mobil 1 would be great if you have it. Thanks!",
//     },
//   ],
// }

// export const AdminMaintenanceDetail = () => {
//   const navigate = useNavigate()
//   const { id } = useParams()
//   const [activeTab, setActiveTab] = useState("details")
//   const [newMessage, setNewMessage] = useState("")
//   const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
//   const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
//   const [rejectionReason, setRejectionReason] = useState("")
//   const [updatedPrice, setUpdatedPrice] = useState(maintenanceData.price.toString())

//   const handleGoBack = () => {
//     navigate("/admin/maintenance")
//   }

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       console.log("Sending message:", newMessage)
//       setNewMessage("")
//     }
//   }

//   const handleApprove = () => {
//     console.log("Approving maintenance request:", id, "with price:", updatedPrice)
//     setIsApproveDialogOpen(false)
//     // Here you would update the status and redirect or refresh
//   }

//   const handleReject = () => {
//     console.log("Rejecting maintenance request:", id, "with reason:", rejectionReason)
//     setIsRejectDialogOpen(false)
//     setRejectionReason("")
//     // Here you would update the status and redirect or refresh
//   }

//   const handleComplete = () => {
//     console.log("Marking maintenance request as completed:", id)
//     // Here you would update the status and redirect or refresh
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     })
//   }

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const formatDateTime = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "approved":
//         return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
//       case "pending":
//         return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
//       case "completed":
//         return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>
//       case "rejected":
//         return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
//       default:
//         return <Badge variant="outline">{status}</Badge>
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "approved":
//         return <CheckCircle2 className="h-5 w-5 text-green-500" />
//       case "pending":
//         return <AlertCircle className="h-5 w-5 text-yellow-500" />
//       case "completed":
//         return <CheckCheck className="h-5 w-5 text-blue-500" />
//       case "rejected":
//         return <XCircle className="h-5 w-5 text-red-500" />
//       default:
//         return <AlertCircle className="h-5 w-5 text-gray-500" />
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <Button variant="ghost" onClick={handleGoBack} className="mr-4">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Maintenance
//           </Button>
//           <h1 className="text-2xl font-bold tracking-tight">Maintenance Request {maintenanceData.id}</h1>
//           <div className="ml-4">{getStatusBadge(maintenanceData.status)}</div>
//         </div>
//         <div className="flex gap-2">
//           {maintenanceData.status === "pending" && (
//             <>
//               <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="default" className="bg-green-600 hover:bg-green-700">
//                     <CheckCircle2 className="mr-2 h-4 w-4" />
//                     Approve Request
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Approve Maintenance Request</DialogTitle>
//                     <DialogDescription>
//                       Confirm the details and price before approving this maintenance request.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="space-y-4 py-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="price">Price ($)</Label>
//                       <Input
//                         id="price"
//                         type="number"
//                         value={updatedPrice}
//                         onChange={(e) => setUpdatedPrice(e.target.value)}
//                       />
//                       <p className="text-sm text-gray-500">Update the price if necessary before approval.</p>
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
//                       Cancel
//                     </Button>
//                     <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
//                       Approve Request
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>

//               <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="destructive">
//                     <X className="mr-2 h-4 w-4" />
//                     Reject Request
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Reject Maintenance Request</DialogTitle>
//                     <DialogDescription>
//                       Please provide a reason for rejecting this maintenance request.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="space-y-4 py-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="reason">Rejection Reason</Label>
//                       <Textarea
//                         id="reason"
//                         placeholder="Enter the reason for rejection..."
//                         value={rejectionReason}
//                         onChange={(e) => setRejectionReason(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
//                       Cancel
//                     </Button>
//                     <Button variant="destructive" onClick={handleReject}>
//                       Reject Request
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </>
//           )}

//           {maintenanceData.status === "approved" && (
//             <Button onClick={handleComplete} className="bg-blue-600 hover:bg-blue-700">
//               <CheckCheck className="mr-2 h-4 w-4" />
//               Mark as Completed
//             </Button>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Details and Tabs */}
//         <div className="lg:col-span-2 space-y-6">
//           <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="details">Request Details</TabsTrigger>
//               <TabsTrigger value="history">History</TabsTrigger>
//               <TabsTrigger value="messages">Messages</TabsTrigger>
//             </TabsList>
//             <TabsContent value="details" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Service Information</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-1">
//                       <p className="text-sm font-medium text-gray-500">Service Type</p>
//                       <div className="flex items-center">
//                         <Wrench className="h-4 w-4 mr-2 text-gray-400" />
//                         <p>{maintenanceData.service}</p>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-sm font-medium text-gray-500">Appointment Date</p>
//                       <div className="flex items-center">
//                         <Calendar className="h-4 w-4 mr-2 text-gray-400" />
//                         <p>{formatDate(maintenanceData.date)}</p>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-sm font-medium text-gray-500">Appointment Time</p>
//                       <div className="flex items-center">
//                         <Clock className="h-4 w-4 mr-2 text-gray-400" />
//                         <p>{formatTime(maintenanceData.date)}</p>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-sm font-medium text-gray-500">Estimated Duration</p>
//                       <div className="flex items-center">
//                         <Clock className="h-4 w-4 mr-2 text-gray-400" />
//                         <p>{maintenanceData.estimatedDuration}</p>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-sm font-medium text-gray-500">Price</p>
//                       <div className="flex items-center">
//                         <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
//                         <p>${maintenanceData.price.toFixed(2)}</p>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-sm font-medium text-gray-500">Assigned Technician</p>
//                       <div className="flex items-center">
//                         <User className="h-4 w-4 mr-2 text-gray-400" />
//                         <p>{maintenanceData.technician?.name || "Not assigned yet"}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <Separator className="my-4" />

//                   <div className="space-y-2">
//                     <p className="text-sm font-medium text-gray-500">Customer Notes</p>
//                     <p className="text-sm">{maintenanceData.notes}</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Vehicle Information</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-3">
//                       <div className="flex items-center">
//                         <Car className="h-4 w-4 mr-2 text-gray-400" />
//                         <p className="font-medium">{maintenanceData.vehicle.title}</p>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 text-sm">
//                         <div>
//                           <p className="text-gray-500">Make:</p>
//                           <p>{maintenanceData.vehicle.make}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Model:</p>
//                           <p>{maintenanceData.vehicle.model}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Year:</p>
//                           <p>{maintenanceData.vehicle.year}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">VIN:</p>
//                           <p>{maintenanceData.vehicle.vin}</p>
//                         </div>
//                       </div>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="w-full mt-2"
//                         onClick={() => navigate(`/admin/vehicles/${maintenanceData.vehicle.id}`)}
//                       >
//                         View Vehicle Details
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Customer Information</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-center gap-3 mb-4">
//                       <Avatar className="h-10 w-10">
//                         <AvatarImage
//                           src={maintenanceData.customer.avatar || "/placeholder.svg"}
//                           alt={maintenanceData.customer.name}
//                         />
//                         <AvatarFallback>{maintenanceData.customer.name.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-medium">{maintenanceData.customer.name}</p>
//                         <p className="text-sm text-gray-500">Customer ID: {maintenanceData.customer.id}</p>
//                       </div>
//                     </div>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex items-center">
//                         <Mail className="h-4 w-4 mr-2 text-gray-400" />
//                         <p>{maintenanceData.customer.email}</p>
//                       </div>
//                       <div className="flex items-center">
//                         <Phone className="h-4 w-4 mr-2 text-gray-400" />
//                         <p>{maintenanceData.customer.phone}</p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="w-full mt-4"
//                       onClick={() => navigate(`/admin/users/${maintenanceData.customer.id}`)}
//                     >
//                       View Customer Profile
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             <TabsContent value="history">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Request History</CardTitle>
//                   <CardDescription>Timeline of actions and updates for this maintenance request</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-6">
//                     {maintenanceData.history.map((item, index) => (
//                       <div key={index} className="flex gap-4">
//                         <div className="mt-1">
//                           <div className="bg-gray-100 rounded-full p-2">
//                             {item.action === "Request Created" ? (
//                               <FileText className="h-4 w-4 text-blue-500" />
//                             ) : (
//                               <Clock className="h-4 w-4 text-gray-500" />
//                             )}
//                           </div>
//                         </div>
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-2">
//                             <p className="font-medium">{item.action}</p>
//                             <Badge variant="outline" className="text-xs">
//                               {formatDateTime(item.date)}
//                             </Badge>
//                           </div>
//                           <p className="text-sm text-gray-500">By: {item.user}</p>
//                           <p className="text-sm">{item.notes}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="messages">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Customer Communication</CardTitle>
//                   <CardDescription>Messages exchanged regarding this maintenance request</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
//                     {maintenanceData.messages.map((message) => (
//                       <div
//                         key={message.id}
//                         className={`flex ${message.from === "admin" ? "justify-end" : "justify-start"}`}
//                       >
//                         <div
//                           className={`max-w-[80%] rounded-lg p-3 ${
//                             message.from === "admin" ? "bg-black text-white" : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           <p className="text-sm">{message.message}</p>
//                           <p className="text-xs mt-1 opacity-70">{formatDateTime(message.date)}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="flex gap-2">
//                     <Textarea
//                       placeholder="Type your message here..."
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       className="flex-1"
//                     />
//                     <Button onClick={handleSendMessage} className="self-end">
//                       <Send className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* Right Column - Status and Actions */}
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Request Status</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center gap-2">
//                 {getStatusIcon(maintenanceData.status)}
//                 <span className="font-medium capitalize">{maintenanceData.status}</span>
//               </div>

//               <Separator />

//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Request ID:</span>
//                   <span className="font-mono">{maintenanceData.id}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Created:</span>
//                   <span>{formatDateTime(maintenanceData.history[0].date)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Scheduled:</span>
//                   <span>{formatDateTime(maintenanceData.date)}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <Button className="w-full" variant="outline" onClick={() => setActiveTab("messages")}>
//                 <MessageSquare className="mr-2 h-4 w-4" />
//                 Message Customer
//               </Button>
//               <Button className="w-full" variant="outline">
//                 <Calendar className="mr-2 h-4 w-4" />
//                 Reschedule Appointment
//               </Button>
//               <Button className="w-full" variant="outline">
//                 <User className="mr-2 h-4 w-4" />
//                 Assign Technician
//               </Button>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Notes</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Textarea placeholder="Add internal notes about this request..." className="min-h-[100px]" />
//               <Button className="w-full mt-2">Save Notes</Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
