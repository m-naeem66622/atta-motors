"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { X, Upload, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

// Generate years from 1990 to current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1989 }, (_, i) =>
    (currentYear - i).toString()
);

// Form schema
const vehicleSchema = z.object({
    // Basic Information
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.string().min(1, "Year is required"),
    price: z.string().min(1, "Price is required"),

    // Vehicle Details
    mileage: z.string().min(1, "Mileage is required"),
    fuelType: z.string().min(1, "Fuel type is required"),
    transmission: z.string().min(1, "Transmission is required"),
    condition: z.string().min(1, "Condition is required"),
    exteriorColor: z.string().min(1, "Exterior color is required"),
    interiorColor: z.string().min(1, "Interior color is required"),

    // Description
    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(100, "Title must be less than 100 characters"),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters"),

    // Contact Information
    location: z.string().min(1, "Location is required"),
    contactPhone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    contactEmail: z.string().email("Invalid email address"),
    preferredContact: z.string().min(1, "Preferred contact method is required"),
});

type FormValues = z.infer<typeof vehicleSchema>;

interface VehicleListingFormProps {
    onClose: () => void;
}

const VehicleListingForm: React.FC<VehicleListingFormProps> = ({ onClose }) => {
    const [step, setStep] = useState<number>(1);
    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<string>("1");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            make: "",
            model: "",
            year: currentYear.toString(),
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages((prev) => [...prev, ...newFiles]);

            // Create URLs for preview
            const newUrls = newFiles.map((file) => URL.createObjectURL(file));
            setImageUrls((prev) => [...prev, ...newUrls]);
        }
    };

    const removeImage = (index: number) => {
        // Revoke the URL to prevent memory leaks
        URL.revokeObjectURL(imageUrls[index]);

        setImages((prev) => prev.filter((_, i) => i !== index));
        setImageUrls((prev) => prev.filter((_, i) => i !== index));
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

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);

        try {
            // Here you would typically handle the form submission
            console.log(values);
            console.log("Images:", images);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Show success message
            setIsSuccess(true);

            // Redirect after a delay
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="py-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                    Listing Created Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                    Your vehicle has been listed for sale.
                </p>
                <Button onClick={onClose}>Return to Vehicle Sales</Button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="1" onClick={() => setStep(1)}>
                        Basic Info
                    </TabsTrigger>
                    <TabsTrigger value="2" onClick={() => setStep(2)}>
                        Vehicle Details
                    </TabsTrigger>
                    <TabsTrigger value="3" onClick={() => setStep(3)}>
                        Photos
                    </TabsTrigger>
                    <TabsTrigger value="4" onClick={() => setStep(4)}>
                        Contact Info
                    </TabsTrigger>
                </TabsList>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <TabsContent value="1">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Listing Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 2020 Toyota Camry XSE - Excellent Condition"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Create a descriptive title for
                                                your listing
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="make"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Make</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Toyota"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="model"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Model</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Camry"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="year"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select year" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {years.map((year) => (
                                                            <SelectItem
                                                                key={year}
                                                                value={year}
                                                            >
                                                                {year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price ($)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g. 25000"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="2">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="mileage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mileage</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g. 35000"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="fuelType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fuel Type</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select fuel type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Gasoline">
                                                            Gasoline
                                                        </SelectItem>
                                                        <SelectItem value="Diesel">
                                                            Diesel
                                                        </SelectItem>
                                                        <SelectItem value="Electric">
                                                            Electric
                                                        </SelectItem>
                                                        <SelectItem value="Hybrid">
                                                            Hybrid
                                                        </SelectItem>
                                                        <SelectItem value="Plug-in Hybrid">
                                                            Plug-in Hybrid
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="transmission"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Transmission
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select transmission" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Automatic">
                                                            Automatic
                                                        </SelectItem>
                                                        <SelectItem value="Manual">
                                                            Manual
                                                        </SelectItem>
                                                        <SelectItem value="CVT">
                                                            CVT
                                                        </SelectItem>
                                                        <SelectItem value="Semi-Automatic">
                                                            Semi-Automatic
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="condition"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Condition</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select condition" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="New">
                                                            New
                                                        </SelectItem>
                                                        <SelectItem value="Like New">
                                                            Like New
                                                        </SelectItem>
                                                        <SelectItem value="Excellent">
                                                            Excellent
                                                        </SelectItem>
                                                        <SelectItem value="Good">
                                                            Good
                                                        </SelectItem>
                                                        <SelectItem value="Fair">
                                                            Fair
                                                        </SelectItem>
                                                        <SelectItem value="Poor">
                                                            Poor
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="exteriorColor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Exterior Color
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Pearl White"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="interiorColor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Interior Color
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Black Leather"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe your vehicle in detail. Include features, modifications, maintenance history, and any other relevant information."
                                                    className="min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Minimum 20 characters. Be honest
                                                about the condition of your
                                                vehicle.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="3">
                            <div className="space-y-6">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <div className="mb-4">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                            Upload Vehicle Photos
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB each. First
                                            image will be the main photo.
                                        </p>
                                    </div>
                                    <label className="cursor-pointer">
                                        <Button type="button" variant="outline">
                                            Select Files
                                        </Button>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>

                                {imageUrls.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold mb-2">
                                            Uploaded Photos ({imageUrls.length})
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {imageUrls.map((url, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group"
                                                >
                                                    <img
                                                        src={
                                                            url ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={`Vehicle photo ${index + 1}`}
                                                        className="h-24 w-full object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImage(index)
                                                        }
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                    {index === 0 && (
                                                        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                            Main
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {imageUrls.length === 0 && (
                                    <Alert>
                                        <AlertDescription>
                                            Listings with photos receive up to
                                            5x more inquiries. We recommend
                                            uploading at least 5 photos of your
                                            vehicle.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="4">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. San Francisco, CA"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                City and state where the vehicle
                                                is located
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="contactPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Phone Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. +1234567890"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contactEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. your@email.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="preferredContact"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Preferred Contact Method
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select preferred contact method" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="phone">
                                                        Phone
                                                    </SelectItem>
                                                    <SelectItem value="email">
                                                        Email
                                                    </SelectItem>
                                                    <SelectItem value="both">
                                                        Both Phone and Email
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Alert>
                                    <AlertDescription>
                                        By submitting this listing, you confirm
                                        that all information provided is
                                        accurate and that you are the owner of
                                        this vehicle or authorized to sell it.
                                    </AlertDescription>
                                </Alert>
                            </div>
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                            )}

                            {step < 4 ? (
                                <Button type="button" onClick={nextStep}>
                                    Next{" "}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="min-w-[120px]"
                                >
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Submit Listing"}
                                    {!isSubmitting && (
                                        <Check className="ml-2 h-4 w-4" />
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

export default VehicleListingForm;
