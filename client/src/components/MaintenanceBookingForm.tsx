import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppState } from "@/hooks";
import { createMaintenanceAppointment } from "@/redux/store";
import { AppRoutes } from "@/router";

import {
    bookingSchema,
    FormValues,
    MaintenanceBookingFormProps,
    ServiceSelection,
    DateTimeSelection,
    VehicleInformation,
    ContactInformation,
} from "./maintenance-booking";

export const MaintenanceBookingForm: React.FC<MaintenanceBookingFormProps> = ({
    onCancel,
    maintenanceTypes,
    initialServiceType = "",
}) => {
    const [step, setStep] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>("1");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { maintenance } = useAppState();

    // Current year for vehicle year selection for default values
    const currentYear = new Date().getFullYear();

    const form = useForm<FormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            maintenanceType: initialServiceType,
            specificService: "",
            appointmentDate: undefined,
            appointmentTime: "",
            vehicleMake: "",
            vehicleModel: "",
            vehicleYear: currentYear.toString(),
            vehicleRegistration: "",
            name: "",
            email: "",
            phone: "",
            additionalNotes: "",
        },
    });

    // Set initial service type when component mounts
    useEffect(() => {
        if (
            initialServiceType &&
            initialServiceType !== form.getValues("maintenanceType")
        ) {
            form.setValue("maintenanceType", initialServiceType);
        }
    }, [initialServiceType, form]);

    const nextStep = () => {
        if (step < 4) {
            setStep(step + 1);
            setActiveTab((step + 1).toString());
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
            setActiveTab((step - 1).toString());
            window.scrollTo(0, 0);
        }
    };

    const onSubmit = async (values: FormValues) => {
        try {
            // Submit the form data to the backend API
            const result = await dispatch(createMaintenanceAppointment(values));

            if (result.meta.requestStatus === "fulfilled") {                
                // Reset form and navigate back to maintenance page
                form.reset();
                navigate(AppRoutes.maintenance);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8 bg-gray-100">
                <TabsTrigger
                    value="1"
                    onClick={() => setStep(1)}
                    className="data-[state=active]:bg-black data-[state=active]:text-white"
                >
                    Service
                </TabsTrigger>
                <TabsTrigger
                    value="2"
                    onClick={() => setStep(2)}
                    className="data-[state=active]:bg-black data-[state=active]:text-white"
                >
                    Date & Time
                </TabsTrigger>
                <TabsTrigger
                    value="3"
                    onClick={() => setStep(3)}
                    className="data-[state=active]:bg-black data-[state=active]:text-white"
                >
                    Vehicle
                </TabsTrigger>
                <TabsTrigger
                    value="4"
                    onClick={() => setStep(4)}
                    className="data-[state=active]:bg-black data-[state=active]:text-white"
                >
                    Contact
                </TabsTrigger>
            </TabsList>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <TabsContent value="1">
                        <ServiceSelection maintenanceTypes={maintenanceTypes} />
                    </TabsContent>

                    <TabsContent value="2">
                        <DateTimeSelection />
                    </TabsContent>

                    <TabsContent value="3">
                        <VehicleInformation />
                    </TabsContent>

                    <TabsContent value="4">
                        <ContactInformation />
                    </TabsContent>

                    <div className="flex justify-between mt-8">
                        {step > 1 ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                        )}

                        {step < 4 ? (
                            <Button type="button" onClick={nextStep}>
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={maintenance.isCreating}
                                className="min-w-[120px]"
                            >
                                {maintenance.isCreating
                                    ? "Submitting..."
                                    : "Book Appointment"}
                                {!maintenance.isCreating && (
                                    <Check className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </Tabs>
    );
};
