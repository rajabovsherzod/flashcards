import { Router } from "express";
import AuthController from "@/api/auth/auth.controller";
import AuthService from "@/api/auth/auth.service";
import { validate } from "@/middlewares/validate.middleware";
import { registerationStepThreeSchema, registrationStepOneSchema, registrationStepTwoSchema, loginSchema } from "@/api/auth/auth.validation";
import authMiddleware from "@/middlewares/auth.middleware";

const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/register', validate(registrationStepOneSchema), authController.registerStepOne);
router.post('/verify-email', validate(registrationStepTwoSchema), authController.registerStepTwo);
router.post('/set-password', validate(registerationStepThreeSchema), authController.registerStepThree);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/refresh-token', authController.refreshToken);
export default router;
