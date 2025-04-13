import { useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormValues, MaintenanceType } from "./types";

interface ServiceSelectionProps {
    maintenanceTypes: MaintenanceType[];
}

export const ServiceSelection = ({
    maintenanceTypes,
}: ServiceSelectionProps) => {
    const form = useFormContext<FormValues>();
    const watchMaintenanceType = form.watch("maintenanceType");

    // Get services for selected maintenance type
    const getServicesForType = (typeId: string) => {
        const selectedType = maintenanceTypes.find(
            (type) => type.id === typeId
        );
        return selectedType ? selectedType.services : [];
    };

    return (
        <div className="space-y-6">
            <FormField
                control={form.control}
                name="maintenanceType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Maintenance Type</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    // Reset specific service when maintenance type changes
                                    form.setValue("specificService", "");
                                }}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {maintenanceTypes.map((type) => (
                                    <div key={type.id}>
                                        <RadioGroupItem
                                            value={type.id}
                                            id={type.id}
                                            className="peer sr-only"
                                        />
                                        <label
                                            htmlFor={type.id}
                                            className="flex flex-col h-full p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-gray-50 hover:bg-gray-50 transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium">
                                                    {type.title}
                                                </span>
                                                <div className="text-sm text-gray-600">
                                                    {type.price}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {type.description}
                                            </p>
                                            <div className="text-xs text-gray-500 mt-auto">
                                                Estimated time:{" "}
                                                {type.estimatedTime}
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {watchMaintenanceType && (
                <FormField
                    control={form.control}
                    name="specificService"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Specific Service</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a specific service" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {getServicesForType(
                                        watchMaintenanceType
                                    ).map((service, index) => (
                                        <SelectItem key={index} value={service}>
                                            {service}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Choose the specific service you need from the
                                selected maintenance category
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
};
