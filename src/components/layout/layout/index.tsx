import { AntdLayout, Grid } from "@pankod/refine-antd";
import { LayoutProps } from "@pankod/refine-core";
import { FC, PropsWithChildren } from "react";

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  children,
  Sider,
  Header,
  Footer,
  OffLayoutArea,
}) => {
  const breakpoint = Grid.useBreakpoint();

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
    </AntdLayout>
  );
};
