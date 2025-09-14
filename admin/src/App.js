import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Student pages
import AddStudent from './pages/Student/AddStudent';
import ManageStudents from './pages/Student/ManageStudents';
import EditStudent from './pages/Student/EditStudent';
// Teacher pages
import AddTeacher from './pages/Teacher/AddTeacher';
import ManageTeacher from './pages/Teacher/ManageTeacher';
// Common pages
import Home from './components/Home';
import Dashboard1 from './components/Dashboard1';
import AdminLogin from './pages/Login/AdminLogin';
import SignupLogin from './pages/Login/SignupLogin';
import ProtectedRoute from './ProtectedRoute'; // Uncomment when you implement
import CreateAdmin from './components/CreateAdmin';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminChat from './pages/AdminChat';
import EditTeacher from './pages/Teacher/EditTeacher';
function App() {
    return (_jsxs(_Fragment, { children: [_jsx(ToastContainer, { position: "top-right", autoClose: 3000 }), _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/adminlogin", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/admin/signup-login", element: _jsx(SignupLogin, {}) }), _jsx(Route, { element: _jsx(ProtectedRoute, { requiredRole: "admin" }), children: _jsxs(Route, { path: "/admin", element: _jsx(Home, {}), children: [_jsx(Route, { path: "dashboard", element: _jsx(Dashboard1, {}) }), _jsx(Route, { path: "student/add-student", element: _jsx(AddStudent, {}) }), _jsx(Route, { path: "student/manage-students", element: _jsx(ManageStudents, {}) }), _jsx(Route, { path: "student/edit/:sid", element: _jsx(EditStudent, {}) }), _jsx(Route, { path: 'teacher/edit/:id', element: _jsx(EditTeacher, {}) }), _jsx(Route, { path: "messages", element: _jsx(AdminChat, {}) }), _jsx(Route, { path: "teacher/add-teacher", element: _jsx(AddTeacher, {}) }), _jsx(Route, { path: "teacher/manage-teachers", element: _jsx(ManageTeacher, {}) }), _jsx(Route, { index: true, element: _jsx(Navigate, { to: "dashboard", replace: true }) })] }) }), _jsx(Route, { path: "dd", element: _jsx(CreateAdmin, {}) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/admin", replace: true }) }), _jsx(Route, { path: "*", element: _jsx("div", { children: "Page Not Found" }) })] }) })] }));
}
export default App;
