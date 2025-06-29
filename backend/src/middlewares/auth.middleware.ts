import { Request, Response, NextFunction } from "express";
import ApiError from "@/utils/api.Error";
import { tokenService } from "@/services/token.service";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) return next(new ApiError(401, "Unauthorized: No token provided."));
    
      const token = authHeader.split(' ')[1];
      
      const secret = process.env.ACCESS_TOKEN_SECRET;
      if (!secret) return next(new ApiError(500, "Access token secret is not configured on the server."));
  
      const payload = tokenService.verifyToken(token, secret); // <--- TO'G'RI CHAQIRUV
      if (!payload) return next(new ApiError(401, "Unauthorized: Invalid or expired token."));
  
      req.user = payload;
      next();
    } catch (error) {
      return next(new ApiError(500, "Internal server error during token verification."));
    }
  };

  export default authMiddleware;