import { useEffect, useState } from "react";
import { WEBHOOK_API } from "api/baseApi";
import { useLocation } from "react-router-dom";
import "../../styles/detailWebhook.less";
import { useTranslate, useCustom } from "@pankod/refine-core";
import { IWebhook } from "interfaces/webhook";
export const WebhookDetail = () => {
  const locationURL = useLocation();
  const queryParams = new URLSearchParams(locationURL.search);
  const id = queryParams.get("id");

  const t = useTranslate();
  const [webhook, setWebhook] = useState<IWebhook | null>(null);
  const url = `${WEBHOOK_API}/${id}`;
  const { data } = useCustom({
    url: url,
    method: "get",
  });
  useEffect(() => {
    if (data?.data) {
      setWebhook(data.data as IWebhook);
    }
  }, [data]);

  const { name, url: webhookUrl, id: webhookId, created_at } = webhook || {};
  return (
    <div className="detail-webhook-container">
      <div className="detail-webhook-content">
        <h1 className="detail-webhook-title">
          {t("webhook.label.title.detail")}
        </h1>
        <div className="detail-webhook-info">
          <div className="webhook-info-item">
            <p className="info-title">{t("model.label.field.id")}:</p>
            <p
              className="info-content"
              title={webhookId ? webhookId : undefined}
            >
              {webhookId || "n/a"}
            </p>
          </div>
          <div className="webhook-info-item">
            <p className="info-title">{t("webhook.label.field.name")}:</p>
            <p
              className="info-content"
              title={name ? name : undefined}
              style={{ display: "flex" }}
            >
              {name || "n/a"}
            </p>
          </div>
          <div className="webhook-info-item">
            <p className="info-title">{t("webhook.label.field.url")}:</p>
            <p
              className="info-content info-content-url"
              title={webhookUrl ? webhookUrl : undefined}
            >
              {webhookUrl || "n/a"}
            </p>
          </div>
          <div className="webhook-info-item">
            <p className="info-title">{t("webhook.label.field.created_at")}:</p>
            <p
              className="info-content"
              title={created_at?.formatted ? created_at?.formatted : undefined}
            >
              {created_at?.formatted || "n/a"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
