// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

interface Props {
  children?: JSX.Element;    // optional children
  requiredRole?: string;     // optional role restriction
}

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        console.log("Authenticated user:", user);
        try {
          // fetch role from Firestore
          const userDocRef = doc(db, "users", user?.uid);
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            setRole(data.role || null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!currentUser) return <Navigate to="/adminlogin" replace />;

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/adminlogin" replace />;
  }

  // support both children and nested routes (Outlet)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
