import { Row, Col, Show } from "@pankod/refine-antd";

import { Locations } from "components/dashboard/locations";
import { useCustom } from "@pankod/refine-core";

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useCustom({ url: "api/v1/dashboard", method: "get" });

  return (
    <div className="dashboardContainer">
      <Show isLoading={isLoading}>
        <Row gutter={[12, 12]}>
          {( data?.data.payload || []).map((item: any) => (
            <Col sm={24} md={24}>
              <Locations location={item}></Locations>
            </Col>
          ))}
        </Row>
      </Show>
    </div>
  );
};
