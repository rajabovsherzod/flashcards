import { TokenPayload } from "@/services/token.service";

declare global {
  namespace Express {
    export interface Request {
      user?: TokenPayload;
    }
  }
}