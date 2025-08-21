import { CSSProperties } from "react";

export const headerStyles: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "0px 24px",
  height: "64px",
  backgroundColor: "var(--color-bg-header)",
};

export const IoQrCodeSharpStyles: CSSProperties = {
  marginRight: "25px",
  backgroundColor: "none",
  border: "none",
};

// Username styles + style of .ant-typography (theme-variables.less)
export const usernameStyles: CSSProperties = {
  fontWeight: "500",
  fontSize: "16px",
};

export const userInfoSpaceStyles: CSSProperties = { marginLeft: "8px" };
