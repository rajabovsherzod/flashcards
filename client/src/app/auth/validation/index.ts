import * as z from "zod";

export const registerStepOneSchema = z.object({
  fullName: z.string({ required_error: "Name is required" }).min(3, { message: "Name must be at least 3 characters." }),
  email: z.string({ required_error: "Email is required" }).email({ message: "Please enter a valid email." }),
});

export const registerStepTwoSchema = z.object({
  verificationCode: z.string({ required_error: "Verify code is required" }).min(6, { message: "Verify code must be 6 characters." }),
});

export const registerStepThreeSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required"}).email({ message: "Please enter valid email"}),
  password: z.string({ required_error: "Password is required"}).min(8, {message: "Password must be at least 8 characters."})
})
