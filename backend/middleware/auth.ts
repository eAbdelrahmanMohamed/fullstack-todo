import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, AuthenticatedUser } from "../types/express/AuthenticatedRequest";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthenticatedUser;
    
    // Tell TypeScript that `req` is an `AuthenticatedRequest`
    (req as AuthenticatedRequest).user = decoded;
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
export default authenticate;