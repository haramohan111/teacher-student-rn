var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
const ProtectedRoute = ({ children, requiredRole }) => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => __awaiter(void 0, void 0, void 0, function* () {
            setCurrentUser(user);
            if (user) {
                console.log("Authenticated user:", user);
                try {
                    // fetch role from Firestore
                    const userDocRef = doc(db, "users", user === null || user === void 0 ? void 0 : user.uid);
                    const userSnapshot = yield getDoc(userDocRef);
                    if (userSnapshot.exists()) {
                        const data = userSnapshot.data();
                        setRole(data.role || null);
                    }
                }
                catch (error) {
                    console.error("Error fetching user role:", error);
                }
            }
            setLoading(false);
        }));
        return () => unsubscribe();
    }, []);
    if (loading)
        return _jsx("p", { children: "Loading..." });
    if (!currentUser)
        return _jsx(Navigate, { to: "/adminlogin", replace: true });
    if (requiredRole && role !== requiredRole) {
        return _jsx(Navigate, { to: "/adminlogin", replace: true });
    }
    // support both children and nested routes (Outlet)
    return children ? children : _jsx(Outlet, {});
};
export default ProtectedRoute;
