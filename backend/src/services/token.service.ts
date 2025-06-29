import jwt, { JwtPayload } from "jsonwebtoken";
import { User, RefreshToken } from "@generated/prisma";
import ApiError from "@/utils/api.Error";
import { prisma } from "@/lib/prisma";
import { parseTimeStr } from "@/utils/time";

export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  status: string;
}

class TokenService {
  // Bu yordamchi, private metod
  private generateSingleToken(
    payload: object,
    secret: string,
    expiresIn: string
  ): string {
    return jwt.sign(payload, secret, { expiresIn } as any);
  }

  // Bu asosiy, public metod
  public generateAuthTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = {
      id: user.id,
      email: user.email,
      status: user.status,
    };

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

    if (
      !accessTokenSecret ||
      !accessTokenExpiry ||
      !refreshTokenSecret ||
      !refreshTokenExpiry
    ) {
      throw new ApiError(
        500,
        "Token secrets or expirations are not defined in .env"
      );
    }

    const accessToken = this.generateSingleToken(
      payload,
      accessTokenSecret,
      accessTokenExpiry
    );

    const refreshToken = this.generateSingleToken(
      payload,
      refreshTokenSecret,
      refreshTokenExpiry
    );

    return { accessToken, refreshToken };
  }

  public async saveRefreshToken(token: string, userId: string): Promise<RefreshToken> {
      const refreshTokenExpiryStr = process.env.REFRESH_TOKEN_EXPIRY
      const refreshTokenExpiry = refreshTokenExpiryStr ? parseTimeStr(refreshTokenExpiryStr) : 0
      const expiresAt = new Date(Date.now() + refreshTokenExpiry)

      const savedToken = await prisma.refreshToken.create({
        data: {
          token,
          userId,
          expiresAt
        }
      })

      return savedToken
  }

 // backend/src/services/token.service.ts
 public verifyToken(token: string, secret: string): TokenPayload | null {
      try {
        return jwt.verify(token, secret) as TokenPayload;
      } catch (error) {
        return null;
      }
  }

  public refreshAccessToken(refreshToken: string): { accessToken: string } | null {
        const payload = this.verifyToken(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        );

        if (!payload) {
            return null;
        }

        const newAccessTokenPayload = {
            id: payload.id,
            email: payload.email,
            status: payload.status,
        };

        const accessToken = this.generateSingleToken(
        newAccessTokenPayload,
        process.env.ACCESS_TOKEN_SECRET!,
        process.env.ACCESS_TOKEN_EXPIRY!
        );

        return { accessToken };
    }
}

export const tokenService = new TokenService();
