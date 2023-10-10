import { CSSProperties } from "react";

export const antLayoutSider: CSSProperties = {
  position: "sticky",
  maxHeight: "calc(100vh - 48px)",
  overflowY: "auto",
  top: 0,
  border: "none"
};
export const antLayoutSiderMobile: CSSProperties = {
  position: "fixed",
  height: "100vh",
  zIndex: 999,
  border: "none"
};
