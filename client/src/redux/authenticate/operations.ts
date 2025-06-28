import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import {
    LogInValues,
    LoginResponse,
    Tokens,
    UserResponse,
    User,
    UpdateUserValues,
    RegisterValues,
    UsersResponse,
} from "@/d";
import { CookiesApi } from "@/utils";
import { AppState } from "@/redux/store";
import { handleApiError, handleApiSuccess } from "@/utils";

const setAuthHeader = (token: string) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const register = createAsyncThunk<LoginResponse, RegisterValues>(
    "register",
    async (info, { rejectWithValue }) => {
        const formData = new FormData();

        formData.append("avatar", info.file as Blob);
        formData.append("username", info.username);
        formData.append("name", info.name);
        formData.append("phone", info.phone);
        formData.append("email", info.email);
        formData.append("address", info.address || "");
        formData.append("password", info.password);

        try {
            const response: AxiosResponse<LoginResponse> = await axios.post(
                "api/auth/register",
                formData
            );

            setAuthHeader(response.data.tokens.accessToken);

            CookiesApi.setValue(
                "accessToken",
                response.data.tokens.accessToken
            );

            handleApiSuccess("Success", "Register Success!");

            return response.data;
        } catch (error: any) {
            handleApiError(error, {
                context: "register",
                resourceType: "user",
                defaultMessage: "Failed to register",
            });
            return rejectWithValue(error);
        }
    }
);

export const login = createAsyncThunk<
    LoginResponse,
    LogInValues | { tokens: Tokens; user: User }
>("login", async (data, { rejectWithValue }) => {
    try {
        let response: AxiosResponse<LoginResponse> = await axios.post(
            "api/auth/login",
            data
        );

        setAuthHeader(response.data.tokens.accessToken);

        CookiesApi.setValue("accessToken", response.data.tokens.accessToken);

        handleApiSuccess("Success", "Login Success!");

        return response.data;
    } catch (error: any) {
        console.error(error);
        handleApiError(error, {
            context: "login",
            resourceType: "user",
            defaultMessage: "Failed to login",
        });
        return rejectWithValue(error);
    }
});

export const fetchProfile = createAsyncThunk<UserResponse>(
    "profile",
    async (_, { rejectWithValue, getState }) => {
        const { authenticate } = getState() as AppState;

        const accessToken = CookiesApi.getValue("accessToken");

        if (accessToken === undefined) return rejectWithValue(authenticate);

        setAuthHeader(accessToken);

        try {
            const response: AxiosResponse<UserResponse> =
                await axios.get("api/users/profile");

            // CookiesApi.setValue("accessToken", response.data.tokens.accessToken);
            // setAuthHeader(response.data.tokens.accessToken);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(authenticate);
        }
    }
);

export const updateProfile = createAsyncThunk<UserResponse, UpdateUserValues>(
    "updateProfile",
    async (updateUser, { rejectWithValue }) => {
        try {
            const { confirmPassword, ...rest } = updateUser;

            const formData = new FormData();
            Object.keys(rest).forEach((key) => {
                const value = updateUser[key as keyof UpdateUserValues];
                if (value !== undefined && value !== null && value !== "") {
                    formData.append(key, value);
                }
            });

            const response: AxiosResponse<UserResponse> = await axios.patch(
                `api/users/profile`,
                formData
            );

            handleApiSuccess("Success", "Personal info updated successfully!");

            return response.data;
        } catch (error: any) {
            handleApiError(error, {
                context: "update",
                resourceType: "profile",
                defaultMessage: "Failed to update profile",
            });
            return rejectWithValue(error);
        }
    }
);

export const getAllUsers = createAsyncThunk<
    UsersResponse,
    | {
          status?: string;
          joinedFrom?: string;
          joinedTo?: string;
          search?: string;
          page?: number;
          limit?: number;
      }
    | undefined
>("getUsers", async (params = {}, { rejectWithValue }) => {
    try {
        const queryParams = new URLSearchParams();
        if (params.status && params.status !== "all") {
            queryParams.append("status", params.status);
        }
        if (params.joinedFrom) {
            queryParams.append("joinedFrom", params.joinedFrom);
        }
        if (params.joinedTo) {
            queryParams.append("joinedTo", params.joinedTo);
        }
        if (params.search) {
            queryParams.append("search", params.search);
        }
        if (params.page) {
            queryParams.append("page", params.page.toString());
        }
        if (params.limit) {
            queryParams.append("limit", params.limit.toString());
        }

        const response: AxiosResponse<UsersResponse> = await axios.get(
            `api/users?${queryParams.toString()}`
        );
        return response.data;
    } catch (error: any) {
        handleApiError(error, {
            context: "fetch",
            resourceType: "users",
            defaultMessage: "Failed to fetch users",
        });
        return rejectWithValue(error);
    }
});
