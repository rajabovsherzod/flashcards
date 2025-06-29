import { z } from "zod"

export const registrationStepOneSchema = z.object({
    body: z.object({
        fullName: z.string({required_error: "Full name is required"}).min(3, "Full name must be at least 3 characters long"),
        email: z.string({required_error: "Email is required"}).email("Invalid email address"),
    })
})

export const registrationStepTwoSchema = z.object({
    body: z.object({
        email: z.string({required_error: "Email is required"}).email("Invalid email address"),
        verificationCode: z.string({required_error: "Verification code is required"}).length(6, "Verification code must be 6 digits long"),
    })
})

export const registerationStepThreeSchema = z.object({
    body: z.object({
        email: z.string({required_error: "Email is required"}).email("Invalid email address"),
        password: z.string({required_error: "Password is required"}).min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string({required_error: "Confirm password is required"}).min(8, "Confirm password must be at least 8 characters long"),
    })
})

export const loginSchema = z.object({
    body: z.object({
        email: z.string({required_error: "Email is required"}).email("Invalid email address"),
        password: z.string({required_error: "Password is required"}).min(8, "Password must be at least 8 characters long"),
    })
})

