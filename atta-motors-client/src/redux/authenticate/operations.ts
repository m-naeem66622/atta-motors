import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import {
  LogInValues,
  LoginResponse,
  Tokens,
  UserResponse,
  User,
  UserUpdateValuesForUser,
  RegisterValues,
} from "@/d";
import { CookiesApi, getErrorMessage } from "@/utils";
import { AppState } from "@/redux/store";

const setAuthHeader = (token: string) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const register = createAsyncThunk<LoginResponse, RegisterValues>(
  "register",
  async (info, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        "api/auth/register",
        info
      );

      setAuthHeader(response.data.tokens.accessToken);

      CookiesApi.setValue("accessToken", response.data.tokens.accessToken);

      toast.success("Register Success!");

      return response.data;
    } catch (error: any) {
      toast.error(getErrorMessage(error.response?.data.error.message));
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

    toast.success("Login Success!");

    return response.data;
  } catch (error: any) {
    console.error(error);
    toast.error(getErrorMessage(error.response?.data.error.message));
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
      const response: AxiosResponse<UserResponse> = await axios.get(
        "api/users/profile"
      );

      // CookiesApi.setValue("accessToken", response.data.tokens.accessToken);
      // setAuthHeader(response.data.tokens.accessToken);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(authenticate);
    }
  }
);

export const updateProfile = createAsyncThunk<
  UserResponse,
  UserUpdateValuesForUser
>("updateProfile", async (updateUser, { rejectWithValue }) => {
  try {
    const { confirmPassword, ...rest } = updateUser;

    const formData = new FormData();
    Object.keys(rest).forEach((key) => {
      const value = updateUser[key as keyof UserUpdateValuesForUser];
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    const response: AxiosResponse<UserResponse> = await axios.patch(
      `api/users/profile`,
      formData
    );

    toast.success("Personal info updated successfuly!");

    return response.data;
  } catch (error: any) {
    toast.error(getErrorMessage(error.response?.data.error.message));
    return rejectWithValue(error);
  }
});
