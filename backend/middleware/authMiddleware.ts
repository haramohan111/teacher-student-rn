// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin"; // make sure this is firebase-admin, not client SDK

export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    // ✅ Admin SDK verifies client ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach user info to request object
    (req as any).user = decodedToken;

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};
