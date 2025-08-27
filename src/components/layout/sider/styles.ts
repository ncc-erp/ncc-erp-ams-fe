import { CSSProperties } from "react";

export const logoStyles: CSSProperties = {
  height: "50px",
  left: "50%",
  position: "relative",
  transform: "translateX(-50%)",
  marginTop: "10px",
  marginBottom: "10px",
};

export const antLayoutSider: CSSProperties = {
  position: "sticky",
  maxHeight: "calc(100vh - 48px)",
  overflowY: "auto",
  top: 0,
  border: "none",
  overflowX: "hidden",
};

export const antLayoutSiderMobile: CSSProperties = {
  position: "fixed",
  height: "100vh",
  zIndex: 999,
  border: "none",
};

export const mobileSiderWrapper: CSSProperties = {
  height: "100%",
  display: "flex",
  background: "var(--color-bg-sider)",
};

export const mobileSiderContent: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
};

export const menuItemStyles = (isSelected: boolean): CSSProperties => {
  return {
    fontWeight: isSelected ? "bold" : "normal",
    background: "var(--color-item-bg)",
    transition: "color 0.3s, background 0.3s",
  };
};

export const menuItemInnerStyles: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
