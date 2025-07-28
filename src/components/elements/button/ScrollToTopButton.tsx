import React, { useState } from "react";
import { Button } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import useDebouncedEventListener from "hooks/useDebouncedEventListener";
import useWindowWidth from "hooks/useWindowWidth";
import { WindowSize } from "constants/responsive";
import { DATA_TEST_ID } from "__tests__/constants/data-test-id";

const SCROLL_TO_TOP_OFFSET = 250;

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useDebouncedEventListener(
    "scroll",
    () => {
      const shouldShow = window.pageYOffset > SCROLL_TO_TOP_OFFSET;
      setVisible((prev) => (prev !== shouldShow ? shouldShow : prev));
    },
    100
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const windowWidth = useWindowWidth();

  return (
    <Button
      shape="circle"
      icon={<ArrowUpOutlined />}
      size={windowWidth > WindowSize.MOBILE ? "large" : "middle"}
      onClick={scrollToTop}
      style={{
        position: "fixed",
        zIndex: 1000,
        right: windowWidth > WindowSize.MOBILE ? 40 : "50%",
        bottom: 40,
        transform:
          windowWidth > WindowSize.MOBILE ? undefined : "translateX(50%)",
        display: visible ? "block" : "none",
        background: "#888",
        color: "#fff",
        border: "none",
      }}
      aria-label="Scroll to top"
      type="default"
      ghost
      data-testid={DATA_TEST_ID.SCROLL_TO_TOP_BUTTON}
    />
  );
};

export default ScrollToTopButton;
