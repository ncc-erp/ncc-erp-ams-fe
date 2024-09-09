import { useState, useEffect } from "react";

const getModalWidth = () => {
  const windowWidth = window.innerWidth;
  if (windowWidth > 1200) return 1000;
  if (windowWidth > 992) return 800;
  if (windowWidth > 768) return 600;
  return windowWidth - 40; // 20px margin on each side
};

export const useResponsiveModalWidth = () => {
  const [modalWidth, setModalWidth] = useState(getModalWidth());
    console.log(modalWidth)
    console.log(window.innerWidth)
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