import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.trim().split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT secret not defined in environment");
    }
    
    const decoded = jwt.verify(token, secret);
    console.log(decoded.id)

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Role-based authorization middleware factory
export function requireRole(role) {
  return (req, res, next) => {
    try {
      // auth middleware should have populated req.user
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (req.user.role !== role) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      next();
    } catch (error) {
      console.error("Error in role authorization:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
}
