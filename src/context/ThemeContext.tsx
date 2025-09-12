import React, {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import "../styles/theme-variables.less";

// Extend Window interface
declare global {
  interface Window {
    INITIAL_THEME?: string;
  }
}

export interface IThemeContext {
  isDarkMode: boolean;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  isLoaded: boolean; // Flag to track loading state
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export function getInitialTheme(): boolean {
  // Check if we have theme from script (SSR safe)
  if (typeof window !== "undefined" && window.INITIAL_THEME) {
    return window.INITIAL_THEME === "dark";
  }

  // Check document attribute for backward compatibility
  if (typeof document !== "undefined") {
    const themeAttr = document.documentElement.getAttribute("data-theme");
    if (themeAttr) {
      return themeAttr === "dark";
    }
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("theme-mode");
      if (saved) {
        return saved === "dark";
      }
    } catch {}

    try {
      if (window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    } catch {}
  }

  return false;
}

export const ThemeProvider: React.FC<React.PropsWithChildren<object>> = ({
  children,
}) => {
  // Use the initial theme from window.INITIAL_THEME
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);
  const [isLoaded, setIsLoaded] = useState(false);
  const themeChangeRef = useRef<boolean>(false);

  // Apply theme with useLayoutEffect to ensure it runs before render
  useLayoutEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    const isInitialRender = !themeChangeRef.current;

    // Apply to document
    document.documentElement.setAttribute("data-theme", theme);

    // Apply class to body
    document.body.classList.remove("dark-theme", "light-theme");
    document.body.classList.add(isDarkMode ? "dark-theme" : "light-theme");

    // Set important CSS variables directly to ensure immediate change
    const darkModeVars = {
      "--color-bg-base": isDarkMode ? "#1f1f1f" : "#ffffff",
      "--color-bg-container": isDarkMode ? "#282828" : "#ffffff",
      "--color-bg-layout": isDarkMode ? "#1f1f1f" : "#f5f5f5",
      "--color-bg-elevated": isDarkMode ? "#282828" : "#ffffff",
      "--color-text": isDarkMode ? "rgba(255, 255, 255, 0.75)" : "#626262",
      "--color-bg-header": isDarkMode ? "#292929" : "#ffffff",
      "--color-bg-body": isDarkMode ? "#1f1f1f" : "#ffffff",
      "--color-bg-sider": "black",
      "--color-card-bg": isDarkMode ? "#282828" : "#ffffff",
    };

    // Apply all critical variables immediately to override any inline styles
    Object.entries(darkModeVars).forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value);
    });

    // Store for script and React
    window.INITIAL_THEME = theme;

    // Save to localStorage
    try {
      localStorage.setItem("theme-mode", theme);
    } catch {}

    // Handle initial render vs theme change differently
    if (isInitialRender) {
      // Initial render: Just mark as loaded and remove initializing class
      requestAnimationFrame(() => {
        setIsLoaded(true);
        document.documentElement.classList.remove("theme-initializing");
        themeChangeRef.current = true;
      });
    } else {
      // Theme change: Add transition class, then remove it after animation completes
      document.documentElement.classList.add("theme-transition");

      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 300);
    }
  }, [isDarkMode]);

  // Handle system preference changes
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e: MediaQueryListEvent) => {
        const savedTheme = localStorage.getItem("theme-mode");
        if (!savedTheme) {
          setIsDarkMode(e.matches);
        }
      };

      // Add event listener
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } catch {
      // Fallback for older browsers that don't support addEventListener
      try {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        // Create a reusable handler function that we can reference later for removal
        const legacyHandler = function (this: MediaQueryList) {
          const savedTheme = localStorage.getItem("theme-mode");
          if (!savedTheme) {
            setIsDarkMode(this.matches);
          }
        };

        // Use deprecated method with proper typing
        mediaQuery.addListener(legacyHandler);

        return () => {
          try {
            // Properly remove the same handler
            mediaQuery.removeListener(legacyHandler);
          } catch {}
        };
      } catch {
        return undefined;
      }
    }
  }, []);

  const toggleTheme = (): void => {
    setIsDarkMode((prev) => !prev);
  };

  const setTheme = (theme: "light" | "dark") => {
    if ((theme === "dark") === isDarkMode) return;
    setIsDarkMode(theme === "dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        theme: isDarkMode ? "dark" : "light",
        toggleTheme,
        setTheme,
        isLoaded, // Flag to track loading state
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
