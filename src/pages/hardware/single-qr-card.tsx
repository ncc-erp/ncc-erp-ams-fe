import { IHardwareResponse } from "interfaces/hardware";
import React from "react";
import QRCode from "react-qr-code";
import "../../styles/single-qr-code.less";
interface SingleQrCardProps {
  detail: IHardwareResponse;
  layout: "above" | "below" | null;
  paddingStyle: string;
  renderSelectedFields: (modelName: string) => React.ReactNode;
  generateRedirectUrl: (detail: IHardwareResponse) => string;
}
const SingleQrCard: React.FC<SingleQrCardProps> = ({
  detail,
  layout,
  paddingStyle,
  renderSelectedFields,
  generateRedirectUrl,
}) => {
  if (!detail) {
    return null;
  }
  return (
    <div key={detail.id} className="single-qr-card">
      <div className="qr-card-content" style={{ padding: paddingStyle }}>
        {layout === "above" && renderSelectedFields(detail.name)}
        <QRCode className="qr-code" value={generateRedirectUrl(detail)} />
        {layout === "below" && renderSelectedFields(detail.name)}
      </div>
    </div>
  );
};

export default SingleQrCard;
