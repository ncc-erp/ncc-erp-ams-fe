import React, { useEffect, useState } from "react";
import { Modal, Typography, Descriptions, Tag } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";
import { getDetailAssetStatusByName } from "untils/assets";
interface AssetDetailModalProps {
  url: string;
  onClose: () => void;
}
const { Text } = Typography;

const PopupDetailDevice: React.FC<AssetDetailModalProps> = ({
  url,
  onClose,
}) => {
  const t = useTranslate();
  const [data, setData] = useState({
    id: "",
    name: "",
    status: "",
    serial: "",
    manufacturer: "",
    category: "",
    model: "",
    purchase_date: "",
    supplier: "",
    location: "",
    created_at: "",
    updated_at: "",
    purchase_cost: "",
    assigned_to: "",
    checkin_counter: "",
    checkout_counter: "",
    notes: "",
    warranty_expires: "",
    requests_counter: "",
  });

  useEffect(() => {
    const parsedUrl = new URL(url);
    const searchParams = new URLSearchParams(parsedUrl.search);
    setData({
      id: searchParams.get("id") || "",
      name: searchParams.get("name") || "",
      status: searchParams.get("status") || "",
      serial: searchParams.get("serial") || "",
      manufacturer: searchParams.get("manufacturer") || "",
      category: searchParams.get("category") || "",
      model: searchParams.get("model") || "",
      purchase_date: searchParams.get("purchase_date") || "",
      supplier: searchParams.get("supplier") || "",
      location: searchParams.get("location") || "",
      created_at: searchParams.get("created_at") || "",
      updated_at: searchParams.get("updated_at") || "",
      purchase_cost: searchParams.get("purchase_cost") || "",
      assigned_to: searchParams.get("assigned_to") || "",
      checkin_counter: searchParams.get("checkin_counter") || "",
      checkout_counter: searchParams.get("checkout_counter") || "",
      notes: searchParams.get("notes") || "",
      warranty_expires: searchParams.get("warranty_expires") || "",
      requests_counter: searchParams.get("requests_counter") || "",
    });
  }, [url]);
  return (
    <Modal
      title={t("hardware.label.title.detail")}
      footer={null}
      visible={true}
      onCancel={onClose}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label={t("model.label.field.id")}>
          {data.id || "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.status")}>
        <Text>
            <Tag>{getDetailAssetStatusByName(data.status)}</Tag>
            {data?.assigned_to ? (
              <>
                <UserOutlined />{" "}
                <span className="show-asset">
                  {data?.assigned_to ? data?.assigned_to : ""}
                </span>
              </>
            ) : (
              ""
            )}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.assetName")}>
          {data.name || "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.serial")}>
          {data.serial || "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.manufacturer")}>
          <p style={{ color: "blue" }}>
            {data.manufacturer || "n/a"}
          </p>
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.category")}>
          {data.category || "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.propertyType")}>
          {data.model || "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.purchase_date")}>
          {data.purchase_date || "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.supplier")}>
          <p style={{ color: "blue" }}>
            {data.supplier || "n/a"}
          </p>
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.rtd_location")}>
          <p style={{ color: "blue" }}>
            {data.location || "n/a"}
          </p>
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.title.dateCreate")}>
        {data?.created_at ? (
            <Text> {data?.created_at && moment(data?.created_at).add(moment.duration(moment().format('Z'))).format('ddd MMM D, YYYY h:mmA')}</Text>
          ) : (
            "n/a"
          )}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.title.updateAt")}>
          {data?.updated_at ? (
            <Text> {data?.updated_at && moment(data?.updated_at).add(moment.duration(moment().format('Z'))).format('ddd MMM D, YYYY h:mmA')}</Text>
          ) : (
            "n/a"
          )}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.purchase_cost")}>
          {data.purchase_cost || "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.checkin_counter")}>
          {data.checkin_counter || "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.notes")}>
          {data.notes || "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.insurance")}>
          {data.warranty_expires || "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label={t("hardware.label.field.checkout_counter")}>
          <Text>{data?.checkout_counter}</Text>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PopupDetailDevice;
