import React, { CSSProperties } from "react";
import routerProvider from "@pankod/refine-react-router-v6";
import { TitleProps } from "@pankod/refine-core";

const { Link } = routerProvider;
const logo: CSSProperties = {
  height: "50px",
  left: "50%",
  position: "relative",
  transform: "translateX(-50%)",
  marginTop: "10px",
  marginBottom: "10px"
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => (
  <Link to="/">
    {collapsed ? (
      <img
        src={"/images/global/nccsoft-logo-small.png"}
        alt="NCC IT TOOL"
        style={logo}
      />
    ) : (
      <img
        src={"/images/global/nccsoft-logo-small.png"}
        alt="NCC IT TOOL"
        style={logo}
      />
    )}
  </Link>
);
