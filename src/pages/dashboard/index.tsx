import { Row, Col, Show } from "@pankod/refine-antd";

import { Locations } from "components/dashboard/locations";
import { IResourceComponentsProps, useCustom, useTranslate } from "@pankod/refine-core";
import { DASHBOARD_API } from "api/baseApi";

export const DashboardPage: React.FC<IResourceComponentsProps> = () => {
  const { data, isLoading } = useCustom({
    url: DASHBOARD_API,
    method: "get",
  });

  const translate = useTranslate();

  return (
    <div className="dashboardContainer">
      <Show isLoading={isLoading} title={translate("dashboard.title")}>
        <Row gutter={[12, 12]}>
          {(data?.data.payload || []).map((item: any, index: number) => (
            <Col key={index} sm={24} md={24}>
              <Locations location={item}></Locations>
            </Col>
          ))}
        </Row>
      </Show>
    </div>
  );
};
