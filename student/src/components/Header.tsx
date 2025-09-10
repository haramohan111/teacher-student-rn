import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const Header: React.FC = () => {
  const [hoveredUserMenu, setHoveredUserMenu] = useState(false);
  const [studentName, setStudentName] = useState('Student User');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch name from Firestore "users" table
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setStudentName(data.name || 'Student');
          } else {
            setStudentName('Student');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setStudentName('Student');
        }
      } else {
        setStudentName('Student User');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      dispatch(logout());
      navigate('/student-login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-content">
        <div className="app-name">Student Dashboard</div>

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
              <div className="dropdown-header">Student Actions</div>
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
