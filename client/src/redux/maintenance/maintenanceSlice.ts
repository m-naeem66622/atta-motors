import { createSlice } from "@reduxjs/toolkit";
import type { MaintenanceState } from "@/d";
import {
    createMaintenanceAppointment,
    getMaintenanceHistory,
    getMaintenanceAppointment,
    cancelMaintenanceAppointment,
    checkAppointmentAvailability,
    getAllMaintenanceAppointments,
    updateMaintenanceAppointment,
} from "./operations";

const initialState: MaintenanceState = {
    appointments: [],
    currentAppointment: null,
    availability: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    error: null,
    meta: null,
};

const maintenanceSlice = createSlice({
    name: "maintenance",
    initialState,
    reducers: {
        clearMaintenanceError: (state) => {
            state.error = null;
        },
        clearCurrentAppointment: (state) => {
            state.currentAppointment = null;
        },
    },
    extraReducers: (builder) => {
        // Create maintenance appointment
        builder
            .addCase(createMaintenanceAppointment.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(
                createMaintenanceAppointment.fulfilled,
                (state, action) => {
                    state.isCreating = false;
                    state.currentAppointment = action.payload.data;
                }
            )
            .addCase(createMaintenanceAppointment.rejected, (state, action) => {
                state.isCreating = false;
                state.error =
                    action.error.message || "Failed to create appointment";
            });

        // Get maintenance history
        builder
            .addCase(getMaintenanceHistory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getMaintenanceHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appointments = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(getMaintenanceHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message ||
                    "Failed to fetch maintenance history";
            });

        // Get maintenance appointment by ID
        builder
            .addCase(getMaintenanceAppointment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getMaintenanceAppointment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentAppointment = action.payload.data;
            })
            .addCase(getMaintenanceAppointment.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message ||
                    "Failed to fetch appointment details";
            });

        // Cancel maintenance appointment
        builder
            .addCase(cancelMaintenanceAppointment.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(
                cancelMaintenanceAppointment.fulfilled,
                (state, action) => {
                    state.isUpdating = false;
                    // Update the current appointment if it's the same one
                    if (
                        state.currentAppointment &&
                        state.currentAppointment._id === action.payload.data._id
                    ) {
                        state.currentAppointment = action.payload.data;
                    }
                    // Update in the list if present
                    state.appointments = state.appointments.map((appointment) =>
                        appointment._id === action.payload.data._id
                            ? action.payload.data
                            : appointment
                    );
                }
            )
            .addCase(cancelMaintenanceAppointment.rejected, (state, action) => {
                state.isUpdating = false;
                state.error =
                    action.error.message || "Failed to cancel appointment";
            });

        // Check appointment availability
        builder
            .addCase(checkAppointmentAvailability.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                checkAppointmentAvailability.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.availability = {
                        date: action.payload.data.date,
                        slots: action.payload.data.availability,
                    };
                }
            )
            .addCase(checkAppointmentAvailability.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message ||
                    "Failed to check appointment availability";
            });

        // Get all maintenance appointments (admin)
        builder
            .addCase(getAllMaintenanceAppointments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                getAllMaintenanceAppointments.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.appointments = action.payload.data;
                    state.meta = action.payload.meta;
                }
            )
            .addCase(
                getAllMaintenanceAppointments.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error =
                        action.error.message ||
                        "Failed to fetch maintenance appointments";
                }
            );

        // Update maintenance appointment (admin)
        builder
            .addCase(updateMaintenanceAppointment.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(
                updateMaintenanceAppointment.fulfilled,
                (state, action) => {
                    state.isUpdating = false;
                    // Update the current appointment if it's the same one
                    if (
                        state.currentAppointment &&
                        state.currentAppointment._id === action.payload.data._id
                    ) {
                        state.currentAppointment = action.payload.data;
                    }
                    // Update in the list if present
                    state.appointments = state.appointments.map((appointment) =>
                        appointment._id === action.payload.data._id
                            ? action.payload.data
                            : appointment
                    );
                }
            )
            .addCase(updateMaintenanceAppointment.rejected, (state, action) => {
                state.isUpdating = false;
                state.error =
                    action.error.message || "Failed to update appointment";
            });
    },
});

export const { clearMaintenanceError, clearCurrentAppointment } =
    maintenanceSlice.actions;
export default maintenanceSlice.reducer;
