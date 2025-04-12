import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthenticateState } from "@/d";
import {
    login,
    fetchProfile,
    updateProfile,
    register,
} from "@/redux/authenticate/operations";
import { CookiesApi } from "@/utils";

const initialState: AuthenticateState = {
    isLoggedIn: false,
    isLoading: false,
    isCreating: false,
    isUpdateLoading: false,
    isRefreshing: true,
    user: null,
    tokens: null,
    error: null,
};

const authSlice = createSlice({
    name: "authenticate",
    initialState,
    reducers: {
        logout(state) {
            state.isLoggedIn = false;
            CookiesApi.setValue("refreshToken", null);
            state.tokens = null;
            state.user = null;
            axios.defaults.headers.common.Authorization = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.error = null;
                state.tokens = payload.tokens;
                state.user = payload.data;
                state.isLoggedIn = true;
            })
            .addCase(register.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isLoggedIn = false;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.error = null;
                state.tokens = payload.tokens;
                state.user = payload.data;
                state.isLoggedIn = true;
            })
            .addCase(login.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.tokens = null;
                state.isLoggedIn = false;
            })
            .addCase(fetchProfile.pending, (state) => {
                state.isRefreshing = true;
            })
            .addCase(fetchProfile.fulfilled, (state, { payload }) => {
                state.isRefreshing = false;
                state.error = null;
                // state.tokens = payload.tokens;
                state.user = payload.data;
                state.isLoggedIn = true;
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.isRefreshing = false;
                state.tokens = null;
                state.isLoggedIn = false;
            })
            .addCase(updateProfile.pending, (state) => {
                state.isUpdateLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, { payload }) => {
                state.isUpdateLoading = false;
                state.error = null;
                state.user = payload.data;
            })
            .addCase(updateProfile.rejected, (state) => {
                state.isUpdateLoading = false;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
