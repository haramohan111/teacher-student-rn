import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation(); // Get current browser URL
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const [menuStates, setMenuStates] = useState<{ [key: string]: { isHovering: boolean; menuOpen: boolean } }>({});
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

    const initialMenuStates: { [key: string]: { isHovering: boolean; menuOpen: boolean } } = {};
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
    const updatedStates: { [key: string]: { isHovering: boolean; menuOpen: boolean } } = {};
    managementMenus.forEach(menu => {
      const isActive = menu.items.some(item => location.pathname.startsWith(item.path));
      updatedStates[menu.id] = {
        isHovering: false,
        menuOpen: isActive || menuStates[menu.id]?.menuOpen || false
      };
    });
    setMenuStates(prev => ({ ...prev, ...updatedStates }));
  }, [location.pathname]);

  const toggleHover = () => {
    const newState = !hoverEnabled;
    setHoverEnabled(newState);
    localStorage.setItem('sidebarHoverEnabled', newState.toString());

    if (!newState) {
      const updatedStates: { [key: string]: { isHovering: boolean; menuOpen: boolean } } = {};
      Object.keys(menuStates).forEach(menuId => {
        updatedStates[menuId] = { ...menuStates[menuId], menuOpen: false };
      });
      setMenuStates(updatedStates);
    }
    setSettingsOpen(false);
  };

  const handleMenuClick = (menuId: string) => {
    if (!hoverEnabled) {
      setMenuStates(prev => ({
        ...prev,
        [menuId]: {
          ...prev[menuId],
          menuOpen: !prev[menuId].menuOpen
        }
      }));
    }
  };

  const handleMouseEnter = (menuId: string) => {
    if (hoverEnabled) {
      setMenuStates(prev => ({
        ...prev,
        [menuId]: {
          ...prev[menuId],
          isHovering: true
        }
      }));
    }
  };

  const handleMouseLeave = (menuId: string) => {
    if (hoverEnabled) {
      setMenuStates(prev => ({
        ...prev,
        [menuId]: {
          ...prev[menuId],
          isHovering: false
        }
      }));
    }
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <div className={`sidebar ${!hoverEnabled ? 'no-hover' : ''}`}>
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-menu">
        <Link
          to="/admin/dashboard"
          className={`menu-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
        >
          <span className="icon">📊</span>
          <span className="text">Dashboard</span>
        </Link>

        {/* Dynamic Management Menus */}
        {managementMenus.map(menu => (
          <div
            key={menu.id}
            className="menu-group"
            onMouseEnter={() => handleMouseEnter(menu.id)}
            onMouseLeave={() => handleMouseLeave(menu.id)}
          >
            <div
              className={`menu-item ${
                menuStates[menu.id]?.menuOpen || menuStates[menu.id]?.isHovering ? 'active' : ''
              }`}
              onClick={() => handleMenuClick(menu.id)}
            >
              <span className="icon">{menu.icon}</span>
              <span className="text">{menu.title}</span>
              <span className="arrow">
                {menuStates[menu.id]?.menuOpen || menuStates[menu.id]?.isHovering ? '▼' : '▶'}
              </span>
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
        ))}

        {/* Settings Menu */}
        <div className="menu-group">
          <div
            className={`menu-item ${settingsOpen ? 'active' : ''}`}
            onClick={toggleSettings}
          >
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
