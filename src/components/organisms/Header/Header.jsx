import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LANGUAGE_CONTENT } from '../../../constants/language';
import Icon from '../../atoms/Icon';
import ThemeToggle from '../../molecules/ThemeToggle';
import ProfileDropdown from '../../molecules/ProfileDropdown';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const content = LANGUAGE_CONTENT;

  const navigation = [
    { path: '/', label: content.navigation.dashboard, icon: 'home' },
    { path: '/public-library', label: content.navigation.publicLibrary, icon: 'folder' },
    { path: '/private-library', label: content.navigation.privateLibrary, icon: 'lock' }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo Section */}
        <div className="header__logo">
          <Link to="/" className="header__logo-link">
            <Icon name="symbolMethod" size="large" className="header__logo-icon" />
            <span className="header__logo-text">
              {content.appName}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="header__nav">
          <ul className="header__nav-list">
            {navigation.map((item) => (
              <li key={item.path} className="header__nav-item">
                <Link
                  to={item.path}
                  className={`header__nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                >
                  <Icon name={item.icon} size="small" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Section */}
        <div className="header__actions">
          <ThemeToggle />
          <ProfileDropdown />
        </div>

        {/* Mobile Menu Button */}
        <button className="header__mobile-menu">
          <Icon name="menu" size="medium" />
        </button>
      </div>
    </header>
  );
};

export default Header; 