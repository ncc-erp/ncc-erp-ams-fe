import "../../styles/qr-code.less";
import { BrowserMultiFormatReader } from "@zxing/library";
import { useEffect, useRef, useState } from "react";
import { Button } from "@pankod/refine-antd";
import PopupDetailDevice from "./popupDetailDevice";
export const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const [showModalDevice, setShowModalDevice] = useState(false);
  useEffect(() => {
    if (scanning) {
      startScanning();
    } else {
      stopScanning();
    }
    return () => {
      stopScanning();
    };
  }, [scanning]);

  useEffect(() => {
    if (result) {
      setScanning(false);
      setShowModalDevice(true);
    }
  }, [result]);

  const startScanning = () => {
    codeReader.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result, error) => {
        if (result) {
          setResult(result.getText());
          setScanning(false);
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
    setScanning(true);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={handleScan} loading={scanning}>
          Scan
        </Button>
      </div>

      {scanning && (
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
