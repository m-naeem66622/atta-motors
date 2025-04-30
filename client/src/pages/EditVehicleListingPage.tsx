import type React from "react";
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { VehicleListingForm } from "@/components";
import { useAppDispatch, useAppState } from "@/hooks";
import { AppRoutes } from "@/router";
import { updateVehicle, fetchVehicleById } from "@/redux/store";

export const EditVehicleListingPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoading, foundVehicle } = useAppState().vehicles;

    useEffect(() => {
        const loadVehicle = async () => {
            if (id) {
                const result = await dispatch(fetchVehicleById(id));
                if (result.meta.requestStatus === "fulfilled") {
                    console.log("Loaded:", result.payload);
                }
            }
        };
        loadVehicle();
    }, [id]);

    const handleUpdate = async (values: any, images: any) => {
        const result = await dispatch(
            updateVehicle({ id: id, ...values, images })
        );
        if (result.meta.requestStatus === "fulfilled") {
            navigate(AppRoutes.vehicleSales);
        }
    };

    if (isLoading) return <Loader2 size={64} className="animate-spin m-auto" />;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                <Link to="/admin/vehicles">
                    <Button
                        variant="ghost"
                        className="mb-6 text-black hover:text-gray-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Vehicle Sales
                    </Button>
                </Link>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-600 to-orange-800 p-4 text-white px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">
                            Edit Vehicle Listing
                        </h1>
                        <p className="text-gray-300">
                            Update the details of your vehicle
                        </p>
                    </div>

                    <div className="p-6">
                        {!!foundVehicle && (
                            <VehicleListingForm
                                initialValues={{
                                    ...foundVehicle,
                                    year: foundVehicle.year.toString(),
                                    price: foundVehicle.price.toString(),
                                    mileage: foundVehicle.mileage?.toString(),
                                }}
                                isEditMode={true}
                                onSubmitOverride={handleUpdate}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
