import { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, THEME_CONFIG, DEFAULT_THEME } from '../constants/themes';

// Create theme context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or use default
    const savedTheme = localStorage.getItem('vira-library-theme');
    return savedTheme && Object.values(THEMES).includes(savedTheme) 
      ? savedTheme 
      : DEFAULT_THEME;
  });

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const themeConfig = THEME_CONFIG[theme];
    
    // Set data-theme attribute for CSS selectors
    root.setAttribute('data-theme', theme);
    
    // Apply CSS custom properties
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
    
    // Save to localStorage
    localStorage.setItem('vira-library-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes = Object.values(THEMES);
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const setSpecificTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  const getCurrentThemeConfig = () => THEME_CONFIG[theme];

  const value = {
    theme,
    setTheme: setSpecificTheme,
    toggleTheme,
    themes: THEMES,
    themeConfig: getCurrentThemeConfig(),
    allThemeConfigs: THEME_CONFIG
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 