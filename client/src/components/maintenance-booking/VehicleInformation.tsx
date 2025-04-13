import { useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormValues } from "./types";

export const VehicleInformation = () => {
    const form = useFormContext<FormValues>();

    // Current year for vehicle year selection
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) =>
        (currentYear - i).toString()
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="vehicleMake"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vehicle Make</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Toyota" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="vehicleModel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vehicle Model</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Camry" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="vehicleYear"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vehicle Year</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year}>
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
                    name="vehicleRegistration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Registration Number</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. ABC123" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};
