import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser } from '../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import '../../styles/StudentAuth.css';
import type { AppDispatch, RootState } from '../../redux/store';

const StudentAuth: React.FC = () => {
   const { user } = useSelector((state: RootState) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLogin && password !== retypePassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      if (isLogin) {
        const resultAction = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(resultAction)) {
          alert('Login successful');
          navigate('/student/dashboard');
        } else {
          alert(resultAction.payload || 'Login failed');
        }
      } else {
        const resultAction = await dispatch(signupUser({ name, email, password }));
        if (signupUser.fulfilled.match(resultAction)) {
          alert('Signup successful');
          navigate('/student-login');
        } else {
          alert(resultAction.payload || 'Signup failed');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

    useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/student/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>

        <h2>{isLogin ? 'Student Login' : 'Student Register'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Retype Password</label>
              <input
                type="password"
                value={retypePassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRetypePassword(e.target.value)}
                placeholder="Retype your password"
                required
              />
            </div>
          )}

          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading'
              ? isLogin
                ? 'Logging in...'
                : 'Signing up...'
              : isLogin
              ? 'Login'
              : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentAuth;
