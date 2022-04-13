import React from "react";
import routerProvider from "@pankod/refine-react-router-v6";
import { TitleProps } from "@pankod/refine-core";

const { Link } = routerProvider;

export const Title: React.FC<TitleProps> = ({ collapsed }) => (
  <Link to="/">
    {collapsed ? (
      <img
        src={"/refine-collapsed.svg"}
        alt="NCC IT TOOL"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 24px",
        }}
      />
    ) : (
      <img
        src={"/images/global/nccsoft-logo.png"}
        alt="NCC IT TOOL"
        style={{
          width: "200px",
          padding: "12px 24px",
        }}
      />
    )}
  </Link>
);
