import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";

import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const Header: React.FC = () => {
  const [hoveredUserMenu, setHoveredUserMenu] = useState(false);
  const [studentName, setStudentName] = useState("Student User");
  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    // Listen for auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {

          // 🔍 Query by "uid" field instead of document ID
          const q = query(
            collection(db, "teachers"),
            where("uid", "==", user.uid)
          );
          const querySnap = await getDocs(q);

          if (!querySnap.empty) {
            const data = querySnap.docs[0].data();

            setStudentName(data.name || "Teacher");
          } else {

            setStudentName("Student");
          }
        } catch (error) {
          console.error("Error fetching teacher data:", error);
          setStudentName("Student");
        }
      } else {
        setStudentName("Teacher");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/teacherlogin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="app-name">Teacher Dashboard</div>

        <div
          className="user-area"
          onMouseEnter={() => setHoveredUserMenu(true)}
          onMouseLeave={() => setHoveredUserMenu(false)}
        >
          <div className="user-info">
            <span className="user-name">{studentName}</span>
            <div className="user-avatar">👤</div>
          </div>

          {hoveredUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">Teacher Actions</div>
              <button onClick={handleLogout} className="logout-btn">
                <span className="icon">🚪</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
