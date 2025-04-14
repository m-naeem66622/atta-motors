import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    BasicInfoTab,
    VehicleDetailsTab,
    PhotosTab,
    ContactInfoTab,
    createVehicleSchema,
    VehicleFormValues,
} from "@/components/vehicle-form";
import { useAppDispatch, useAppState } from "@/hooks";
import { AppRoutes } from "@/router";
import { createVehicle } from "@/redux/store";

export const VehicleListingForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { vehicles } = useAppState();
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>("1");
    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const form = useForm<VehicleFormValues>({
        resolver: zodResolver(createVehicleSchema),
        defaultValues: {
            make: "",
            model: "",
            year: "",
            price: "",
            mileage: "",
            fuelType: "",
            transmission: "",
            condition: "",
            exteriorColor: "",
            interiorColor: "",
            title: "",
            description: "",
            location: "",
            contactPhone: "",
            contactEmail: "",
            preferredContact: "phone",
        },
    });

    const onSubmit = async (values: VehicleFormValues) => {
        try {
            const result = await dispatch(createVehicle({ ...values, images }));

            if (result.meta.requestStatus === "fulfilled") {
                form.reset();
                navigate(AppRoutes.vehicleSales);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

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

    return (
        <div className="w-full">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid grid-cols-4 mb-8 bg-gray-100">
                    <TabsTrigger
                        value="1"
                        onClick={() => setStep(1)}
                        className="data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                        Basic Info
                    </TabsTrigger>
                    <TabsTrigger
                        value="2"
                        onClick={() => setStep(2)}
                        className="data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                        Vehicle Details
                    </TabsTrigger>
                    <TabsTrigger
                        value="3"
                        onClick={() => setStep(3)}
                        className="data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                        Photos
                    </TabsTrigger>
                    <TabsTrigger
                        value="4"
                        onClick={() => setStep(4)}
                        className="data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                        Contact Info
                    </TabsTrigger>
                </TabsList>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <TabsContent value="1">
                            <BasicInfoTab form={form} />
                        </TabsContent>

                        <TabsContent value="2">
                            <VehicleDetailsTab form={form} />
                        </TabsContent>

                        <TabsContent value="3">
                            <PhotosTab
                                images={images}
                                setImages={setImages}
                                imageUrls={imageUrls}
                                setImageUrls={setImageUrls}
                            />
                        </TabsContent>

                        <TabsContent value="4">
                            <ContactInfoTab form={form} />
                        </TabsContent>

                        <div className="flex justify-between mt-8">
                            {step > 1 ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />{" "}
                                    Back
                                </Button>
                            ) : (
                                <Link to={AppRoutes.vehicleSales}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            )}

                            {step < 4 ? (
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        nextStep();
                                    }}
                                >
                                    Next{" "}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={vehicles.isCreating}
                                    className="min-w-[120px]"
                                >
                                    {vehicles.isCreating ? (
                                        <span className="flex items-center">
                                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white"></span>
                                            Submitting...
                                        </span>
                                    ) : (
                                        <>
                                            Submit Listing
                                            <Check className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </Tabs>
        </div>
    );
};
