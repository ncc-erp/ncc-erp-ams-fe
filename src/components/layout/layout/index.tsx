import { AntdLayout, Grid } from "@pankod/refine-antd";
import { LayoutProps } from "@pankod/refine-core";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { UnauthorizedModal } from "components/Modal/UnauthorizedModal";

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  children,
  Sider,
  Header,
  Footer,
  OffLayoutArea,
}) => {
  const breakpoint = Grid.useBreakpoint();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(
    localStorage.getItem("unauthorized") === "true"
  );

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthModalVisible(true);
    };
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
      if (localStorage.getItem("unauthorized") === "true") {
        localStorage.removeItem("unauthorized");
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
