import "../../styles/qr-code.less";
import { BrowserMultiFormatReader } from '@zxing/library'
import { useEffect, useRef, useState } from "react";
import { Button } from "@pankod/refine-antd";

export const Scanner = () => {
    const [scanning, setScanning] = useState(false)
    const [result, setResult] = useState('')
    const videoRef = useRef<HTMLVideoElement>(null)
    const codeReader = useRef(new BrowserMultiFormatReader())

    useEffect(() => {
        if (scanning) {
            startScanning()
        } else {
            stopScanning()
        }
        return () => {
            stopScanning()
        }
    }, [scanning]) 

    useEffect(() => {
        if(result){
            setScanning(false)
            // redirect to the page with the result or pop up a modal
        }
    }, [result])

    const startScanning = () => {
        codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
            if (result) {
                setResult(result.getText())
                setScanning(false)
            }
            if (error && error.name !== 'NotFoundException') {
                console.error(error)

            }
        })
    }
    const stopScanning = () => {
        codeReader.current.reset()
        const stream = videoRef.current?.srcObject as MediaStream
        const tracks = stream?.getTracks() // Added safe navigation operator

        if(tracks){
            tracks.forEach(track => {
                track.stop()
            })
        }

        if(videoRef.current){
            videoRef.current.srcObject = null
        }
    }

    const handleScan = () => {
        setResult('')
        setScanning(true)
    }



    return (
        <div className="qr__grid">
            <Button onClick={handleScan} loading={scanning}>
                Scan
            </Button>
            {scanning && (
                <div>
                    <video ref={videoRef} autoPlay playsInline></video>
                </div>
            )}
            {result && (
                <div>
                    <h1>Result: {result}</h1>
                </div>
            )}
        </div>
    );
};