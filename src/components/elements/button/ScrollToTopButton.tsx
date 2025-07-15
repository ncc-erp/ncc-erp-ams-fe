import React, { useState } from "react";
import { Button } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import useDebouncedEventListener from "hooks/useDebouncedEventListener";

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useDebouncedEventListener(
    "scroll",
    () => {
      const shouldShow = window.pageYOffset > 250;
      setVisible((prev) => (prev !== shouldShow ? shouldShow : prev));
    },
    100
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useDebouncedEventListener(
    "resize",
    () => {
      setWindowWidth(window.innerWidth);
    },
    100
  );

  return (
    <Button
      shape="circle"
      icon={<ArrowUpOutlined />}
      size="large"
      onClick={scrollToTop}
      style={{
        position: "fixed",
        zIndex: 1000,
        right: windowWidth > 600 ? 40 : "50%",
        bottom: 40,
        transform: windowWidth > 600 ? undefined : "translateX(50%)",
        display: visible ? "block" : "none",
        background: "#888",
        color: "#fff",
        border: "none",
      }}
      aria-label="Scroll to top"
      type="default"
      ghost
    />
  );
};

export default ScrollToTopButton;
