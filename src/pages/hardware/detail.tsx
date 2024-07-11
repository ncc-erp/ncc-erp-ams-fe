import React from "react";
import { useLocation } from "react-router-dom";
import "../../styles/detailProductQR.less";
import { useTranslate } from "@pankod/refine-core";

export const DetailProduct = () => {
  const locationURL = useLocation();
  const queryParams = new URLSearchParams(locationURL.search);
  const t = useTranslate();
  const id = queryParams.get("id");
  const name = queryParams.get("name");
  const status = queryParams.get("status");
  const serial = queryParams.get("serial");
  const manufacturer = queryParams.get("manufacturer");
  const category = queryParams.get("category");
  const model = queryParams.get("model");
  const purchase_date = queryParams.get("purchase_date");
  const supplier = queryParams.get("supplier");
  const location = queryParams.get("location");
  const created_at = queryParams.get("created_at");
  const updated_at = queryParams.get("updated_at");
  const purchase_cost = queryParams.get("purchase_cost");
  const assigned_to = queryParams.get("assigned_to");

  return (
    <div className="detail-product-container">
      <div className="detail-product-content">
        <h1 className="detail-product-title">Chi tiết tài sản</h1>
        <div className="detail-product-info">
          <div className="detail-info-item">
            <p className="info-title">ID:</p>
            <p className="info-content" title={id ? id : undefined}>
              {id ? id : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Trạng Thái:</p>
            <p
              className="info-content"
              title={status ? status : undefined}
              style={{ display: "flex" }}
            >
              {status && status === t("hardware.label.field.broken")
                ? t("hardware.label.detail.broken")
                : status
                ? t("hardware.label.detail.readyToDeploy")
                : "n/a"}{" "}
              <p style={{ color: "blue", marginLeft: "10px" }}>
                {assigned_to === null || undefined ? null : assigned_to}
              </p>
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Tên tài sản:</p>
            <p className="info-content" title={name ? name : undefined}>
              {name ? name : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Số Sê-ri:</p>
            <p className="info-content" title={serial ? serial : undefined}>
              {serial ? serial : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Kho:</p>
            <p
              className="info-content"
              title={manufacturer ? manufacturer : undefined}
              style={{ color: "blue" }}
            >
              {manufacturer ? manufacturer : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Thể loại:</p>
            <p
              className="info-content"
              title={category ? category : undefined}
              style={{ color: "blue" }}
            >
              {category ? category : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Kiểu tài sản:</p>
            <p
              className="info-content"
              title={model ? model : undefined}
              style={{ color: "blue" }}
            >
              {model ? model : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Ngày mua:</p>
            <p
              className="info-content"
              title={purchase_date ? purchase_date : undefined}
            >
              {purchase_date ? purchase_date : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Nhà cung cấp:</p>
            <p
              className="info-content"
              title={supplier ? supplier : undefined}
              style={{ color: "blue" }}
            >
              {supplier ? supplier : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Vị trí:</p>
            <p
              className="info-content"
              title={location ? location : undefined}
              style={{ color: "blue" }}
            >
              {location ? location : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Đã tạo lúc:</p>
            <p
              className="info-content"
              title={created_at ? created_at : undefined}
            >
              {created_at ? created_at : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Cập nhật tại:</p>
            <p
              className="info-content"
              title={updated_at ? updated_at : undefined}
            >
              {updated_at ? updated_at : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Giá:</p>
            <p
              className="info-content"
              title={purchase_cost ? purchase_cost : undefined}
            >
              {purchase_cost ? purchase_cost : "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Assigned to:</p>
            <p
              className="info-content"
              title={assigned_to ? assigned_to : undefined}
            >
              {assigned_to ? assigned_to : "n/a"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
