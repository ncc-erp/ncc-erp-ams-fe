(function () {
  "use strict";

  // Mark as initializing to prevent FOUC
  document.documentElement.classList.add("theme-initializing");

  function getInitialTheme() {
    try {
      // Check localStorage first
      const savedTheme = localStorage.getItem("theme-mode");
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }

      // Check system preference
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
    } catch {}

    // Default to light theme
    return "light";
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";

    // Apply to document
    document.documentElement.setAttribute("data-theme", theme);

    // Apply to body
    if (document.body) {
      document.body.classList.remove("light-theme", "dark-theme");
      document.body.classList.add(isDark ? "dark-theme" : "light-theme");
    }

    // Set critical CSS custom properties for immediate effect
    const criticalVariables = {
      "--initial-theme-mode": theme,
      "--color-bg-base": isDark ? "#1f1f1f" : "#ffffff",
      "--color-bg-container": isDark ? "#282828" : "#ffffff",
      "--color-bg-elevated": isDark ? "#282828" : "#ffffff",
      "--color-bg-layout": isDark ? "#1f1f1f" : "#f5f5f5",
      "--color-text": isDark ? "rgba(255, 255, 255, 0.75)" : "#626262",
      "--color-bg-header": isDark ? "#292929" : "#ffffff",
      "--color-bg-body": isDark ? "#1f1f1f" : "#ffffff",
      "--color-bg-sider": "black",
      "--color-card-bg": isDark ? "#282828" : "#ffffff",
    };

    // Apply all critical variables immediately
    Object.entries(criticalVariables).forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value);
    });

    // Store for React
    window.INITIAL_THEME = theme;

    // Save to localStorage
    try {
      localStorage.setItem("theme-mode", theme);
    } catch {}
  }

  // Apply theme immediately before any rendering happens
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  // Use "requestAnimationFrame" to ensure that CSS has been applied
  function removeInitializingClass() {
    requestAnimationFrame(() => {
      // Ensure styles have been applied before revealing content
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("theme-initializing");
      });
    });
  }

  // Use DOMContentLoaded or execute immediately if already loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removeInitializingClass);
  } else {
    removeInitializingClass();
  }
})();
