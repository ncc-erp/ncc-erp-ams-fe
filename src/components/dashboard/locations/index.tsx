import { Col, Row } from "@pankod/refine-antd";
import { ILocation } from "interfaces/dashboard";
import { AssetsSummaryTable } from "./assets-summary-table";
import { AssetsSummaryPieChart } from "./assets-summary-pie-chart";
import "./style.less";

type LocationProps = {
  location: ILocation;
  data: any;
};

export const Locations = (props: LocationProps) => {
  const { location, data } = props;

  return (
    <div className="locationContainer">
      <Row gutter={16}>
        <Col className="gutter-row assets-summary-pie-chart" sm={24} md={7}>
          {location.id === 99999 && (
            <AssetsSummaryPieChart
              categories={location.categories}
              name={location.name}
              count={location.items_count}
            ></AssetsSummaryPieChart>
          )}
        </Col>
        <Col className="gutter-row assets-summary-table" sm={24} md={17}>
          {location.id === 99999 && (
            <AssetsSummaryTable
              id={location.id}
              categories={location.categories}
              data={data}
            ></AssetsSummaryTable>
          )}
        </Col>
      </Row>
    </div>
  );
};
