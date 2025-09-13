import React, { useState } from 'react';
import '../App.css';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h2>You have been logged out</h2>
        <button onClick={() => setIsLoggedIn(true)}>Login Again</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Sidebar  />

      <div className="main-content">
        <Header />

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
