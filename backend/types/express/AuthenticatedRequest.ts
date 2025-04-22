import { Request } from "express";
import { IUser } from "../../models/User";

export interface AuthenticatedUser {
  id: string;
  email: string;
  // Add more properties if needed
}

export interface AuthenticatedRequest extends Request {
//   user: AuthenticatedUser;
}

declare module "express-serve-static-core" {
    interface Request {
     user?: IUser
    }
  }