import { useEffect } from "react";
import { useAppDispatch } from "@/hooks";
import { refresh } from "@/redux/store";

export const useRefresh = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(refresh());
    }, [dispatch]);
};
