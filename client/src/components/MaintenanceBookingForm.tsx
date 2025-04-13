import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
    bookingSchema,
    FormValues,
    MaintenanceBookingFormProps,
    ServiceSelection,
    DateTimeSelection,
    VehicleInformation,
    ContactInformation,
    SuccessConfirmation,
} from "./maintenance-booking";

export const MaintenanceBookingForm: React.FC<MaintenanceBookingFormProps> = ({
    onCancel,
    maintenanceTypes,
    initialServiceType = "",
}) => {
    const [step, setStep] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>("1");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

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
        if (initialServiceType) {
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
        setIsSubmitting(true);

        try {
            // Here you would typically handle the form submission to your backend
            console.log(values);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Show success message
            setIsSuccess(true);

            // Redirect after a delay
            setTimeout(() => {
                onCancel();
            }, 3000);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <SuccessConfirmation
                onCancel={onCancel}
                maintenanceTypes={maintenanceTypes}
            />
        );
    }

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
                                disabled={isSubmitting}
                                className="min-w-[120px]"
                            >
                                {isSubmitting
                                    ? "Submitting..."
                                    : "Book Appointment"}
                                {!isSubmitting && (
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
