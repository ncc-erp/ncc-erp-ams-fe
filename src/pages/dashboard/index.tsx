import { Row, Col, Show, Select, Form, DatePicker } from "@pankod/refine-antd";
import "styles/antd.less";
import { Locations } from "components/dashboard/locations";
import {
  IResourceComponentsProps,
  useCustom,
  useTranslate,
} from "@pankod/refine-core";

import { DASHBOARD_API } from "api/baseApi";
import { useState } from "react";

export const DashboardPage: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();

  const { data, isLoading } = useCustom({
    url: DASHBOARD_API,
    method: "get",
  });

  const [locationSelected, setLocationSelected] = useState<number | null>(null);

  const handleChangeLocation = (value: any) => {
    if (value) {
      setLocationSelected(value);
    }
  };

  const { RangePicker } = DatePicker;

  return (
    <div className="dashboardContainer">
      <Show isLoading={isLoading} title={translate("dashboard.title")}>
        <Select
          allowClear
          placeholder="Lựa chọn vị trí"
          onChange={handleChangeLocation}
          defaultValue={data?.data.payload[data?.data.payload.length - 1]}
        >
          {(data?.data.payload || []).map((item: any) => (
            <Select.Option value={item.id} key={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
        <Form layout="vertical" className="search-month-location">
          <Form.Item label="Thời gian" name="purchase_date">
            <RangePicker />
          </Form.Item>
        </Form>

        <Row gutter={[12, 12]}>
          {(data?.data.payload || [])
            .filter(
              (item: any) =>
                locationSelected === null || item.id === locationSelected
            )
            .map((item: any, index: number) => (
              <Col key={index} sm={24} md={24}>
                <Locations location={item}></Locations>
              </Col>
            ))}
        </Row>
      </Show>
    </div>
  );
};
