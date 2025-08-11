import { Button, Modal } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import { IHardwareResponse } from "interfaces/hardware";
import "../../styles/qr-code.less";
import MultiQrCards from "./muti-qr-cards";
import QrControlPanel from "./qr-control-panel";
import SingleQrCard from "./single-qr-card";

interface QrCodeDetailProps {
  detail: IHardwareResponse | IHardwareResponse[];
  closeModal: () => void;
}

export const QrCodeDetail = ({ detail, closeModal }: QrCodeDetailProps) => {
  const t = useTranslate();
  const [qrCodes, setQrCodes] = useState<
    IHardwareResponse | IHardwareResponse[]
  >(detail);
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
    return `${window.location.origin}/detail-device?id=${hardware.id}`;
  };

  const renderSelectedFields = useCallback(
    (name: string) => {
      return selectedFields.map((field) => {
        let value = "";
        if (field === "name") {
          value = name;
        }
        return (
          <div
            key={field}
            style={{
              textAlign: "center",
              color: "#FF0000",
              fontSize: "19px",
              fontWeight: "bold",
            }}
          >
            {value}
          </div>
        );
      });
    },
    [selectedFields]
  );

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  useEffect(() => {
    setQrCodes(detail);
  }, [detail]);

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
        .qr__name {
          font-size: 20px;
          font-weight: 900;
          margin-top: 8px;
        }
    `,
  });
  const paddingStyle = useMemo(() => {
    if (selectedFields.length === 0) {
      return "24px";
    } else if (layout === "above") {
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
            <MultiQrCards
              hardwareList={qrCodes as IHardwareResponse[]}
              layout={layout}
              paddingStyle={paddingStyle}
              renderSelectedFields={renderSelectedFields}
              generateRedirectUrl={generateRedirectUrl}
              handleDeleteQrCode={handleDeleteQrCode}
            />
          ) : (
            <SingleQrCard
              detail={qrCodes as IHardwareResponse}
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
