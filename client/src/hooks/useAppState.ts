import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import {
    selectAuthenticate,
    selectMaintenance,
    selectSaveNavigation,
    selectVehicles,
    selectAdmin,
} from "@/redux/selectors";

export const useAppState = (): AppState => ({
    authenticate: useSelector(selectAuthenticate),
    saveNavigation: useSelector(selectSaveNavigation),
    vehicles: useSelector(selectVehicles),
    maintenance: useSelector(selectMaintenance),
    admin: useSelector(selectAdmin),
});
