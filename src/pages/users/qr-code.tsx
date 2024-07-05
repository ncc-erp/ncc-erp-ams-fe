import { Button, Checkbox, Select } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import { IHardwareResponse } from "interfaces/hardware";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from 'react-to-print';



interface QrCodeDetailProps {
    detail: IHardwareResponse | undefined;
}

export const QrCodeDetail = ({ detail }: QrCodeDetailProps) => {
    const t = useTranslate();
    const data = useMemo(() => ({
        id: detail?.id ?? 0,
        name: detail?.name ?? "",
        first_name: detail?.assigned_to.first_name ?? "",
        last_name:  detail?.assigned_to.last_name ?? "",
        model_name: detail?.model.name ?? "",
        category_name: detail?.category.name ?? "",
        rtd_location_name: detail?.rtd_location.name ?? "",
        notes: detail?.notes ?? "",
        status_label_name: detail?.status_label.name ?? "",
    }), [detail]);

    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [layout, setLayout] = useState<'above' | 'below'>('below');

    const [isPrinting, setIsPrinting] = useState(false);
    const printRef = useRef<any>(null);
    const promiseResolveRef = useRef<any>(null);

    const handleFieldChange = (field: string) => {
        setSelectedFields(prevFields =>
            prevFields.includes(field) ? prevFields.filter(f => f !== field) : [...prevFields, field]
        );
    };

    
    const redirectUrl = useMemo(() => {
        if (!data) return '';
    
        const {
          name,
          notes,
            id,
            first_name,
            last_name,
            model_name,
            category_name,
            rtd_location_name,
            status_label_name
        } = data;
    
        const selectedFields = {
          id,
          name,
          first_name,
          last_name,
          model_name,
          category_name,
          rtd_location_name,
          notes,
          status_label_name
        };
    
        const queryParams = Object.entries(selectedFields)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');    
        return `${window.location.origin}/detail-device?${queryParams}`;
      }, [data]);

    // Render selected fields based on checkboxes
    const renderSelectedFields = useCallback(() => {
        return selectedFields.map(field => {
            let value = '';
            if (data) {
                if (field === 'name') {
                    value = data[field]
                }else if( field === 'name_user' ){
                    value = `${data?.first_name} ${data?.last_name}`;
                }
            }
            return (
                <div key={field} style={{ textAlign: 'center', color: '#FF0000' }}>
                    {field === 'name' ? 'Mã thiết bị' : "Tên"}: {value}
                </div>
            );
        });
    }, [selectedFields, data]);

    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) {
            // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
            promiseResolveRef.current();
        }
    }, [isPrinting]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
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
            @media print {
                html, body {
                height: 100vh; /* Use 100% here to support printing more than a single page*/
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden;
                background-color: #ffffff;
                }
            }
        `,
    });

    const paddingStyle = useMemo(() => {
        if(selectedFields.length === 0) return "24px";
        if (layout === 'above') {
          return "8px 24px 24px 24px";
        } else if (layout === 'below') {
          return "24px 24px 8px 24px";
        } else {
          return "24px";
        }
      }, [layout, selectedFields]);
    


    const renderQR = useCallback(() => {
        return (
            <span ref={printRef} style={{ padding: paddingStyle, border: 1, borderColor: "black", borderStyle: "solid", borderRadius: "8px" }} >
                {layout === 'above' && renderSelectedFields()}
                <QRCode size={500} value={redirectUrl} />
                {layout === 'below' && renderSelectedFields()}
            </span>
        );
    }, [layout, redirectUrl, renderSelectedFields, paddingStyle]);


    return (
        <>
            <div style={{ height: 500, width: '100%', display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <span ref={printRef} style={{ padding: paddingStyle, border: 1, borderColor: "black", borderStyle: "solid", borderRadius: "8px" }} >
                        {layout === 'above' && renderSelectedFields()}
                        <QRCode size={250} value={redirectUrl} />
                        {layout === 'below' && renderSelectedFields()}
                    </span>
                    <Button type="primary" style={{ marginTop: 16 }} onClick={handlePrint} >In mã QR</Button>
                </div>
                <div style={{ width: "50%", padding: "0 16px" }}>
                    <div style={{ marginBottom: 16 }}>
                        <Checkbox onChange={() => handleFieldChange('name')}>{t("user.label.title.codeDevice")}</Checkbox>
                        <Checkbox onChange={() => handleFieldChange('name_user')}>{t('user.label.title.user_name')}</Checkbox>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <Select value={layout} onChange={value => setLayout(value)} style={{ width: 200 }}>
                            <Select.Option value="above">{t("user.label.title.above")}</Select.Option>
                            <Select.Option value="below">{t("user.label.title.below")}</Select.Option>
                        </Select>
                    </div>
                </div>

            </div>
            <div style={{ display: 'none' }}>
                <div
                    ref={printRef}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        gap: 8,
                        padding: 24,
                        backgroundColor: '#ffffff',
                    }}
                >
                    {renderQR()}
                </div>
            </div>
        </>

    )
}