import { AntdLayout, Grid } from "@pankod/refine-antd";
import { LayoutProps } from "@pankod/refine-core";
import { FC, PropsWithChildren, useEffect, useState, useMemo } from "react";
import { UnauthorizedModal } from "components/Modal/UnauthorizedModal";
import { EBooleanString } from "constants/common";
import { LocalStorageKey } from "enums/LocalStorageKey";
import { ErrorBoundary } from "react-error-boundary";
import { Fallback } from "components/Fallback/ContentFallback";
import { useLocation } from "react-router-dom";
import HeaderFallback from "components/Fallback/HeaderFallback";

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

  const ContentWithBoundary: FC<PropsWithChildren<any>> = ({ children }) => {
    const location = useLocation();
    return (
      <ErrorBoundary
        FallbackComponent={Fallback}
        resetKeys={[location.pathname, location.search]}
        onReset={() => {
          window.location.reload();
        }}
      >
        {children}
      </ErrorBoundary>
    );
  };

  const SiderNode = useMemo(() => (Sider ? <Sider /> : null), [Sider]);
  const HeaderNode = useMemo(
    () =>
      Header ? (
        <ErrorBoundary FallbackComponent={HeaderFallback}>
          <Header />
        </ErrorBoundary>
      ) : null,
    [Header]
  );

  return (
    <AntdLayout style={{ minHeight: "100vh", flexDirection: "row" }}>
      {SiderNode}
      <AntdLayout>
        {HeaderNode}
        <AntdLayout.Content>
          <div
            style={{
              padding: breakpoint.sm ? 24 : 12,
              minHeight: 360,
            }}
          >
            <ContentWithBoundary>{children}</ContentWithBoundary>
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
