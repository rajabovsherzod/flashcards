import { prisma } from "@/lib/prisma";
import ApiError from "@/utils/api.Error";
import {
  RegisterStepOne,
  RegisterStepTwo,
  RegisterStepThree,
  Login,
} from "@/api/auth/auth.types";
import emailService from "@/services/email.service";
import { UserDto } from "@/api/user/dto/user.dto";
import bcrypt from "bcryptjs";
import { tokenService } from "@/services/token.service";

class AuthService {
  public async registerStepOne(data: RegisterStepOne) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existingUser && existingUser.status !== "PENDING") {
      throw new ApiError(400,"User with this email already completed registration.");
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiresTime = new Date(Date.now() + 10 * 60 * 1000);
    const verificationExpiresAt = new Date(Date.now() + 60 * 60 * 1000 * 24);

    const user = await prisma.user.upsert({
      where: {
        email: data.email,
      },
      update: {
        fullName: data.fullName,
        verificationCode,
        codeExpiresTime,
        verificationExpiresAt,
      },
      create: {
        email: data.email,
        fullName: data.fullName,
        verificationCode,
        codeExpiresTime,
        verificationExpiresAt,
      },
    });

    try {
      await emailService.sendVerificationEmail(
        user.email,
        user.fullName,
        verificationCode
      );
    } catch (error) {
      console.error("Failed to send verification email for user:", user.email, error);
      throw new ApiError(500,"Could not send verification email. Please try again in a few moments.");
    }

    const userDto = new UserDto(user);

    return userDto;
  }

  public async registerStepTwo(data: RegisterStepTwo) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.status !== "PENDING") {
      throw new ApiError(400,"This account is already verified or in an invalid state.");
    }

    if (!user.verificationCode || !user.codeExpiresTime) {
      throw new ApiError(400,"Verification data is missing. Please try to register again.");
    }

    if (user.codeExpiresTime < new Date()) {
      throw new ApiError(400,"Verification code has expired. Please try to register again.");
    }

    if (user.verificationCode !== data.verificationCode) {
      throw new ApiError(400, "Invalid verification code");
    }

    const userEmailVerifyied = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: "AWAITING_PASSWORD",
        verificationCode: null,
        codeExpiresTime: null,
        verificationExpiresAt: null,
      },
    });

    const userDto = new UserDto(userEmailVerifyied);
    return userDto;
  }

  public async registerStepThree(data: RegisterStepThree) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.status !== "AWAITING_PASSWORD") {
      throw new ApiError(400,"This account is not awaiting a password. Please try to register again.");
    }

    if (user.password) {
      throw new ApiError(400, "Password already set. Please try to login.");
    }

    if (data.password !== data.confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, genSalt);

    const activatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        status: "ACTIVE",
      },
    });

    const userDto = new UserDto(activatedUser);
    const tokens = tokenService.generateAuthTokens(activatedUser);
    await tokenService.saveRefreshToken(tokens.refreshToken, activatedUser.id)
    return { userDto, tokens };
  }

  public async login(data: Login) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new ApiError(404, "User not found with this email");

    if (user.status !== "ACTIVE")
      throw new ApiError(400,"This account is not active. Please try to register again.");

    if (!user.password)
      throw new ApiError(400, "Password is not set for this account.");

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new ApiError(400, "Invalid password");

    const tokens = tokenService.generateAuthTokens(user);
    await tokenService.saveRefreshToken(tokens.refreshToken, user.id)
    const userDto = new UserDto(user);

    return { userDto, tokens };
  }

  public async logout(refreshToken: string){
    if(!refreshToken) return

    await prisma.refreshToken.delete({
      where: {
        token: refreshToken
      }
    })
  }
}

export default AuthService;
