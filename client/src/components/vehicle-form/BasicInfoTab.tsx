import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VehicleFormValues } from "@/components/vehicle-form";

interface BasicInfoTabProps {
    form: UseFormReturn<VehicleFormValues>;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
                Vehicle Basic Information
            </h2>
            <p className="text-gray-500">
                Enter the basic details about your vehicle.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Toyota, Honda, Ford"
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
                                    placeholder="e.g., Camry, Civic, F-150"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g., 2022"
                                    min="1900"
                                    max={new Date().getFullYear().toString()}
                                    {...field}
                                />
                            </FormControl>
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
                                    placeholder="e.g., 25000"
                                    min="0"
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
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Listing Title</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="e.g., 2022 Toyota Camry XSE - Low Miles, Excellent Condition"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
