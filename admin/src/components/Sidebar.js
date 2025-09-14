import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
const Sidebar = () => {
    const location = useLocation(); // Get current browser URL
    const [hoverEnabled, setHoverEnabled] = useState(true);
    const [menuStates, setMenuStates] = useState({});
    const [settingsOpen, setSettingsOpen] = useState(false);
    // Define your management menus here
    const managementMenus = [
        {
            id: 'teacher',
            title: 'Teacher',
            icon: '👨‍🏫',
            items: [
                { id: 'add-teacher', text: 'Add Teacher', icon: '➕', path: '/admin/teacher/add-teacher' },
                { id: 'manage-teachers', text: 'Manage Teachers', icon: '🛠️', path: '/admin/teacher/manage-teachers' }
            ]
        },
        {
            id: 'student',
            title: 'Student',
            icon: '🎓',
            items: [
                // { id: 'add-student', text: 'Add Student', icon: '➕', path: '/admin/student/add-student' },
                { id: 'manage-students', text: 'Manage Students', icon: '🛠️', path: '/admin/student/manage-students' }
            ]
        },
        {
            id: 'messages',
            title: 'Messages',
            icon: '💬',
            items: [
                { id: 'all-messages', text: 'All Messages', icon: '📨', path: '/admin/messages' },
            ]
        }
    ];
    // Initialize state
    useEffect(() => {
        const savedHoverState = localStorage.getItem('sidebarHoverEnabled');
        if (savedHoverState !== null) {
            setHoverEnabled(savedHoverState === 'true');
        }
        const initialMenuStates = {};
        managementMenus.forEach(menu => {
            initialMenuStates[menu.id] = {
                isHovering: false,
                menuOpen: false
            };
        });
        setMenuStates(initialMenuStates);
    }, []);
    // Auto-open menu if URL matches one of its subpaths
    useEffect(() => {
        const updatedStates = {};
        managementMenus.forEach(menu => {
            var _a;
            const isActive = menu.items.some(item => location.pathname.startsWith(item.path));
            updatedStates[menu.id] = {
                isHovering: false,
                menuOpen: isActive || ((_a = menuStates[menu.id]) === null || _a === void 0 ? void 0 : _a.menuOpen) || false
            };
        });
        setMenuStates(prev => (Object.assign(Object.assign({}, prev), updatedStates)));
    }, [location.pathname]);
    const toggleHover = () => {
        const newState = !hoverEnabled;
        setHoverEnabled(newState);
        localStorage.setItem('sidebarHoverEnabled', newState.toString());
        if (!newState) {
            const updatedStates = {};
            Object.keys(menuStates).forEach(menuId => {
                updatedStates[menuId] = Object.assign(Object.assign({}, menuStates[menuId]), { menuOpen: false });
            });
            setMenuStates(updatedStates);
        }
        setSettingsOpen(false);
    };
    const handleMenuClick = (menuId) => {
        if (!hoverEnabled) {
            setMenuStates(prev => (Object.assign(Object.assign({}, prev), { [menuId]: Object.assign(Object.assign({}, prev[menuId]), { menuOpen: !prev[menuId].menuOpen }) })));
        }
    };
    const handleMouseEnter = (menuId) => {
        if (hoverEnabled) {
            setMenuStates(prev => (Object.assign(Object.assign({}, prev), { [menuId]: Object.assign(Object.assign({}, prev[menuId]), { isHovering: true }) })));
        }
    };
    const handleMouseLeave = (menuId) => {
        if (hoverEnabled) {
            setMenuStates(prev => (Object.assign(Object.assign({}, prev), { [menuId]: Object.assign(Object.assign({}, prev[menuId]), { isHovering: false }) })));
        }
    };
    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
    };
    return (_jsxs("div", { className: `sidebar ${!hoverEnabled ? 'no-hover' : ''}`, children: [_jsx("div", { className: "sidebar-header", children: _jsx("h2", { children: "Admin Panel" }) }), _jsxs("nav", { className: "sidebar-menu", children: [_jsxs(Link, { to: "/admin/dashboard", className: `menu-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`, children: [_jsx("span", { className: "icon", children: "\uD83D\uDCCA" }), _jsx("span", { className: "text", children: "Dashboard" })] }), managementMenus.map(menu => {
                        var _a, _b, _c, _d, _e, _f;
                        return (_jsxs("div", { className: "menu-group", onMouseEnter: () => handleMouseEnter(menu.id), onMouseLeave: () => handleMouseLeave(menu.id), children: [_jsxs("div", { className: `menu-item ${((_a = menuStates[menu.id]) === null || _a === void 0 ? void 0 : _a.menuOpen) || ((_b = menuStates[menu.id]) === null || _b === void 0 ? void 0 : _b.isHovering) ? 'active' : ''}`, onClick: () => handleMenuClick(menu.id), children: [_jsx("span", { className: "icon", children: menu.icon }), _jsx("span", { className: "text", children: menu.title }), _jsx("span", { className: "arrow", children: ((_c = menuStates[menu.id]) === null || _c === void 0 ? void 0 : _c.menuOpen) || ((_d = menuStates[menu.id]) === null || _d === void 0 ? void 0 : _d.isHovering) ? '▼' : '▶' })] }), (((_e = menuStates[menu.id]) === null || _e === void 0 ? void 0 : _e.menuOpen) || (((_f = menuStates[menu.id]) === null || _f === void 0 ? void 0 : _f.isHovering) && hoverEnabled)) && (_jsx("div", { className: "sub-menu", children: menu.items.map(item => (_jsxs(Link, { to: item.path, className: `submenu-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`, children: [_jsx("span", { className: "icon", children: item.icon }), _jsx("span", { className: "text", children: item.text })] }, item.id))) }))] }, menu.id));
                    }), _jsxs("div", { className: "menu-group", children: [_jsxs("div", { className: `menu-item ${settingsOpen ? 'active' : ''}`, onClick: toggleSettings, children: [_jsx("span", { className: "icon", children: "\u2699\uFE0F" }), _jsx("span", { className: "text", children: "Settings" }), _jsx("span", { className: "arrow", children: settingsOpen ? '▼' : '▶' })] }), settingsOpen && (_jsx("div", { className: "sub-menu", children: _jsxs("div", { className: "submenu-item", onClick: toggleHover, children: [_jsx("span", { className: "icon", children: hoverEnabled ? '🔴' : '🟢' }), _jsx("span", { className: "text", children: hoverEnabled ? 'Disable Hover' : 'Enable Hover' })] }) }))] })] })] }));
};
export default Sidebar;
