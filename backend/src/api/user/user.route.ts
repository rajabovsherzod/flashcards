import { Router } from "express";
import UserController from "./user.controller";
import Userservice from "./user.service";
import authMiddleware from "@/middlewares/auth.middleware";

const userService = new Userservice();
const userController = new UserController(userService);

const router = Router()

router.get("/me", authMiddleware, userController.getMe);


export default router 
