import "../../styles/qr-code.less";
import { BarcodeFormat, BrowserMultiFormatReader } from "@zxing/library";
import { useEffect, useRef, useState } from "react";
import { Button } from "@pankod/refine-antd";
import PopupDetailDevice from "./popupDetailDevice";

const hardwareUrlPattern = new RegExp(
    '^https?:\\/\\/' + 
    '(?:localhost|[a-z\\d](?:[a-z\\d-]*[a-z\\d])*(?:\\.[a-z]{2,})*)' +
    '(?::\\d+)?' + 
    '\\/detail-device\\?' +
    'id=[^&]+' +
    '&name=[^&]*' +
    '&status=[^&]*' +
    '&serial=[^&]*' +
    '&manufacturer=[^&]*' +
    '&category=[^&]*'
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
