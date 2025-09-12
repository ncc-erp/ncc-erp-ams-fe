import { CSSProperties } from "react";

export const layoutStyles: CSSProperties = {
  background: "var(--color-bg-base)", //`radial-gradient(50% 50% at 50% 50%, #63386A 0%, #310438 100%)`,
  backgroundSize: "cover",
};

export const fullHeightRow: CSSProperties = {
  height: "100vh",
};

export const containerStyles: CSSProperties = {
  maxWidth: "408px",
  margin: "auto",
  marginTop: "70px",
};

export const titleStyles: CSSProperties = {
  textAlign: "center",
  color: "var(--color-typography)",
  fontSize: "30px",
  letterSpacing: "-0.04em",
};

export const titleContentStyles: CSSProperties = {
  // Allow text to break onto the next line when it's too long (max 2 lines)
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
  maxWidth: "100%",
  maxHeight: "90px",
};

export const imageContainer: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "28px",
};

export const logo: CSSProperties = {
  height: "100px",
  marginTop: "-100px",
};

export const cardStyles: CSSProperties = {
  background: "var(--color-bg-elevated)",
  boxShadow: "var(--box-shadow)",
  borderRadius: "var(--border-radius)",
};

export const formItemStyles: CSSProperties = {
  marginBottom: "12px",
};

export const checkboxStyles: CSSProperties = {
  fontSize: "12px",
  color: "var(--color-checkbox-text)",
};

export const buttonLoginMezon: CSSProperties = {
  marginTop: "10px",
  backgroundColor: "var(--color-bg-container)",
  borderColor: "var(--color-border)",
  color: "var(--color-text)",
};

export const forgotPass: CSSProperties = {
  float: "right",
  fontSize: "12px",
};

// Remember me style
export const rememberContainer: CSSProperties = {
  marginBottom: "12px",
};

export const mezonLogoStyle: CSSProperties = {
  width: 20,
  marginRight: 10,
};
