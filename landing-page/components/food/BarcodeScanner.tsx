"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Camera, AlertCircle, X, ScanBarcode } from "lucide-react"
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"

interface BarcodeScannerProps {
    onProductFound: (code: string) => void
    isSearching: boolean
}

export function BarcodeScanner({ onProductFound, isSearching }: BarcodeScannerProps) {
    const [barcode, setBarcode] = useState("")
    const [isCameraOpen, setIsCameraOpen] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const [scannerId] = useState("reader-" + Math.random().toString(36).substring(7))
    const [qrBoxSize, setQrBoxSize] = useState({ width: 300, height: 150 })

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (scannerRef.current) {
                if (scannerRef.current.isScanning) {
                    scannerRef.current.stop().catch(console.error)
                }
                scannerRef.current.clear()
            }
        }
    }, [])

    const getQrBoxSize = () => {
        // Make scanning box responsive to screen size
        const width = Math.min(window.innerWidth * 0.8, 300)
        const height = Math.min(width * 0.5, 150)
        return { width: Math.floor(width), height: Math.floor(height) }
    }

    const startCamera = async () => {
        setCameraError(null)
        setIsCameraOpen(true)

        // Calculate responsive qrbox size
        const calculatedSize = getQrBoxSize()
        setQrBoxSize(calculatedSize)

        // Wait for DOM
        await new Promise(r => setTimeout(r, 100))

        try {
            // Prioritize Barcode formats for speed
            const html5QrCode = new Html5Qrcode(scannerId, {
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                    Html5QrcodeSupportedFormats.CODE_128,
                ],
                verbose: false
            })
            scannerRef.current = html5QrCode

            // Responsive scanning configuration
            const config = {
                fps: 10,
                qrbox: calculatedSize,
                // Remove fixed aspectRatio to allow camera's native ratio
                disableFlip: false,
            }

            // Try environment camera first (back camera on mobile)
            try {
                await html5QrCode.start(
                    { facingMode: { ideal: "environment" } },
                    config,
                    (decodedText) => {
                        // Success callback
                        console.log(`Scan success: ${decodedText}`)
                        stopCamera()
                        onProductFound(decodedText)
                    },
                    (errorMessage) => {
                        // Error callback (ignore frequent scan errors)
                    }
                )
            } catch (envError) {
                // Fallback to any available camera
                console.log("Environment camera failed, trying any camera:", envError)
                await html5QrCode.start(
                    { facingMode: "user" },
                    config,
                    (decodedText) => {
                        console.log(`Scan success: ${decodedText}`)
                        stopCamera()
                        onProductFound(decodedText)
                    },
                    (errorMessage) => {
                        // Error callback (ignore frequent scan errors)
                    }
                )
            }
        } catch (err: any) {
            console.error("Camera error:", err)

            // Provide specific error messages
            let errorMessage = "Could not access camera."

            if (err.name === "NotAllowedError" || err.message?.includes("Permission")) {
                errorMessage = "Camera permission denied. Please allow camera access in your browser settings."
            } else if (err.name === "NotFoundError" || err.message?.includes("not found")) {
                errorMessage = "No camera found on this device."
            } else if (err.name === "NotReadableError" || err.message?.includes("in use")) {
                errorMessage = "Camera is already in use by another application."
            } else if (err.message) {
                errorMessage = err.message
            }

            setCameraError(errorMessage)
            setIsCameraOpen(false)
        }
    }

    const stopCamera = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop()
                }
                scannerRef.current.clear()
            } catch (err) {
                console.error("Failed to stop scanner", err)
            }
        }
        setIsCameraOpen(false)
    }

    const handleManualSearch = () => {
        if (barcode) {
            onProductFound(barcode)
        }
    }

    return (
        <div className="space-y-6">

            {/* Camera Section */}
            {!isCameraOpen ? (
                <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border-2 border-dashed border-border rounded-xl transition-all hover:bg-muted/30">
                    <div className="text-center space-y-4 max-w-sm">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
                            <Camera className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Scan Product</h3>
                            <p className="text-sm text-muted-foreground">
                                Point your camera at a barcode to instantly analyze ingredients.
                            </p>
                        </div>
                        <Button onClick={startCamera} size="lg" className="w-full">
                            <ScanBarcode className="w-4 h-4 mr-2" />
                            Enable Camera
                        </Button>
                        {cameraError && (
                            <p className="text-xs text-red-500 font-medium bg-red-50 p-2 rounded">
                                {cameraError}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-square max-w-md mx-auto shadow-2xl border-4 border-primary/20">
                    <div id={scannerId} className="w-full h-full" />

                    {/* Creative Overlay for Rectangular Barcode */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {/* Using a centered box instead of full borders to emphasize the scan area */}
                        <div
                            className="border-2 border-red-500/80 rounded-lg relative shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                            style={{ width: `${qrBoxSize.width}px`, height: `${qrBoxSize.height}px` }}
                        >
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500/50 animate-pulse"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <Button variant="secondary" onClick={stopCamera} className="bg-white/80 hover:bg-white text-black">
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                    </div>
                </div>
            )}

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or type manually</span>
                </div>
            </div>

            {/* Manual Input */}
            <div className="flex gap-2">
                <Input
                    placeholder="Enter EAN/UPC (e.g. 0123456789012)"
                    className="bg-background"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                />
                <Button onClick={handleManualSearch} disabled={!barcode || isSearching}>
                    {isSearching ? <span className="animate-spin mr-2">⏳</span> : <Search className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    )
}
