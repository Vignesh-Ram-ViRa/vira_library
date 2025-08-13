import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.jsx';
import Icon from '../../atoms/Icon';
import { LANGUAGE_CONTENT } from '../../../constants/language';
import './ProfileDropdown.css';

const ProfileDropdown = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const content = LANGUAGE_CONTENT;
  const { user, isGuest, isAuthenticated, displayName, signOut } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAbout = () => {
    setIsOpen(false);
    navigate('/about');
  };

  const handleLogin = () => {
    setIsOpen(false);
    navigate('/login');
  };

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await signOut();
      navigate('/'); // Redirect to dashboard after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserIcon = () => {
    if (isGuest) return 'organization';
    if (isAuthenticated) return 'account';
    return 'person';
  };

  const getUserStatus = () => {
    if (isGuest) return 'Guest Mode';
    if (isAuthenticated) return 'Owner';
    return 'Not Logged In';
  };

  return (
    <div className={`profile-dropdown ${className}`} ref={dropdownRef}>
      <button
        className={`profile-dropdown__trigger ${isGuest ? 'profile-dropdown__trigger--guest' : ''}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`${displayName} (${getUserStatus()})`}
      >
        <Icon name={getUserIcon()} size="medium" />
      </button>

      {isOpen && (
        <div className="profile-dropdown__menu">
          <div className="profile-dropdown__arrow" />
          
          {/* User Info */}
          <div className="profile-dropdown__user-info">
            <div className="profile-dropdown__user-name">{displayName}</div>
            <div className="profile-dropdown__user-status">{getUserStatus()}</div>
          </div>
          
          <div className="profile-dropdown__divider" />
          
          <button
            className="profile-dropdown__item"
            onClick={handleAbout}
          >
            <Icon name="info" size="small" />
            <span>About</span>
          </button>
          
          {!user && (
            <button
              className="profile-dropdown__item"
              onClick={handleLogin}
            >
              <Icon name="signIn" size="small" />
              <span>Login</span>
            </button>
          )}
          
          {user && (
            <>
              <div className="profile-dropdown__divider" />
              <button
                className="profile-dropdown__item profile-dropdown__item--danger"
                onClick={handleLogout}
              >
                <Icon name="signOut" size="small" />
                <span>{isGuest ? 'Exit Guest Mode' : content.auth.logout}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 