import React, { useState } from 'react';
import '../styles/Header.css';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [hoveredUserMenu, setHoveredUserMenu] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // ✅ Handle Firebase Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully");
      navigate("/login"); // redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Try again!");
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="app-name">Admin Panel</div>

        <div
          className="user-area"
          onMouseEnter={() => setHoveredUserMenu(true)}
          onMouseLeave={() => setHoveredUserMenu(false)}
        >
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <div className="user-avatar">👤</div>
          </div>

          {hoveredUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">Admin Actions</div>
              <button onClick={() => console.log("Add User clicked")}>
                <span className="icon">➕</span> Add User
              </button>
              <button onClick={() => console.log("Manage Users clicked")}>
                <span className="icon">🛠️</span> Manage Users
              </button>
              <div className="dropdown-divider"></div>
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
