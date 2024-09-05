import "../../styles/qr-code.less";
import { BarcodeFormat, BrowserMultiFormatReader } from "@zxing/library";
import { useEffect, useRef, useState } from "react";
import { Button } from "@pankod/refine-antd";
import PopupDetailDevice from "./popupDetailDevice";

const hardwareUrlPattern = new RegExp(
  '^https?:\\/\\/' + // protocol (http or https)
  '(?:[a-z\\d](?:[a-z\\d-]*[a-z\\d])*)\\.?[a-z]{2,}(?:\\.[a-z]{2,})?' + // domain name with TLD, including ".vn"
  '\\/detail-device\\?' + // required path (/detail-device?)
  'id=[^&]+' + // id field (required)
  '&name=[^&]*' + // name field (required)
  '&status=[^&]*' + // status field (required)
  '&serial=[^&]*' + // serial field (required)
  '&manufacturer=[^&]*' + // manufacturer field (required)
  '&category=[^&]*' + // category field (required)
  '&model=[^&]*' + // model field (required)
  '&purchase_date=[^&]*' + // purchase_date field (required)
  '&supplier=[^&]*' + // supplier field (required)
  '&location=[^&]*' + // location field (required)
  '&created_at=[^&]*' + // created_at field (required)
  '&updated_at=[^&]*' + // updated_at field (required)
  '&purchase_cost=[^&]*' + // purchase_cost field (required)
  '&assigned_to=[^&]*' + // assigned_to field (required)
  '&checkin_counter=[^&]*' + // checkin_counter field (required)
  '&checkout_counter=[^&]*' + // checkout_counter field (required)
  '&notes=[^&]*' + // notes field (required)
  '&warranty_expires=[^&]*' + // warranty_expires field (required)
  '&warranty_months=[^&]*' + // warranty_months field (required)
  '&requests_counter=[^&]*$', // requests_counter field (required)
  'i' // case-insensitive flag
);



export const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const [showModalDevice, setShowModalDevice] = useState(false);
  useEffect(() => {
    if (isScanning) {
      startScanning();
    } else {
      stopScanning();
    }
    return () => {
      stopScanning();
    };
  }, [isScanning]);

  useEffect(() => {
    if (result && hardwareUrlPattern.test(result)) {
      setIsScanning(false);
      setShowModalDevice(true);
    }
  }, [result]);

  const startScanning = () => {
    codeReader.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result, error) => {
        if (result) {
          if (result.getBarcodeFormat() === BarcodeFormat.QR_CODE) {
            setResult(result.getText());
          } else {
            console.warn("Non-QR code scanned");
          }
        }
        if (error && error.name !== "NotFoundException") {
          console.error(error);
        }
      }
    );
  };
  const stopScanning = () => {
    codeReader.current.reset();
    const stream = videoRef.current?.srcObject as MediaStream;
    const tracks = stream?.getTracks();

    if (tracks) {
      tracks.forEach((track) => {
        track.stop();
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };


  const handleScan = () => {
    setResult("");
    setIsScanning(true);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={handleScan} loading={isScanning}>
          Scan
        </Button>
      </div>

      {isScanning && (
        <div
          style={{
            borderRadius: "30px",
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <video ref={videoRef} autoPlay playsInline style={{ width:'70%'}}></video>
        </div>
      )}
      {showModalDevice && <PopupDetailDevice url={result} onClose={() => setShowModalDevice(false)}/>}
    </>
  );
};
