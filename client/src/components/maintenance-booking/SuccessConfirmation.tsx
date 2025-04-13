import { format } from "date-fns";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FormValues, MaintenanceType } from "./types";
import { useFormContext } from "react-hook-form";

interface SuccessConfirmationProps {
    onCancel: () => void;
    maintenanceTypes: MaintenanceType[];
}

export const SuccessConfirmation = ({
    onCancel,
    maintenanceTypes,
}: SuccessConfirmationProps) => {
    const { getValues } = useFormContext<FormValues>();

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center bg-black text-white">
                <CardTitle className="text-2xl">
                    Appointment Confirmed!
                </CardTitle>
                <CardDescription className="text-gray-300">
                    Your maintenance appointment has been scheduled
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-4 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                    Thank You for Your Booking
                </h3>
                <p className="text-gray-600 mb-4">
                    We've sent a confirmation email with all the details of your
                    appointment.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4 inline-block mx-auto text-left">
                    <p className="font-medium">Appointment Details:</p>
                    <p className="text-sm text-gray-600">
                        {format(
                            getValues("appointmentDate"),
                            "EEEE, MMMM d, yyyy"
                        )}{" "}
                        at {getValues("appointmentTime")}
                    </p>
                    <p className="text-sm text-gray-600">
                        Service:{" "}
                        {
                            maintenanceTypes.find(
                                (t) => t.id === getValues("maintenanceType")
                            )?.title
                        }{" "}
                        - {getValues("specificService")}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
                <Button onClick={onCancel}>
                    Return to Maintenance Services
                </Button>
            </CardFooter>
        </Card>
    );
};
