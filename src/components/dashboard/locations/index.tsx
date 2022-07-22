import { Col, Row } from "@pankod/refine-antd";
import { ILocation } from "interfaces/dashboard";
import { AssetsSummaryTable } from "./assets-summary-table";
import { AssetsSummaryPieChart } from "./assets-summary-pie-chart";
import "./style.less";

type LocationProps = {
  location: ILocation;
};

export const Locations = (props: LocationProps) => {
  const { location } = props;

  return (
    <div className="locationContainer">
      <Row gutter={16}>
        <Col className="gutter-row assets-summary-pie-chart" sm={24} md={10}>
          {location.assets_count !== 0 && (
            <AssetsSummaryPieChart
              categories={location.categories}
              name={location.name}
              count={location.assets_count}
            ></AssetsSummaryPieChart>
          )}
        </Col>
        <Col className="gutter-row assets-summary-table" sm={24} md={14}>
          {location.assets_count !== 0 && (
            <AssetsSummaryTable
              id={location.id}
              categories={location.categories}
            ></AssetsSummaryTable>
          )}
        </Col>
      </Row>
    </div>
  );
};
