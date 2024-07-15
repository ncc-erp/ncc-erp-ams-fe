// MultiQrCard.tsx
import { IHardwareResponse } from 'interfaces/hardware';
import React from 'react';
import QRCode from 'react-qr-code';

interface MultiQrCardProps {
  hardware: IHardwareResponse;
  layout: 'above' | 'below';
  paddingStyle: string;
  renderSelectedFields: (modelName: string) => React.ReactNode;
  generateRedirectUrl: (hardware: IHardwareResponse) => string;
  handleDeleteQrCode: (id: number) => void;
}

const MultiQrCards: React.FC<MultiQrCardProps> = ({
  hardware,
  layout,
  paddingStyle,
  renderSelectedFields,
  generateRedirectUrl,
  handleDeleteQrCode,
}) => {
  return (
    <div key={hardware.id}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: paddingStyle,
          border: "1px solid black",
          borderRadius: "8px",
          position: "relative",
          width: "200px",
          height: "200px",
        }}
      >
        {layout === "above" && renderSelectedFields(hardware?.model?.name)}
        <QRCode size={120} value={generateRedirectUrl(hardware)} />
        <div
          onClick={() => handleDeleteQrCode(hardware.id)}
          className="delete__qrcode"
        >
          x
        </div>
        {layout === "below" && renderSelectedFields(hardware?.model?.name)}
      </div>
    </div>
  );
};

export default MultiQrCards;
