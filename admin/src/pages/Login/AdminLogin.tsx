// src/components/AdminLogin.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  loginUser } from '../../redux/features/auth/authSlice'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminLogin.css'; // Import your CSS file for styling

import type { RootState, AppDispatch } from '../../redux/store'; // import your store types

const AdminLogin: React.FC = () => {
const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      if (result.payload.role === "admin") {
        navigate("/admin/dashboard");
      } else if (result.payload.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <h2>Admin</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={status === 'loading'}>
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
