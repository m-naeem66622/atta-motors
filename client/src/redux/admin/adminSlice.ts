import { createSlice } from "@reduxjs/toolkit";
import type { AdminState } from "@/d";
import { getAdminOverview } from "./operations";

const initialState: AdminState = {
    overview: {
        totalVehicles: 0,
        maintenanceRequests: 0,
        activeUsers: 0,
        pendingApprovals: 0,
        recentAppointments: [],
        recentVehicles: [],
        recentUsers: [],
    },
    maintenanceAppointments: [],
    isLoading: false,
    isUpdating: false,
    error: null,
    meta: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Get admin overview
        builder
            .addCase(getAdminOverview.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAdminOverview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.overview = action.payload.data;
            })
            .addCase(getAdminOverview.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || "Failed to fetch admin overview";
            });
    },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
