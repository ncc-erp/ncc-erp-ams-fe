import { Button, Checkbox, Modal, Select } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import { IHardwareResponse } from "interfaces/hardware";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import "../../styles/qr-code.less";
import SingleQrCard from "./single-qr-card";
import MultiQrCards from "./muti-qr-cards";
import QrControlPanel from "./qr-control-panel";
interface QrCodeDetailProps {
  detail: IHardwareResponse | undefined;
  closeModal: () => void;
}

export const QrCodeDetail = ({ detail, closeModal }: QrCodeDetailProps) => {
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
      if (!updatedQrCodes.length) {
        closeModal();
      }
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
      checkin_counter: detail?.checkin_counter ?? "",
      checkout_counter: detail?.checkout_counter ?? "",
    }),
    [detail, qrCodes]
  );

  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [layout, setLayout] = useState<"above" | "below" | null>(null);

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
      checkin_counter,
      checkout_counter,
      notes,
      warranty_expires,
      requests_counter,
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
      created_at: created_at?.datetime?.toString() ?? "",
      updated_at: updated_at?.datetime?.toString() ?? "",
      purchase_cost: purchase_cost?.toString() ?? "",
      assigned_to: assigned_to?.name?.toString() ?? "",
      checkin_counter: checkin_counter?.toString() ?? "",
      checkout_counter: checkout_counter?.toString() ?? "",
      notes: notes?.toString() ?? "",
      warranty_expires: warranty_expires?.date?.toString() ?? "",
      requests_counter: requests_counter?.toString() ?? "",
    };
    const queryParams = Object.entries(selectedFields)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    return `${window.location.origin}/detail-device?${queryParams}`;
  };

  const renderSelectedFields = useCallback(
    (model: string) => {
      return selectedFields.map((field) => {
        let value = "";
        if (field === "name") {
          value = data.model !== "" ? data.model : model.toString();
        }
        return (
          <div key={field} style={{ textAlign: "center", color: "#FF0000" }}>
            {"Mã thiết bị"}: {value}
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
    }  
    if (layout === "below") {
      return "24px 24px 8px 24px";
    } 
    return "24px";
  }, [layout, selectedFields]);

  return (
    <div className="qr__grid">
      <div style={{ maxHeight: "40rem", overflow: "auto" }}>
        <div className="qr__container" ref={componentRef}>
          {Array.isArray(detail) ? (
            <MultiQrCards
              hardwareList={qrCodes}
              layout={layout}
              paddingStyle={paddingStyle}
              renderSelectedFields={renderSelectedFields}
              generateRedirectUrl={generateRedirectUrl}
              handleDeleteQrCode={handleDeleteQrCode}
            />
          ) : (
            <SingleQrCard
              detail={detail!}
              layout={layout}
              paddingStyle={paddingStyle}
              renderSelectedFields={renderSelectedFields}
              generateRedirectUrl={generateRedirectUrl}
            />
          )}
        </div>
      </div>
      <QrControlPanel
        layout={layout}
        setLayout={setLayout}
        handleFieldChange={handleFieldChange}
        handlePrint={handlePrint}
      />
      <Modal
        title={t("hardware.label.field.confirmDeleteQr")}
        visible={isConfirmModalOpen}
        onCancel={handleCancelDelete}
        footer={[
          <Button key="cancel" onClick={handleCancelDelete}>
            {t("buttons.cancel")}
          </Button>,
          <Button
            style={{ marginTop: "0px" }}
            key="delete"
            type="primary"
            danger
            onClick={handleConfirmDelete}
          >
            {t("hardware.label.field.condition")}
          </Button>,
        ]}
      >
        {t("hardware.label.field.confirmDeleteQr")}
      </Modal>
    </div>
  );
};
