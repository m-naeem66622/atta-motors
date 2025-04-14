import type React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, XCircle, User, DollarSign, Loader2 } from "lucide-react";
import { useAppDispatch, useAppState } from "@/hooks";
import {
    getMaintenanceHistory,
    cancelMaintenanceAppointment,
} from "@/redux/store";
import { toast } from "@/hooks/use-toast";
export const MaintenanceHistory: React.FC = () => {
    const [activeTab, setActiveTab] = useState("all");
    const dispatch = useAppDispatch();
    const { maintenance } = useAppState();
    const [isCancelling, setIsCancelling] = useState<string | null>(null);

    // Fetch maintenance history on component mount and when tab changes
    useEffect(() => {
        const status =
            activeTab === "all"
                ? undefined
                : activeTab === "completed"
                ? "Completed"
                : "Scheduled";

        dispatch(getMaintenanceHistory({ status }));
    }, [dispatch, activeTab]);

    const handleCancelAppointment = async (appointmentId: string) => {
        try {
            setIsCancelling(appointmentId);
            await dispatch(
                cancelMaintenanceAppointment(appointmentId)
            ).unwrap();
            toast({
                title: "Success",
                description: "Appointment cancelled successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to cancel appointment",
                variant: "destructive",
            });
        } finally {
            setIsCancelling(null);
        }
    };

    // Format the appointment date for display
    const formatAppointmentDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMMM d, yyyy");
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Maintenance History</h2>
                <Tabs
                    defaultValue="all"
                    onValueChange={setActiveTab}
                    className="w-[400px]"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {maintenance.isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">
                        Loading maintenance history...
                    </span>
                </div>
            ) : maintenance.appointments.length > 0 ? (
                <div className="space-y-4">
                    {maintenance.appointments.map((appointment) => (
                        <Card key={appointment._id} className="overflow-hidden">
                            <CardHeader className="pb-2 flex flex-row justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">
                                        {appointment.specificService}
                                    </CardTitle>
                                    <CardDescription>
                                        {appointment.vehicle.make}{" "}
                                        {appointment.vehicle.model}{" "}
                                        {appointment.vehicle.year} •{" "}
                                        {formatAppointmentDate(
                                            appointment.appointmentDate
                                        )}
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant={
                                        appointment.status === "Completed"
                                            ? "outline"
                                            : "default"
                                    }
                                    className={
                                        appointment.status === "Completed"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : appointment.status === "Cancelled"
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : "bg-blue-500 text-white"
                                    }
                                >
                                    {appointment.status}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 mb-1">
                                            Maintenance Type
                                        </p>
                                        <div className="flex items-center">
                                            <Wrench className="h-4 w-4 mr-2 text-gray-400" />
                                            {appointment.maintenanceType}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">
                                            Technician
                                        </p>
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-2 text-gray-400" />
                                            {appointment.technician ||
                                                "Not assigned yet"}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">
                                            Cost
                                        </p>
                                        <div className="flex items-center font-medium">
                                            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                            {appointment.cost
                                                ? `$${appointment.cost}`
                                                : "To be determined"}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-gray-500 mb-1">Notes</p>
                                    <p className="text-sm">
                                        {appointment.notes ||
                                            appointment.additionalNotes ||
                                            "No notes available"}
                                    </p>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mr-2"
                                    >
                                        View Details
                                    </Button>
                                    {appointment.status === "Scheduled" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 border-red-200 hover:bg-red-50"
                                            onClick={() =>
                                                handleCancelAppointment(
                                                    appointment._id
                                                )
                                            }
                                            disabled={
                                                isCancelling === appointment._id
                                            }
                                        >
                                            {isCancelling ===
                                            appointment._id ? (
                                                <>
                                                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                                    Cancelling...
                                                </>
                                            ) : (
                                                "Cancel Appointment"
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <XCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                        No maintenance records found
                    </h3>
                    <p className="text-gray-500 mb-6">
                        You don't have any{" "}
                        {activeTab !== "all" ? activeTab : ""} maintenance
                        records yet.
                    </p>
                    <Button>Book Your First Appointment</Button>
                </div>
            )}
        </div>
    );
};
