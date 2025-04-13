import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VehiclesState } from "@/d";
import { 
  fetchVehicles, 
  fetchVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle 
} from "./operations";

const initialState: VehiclesState = {
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  vehicles: [],
  foundVehicle: null,
  error: null,
  meta: null,
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    clearCurrentVehicle: (state) => {
      state.foundVehicle = null;
    },
    setSearchParams: (state, action: PayloadAction<Record<string, any>>) => {
      state.searchParams = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch vehicles
    builder.addCase(fetchVehicles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchVehicles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.vehicles = action.payload.data;
      state.meta = action.payload.meta;
    });
    builder.addCase(fetchVehicles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch vehicle by id
    builder.addCase(fetchVehicleById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchVehicleById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.foundVehicle = action.payload.data;
    });
    builder.addCase(fetchVehicleById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Create vehicle
    builder.addCase(createVehicle.pending, (state) => {
      state.isSaving = true;
      state.error = null;
    });
    builder.addCase(createVehicle.fulfilled, (state, action) => {
      state.isSaving = false;
      state.vehicles = [action.payload.data, ...state.vehicles];
    });
    builder.addCase(createVehicle.rejected, (state, action) => {
      state.isSaving = false;
      state.error = action.payload;
    });

    // Update vehicle
    builder.addCase(updateVehicle.pending, (state) => {
      state.isSaving = true;
      state.error = null;
    });
    builder.addCase(updateVehicle.fulfilled, (state, action) => {
      state.isSaving = false;
      state.vehicles = state.vehicles.map((vehicle) => 
        vehicle._id === action.payload.data._id ? action.payload.data : vehicle
      );
      state.foundVehicle = action.payload.data;
    });
    builder.addCase(updateVehicle.rejected, (state, action) => {
      state.isSaving = false;
      state.error = action.payload;
    });

    // Delete vehicle
    builder.addCase(deleteVehicle.pending, (state) => {
      state.isDeleting = true;
      state.error = null;
    });
    builder.addCase(deleteVehicle.fulfilled, (state, action) => {
      state.isDeleting = false;
      state.vehicles = state.vehicles.filter(
        (vehicle) => vehicle._id !== action.meta.arg
      );
    });
    builder.addCase(deleteVehicle.rejected, (state, action) => {
      state.isDeleting = false;
      state.error = action.payload;
    });
  },
});

export const { clearCurrentVehicle, setSearchParams } = vehicleSlice.actions;
export default vehicleSlice.reducer;
