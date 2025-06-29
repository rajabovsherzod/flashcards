import { Request, Response, NextFunction } from "express";
import AuthService from "@/api/auth/auth.service";
import ApiResponse from "@/utils/api.Response";

class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }

  public registerStepOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fullName, email } = req.body;
      const user = await this.authService.registerStepOne({ fullName, email });
      res.status(201).json(new ApiResponse(user, "Verification code sent to your email. Please check your inbox."))
    } catch (error) {
      next(error);
    }
  };

  public registerStepTwo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, verificationCode } = req.body;
      const data = await this.authService.registerStepTwo({
        email,
        verificationCode,
      });
      res
        .status(200)
        .json(new ApiResponse(data, "Email verified successfully"));
    } catch (error) {
      next(error);
    }
  };

  public registerStepThree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, confirmPassword } = req.body;
      const { userDto: user, tokens } = await this.authService.registerStepThree({email, password, confirmPassword})
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.status(200).json(
          new ApiResponse({ user, accessToken: tokens.accessToken },"Password set successfully and account activated")
      );
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { userDto: user, tokens } = await this.authService.login({ email, password });
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.status(200).json(new ApiResponse({ user, accessToken: tokens.accessToken }, "Login successful"));
    } catch (error) {
      next(error)
    }
  }

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies
      await this.authService.logout(refreshToken)
      res.clearCookie("refreshToken")
      res.status(200).json(new ApiResponse(null, "Logout successful"))
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController;
