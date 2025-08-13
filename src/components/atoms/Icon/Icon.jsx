import React from 'react';
import * as VscIcons from 'react-icons/vsc';
import './Icon.css';

const Icon = ({ 
  name, 
  size = 'medium',
  color,
  className = '',
  onClick,
  title,
  ...props 
}) => {
  // Convert icon name to proper format (e.g., 'home' -> 'VscHome')
  const iconName = `Vsc${name.charAt(0).toUpperCase() + name.slice(1)}`;
  const IconComponent = VscIcons[iconName];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in VS Code icons`);
    return null;
  }

  const iconClasses = [
    'icon',
    `icon--${size}`,
    onClick && 'icon--clickable',
    className
  ].filter(Boolean).join(' ');

  const iconStyles = color ? { color } : {};

  return (
    <span 
      className={iconClasses}
      style={iconStyles}
      onClick={onClick}
      title={title}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      {...props}
    >
      <IconComponent />
    </span>
  );
};

export default Icon; 