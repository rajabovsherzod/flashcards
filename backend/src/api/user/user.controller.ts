import { Request, Response, NextFunction } from "express";
import Userservice from "./user.service";
import ApiResponse from "@/utils/api.Response";

class UserController {
    constructor(private readonly userService: Userservice){
        this.userService = userService;
    }
    
    public getMe = async (req: Request, res: Response, next: NextFunction) => {
        const { id, email, fullName, status } = req.user!;
        const publicUser = { id, email, fullName, status };
        res.status(200).json(new ApiResponse(publicUser, "User fetched successfully."));
    }
}

export default UserController;
