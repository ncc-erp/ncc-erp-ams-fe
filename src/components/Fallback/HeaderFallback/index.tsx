import React from "react";
import { FallbackProps } from "react-error-boundary";
import { Button } from "antd";
import { useLogout, useNavigation } from "@pankod/refine-core";
import { LocalStorageKey } from "enums/LocalStorageKey";
import { AntdLayout, Icons } from "@pankod/refine-antd";
const { LogoutOutlined } = Icons;

const style: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "0px 24px",
  height: "64px",
  backgroundColor: "#FFF",
};

export const HeaderFallback: React.FC<FallbackProps> = () => {
  const { mutate: logout } = useLogout();
  const { push } = useNavigation();
  const logoutAccount = () => {
    logout();
    localStorage.removeItem(LocalStorageKey.UNAUTHORIZED);
    push("/login");
  };

  return (
    <div>
      <AntdLayout.Header style={style}>
        <Button
          type="link"
          onClick={() => {
            logoutAccount();
          }}
          data-test-id="logout-btn"
        >
          <LogoutOutlined />
        </Button>
      </AntdLayout.Header>
    </div>
  );
};

export default HeaderFallback;
