// Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuState {
  isHovering: boolean;
  menuOpen: boolean;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [hoverEnabled, setHoverEnabled] = useState<boolean>(true);
  const [menuStates, setMenuStates] = useState<{ [key: string]: MenuState }>({});
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const managementMenus = [
    {
      id: 'search-teacher',
      title: 'Search Teacher',
      icon: '🔍',
      items: [{ id: 'search-teacher', text: 'Search Teacher', icon: '🔍', path: '/student/manageteacher' }],
    },
    {
      id: 'book-appointment',
      title: 'Book Appointment',
      icon: '📅',
      items: [{ id: 'book-appointment', text: 'Book Appointment', icon: '📅', path: '/teacher/appointment' }],
    },
  ];

  // Initialize menu states
  useEffect(() => {
    const savedHoverState = localStorage.getItem('sidebarHoverEnabled');
    if (savedHoverState !== null) setHoverEnabled(savedHoverState === 'true');

    const initialStates: { [key: string]: MenuState } = {};
    managementMenus.forEach(menu => {
      initialStates[menu.id] = { isHovering: false, menuOpen: false };
    });
    setMenuStates(initialStates);
  }, []);

  // Auto-open menu if URL matches
  useEffect(() => {
    const updatedStates: { [key: string]: MenuState } = {};
    managementMenus.forEach(menu => {
      const isActive = menu.items.some(item => location.pathname.startsWith(item.path));
      updatedStates[menu.id] = {
        isHovering: false,
        menuOpen: isActive || menuStates[menu.id]?.menuOpen || false,
      };
    });
    setMenuStates(prev => ({ ...prev, ...updatedStates }));
  }, [location.pathname]);

  const toggleHover = () => {
    const newState = !hoverEnabled;
    setHoverEnabled(newState);
    localStorage.setItem('sidebarHoverEnabled', newState.toString());
    setSettingsOpen(false);
  };

  const handleMenuClick = (menuId: string) => {
    if (!hoverEnabled) {
      setMenuStates(prev => ({
        ...prev,
        [menuId]: { ...prev[menuId], menuOpen: !prev[menuId].menuOpen },
      }));
    }
  };

  const handleMouseEnter = (menuId: string) => {
    if (hoverEnabled) {
      setMenuStates(prev => ({
        ...prev,
        [menuId]: { ...prev[menuId], isHovering: true },
      }));
    }
  };

  const handleMouseLeave = (menuId: string) => {
    if (hoverEnabled) {
      setMenuStates(prev => ({
        ...prev,
        [menuId]: { ...prev[menuId], isHovering: false },
      }));
    }
  };

  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  return (
    <div className={`sidebar ${!hoverEnabled ? 'no-hover' : ''}`}>
      <div className="sidebar-header">
        <h2>Teacher Panel</h2>
      </div>
      <nav className="sidebar-menu">
        <Link
          to="#"
          className={`menu-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
        >
          <span className="icon">📊</span>
          <span className="text">Dashboard</span>
        </Link>

        {/* {managementMenus.map(menu => (
          <div
            key={menu.id}
            className="menu-group"
            onMouseEnter={() => handleMouseEnter(menu.id)}
            onMouseLeave={() => handleMouseLeave(menu.id)}
          >
            <div
              className={`menu-item ${menuStates[menu.id]?.menuOpen || menuStates[menu.id]?.isHovering ? 'active' : ''}`}
              onClick={() => handleMenuClick(menu.id)}
            >
              <span className="icon">{menu.icon}</span>
              <span className="text">{menu.title}</span>
              <span className="arrow">{menuStates[menu.id]?.menuOpen || menuStates[menu.id]?.isHovering ? '▼' : '▶'}</span>
            </div>

            {(menuStates[menu.id]?.menuOpen || (menuStates[menu.id]?.isHovering && hoverEnabled)) && (
              <div className="sub-menu">
                {menu.items.map(item => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`submenu-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                  >
                    <span className="icon">{item.icon}</span>
                    <span className="text">{item.text}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))} */}

        <div className="menu-group">
          <div className={`menu-item`}>
            <span className="icon">🔍</span>
            <Link className={`menu-item`} to="/teacher/manageteacher"><span className="text">Search teacher</span></Link>
            
          </div>

          <div className={`menu-item`}>
            <span className="icon">📅</span>
            <Link className={`menu-item`} to="/teacher/app-appointment"> <span className="text">Manage Appointment</span></Link>
          </div>

          
        </div>


        <div className="menu-group">
          <div className={`menu-item ${settingsOpen ? 'active' : ''}`} onClick={toggleSettings}>
            <span className="icon">⚙️</span>
            <span className="text">Settings</span>
            <span className="arrow">{settingsOpen ? '▼' : '▶'}</span>
          </div>

          {settingsOpen && (
            <div className="sub-menu">
              <div className="submenu-item" onClick={toggleHover}>
                <span className="icon">{hoverEnabled ? '🔴' : '🟢'}</span>
                <span className="text">{hoverEnabled ? 'Disable Hover' : 'Enable Hover'}</span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
