import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Home.jsx
import { useState } from 'react';
import '../App.css'; // Assuming you have a CSS file for styles
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    if (!isLoggedIn) {
        return (_jsxs("div", { className: "login-container", children: [_jsx("h2", { children: "You have been logged out" }), _jsx("button", { onClick: () => setIsLoggedIn(true), children: "Login Again" })] }));
    }
    return (_jsxs("div", { className: "admin-dashboard", children: [_jsx(Sidebar, { activeMenu: activeMenu, setActiveMenu: setActiveMenu }), _jsxs("div", { className: "main-content", children: [_jsx(Header, {}), _jsx("div", { className: "content", children: _jsx(Outlet, {}) })] })] }));
}
