import React from "react";
import routerProvider from "@pankod/refine-react-router-v6";
import { TitleProps } from "@pankod/refine-core";

const { Link } = routerProvider;

export const Title: React.FC<TitleProps> = ({ collapsed }) => (
  <Link to="/">
    {collapsed ? (
      <img
        src={"/images/global/nccsoft-logo-small.png"}
        alt="NCC IT TOOL"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 29px 10px 10px",
          width: "100px",
        }}
      />
    ) : (
      <img
        src={"/images/global/nccsoft-logo.png"}
        alt="NCC IT TOOL"
        style={{
          width: "200px",
          padding: "12px 24px",
          background: "white",
        }}
      />
    )}
  </Link>
);
