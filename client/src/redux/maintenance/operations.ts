import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/utils/handleApiResponse";
import type {
    MaintenanceAppointment,
    MaintenanceResponse,
    MaintenanceHistoryResponse,
    MaintenanceAvailabilityResponse,
} from "@/d";
import type { FormValues as MaintenanceFormValues } from "@/components/maintenance-booking/types";

// Admin operations
// Get all maintenance appointments (admin only)
export const getAllMaintenanceAppointments = createAsyncThunk<
    MaintenanceHistoryResponse,
    | {
          status?: string;
          dateFrom?: string;
          dateTo?: string;
          search?: string;
          page?: number;
          limit?: number;
      }
    | undefined
>("maintenance/admin/getAll", async (params = {}, { rejectWithValue }) => {
    try {
        const queryParams = new URLSearchParams();
        if (params.status && params.status !== "all") {
            queryParams.append("status", params.status);
        }
        if (params.dateFrom) {
            queryParams.append("dateFrom", params.dateFrom);
        }
        if (params.dateTo) {
            queryParams.append("dateTo", params.dateTo);
        }
        if (params.search) {
            queryParams.append("search", params.search);
        }
        if (params.page) {
            queryParams.append("page", params.page.toString());
        }
        if (params.limit) {
            queryParams.append("limit", params.limit.toString());
        }

        const response: AxiosResponse<MaintenanceHistoryResponse> =
            await axios.get(
                `api/maintenance/admin/all?${queryParams.toString()}`
            );
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "fetch",
            resourceType: "maintenance appointments",
            defaultMessage: "Failed to fetch maintenance appointments",
        });
        return rejectWithValue(error);
    }
});

// Update maintenance appointment (admin)
export const updateMaintenanceAppointment = createAsyncThunk<
    MaintenanceResponse,
    {
        id: string;
        data: {
            status?: string;
            technician?: string;
            cost?: string;
            notes?: string;
        };
    }
>("maintenance/admin/update", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<MaintenanceResponse> = await axios.patch(
            `api/maintenance/${id}`,
            data
        );

        toast({
            title: "Success",
            description: "Maintenance appointment updated successfully!",
        });
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "update",
            resourceType: "maintenance appointment",
            defaultMessage: "Failed to update maintenance appointment",
        });
        return rejectWithValue(error);
    }
});

// Get admin overview stats
export const getAdminOverviewStats = createAsyncThunk<
    any, // Using any here since we didn't define the exact type
    void
>("maintenance/admin/overview", async (_, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `api/maintenance/admin/overview`
        );
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "fetch",
            resourceType: "admin overview",
            defaultMessage: "Failed to fetch admin overview statistics",
        });
        return rejectWithValue(error);
    }
});

// Create new maintenance appointment
export const createMaintenanceAppointment = createAsyncThunk<
    MaintenanceResponse,
    MaintenanceFormValues
>("maintenance/create", async (appointmentData, { rejectWithValue }) => {
    try {
        // Transform the form data to match the backend's expected format
        const formattedData = {
            maintenanceType: appointmentData.maintenanceType,
            specificService: appointmentData.specificService,
            appointmentDate: appointmentData.appointmentDate,
            appointmentTime: appointmentData.appointmentTime,
            vehicle: {
                make: appointmentData.vehicleMake,
                model: appointmentData.vehicleModel,
                year: appointmentData.vehicleYear,
                registration: appointmentData.vehicleRegistration,
            },
            customer: {
                name: appointmentData.name,
                email: appointmentData.email,
                phone: appointmentData.phone,
            },
            additionalNotes: appointmentData.additionalNotes || "",
        };

        const response: AxiosResponse<MaintenanceResponse> = await axios.post(
            "api/maintenance",
            formattedData
        );

        toast({
            title: "Success",
            description: "Maintenance appointment booked successfully!",
        });
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "create",
            resourceType: "maintenance appointment",
            defaultMessage: "Failed to book maintenance appointment",
        });
        return rejectWithValue(error);
    }
});

// Get maintenance history
export const getMaintenanceHistory = createAsyncThunk<
    MaintenanceHistoryResponse,
    { status?: string } | undefined
>("maintenance/getHistory", async (params = {}, { rejectWithValue }) => {
    try {
        const queryParams = new URLSearchParams();
        if (params.status) {
            queryParams.append("status", params.status);
        }

        const response: AxiosResponse<MaintenanceHistoryResponse> =
            await axios.get(
                `api/maintenance/history?${queryParams.toString()}`
            );
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "fetch",
            resourceType: "maintenance history",
            defaultMessage: "Failed to fetch maintenance history",
        });
        return rejectWithValue(error);
    }
});

// Get a single maintenance appointment
export const getMaintenanceAppointment = createAsyncThunk<
    { data: MaintenanceAppointment },
    string
>("maintenance/getById", async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<{ data: MaintenanceAppointment }> =
            await axios.get(`api/maintenance/${id}`);
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "fetch",
            resourceType: "maintenance appointment",
            defaultMessage: "Failed to fetch maintenance appointment",
        });
        return rejectWithValue(error);
    }
});

// Cancel a maintenance appointment
export const cancelMaintenanceAppointment = createAsyncThunk<
    { data: MaintenanceAppointment },
    string
>("maintenance/cancel", async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<{ data: MaintenanceAppointment }> =
            await axios.delete(`api/maintenance/${id}/cancel`);

        toast({
            title: "Success",
            description: "Appointment cancelled successfully!",
        });
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "cancel",
            resourceType: "maintenance appointment",
            defaultMessage: "Failed to cancel appointment",
        });
        return rejectWithValue(error);
    }
});

// Check appointment availability
export const checkAppointmentAvailability = createAsyncThunk<
    MaintenanceAvailabilityResponse,
    string
>("maintenance/checkAvailability", async (date, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<MaintenanceAvailabilityResponse> =
            await axios.get(`api/maintenance/availability?date=${date}`);
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "check",
            resourceType: "appointment availability",
            defaultMessage: "Failed to check appointment availability",
        });
        return rejectWithValue(error);
    }
});
