import React, { createContext, useContext, useState, useEffect } from "react";
import "../styles/theme-variables.less";

export interface IThemeContext {
  isDarkMode: boolean;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};

export const ThemeProvider: React.FC<React.PropsWithChildren<object>> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem("theme-mode");
    if (saved) {
      return saved === "dark";
    }

    // Check system preferences
    if (window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    return false;
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("theme-mode", isDarkMode ? "dark" : "light");

    // Apply to document for compatibility with any non-Ant Design styles (<html data-theme='dark'>)
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );

    // Apply class to body for broader CSS targeting
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  const toggleTheme = (): void => {
    setIsDarkMode((prev) => !prev);
  };

  const setTheme = (theme: "light" | "dark") => {
    setIsDarkMode(theme === "dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        theme: isDarkMode ? "dark" : "light",
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
