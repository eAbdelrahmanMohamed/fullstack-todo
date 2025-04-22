import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";
import jwt from "jsonwebtoken";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IUser;
    
    // Tell TypeScript that `req` is an `AuthenticatedRequest`
    // (req as AuthenticatedRequest).user = decoded;
        req.user = decoded; // Now properly typed

     next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
export default authenticate;