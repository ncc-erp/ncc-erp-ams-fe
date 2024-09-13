
import React, { useState } from "react";
import { Select, Checkbox, Button } from "antd";
import { useTranslation } from "react-i18next";
import { CheckboxChangeEvent } from "antd/es/checkbox";

interface QrControlPanelProps {
  layout: "above" | "below" | null;
  setLayout: (value: "above" | "below") => void;
  handleFieldChange: (field: string) => void;
  handlePrint: () => void;
}

const QrControlPanel: React.FC<QrControlPanelProps> = ({
  layout,
  setLayout,
  handleFieldChange,
  handlePrint,
}) => {
  const { t } = useTranslation();
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleCheckboxChange = (e:CheckboxChangeEvent) => {
    const checked = e.target.checked;
    setIsCheckboxChecked(checked);
    handleFieldChange("name");
    setLayout("below");
  };

  return (
    <div className="list__acction__qrcode">
      <div className="select__qrcode">
        <div style={{ marginBottom: 16 }}>
          <Select
            value={layout}
            onChange={(value) => setLayout(value as "above" | "below")}
            style={{ width: "100%" }}
            disabled={!isCheckboxChecked}
          >
            <Select.Option value="above">
              {t("user.label.title.above")}
            </Select.Option>
            <Select.Option value="below">
              {t("user.label.title.below")}
            </Select.Option>
          </Select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Checkbox onChange={handleCheckboxChange}>
            {t("user.label.title.codeDevice")}
          </Checkbox>
        </div>
      </div>
      <Button type="primary" className="gen__qrcode" onClick={handlePrint}>
        {t("hardware.label.field.qr_code")}
      </Button>
    </div>
  );
};

export default QrControlPanel;
