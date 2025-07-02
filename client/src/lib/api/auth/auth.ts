import { $axios } from "../axios";
import {
  RegisterStepOnePayload,
  UserResponse,
  RegisterStepTwoPayload,
  RegisterStepThreePayload,
  LoginPayload,
} from "./auth.types";
import { ApiResponse } from "../api.response";

export const registerStepOne = async (payload: RegisterStepOnePayload): Promise<ApiResponse<UserResponse>> => {
  const { data } = await $axios.post<ApiResponse<UserResponse>>("/auth/register",payload);
  return data;
};

export const registerStepTwo = async (payload: RegisterStepTwoPayload): Promise<ApiResponse<UserResponse>> => {
  const { data } = await $axios.post<ApiResponse<UserResponse>>("/auth/verify-email",payload);
  return data;
};

export const registerStepThree = async (payload: RegisterStepThreePayload): Promise<ApiResponse<UserResponse>> => {
  const { data } = await $axios.post<ApiResponse<UserResponse>>("/auth/set-password",payload);
  return data;
};

export const login = async (payload: LoginPayload): Promise<ApiResponse<UserResponse>> => {
  const { data } = await $axios.post<ApiResponse<UserResponse>>("/auth/login",payload);
  return data;
};

