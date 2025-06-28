import { AppState } from "@/redux/store";

export const selectAuthenticate = (state: AppState) => state.authenticate;

export const selectSaveNavigation = (state: AppState) => state.saveNavigation;

export const selectVehicles = (state: AppState) => state.vehicles;

export const selectMaintenance = (state: AppState) => state.maintenance;

export const selectAdmin = (state: AppState) => state.admin;
