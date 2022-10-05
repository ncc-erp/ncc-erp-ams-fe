import { Col, Row } from "@pankod/refine-antd";
import { ILocation } from "interfaces/dashboard";
import { AssetsSummaryPieChart } from "./assets-summary-pie-chart";
import "./style.less";
import { AssetsSummaryTableAllLocation } from "./assets-summary-table/index-all-location";

type LocationProps = {
  location: ILocation;
};

export const AllLocations = (props: LocationProps) => {
  const { location } = props;
  const items_count =
    location.assets_count +
    location.accessories_count +
    location.consumables_count;
    
    
  return (
    <div className="locationContainer">
      <Row gutter={16}>
        <Col className="gutter-row assets-summary-pie-chart" sm={24} md={7}>
          <AssetsSummaryPieChart
            categories={location.categories}
            name={location.name}
            count={items_count}
          ></AssetsSummaryPieChart>
        </Col>
        <Col className="gutter-row assets-summary-table" sm={24} md={17}>
          <AssetsSummaryTableAllLocation
            id={location.id}
            categories={location.categories}
          ></AssetsSummaryTableAllLocation>
        </Col>
      </Row>
    </div>
  );
};
