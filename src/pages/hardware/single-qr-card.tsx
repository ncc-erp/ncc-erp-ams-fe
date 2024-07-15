import { IHardwareResponse } from "interfaces/hardware";
import React from "react";
import QRCode from 'react-qr-code';
interface SingleQrCardProps {
    detail: IHardwareResponse;
    layout: 'above' | 'below';
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
    
  return (
    <div
      key={detail?.id}
      style={{
        height: 500,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        marginLeft: "12rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: paddingStyle,
          border: "1px solid black",
          borderRadius: "8px",
        }}
      >
        {layout === "above" && renderSelectedFields(detail?.model?.name!)}
        <QRCode
          size={250}
          value={generateRedirectUrl(detail!)}
          style={{ marginBottom: "20px" }}
        />
        {layout === "below" && renderSelectedFields(detail?.model?.name!)}
      </div>
    </div>
  );
};

export default SingleQrCard;
