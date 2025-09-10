// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

interface Props {
  children?: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // 🔎 check Firestore for "verified" field
        const userRef = doc(db, "teachers", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setIsVerified(data.verified === true);
        } else {
          setIsVerified(false);
        }
      } else {
        setIsVerified(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Not logged in → redirect
  if (!currentUser) {
    return <Navigate to="/teacherlogin" replace />;
  }

  // Logged in but not verified → redirect
  // if (isVerified === false) {
  //   return <Navigate to="/pending-approval" replace />;
  // }

  // Logged in & verified → allow access
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
