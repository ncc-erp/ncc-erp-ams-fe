import { Button, Checkbox, Modal, Select } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import { IHardwareResponse } from "interfaces/hardware";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";
import "../../styles/qr-code.less";
interface QrCodeDetailProps {
  detail: IHardwareResponse | undefined;
}

export const QrCodeDetail = ({ detail }: QrCodeDetailProps) => {
  const t = useTranslate();
  const [qrCodes, setQrCodes] = useState<IHardwareResponse[]>(
    Array.isArray(detail) ? detail : []
  );
  const componentRef = useRef<HTMLDivElement>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const handleDeleteQrCode = (id: number) => {
    setDeleteId(id);
    setIsConfirmModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (!qrCodes) return;
    if (Array.isArray(qrCodes)) {
      const updatedQrCodes = qrCodes.filter((qr) => qr.id !== deleteId);
      setQrCodes(updatedQrCodes);
    }
    setIsConfirmModalOpen(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setDeleteId(null);
  };

  const data = useMemo(
    () => ({
      id: detail?.id ?? 0,
      name: detail?.name ?? "",
      status: detail?.status_label?.name ?? "",
      serial: detail?.serial ?? "",
      manufacturer: detail?.manufacturer?.name ?? "",
      category: detail?.category?.name ?? "",
      model: detail?.model?.name ?? "",
      purchase_date: detail?.purchase_date?.formatted ?? "",
      supplier: detail?.supplier?.name ?? "",
      location: detail?.location?.name ?? "",
      created_at: detail?.created_at?.formatted ?? "",
      updated_at: detail?.updated_at?.formatted ?? "",
      purchase_cost: detail?.purchase_cost ?? "",
      assigned_to: detail?.assigned_to?.name ?? "",
    }),
    [detail, qrCodes]
  );

  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [layout, setLayout] = useState<"above" | "below">("below");

  const [isPrinting, setIsPrinting] = useState(false);
  const promiseResolveRef = useRef<any>(null);

  const handleFieldChange = (field: string) => {
    setSelectedFields((prevFields) =>
      prevFields.includes(field)
        ? prevFields.filter((f) => f !== field)
        : [...prevFields, field]
    );
  };

  const generateRedirectUrl = (hardware: IHardwareResponse) => {

    if (!hardware) return "";
    const {
      id,
      name,
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
      assigned_to,
      status_label,
    } = hardware;
    const selectedFields = {
      id: id?.toString() ?? "",
      name: name?.toString() ?? "",
      status: status_label?.name?.toString() ?? "",
      serial: serial?.toString() ?? "",
      manufacturer: manufacturer?.name?.toString() ?? "",
      category: category?.name?.toString() ?? "",
      model: model?.name?.toString() ?? "",
      purchase_date: purchase_date?.formatted?.toString() ?? "",
      supplier: supplier?.name?.toString() ?? "",
      location: location?.name?.toString() ?? "",
      created_at: created_at?.formatted?.toString() ?? "",
      updated_at: updated_at?.formatted?.toString() ?? "",
      purchase_cost: purchase_cost?.toString() ?? "",
      assigned_to: assigned_to?.name?.toString() ?? "",
    };
    console.log(selectedFields);

    const queryParams = Object.entries(selectedFields)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    return `${window.location.origin}/detail-device?${queryParams}`;
  };

  const renderSelectedFields = useCallback(
    (model: string, assigned_to: string) => {
      return selectedFields.map((field) => {
        let value = "";
        if (data.model !== "") {
          if (field === "name") {
            value = data.model;
          } else if (field === "name_user") {
            value = `${data?.assigned_to}`;
          }
        } else {
          if (field === "name") {
            value = model.toString();
          } else if (field === "name_user") {
            value = assigned_to ?? "";
          }
        }
        return (
          <div key={field} style={{ textAlign: "center", color: "#FF0000" }}>
            {field === "name" ? "Mã thiết bị" : "Tên"}: {value}
          </div>
        );
      });
    },
    [selectedFields, data]
  );

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
    pageStyle: `
        @page {
        size: A4;
        padding: 0px !important;
        margin: 0px !important;
        overflow: hidden !important;
       
        }
         .delete__qrcode{
        display:none;
        }
    `,
  });
  const paddingStyle = useMemo(() => {
    if (selectedFields.length === 0) return "24px";
    if (layout === "above") {
      return "8px 24px 24px 24px";
    } else if (layout === "below") {
      return "24px 24px 8px 24px";
    } else {
      return "24px";
    }
  }, [layout, selectedFields]);

  return (
    <div className="qr__grid">
      <div style={{ maxHeight: "40rem", overflow: "auto" }}>
        <div className="qr__container" ref={componentRef}>
          {Array.isArray(detail) ? (
            qrCodes.map((hardware) => (
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
                  {layout === "above" &&
                    renderSelectedFields(
                      hardware?.model?.name,
                      hardware?.assigned_to?.name
                    )}
                  <QRCode size={120} value={generateRedirectUrl(hardware)} />
                  <div
                    onClick={() => handleDeleteQrCode(hardware.id)}
                    className="delete__qrcode"
                  >
                    x
                  </div>
                  {layout === "below" &&
                    renderSelectedFields(
                      hardware?.model?.name,
                      hardware?.assigned_to?.name
                    )}
                </div>
              </div>
            ))
          ) : (
            <div
              key={detail?.id}
              style={{
                height: 500,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                marginLeft: "12rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: paddingStyle,
                  border: "1px solid black",
                  borderRadius: "8px",
                }}
              >
                {layout === "above" &&
                  renderSelectedFields(
                    detail?.model?.name!,
                    detail?.assigned_to?.name!
                  )}
                <QRCode
                  size={250}
                  value={generateRedirectUrl(detail!)}
                  style={{ marginBottom: "20px" }}
                />
                {layout === "below" &&
                  renderSelectedFields(
                    detail?.model?.name!,
                    detail?.assigned_to?.name!
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="list__acction__qrcode">
        <div className="select__qrcode">
          <div style={{ marginBottom: 16 }}>
            <Select
              value={layout}
              onChange={(value) => setLayout(value)}
              style={{ width: "100%" }}
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
            <Checkbox onChange={() => handleFieldChange("name")}>
              {t("user.label.title.codeDevice")}
            </Checkbox>
            <Checkbox
              onChange={() => handleFieldChange("name_user")}
              style={{ margin: "0px" }}
            >
              {t("user.label.title.user_name")}
            </Checkbox>
          </div>
        </div>
        <Button type="primary" className="gen__qrcode" onClick={handlePrint}>
          In mã QR
        </Button>
      </div>
      <Modal
        title="Xác nhận xóa mã QR"
        visible={isConfirmModalOpen}
        onCancel={handleCancelDelete}
        footer={[
          <Button key="cancel" onClick={handleCancelDelete}>
            Hủy bỏ
          </Button>,
          <Button
            style={{ marginTop: "0px" }}
            key="delete"
            type="primary"
            danger
            onClick={handleConfirmDelete}
          >
            Xác nhận xóa
          </Button>,
        ]}
      >
        Bạn có chắc chắn muốn xóa mã QR này không?
      </Modal>
    </div>
  );
};
