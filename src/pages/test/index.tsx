import { Row, Col, Show } from "@pankod/refine-antd";

import { Locations } from "components/dashboard/locations";
import { useCustom } from "@pankod/refine-core";

export const TestPage: React.FC = () => {
  const { data, isLoading } = useCustom({ url: "api/v1/dashboard", method: "get" });

  return (
    <div className="dashboardContainer">
      vvv
    </div>
  );
};
