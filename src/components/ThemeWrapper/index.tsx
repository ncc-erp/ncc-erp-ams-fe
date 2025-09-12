import { useTheme } from "../../context/ThemeContext";
import React, { useEffect, useState } from "react";

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const { isLoaded } = useTheme();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      // requestAnimationFrame ensures that CSS has been applied
      requestAnimationFrame(() => {
        setShouldRender(true);
      });
    }
  }, [isLoaded]);

  // If <ThemeWrapper> is not ready, show a placeholder
  if (!shouldRender) {
    return (
      <div
        aria-hidden="true"
        style={{
          visibility: "hidden",
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    );
  }

  // If <ThemeWrapper> is ready, render children
  return <>{children}</>;
};
