var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import '../styles/Header.css';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
export const Header = () => {
    const [hoveredUserMenu, setHoveredUserMenu] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();
    // ✅ Handle Firebase Logout
    const handleLogout = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield signOut(auth);
            alert("Logged out successfully");
            navigate("/login"); // redirect to login after logout
        }
        catch (error) {
            console.error("Logout failed:", error);
            alert("Failed to logout. Try again!");
        }
    });
    return (_jsx("header", { className: "topbar", children: _jsxs("div", { className: "topbar-content", children: [_jsx("div", { className: "app-name", children: "Admin Panel" }), _jsxs("div", { className: "user-area", onMouseEnter: () => setHoveredUserMenu(true), onMouseLeave: () => setHoveredUserMenu(false), children: [_jsxs("div", { className: "user-info", children: [_jsx("span", { className: "user-name", children: "Admin User" }), _jsx("div", { className: "user-avatar", children: "\uD83D\uDC64" })] }), hoveredUserMenu && (_jsxs("div", { className: "user-dropdown", children: [_jsx("div", { className: "dropdown-header", children: "Admin Actions" }), _jsxs("button", { onClick: () => console.log("Add User clicked"), children: [_jsx("span", { className: "icon", children: "\u2795" }), " Add User"] }), _jsxs("button", { onClick: () => console.log("Manage Users clicked"), children: [_jsx("span", { className: "icon", children: "\uD83D\uDEE0\uFE0F" }), " Manage Users"] }), _jsx("div", { className: "dropdown-divider" }), _jsxs("button", { onClick: handleLogout, className: "logout-btn", children: [_jsx("span", { className: "icon", children: "\uD83D\uDEAA" }), " Logout"] })] }))] })] }) }));
};
