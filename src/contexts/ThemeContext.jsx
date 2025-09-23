import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  emerald: {
    name: 'Emerald',
    primary: 'emerald-primary',
    secondary: 'emerald-secondary',
    accent: 'emerald-accent',
    gradient: 'from-emerald-primary to-emerald-secondary',
    glowColor: '#10b981'
  },
  cobalt: {
    name: 'Cobalt Blue',
    primary: 'cobalt-primary',
    secondary: 'cobalt-secondary',
    accent: 'cobalt-accent',
    gradient: 'from-cobalt-primary to-cobalt-secondary',
    glowColor: '#3b82f6'
  },
  magenta: {
    name: 'Magenta',
    primary: 'magenta-primary',
    secondary: 'magenta-secondary',
    accent: 'magenta-accent',
    gradient: 'from-magenta-primary to-magenta-secondary',
    glowColor: '#d946ef'
  },
  crimson: {
    name: 'Crimson',
    primary: 'crimson-primary',
    secondary: 'crimson-secondary',
    accent: 'crimson-accent',
    gradient: 'from-crimson-primary to-crimson-secondary',
    glowColor: '#dc2626'
  },
  tangerine: {
    name: 'Tangerine',
    primary: 'tangerine-primary',
    secondary: 'tangerine-secondary',
    accent: 'tangerine-accent',
    gradient: 'from-tangerine-primary to-tangerine-secondary',
    glowColor: '#ea580c'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('emerald');
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('ovi-theme');
    const isReturningUser = localStorage.getItem('ovi-user-setup');
    
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    
    if (isReturningUser) {
      setIsFirstTime(false);
    }
  }, []);

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('ovi-theme', theme);
  };

  const completeSetup = () => {
    setIsFirstTime(false);
    localStorage.setItem('ovi-user-setup', 'true');
  };

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      theme,
      themes,
      changeTheme,
      isFirstTime,
      completeSetup
    }}>
      {children}
    </ThemeContext.Provider>
  );
};