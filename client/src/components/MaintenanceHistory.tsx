import type React from "react";
import { useState } from "react";
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
import { Wrench, XCircle, User, DollarSign } from "lucide-react";

// Mock data for maintenance history
const maintenanceHistory = [
    {
        id: 1,
        date: "October 15, 2023",
        type: "Routine Maintenance",
        service: "Oil Change & Filter Replacement",
        status: "Completed",
        technician: "Michael Johnson",
        cost: "$95.00",
        notes: "Changed oil and filter, topped up all fluids, performed multi-point inspection.",
        vehicle: "2020 Toyota Camry",
    },
    {
        id: 2,
        date: "August 3, 2023",
        type: "Mechanical Maintenance",
        service: "Brake System Repair",
        status: "Completed",
        technician: "Robert Smith",
        cost: "$320.00",
        notes: "Replaced front brake pads and rotors, performed brake fluid flush.",
        vehicle: "2020 Toyota Camry",
    },
    {
        id: 3,
        date: "May 22, 2023",
        type: "Electrical Maintenance",
        service: "Battery Replacement",
        status: "Completed",
        technician: "Sarah Williams",
        cost: "$175.00",
        notes: "Replaced battery and tested charging system.",
        vehicle: "2020 Toyota Camry",
    },
    {
        id: 4,
        date: "November 10, 2023",
        type: "Computerized Maintenance",
        service: "ECU Programming",
        status: "Scheduled",
        technician: "David Chen",
        cost: "Estimate: $150.00",
        notes: "Scheduled for ECU update and diagnostics.",
        vehicle: "2020 Toyota Camry",
    },
];

export const MaintenanceHistory: React.FC = () => {
    const [activeTab, setActiveTab] = useState("all");

    const filteredHistory =
        activeTab === "all"
            ? maintenanceHistory
            : maintenanceHistory.filter((item) =>
                  activeTab === "completed"
                      ? item.status === "Completed"
                      : item.status === "Scheduled"
              );

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

            {filteredHistory.length > 0 ? (
                <div className="space-y-4">
                    {filteredHistory.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <CardHeader className="pb-2 flex flex-row justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">
                                        {item.service}
                                    </CardTitle>
                                    <CardDescription>
                                        {item.vehicle} • {item.date}
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant={
                                        item.status === "Completed"
                                            ? "outline"
                                            : "default"
                                    }
                                    className={
                                        item.status === "Completed"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-blue-500 text-white"
                                    }
                                >
                                    {item.status}
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
                                            {item.type}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">
                                            Technician
                                        </p>
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-2 text-gray-400" />
                                            {item.technician}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">
                                            Cost
                                        </p>
                                        <div className="flex items-center font-medium">
                                            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                            {item.cost}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-gray-500 mb-1">Notes</p>
                                    <p className="text-sm">{item.notes}</p>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mr-2"
                                    >
                                        View Details
                                    </Button>
                                    {item.status === "Scheduled" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 border-red-200 hover:bg-red-50"
                                        >
                                            Cancel Appointment
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
