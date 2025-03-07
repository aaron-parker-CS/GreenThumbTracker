import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.access_token;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // 2. Verify the token
    const jwtSecret = process.env.JWT_SECRET || "jwtSecret";
    const decoded = jwt.verify(token, jwtSecret as string) as jwt.JwtPayload;

    // 3. Attach the userId (or entire decoded payload) to req so other routes can access it
    req.userId = decoded.id;

    // 4. Continue to the next middleware or route
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(403).json({ message: "Forbidden - Invalid token" });
    return;
  }
};

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { username, email, password } = req.body;

  // Check if all fields are provided
  if (!username || !email || !password) {
    res.status(400).json({ message: "Please fill in all fields." });
    return;
  }

  // Validate password
  if (password.length < 8) {
    res
      .status(400)
      .json({ message: "Password must be at least 8 characters." });
    return;
  }
  if (password.length > 100) {
    res
      .status(400)
      .json({ message: "Password is too long, limit of 100 characters." });
    return;
  }

  // Validate username
  if (username.length < 3) {
    res
      .status(400)
      .json({ message: "Username must be at least 3 characters." });
    return;
  }
  if (username.length > 30) {
    res
      .status(400)
      .json({ message: "Username is too long, limit of 30 characters." });
    return;
  }

  // Validate email
  if (email.length > 100) {
    res
      .status(400)
      .json({ message: "Email address is too long, limit of 100 characters." });
    return;
  }

  // All validations passed, proceed to the next middleware or controller
  next();
};
