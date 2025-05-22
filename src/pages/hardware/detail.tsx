import React from "react";
import { useEffect, useState } from "react";
import { HARDWARE_API } from "api/baseApi";
import { useLocation } from "react-router-dom";
import "../../styles/detailProductQR.less";
import { useTranslate, useCustom } from "@pankod/refine-core";
import { IDeviceDetailQr } from "interfaces/deviceDetailQr";
export const DetailProduct = () => {
  const locationURL = useLocation();
  const queryParams = new URLSearchParams(locationURL.search);
  const id = queryParams.get("id");

  const t = useTranslate();
  const [device, setDevice] = useState<IDeviceDetailQr | null>(null);
  const url = `${HARDWARE_API}/${id}`;
  const { data } = useCustom({
    url: url,
    method: "get",
  });
  useEffect(() => {
    if (data?.data) {
      setDevice(data.data as IDeviceDetailQr);
    }
  }, [data]);

  const {
    name,
    status_label,
    serial,
    manufacturer,
    category,
    model,
    purchase_date,
    supplier,
    location,
    created_at,
    updated_at,
    purchase_cost,
    checkin_counter,
    checkout_counter,
    notes,
    warranty_expires,
    assigned_to,
  } = device || {};
  return (
    <div className="detail-product-container">
      <div className="detail-product-content">
        <h1 className="detail-product-title">
          {t("hardware.label.title.detail")}
        </h1>
        <div className="detail-product-info">
          <div className="detail-info-item">
            <p className="info-title">{t("model.label.field.id")}:</p>
            <p className="info-content" title={id ? id : undefined}>
              {id || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">{t("hardware.label.field.status")}:</p>
            <p
              className="info-content"
              title={status_label?.name ? status_label?.name : undefined}
              style={{ display: "flex" }}
            >
              {status_label?.name
                ? status_label?.name === t("hardware.label.field.broken")
                  ? t("hardware.label.detail.broken")
                  : t("hardware.label.detail.readyToDeploy")
                : "n/a"}
              <p style={{ color: "blue", marginLeft: "10px" }}>
                {assigned_to?.name === null || undefined
                  ? null
                  : assigned_to?.name}
              </p>
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">{t("hardware.label.field.assetName")}:</p>
            <p className="info-content" title={name ? name : undefined}>
              {name || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">{t("hardware.label.field.serial")}:</p>
            <p className="info-content" title={serial ? serial : undefined}>
              {serial || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.field.manufacturer")}:
            </p>
            <p
              className="info-content"
              title={manufacturer?.name ? manufacturer?.name : undefined}
              style={{ color: "blue" }}
            >
              {manufacturer?.name || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">{t("hardware.label.field.category")}:</p>
            <p
              className="info-content"
              title={category?.name ? category?.name : undefined}
              style={{ color: "blue" }}
            >
              {category?.name || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.field.propertyType")}:
            </p>
            <p
              className="info-content"
              title={model?.name ? model?.name : undefined}
              style={{ color: "blue" }}
            >
              {model?.name || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.field.purchase_date")}:
            </p>
            <p
              className="info-content"
              title={
                purchase_date?.formatted ? purchase_date?.formatted : undefined
              }
            >
              {purchase_date?.formatted || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">{t("hardware.label.field.supplier")}:</p>
            <p
              className="info-content"
              title={supplier ? supplier : undefined}
              style={{ color: "blue" }}
            >
              {supplier || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.field.rtd_location")}:
            </p>
            <p
              className="info-content"
              title={location?.name ? location?.name : undefined}
              style={{ color: "blue" }}
            >
              {location?.name || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.title.dateCreate")}:
            </p>
            <p
              className="info-content"
              title={created_at?.formatted ? created_at?.formatted : undefined}
            >
              {created_at?.formatted || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">{t("hardware.label.title.updateAt")}:</p>
            <p
              className="info-content"
              title={updated_at?.formatted ? updated_at?.formatted : undefined}
            >
              {updated_at?.formatted || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.field.purchase_cost")}:
            </p>
            <p
              className="info-content"
              title={
                purchase_cost?.formatted ? purchase_cost?.formatted : undefined
              }
            >
              {purchase_cost?.formatted || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.field.checkin_counter")}:
            </p>
            <p
              className="info-content"
              title={checkin_counter ? checkin_counter : undefined}
            >
              {checkin_counter ?? "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.field.checkout_counter")}:
            </p>
            <p
              className="info-content"
              title={checkout_counter ? checkout_counter : undefined}
            >
              {checkout_counter ?? "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">{t("hardware.label.field.notes")}:</p>
            <p className="info-content" title={notes ? notes : undefined}>
              {notes || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">{t("hardware.label.field.insurance")}:</p>
            <p
              className="info-content"
              title={
                warranty_expires?.formatted
                  ? warranty_expires?.formatted
                  : undefined
              }
            >
              {warranty_expires?.formatted || "n/a"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
