import { AppState } from "@/redux/store";

export const selectAuthenticate = (state: AppState) => state.authenticate;

export const selectSaveNavigation = (state: AppState) => state.saveNavigation;

export const selectVehicles = (state: AppState) => state.vehicles;
