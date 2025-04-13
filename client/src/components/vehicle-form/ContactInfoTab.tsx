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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { VehicleFormValues } from "@/components/vehicle-form";

interface ContactInfoTabProps {
    form: UseFormReturn<VehicleFormValues>;
}

export const ContactInfoTab: React.FC<ContactInfoTabProps> = ({ form }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Contact Information</h2>
            <p className="text-gray-500">
                Provide your contact details for potential buyers to reach you.
            </p>

            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="e.g., New York, NY"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., (555) 123-4567"
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
                            <FormLabel>Email Address (optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., your.email@example.com"
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
                    <FormItem className="space-y-3">
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="phone" id="phone" />
                                    <Label htmlFor="phone">Phone</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="email" id="email" />
                                    <Label htmlFor="email">Email</Label>
                                </div>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Alert>
                <AlertDescription>
                    By submitting this listing, you confirm that all information
                    provided is accurate and that you are the owner of this
                    vehicle or authorized to sell it.
                </AlertDescription>
            </Alert>
        </div>
    );
};
