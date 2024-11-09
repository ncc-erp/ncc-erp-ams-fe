import { useTranslate } from "@pankod/refine-core";
import { Typography } from "@pankod/refine-antd";

import "./style.less";

export const DailyOrders: React.FC = () => {
  const t = useTranslate();

  const { Text, Title } = Typography;
  return (
    <div className="daily-order-wrapper">
      <div className="title-area">
        <Title level={3}>{t("dashboard.dailyOrders.title")}</Title>
        <div className="title-area__number">
          <Text strong>{0} </Text>
        </div>
      </div>
      <div>Content</div>
    </div>
  );
};
