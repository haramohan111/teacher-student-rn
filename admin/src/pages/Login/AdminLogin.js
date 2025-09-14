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
// src/components/AdminLogin.tsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/features/auth/authSlice'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminLogin.css'; // Import your CSS file for styling
const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, status, error } = useSelector((state) => state.auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const result = yield dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(result)) {
            if (result.payload.role === "admin") {
                navigate("/admin/dashboard");
            }
            else if (result.payload.role === "teacher") {
                navigate("/teacher-dashboard");
            }
            else {
                navigate("/student-dashboard");
            }
        }
    });
    return (_jsx("div", { className: "admin-login-container", children: _jsxs("div", { className: "login-card", children: [_jsx("h2", { children: "Admin" }), error && _jsx("div", { className: "error-message", children: error }), _jsxs("form", { onSubmit: handleLogin, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Enter your email", required: true, autoFocus: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter your password", required: true })] }), _jsx("button", { type: "submit", className: "login-btn", disabled: status === 'loading', children: status === 'loading' ? 'Logging in...' : 'Login' })] })] }) }));
};
export default AdminLogin;
