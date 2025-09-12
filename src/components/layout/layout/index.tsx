import { AntdLayout, Grid } from "@pankod/refine-antd";
import { LayoutProps } from "@pankod/refine-core";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { UnauthorizedModal } from "components/Modal/UnauthorizedModal";
import { EBooleanString } from "constants/common";
import { LocalStorageKey } from "enums/LocalStorageKey";

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  children,
  Sider,
  Header,
  Footer,
  OffLayoutArea,
}) => {
  const breakpoint = Grid.useBreakpoint();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(
    localStorage.getItem(LocalStorageKey.UNAUTHORIZED) === EBooleanString.TRUE
  );

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthModalVisible(true);
    };
    window.addEventListener(LocalStorageKey.UNAUTHORIZED, handleUnauthorized);
    return () => {
      window.removeEventListener(
        LocalStorageKey.UNAUTHORIZED,
        handleUnauthorized
      );
      if (
        localStorage.getItem(LocalStorageKey.UNAUTHORIZED) ===
        EBooleanString.TRUE
      ) {
        localStorage.removeItem(LocalStorageKey.UNAUTHORIZED);
      }
    };
  }, []);

  return (
    <AntdLayout style={{ minHeight: "100vh", flexDirection: "row" }}>
      {Sider && <Sider />}
      <AntdLayout>
        {Header && <Header />}
        <AntdLayout.Content>
          <div
            style={{
              padding: breakpoint.sm ? 24 : 12,
              minHeight: 360,
            }}
          >
            {children}
          </div>
          {OffLayoutArea && <OffLayoutArea />}
        </AntdLayout.Content>
        {Footer && <Footer />}
      </AntdLayout>
      <UnauthorizedModal
        visible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
      />
    </AntdLayout>
  );
};
