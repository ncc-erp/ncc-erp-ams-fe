import React, { useEffect, useState } from "react";
import { Modal, Typography, Descriptions } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
interface AssetDetailModalProps {
  url: string;
  onClose: () => void;
}

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
    });
  }, [url]);
  return (
    <Modal
      title="Chi tiết tài sản"
      footer={null}
      visible={true}
      onCancel={onClose}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
        <Descriptions.Item label="Trạng Thái">
          <div style={{ display: "flex" }}>
            <p>
              {data.status && data.status === t("hardware.label.field.broken")
                ? t("hardware.label.detail.broken")
                : data.status
                ? t("hardware.label.detail.readyToDeploy")
                : "n/a"}{" "}
            </p>
            <p style={{ color: "blue", marginLeft: "10px" }}>
              {data.assigned_to === null || undefined ? null : data.assigned_to}
            </p>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Tên tài sản">
          {data.name ? data.name : "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label="Số Sê-ri">
          {data.serial ? data.serial : "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label="Kho">
          <p style={{ color: "blue" }}>
            {data.manufacturer ? data.manufacturer : "n/a"}
          </p>
        </Descriptions.Item>
        <Descriptions.Item label="Thể loại">
          {data.category ? data.category : "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label="Kiểu tài sản">
          {data.model ? data.model : "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày mua">
          {data.purchase_date ? data.purchase_date : "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label="Nhà cung cấp">
          <p style={{ color: "blue" }}>
            {data.supplier ? data.supplier : "n/a"}
          </p>
        </Descriptions.Item>
        <Descriptions.Item label="Vị trí">
          <p style={{ color: "blue" }}>
            {data.location ? data.location : "n/a"}
          </p>
        </Descriptions.Item>
        <Descriptions.Item label="Đã tạo lúc">
          {data.created_at ? data.created_at : "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật tại">
          {data.updated_at ? data.updated_at : "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label="Giá">
          {data.purchase_cost ? data.purchase_cost : "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label="Số lần thu hồi">
          {data.checkin_counter ? data.checkin_counter : "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label="Số lần cấp phát">
          {data.checkout_counter ? data.checkout_counter : "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          {data.notes ? data.notes : "n/a"}
        </Descriptions.Item>
        <Descriptions.Item label="Bảo hành">
          {data.warranty_expires ? data.warranty_expires : "n/a"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PopupDetailDevice;
