export interface RegisterStepOne {
    fullName: string
    email: string
}

export interface RegisterStepTwo {
    email: string
    verificationCode: string
}

export interface RegisterStepThree {
    email: string
    password: string
    confirmPassword: string
}

export interface Login {
    email: string
    password: string
}