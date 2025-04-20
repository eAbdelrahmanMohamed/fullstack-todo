// types/AuthenticatedRequest.ts
import { Request } from "express";

export interface AuthenticatedUser {
  _id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
