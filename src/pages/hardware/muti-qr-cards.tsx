
import { IHardwareResponse } from 'interfaces/hardware';
import React from 'react';
import QRCode from 'react-qr-code';

interface MultiQrCardProps {
  hardwareList: IHardwareResponse[];
  layout: 'above' | 'below' | null;
  paddingStyle: string;
  renderSelectedFields: (modelName: string) => React.ReactNode;
  generateRedirectUrl: (hardware: IHardwareResponse) => string;
  handleDeleteQrCode: (id: number) => void;
}

const MultiQrCards: React.FC<MultiQrCardProps> = ({
  hardwareList,
  layout,
  paddingStyle,
  renderSelectedFields,
  generateRedirectUrl,
  handleDeleteQrCode,
}) => {
  return (
    <>
      {hardwareList.map((hardware) => (
        <div key={hardware.id}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: '20px',
              border: "1px solid black",
              borderRadius: "8px",
              position: "relative",
              width: "85%",
              margin: "auto"
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
      ))}
    </>
  );
};

export default MultiQrCards;
