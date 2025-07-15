import { useState, useEffect } from "react";
import { WindowSize } from "constants/responsive";

enum ModalSize {
  Large = 1000,
  Medium = 800,
  Small = 600,
}

const getModalWidth = () => {
  const windowWidth = window.innerWidth;

  if (windowWidth > WindowSize.DESKTOP) return ModalSize.Large;
  if (windowWidth > WindowSize.LAPTOP) return ModalSize.Medium;
  if (windowWidth > WindowSize.TABLET) return ModalSize.Small;

  return windowWidth - 40;
};

export const useResponsiveModalWidth = () => {
  const [modalWidth, setModalWidth] = useState(getModalWidth());
  useEffect(() => {
    const handleResize = () => {
      setModalWidth(getModalWidth());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return modalWidth;
};
