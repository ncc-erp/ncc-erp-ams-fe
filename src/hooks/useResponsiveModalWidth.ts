import { useState, useEffect } from "react";

enum WindowSize {
  Desktop = 1200,
  Laptop = 992,
  Tablet = 768,
}

enum ModalSize {
  Large = 1000,
  Medium = 800,
  Small = 600,
}

const getModalWidth = () => {
  const windowWidth = window.innerWidth;

  if (windowWidth > WindowSize.Desktop) return ModalSize.Large;
  if (windowWidth > WindowSize.Laptop) return ModalSize.Medium;
  if (windowWidth > WindowSize.Tablet) return ModalSize.Small;

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
