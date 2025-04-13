import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VehicleFormValues } from "@/components/vehicle-form";

interface VehicleDetailsTabProps {
    form: UseFormReturn<VehicleFormValues>;
}

export const VehicleDetailsTab: React.FC<VehicleDetailsTabProps> = ({
    form,
}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Vehicle Details</h2>
            <p className="text-gray-500">
                Provide specific details about your vehicle's specifications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mileage</FormLabel>
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

                <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transmission</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select transmission type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {["Automatic", "Manual", "CVT"].map(
                                        (transmission) => (
                                            <SelectItem
                                                key={transmission}
                                                value={transmission}
                                            >
                                                {transmission}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fuel Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select fuel type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {[
                                        "Petrol",
                                        "Diesel",
                                        "Hybrid",
                                        "Electric",
                                        "CNG",
                                    ].map((fuelType) => (
                                        <SelectItem
                                            key={fuelType}
                                            value={fuelType}
                                        >
                                            {fuelType}
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
                    name="condition"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select vehicle condition" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {[
                                        "New",
                                        "Like New",
                                        "Excellent",
                                        "Good",
                                        "Fair",
                                        "Salvage",
                                    ].map((condition) => (
                                        <SelectItem
                                            key={condition}
                                            value={condition}
                                        >
                                            {condition}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="exteriorColor"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Exterior Color</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Black, White, Silver"
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
                            <FormLabel>Interior Color</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Black, Tan, Gray"
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
                            Minimum 20 characters. Be honest about the condition
                            of your vehicle.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
