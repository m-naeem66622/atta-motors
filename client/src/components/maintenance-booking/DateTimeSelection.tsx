import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, Clock, Sun, Cloud, Moon } from "lucide-react";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { FormValues, unavailableDates, timeSlotAvailability } from "./types";

export const DateTimeSelection = () => {
    const form = useFormContext<FormValues>();
    const [selectedTimeOfDay, setSelectedTimeOfDay] =
        useState<string>("morning");
    const watchAppointmentDate = form.watch("appointmentDate");

    // Function to check if a date is unavailable
    const isDateUnavailable = (date: Date) => {
        return unavailableDates.some((unavailableDate) =>
            isSameDay(date, unavailableDate)
        );
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium mb-2">
                    Schedule Your Appointment
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    Select your preferred date and time for the maintenance
                    service
                </p>

                {/* Date and Time Selection in a side-by-side layout on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Date Selection */}
                    <div className="bg-white border rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="p-4 border-b">
                            <FormLabel className="text-base font-medium">
                                Select a Date
                            </FormLabel>
                            <FormDescription>
                                Choose an available date for your appointment
                            </FormDescription>
                        </div>

                        <div className="p-4 flex-grow flex flex-col">
                            <FormField
                                control={form.control}
                                name="appointmentDate"
                                render={({ field }) => (
                                    <FormItem className="flex-grow flex flex-col">
                                        <FormControl>
                                            <div className="flex-grow flex flex-col items-center justify-center">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date <
                                                            new Date(
                                                                new Date().setHours(
                                                                    0,
                                                                    0,
                                                                    0,
                                                                    0
                                                                )
                                                            ) ||
                                                        date.getDay() === 0 || // Disable Sundays
                                                        isDateUnavailable(date)
                                                    }
                                                    className="mx-auto"
                                                    modifiers={{
                                                        booked: unavailableDates,
                                                    }}
                                                    modifiersStyles={{
                                                        booked: {
                                                            backgroundColor:
                                                                "#FEE2E2",
                                                            color: "#EF4444",
                                                            opacity: 0.5,
                                                        },
                                                    }}
                                                    initialFocus
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Legend moved below the calendar */}
                            <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-black rounded-full mr-2"></div>
                                    <span>Selected</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded-full mr-2"></div>
                                    <span>Unavailable</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full mr-2"></div>
                                    <span>Available</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
                        <div className="p-4 border-b">
                            <FormLabel className="text-base font-medium">
                                Select a Time
                            </FormLabel>
                            <FormDescription>
                                Choose an available time slot
                            </FormDescription>
                        </div>

                        <div className="flex-grow flex flex-col">
                            <div className="grid grid-cols-3 border-b">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedTimeOfDay("morning")
                                    }
                                    className={`flex flex-col items-center justify-center py-3 transition-colors ${
                                        selectedTimeOfDay === "morning"
                                            ? "bg-black text-white"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <Sun className="h-5 w-5 mb-1" />
                                    <span className="text-sm font-medium">
                                        Morning
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedTimeOfDay("afternoon")
                                    }
                                    className={`flex flex-col items-center justify-center py-3 transition-colors ${
                                        selectedTimeOfDay === "afternoon"
                                            ? "bg-black text-white"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <Cloud className="h-5 w-5 mb-1" />
                                    <span className="text-sm font-medium">
                                        Afternoon
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedTimeOfDay("evening")
                                    }
                                    className={`flex flex-col items-center justify-center py-3 transition-colors ${
                                        selectedTimeOfDay === "evening"
                                            ? "bg-black text-white"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <Moon className="h-5 w-5 mb-1" />
                                    <span className="text-sm font-medium">
                                        Evening
                                    </span>
                                </button>
                            </div>

                            <div className="p-4 flex-grow">
                                <FormField
                                    control={form.control}
                                    name="appointmentTime"
                                    render={({ field }) => (
                                        <FormItem className="h-full">
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-2 gap-3 h-full"
                                                >
                                                    {timeSlotAvailability[
                                                        selectedTimeOfDay as keyof typeof timeSlotAvailability
                                                    ].map((slot, index) => (
                                                        <div key={index}>
                                                            <RadioGroupItem
                                                                value={
                                                                    slot.time
                                                                }
                                                                id={`time-${slot.time}`}
                                                                className="peer sr-only"
                                                                disabled={
                                                                    !slot.available
                                                                }
                                                            />
                                                            <label
                                                                htmlFor={`time-${slot.time}`}
                                                                className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                                                                    !slot.available
                                                                        ? "opacity-50 cursor-not-allowed bg-gray-50"
                                                                        : "peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-gray-50 hover:bg-gray-50"
                                                                }`}
                                                            >
                                                                <Clock className="h-4 w-4 mb-1" />
                                                                <span className="text-sm font-medium">
                                                                    {slot.time}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {slot.available
                                                                        ? "Available"
                                                                        : "Booked"}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected Appointment Summary */}
                {watchAppointmentDate && form.watch("appointmentTime") && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
                        <h4 className="font-medium mb-2">
                            Your Selected Appointment
                        </h4>
                        <div className="flex items-center text-sm">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <span>
                                {format(
                                    watchAppointmentDate,
                                    "EEEE, MMMM d, yyyy"
                                )}
                            </span>
                        </div>
                        <div className="flex items-center text-sm mt-1">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{form.watch("appointmentTime")}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
