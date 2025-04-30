import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { handleApiError } from "@/utils/handleApiResponse";
import type { AdminOverviewResponse } from "@/d";

// Get admin dashboard overview statistics
export const getAdminOverview = createAsyncThunk<AdminOverviewResponse, void>(
    "admin/getOverview",
    async (_, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<AdminOverviewResponse> =
                await axios.get("api/admin/overview");
            return response.data;
        } catch (error: any) {
            handleApiError(error, {
                context: "fetch",
                resourceType: "admin overview statistics",
                defaultMessage: "Failed to fetch admin overview statistics",
            });
            return rejectWithValue(error);
        }
    }
);
