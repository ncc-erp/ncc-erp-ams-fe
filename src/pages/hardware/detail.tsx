import React from "react";
import { useLocation } from "react-router-dom";
import "../../styles/detailProductQR.less";
import { useTranslate } from "@pankod/refine-core";
import { IDeviceDetailQr } from "interfaces/deviceDetailQr";
export const DetailProduct = () => {
  const locationURL = useLocation();
  const queryParams = new URLSearchParams(locationURL.search);
  const t = useTranslate();
  const paramNames = [
    "id",
    "name",
    "status",
    "serial",
    "manufacturer",
    "category",
    "model",
    "purchase_date",
    "supplier",
    "location",
    "created_at",
    "updated_at",
    "purchase_cost",
    "checkin_counter",
    "checkout_counter",
    "notes",
    "warranty_expires",
    "assigned_to",
  ];

  const params: IDeviceDetailQr = paramNames.reduce((acc, param) => {
    acc[param as keyof IDeviceDetailQr] = queryParams.get(param);
    return acc;
  }, {} as IDeviceDetailQr);

  const {
    id,
    name,
    status,
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
  } = params;

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
              title={status ? status : undefined}
              style={{ display: "flex" }}
            >
              {status
                ? status === t("hardware.label.field.broken")
                  ? t("hardware.label.detail.broken")
                  : t("hardware.label.detail.readyToDeploy")
                : "n/a"}
              <p style={{ color: "blue", marginLeft: "10px" }}>
                {assigned_to === null || undefined ? null : assigned_to}
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
              title={manufacturer ? manufacturer : undefined}
              style={{ color: "blue" }}
            >
              {manufacturer || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">{t("hardware.label.field.category")}:</p>
            <p
              className="info-content"
              title={category ? category : undefined}
              style={{ color: "blue" }}
            >
              {category || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.field.propertyType")}:
            </p>
            <p
              className="info-content"
              title={model ? model : undefined}
              style={{ color: "blue" }}
            >
              {model || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.field.purchase_date")}:
            </p>
            <p
              className="info-content"
              title={purchase_date ? purchase_date : undefined}
            >
              {purchase_date || "n/a"}
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
              title={location ? location : undefined}
              style={{ color: "blue" }}
            >
              {location || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.title.dateCreate")}:
            </p>
            <p
              className="info-content"
              title={created_at ? created_at : undefined}
            >
              {created_at || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">{t("hardware.label.title.updateAt")}:</p>
            <p
              className="info-content"
              title={updated_at ? updated_at : undefined}
            >
              {updated_at || "n/a"}
            </p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">
              {t("hardware.label.field.purchase_cost")}:
            </p>
            <p
              className="info-content"
              title={purchase_cost ? purchase_cost : undefined}
            >
              {purchase_cost || "n/a"}
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
              {checkin_counter || "n/a"}
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
              {checkout_counter || "n/a"}
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
              title={warranty_expires ? warranty_expires : undefined}
            >
              {warranty_expires || "n/a"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
