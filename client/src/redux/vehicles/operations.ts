import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { VehicleResponse, VehiclesResponse, SearchParams } from "@/d";
import { VehicleFormValues } from "@/components/vehicle-form";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/utils";

// Fetch all vehicles with optional search params
export const fetchVehicles = createAsyncThunk<
    VehiclesResponse,
    SearchParams | undefined
>("vehicles/fetchAll", async (searchParams, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<VehiclesResponse> = await axios.get(
            "api/vehicles",
            { params: searchParams }
        );
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "fetch",
            resourceType: "vehicles",
            defaultMessage: "Failed to fetch vehicles",
        });
        return rejectWithValue(error);
    }
});

// Fetch vehicle by ID
export const fetchVehicleById = createAsyncThunk<VehicleResponse, string>(
    "vehicles/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<VehicleResponse> = await axios.get(
                `api/vehicles/${id}`
            );
            return response.data;
        } catch (error: any) {
            handleApiError(error, {
                context: "fetch",
                resourceType: "vehicle",
                defaultMessage: "Failed to fetch vehicle",
            });
            return rejectWithValue(error);
        }
    }
);

// Create new vehicle
export const createVehicle = createAsyncThunk<
    VehicleResponse,
    VehicleFormValues & { images: File[] }
>("vehicles/create", async (vehicleData, { rejectWithValue }) => {
    const formData = new FormData();

    // Append basic info
    formData.append("make", vehicleData.make);
    formData.append("model", vehicleData.model);
    formData.append("year", vehicleData.year.toString());
    formData.append("price", vehicleData.price.toString());
    formData.append("title", vehicleData.title);

    // Append vehicle details
    if (vehicleData.mileage)
        formData.append("mileage", vehicleData.mileage.toString());
    if (vehicleData.fuelType) formData.append("fuelType", vehicleData.fuelType);
    if (vehicleData.transmission)
        formData.append("transmission", vehicleData.transmission);
    if (vehicleData.condition)
        formData.append("condition", vehicleData.condition);
    if (vehicleData.exteriorColor)
        formData.append("exteriorColor", vehicleData.exteriorColor);
    if (vehicleData.interiorColor)
        formData.append("interiorColor", vehicleData.interiorColor);
    if (vehicleData.description)
        formData.append("description", vehicleData.description);

    // Append images if present
    if (vehicleData.images && vehicleData.images.length > 0) {
        vehicleData.images.forEach((image, _) => {
            formData.append("images", image as Blob);
        });
    }

    // Append contact info
    if (vehicleData.location) formData.append("location", vehicleData.location);
    if (vehicleData.contactPhone)
        formData.append("contactPhone", vehicleData.contactPhone);
    if (vehicleData.contactEmail)
        formData.append("contactEmail", vehicleData.contactEmail);

    try {
        const response: AxiosResponse<VehicleResponse> = await axios.post(
            "api/vehicles",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        toast({
            title: "Success",
            description: "Vehicle created successfully!",
        });
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "create",
            resourceType: "vehicle",
            defaultMessage: "Failed to create vehicle listing",
        });
        return rejectWithValue(error);
    }
});

// Update vehicle
export const updateVehicle = createAsyncThunk<
    VehicleResponse,
    {
        id: string;
        data: VehicleFormValues & { images: File[]; existingImages: string[] };
    }
>("vehicles/update", async ({ id, data }, { rejectWithValue }) => {
    const formData = new FormData();

    // Append basic vehicle info
    if (data.make) formData.append("make", data.make);
    if (data.model) formData.append("model", data.model);
    if (data.year) formData.append("year", data.year.toString());
    if (data.price) formData.append("price", data.price.toString());

    // Append vehicle details
    if (data.mileage) formData.append("mileage", data.mileage.toString());
    if (data.fuelType) formData.append("fuelType", data.fuelType);
    if (data.transmission) formData.append("transmission", data.transmission);
    if (data.condition) formData.append("condition", data.condition);
    if (data.exteriorColor)
        formData.append("exteriorColor", data.exteriorColor);
    if (data.interiorColor)
        formData.append("interiorColor", data.interiorColor);
    if (data.description) formData.append("description", data.description);

    // Append existing images (as objects of cloudinary)
    // existingImages is an array of objects of cloudinary
    if (data.existingImages && data.existingImages.length > 0) {
        data.existingImages.forEach((image, index) => {
            Object.entries(image).forEach(([key, value]) => {
                formData.append(`existingImages[${index}][${key}]`, value);
            });
        });
    }

    // Append new images if present
    if (data.images && data.images.length > 0) {
        data.images.forEach((image, _) => {
            if (image instanceof Blob) {
                formData.append("images", image);
            }
        });
    }

    // Append contact info
    if (data.location) formData.append("location", data.location);
    if (data.contactPhone) formData.append("contactPhone", data.contactPhone);
    if (data.contactEmail) formData.append("contactEmail", data.contactEmail);

    try {
        const response: AxiosResponse<VehicleResponse> = await axios.patch(
            `api/vehicles/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        toast({
            title: "Success",
            description: "Vehicle updated successfully!",
        });
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "update",
            resourceType: "vehicle",
            defaultMessage: "Failed to update vehicle listing",
        });
        return rejectWithValue(error);
    }
});

// Delete vehicle
export const deleteVehicle = createAsyncThunk<void, string>(
    "vehicles/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`api/vehicles/${id}`);
            toast({
                title: "Success",
                description: "Vehicle deleted successfully!",
            });
        } catch (error: any) {
            handleApiError(error, {
                context: "delete",
                resourceType: "vehicle",
                defaultMessage: "Failed to delete vehicle listing",
            });
            return rejectWithValue(error);
        }
    }
);
