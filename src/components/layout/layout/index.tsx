import React, { useEffect, useState } from "react";

import { LayoutProps, usePermissions, useNavigation } from "@pankod/refine-core";
import routerProvider from "@pankod/refine-react-router-v6";
import { AntdLayout, Grid } from "@pankod/refine-antd";

export const Layout: React.FC<LayoutProps> = ({
  children,
  Sider,
  Header,
  Footer,
  OffLayoutArea,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { pathname } = routerProvider.useLocation();
  const { push } = useNavigation();
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
