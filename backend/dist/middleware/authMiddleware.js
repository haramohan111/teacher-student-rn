"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFirebaseToken = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin")); // make sure this is firebase-admin, not client SDK
const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    const idToken = authHeader.split(" ")[1];
    try {
        // ✅ Admin SDK verifies client ID token
        const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(idToken);
        // Attach user info to request object
        req.user = decodedToken;
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
};
exports.verifyFirebaseToken = verifyFirebaseToken;
