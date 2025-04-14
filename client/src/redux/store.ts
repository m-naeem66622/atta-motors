import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import axios from "axios";

import authenticateReducer, { logout } from "@/redux/authenticate/authSlice";
import {
    login,
    register,
    fetchProfile,
    updateProfile,
} from "@/redux/authenticate/operations";

import saveNavigationReducer, {
    setRoute,
} from "@/redux/saveNavigation/saveNavigationSlice";

import vehicleReducer from "@/redux/vehicles/vehicleSlice";
import {
    fetchVehicleById,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} from "@/redux/vehicles/operations";

import maintenanceReducer from "@/redux/maintenance/maintenanceSlice";
import {
    createMaintenanceAppointment,
    getMaintenanceHistory,
    getMaintenanceAppointment,
    cancelMaintenanceAppointment,
    checkAppointmentAvailability,
} from "@/redux/maintenance/operations";

const { VITE_APP_BASE_URL } = import.meta.env;

axios.defaults.baseURL = `${VITE_APP_BASE_URL}`;

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["saveRoute", "isLoggedIn"],
};

const reducer = combineReducers({
    authenticate: persistReducer(persistConfig, authenticateReducer),
    saveNavigation: persistReducer(persistConfig, saveNavigationReducer),
    vehicles: vehicleReducer,
    maintenance: maintenanceReducer,
});

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {
    login,
    register,
    fetchProfile as refresh,
    logout,
    updateProfile,
    setRoute,
    fetchVehicles,
    fetchVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    createMaintenanceAppointment,
    getMaintenanceHistory,
    getMaintenanceAppointment,
    cancelMaintenanceAppointment,
    checkAppointmentAvailability,
};
