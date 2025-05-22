import React, { useEffect, useState } from "react";
import { Modal, Typography, Descriptions } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import { UserOutlined } from "@ant-design/icons";
import { HARDWARE_API } from "api/baseApi";
import { useCustom } from "@pankod/refine-core";
import { IDeviceDetailQr } from "interfaces/deviceDetailQr";
interface AssetDetailModalProps {
  id: string;
  onClose: () => void;
}
const { Text } = Typography;

const PopupDetailDevice: React.FC<AssetDetailModalProps> = ({
  id,
  onClose,
}) => {
  const t = useTranslate();
  const [device, setDevice] = useState<IDeviceDetailQr | null>(null);
  const url = `${HARDWARE_API}/${id}`;
  const { data, isLoading } = useCustom({
    url: url,
    method: "get",
  });

  useEffect(() => {
    if (data?.data) {
      setDevice(data.data as IDeviceDetailQr);
    }
  }, [device, data]);

  const renderField = (value: any, fallback = "n/a") => {
    return isLoading
      ? "Loading..."
      : value !== null && value !== undefined && value !== ""
        ? value
        : fallback;
  };

  return (
    <Modal
      title={t("hardware.label.title.detail")}
      footer={null}
      visible={true}
      onCancel={onClose}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label={t("model.label.field.id")}>
          {renderField(device?.id)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.status")}>
          <Text>
            {isLoading
              ? "Loading..."
              : device?.status_label?.name
                ? device.status_label.name === t("hardware.label.field.broken")
                  ? t("hardware.label.detail.broken")
                  : t("hardware.label.detail.readyToDeploy")
                : "n/a"}
            {device?.assigned_to && !isLoading ? (
              <>
                <UserOutlined />
                <span className="show-asset">
                  {renderField(device?.assigned_to?.name)}
                </span>
              </>
            ) : null}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.assetName")}>
          {renderField(device?.name)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.serial")}>
          {renderField(device?.serial)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.manufacturer")}>
          <p style={{ color: "blue" }}>
            {renderField(device?.manufacturer?.name)}
          </p>
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.category")}>
          {renderField(device?.category?.name)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.propertyType")}>
          {renderField(device?.model?.name)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.purchase_date")}>
          {renderField(device?.purchase_date?.formatted)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.supplier")}>
          <p style={{ color: "blue" }}>{renderField(device?.supplier)}</p>
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.rtd_location")}>
          <p style={{ color: "blue" }}>{renderField(device?.location?.name)}</p>
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.title.dateCreate")}>
          {renderField(device?.created_at?.formatted)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.title.updateAt")}>
          {renderField(device?.updated_at?.formatted)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.purchase_cost")}>
          {renderField(device?.purchase_cost?.formatted)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.checkin_counter")}>
          {renderField(device?.checkin_counter)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.checkout_counter")}>
          {renderField(device?.checkout_counter)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.notes")}>
          {renderField(device?.notes)}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.insurance")}>
          {renderField(device?.warranty_months)}
          {" ("}
          {t("hardware.label.field.warranty_expires")}
          {": "}
          {renderField(device?.warranty_expires?.formatted)}
          {")"}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.requestable")}>
          {renderField(device?.requests_counter)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PopupDetailDevice;
