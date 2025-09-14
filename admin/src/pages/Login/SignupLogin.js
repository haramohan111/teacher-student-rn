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
// src/pages/Login/SignupLogin.tsx
import { useState } from 'react';
import { auth } from '../../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
const SignupLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signup = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userCredential = yield createUserWithEmailAndPassword(auth, email, password);
            const idToken = yield userCredential.user.getIdToken();
            alert('Signup successful');
            yield axios.post('http://localhost:5000/verify', {}, {
                headers: { Authorization: `Bearer ${idToken}` },
                withCredentials: true
            });
        }
        catch (err) {
            alert(err.message || 'Signup failed');
        }
    });
    const login = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userCredential = yield signInWithEmailAndPassword(auth, email, password);
            const idToken = yield userCredential.user.getIdToken();
            alert('Login successful');
            yield axios.post('http://localhost:5000/verify', {}, {
                headers: { Authorization: `Bearer ${idToken}` },
                withCredentials: true
            });
        }
        catch (err) {
            alert(err.message || 'Login failed');
        }
    });
    return (_jsxs("div", { children: [_jsx("h2", { children: "Signup / Login" }), _jsx("input", { type: "email", placeholder: "Email", value: email, onChange: e => setEmail(e.target.value) }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: e => setPassword(e.target.value) }), _jsx("br", {}), _jsx("button", { onClick: signup, children: "Signup" }), _jsx("button", { onClick: login, children: "Login" })] }));
};
export default SignupLogin;
