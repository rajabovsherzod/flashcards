export interface RegisterStepOnePayload {
  fullName: string;
  email: string;
}

export interface RegisterStepTwoPayload {
  email: string;
  verificationCode: string;
}

export interface RegisterStepThreePayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  status: "PENDING" | "AWAITING_PASSWORD" | "ACTIVE";
  createdAt: string;
  updatedAt: string;
  accessToken: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserResponse;
}

export interface RegisterResponse {
  accessToken: string;
  user: UserResponse;
}
