"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Camera, X, ScanBarcode } from "lucide-react"
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"

interface BarcodeScannerProps {
    onProductFound: (code: string) => void
    isSearching: boolean
}

// Camera state machine to handle transitions properly
type CameraState = "idle" | "starting" | "running" | "stopping"

export function BarcodeScanner({ onProductFound, isSearching }: BarcodeScannerProps) {
    const [barcode, setBarcode] = useState("")
    const [cameraState, setCameraState] = useState<CameraState>("idle")
    const cameraStateRef = useRef<CameraState>("idle") // Ref to track current state for closures
    const [cameraError, setCameraError] = useState<string | null>(null)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const abortStartupRef = useRef(false) // Track if startup should be aborted
    const lastStopTimeRef = useRef<number>(0) // Track when camera was last stopped for cooldown
    const [scannerId] = useState("reader-" + Math.random().toString(36).substring(7))
    const [qrBoxSize, setQrBoxSize] = useState({ width: 300, height: 150 })

    // Derived state for backward compatibility
    const isCameraOpen = cameraState === "starting" || cameraState === "running"
    const isStarting = cameraState === "starting"

    // Helper to update both state and ref
    const updateCameraState = (newState: CameraState) => {
        cameraStateRef.current = newState
        setCameraState(newState)
    }

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
        // Only allow starting from idle state (use ref for accurate check)
        if (cameraStateRef.current !== "idle") {
            console.log(`Camera in ${cameraStateRef.current} state, ignoring start request`)
            return
        }

        updateCameraState("starting")
        setCameraError(null)
        abortStartupRef.current = false

        // Calculate responsive qrbox size
        const calculatedSize = getQrBoxSize()
        setQrBoxSize(calculatedSize)

        // Wait for DOM element to be rendered (React state update + render)
        await new Promise(r => setTimeout(r, 200))

        // Ensure minimum cooldown after last stop to let html5-qrcode finish internal cleanup
        const timeSinceLastStop = Date.now() - lastStopTimeRef.current
        const cooldownMs = 500
        if (timeSinceLastStop < cooldownMs) {
            await new Promise(r => setTimeout(r, cooldownMs - timeSinceLastStop))
        }

        // Check if startup was aborted during the wait
        if (abortStartupRef.current) {
            console.log("Startup aborted during DOM wait")
            return
        }

        try {
            // Clean up any existing scanner first (stop but don't clear DOM)
            if (scannerRef.current) {
                try {
                    if (scannerRef.current.isScanning) {
                        await scannerRef.current.stop()
                        // Wait for library to finish internal cleanup
                        await new Promise(r => setTimeout(r, 300))
                    }
                    // Don't call clear() as it removes the DOM element
                } catch (err) {
                    console.log("Error stopping previous scanner:", err)
                }
                scannerRef.current = null
            }

            // Verify DOM element exists
            const element = document.getElementById(scannerId)
            if (!element) {
                throw new Error(`Scanner element ${scannerId} not found in DOM`)
            }
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

            const onScanSuccess = (decodedText: string) => {
                console.log(`Scan success: ${decodedText}`)
                stopCamera()
                onProductFound(decodedText)
            }

            const onScanError = () => {
                // Error callback (ignore frequent scan errors)
            }

            // Helper to start camera with retry on transition error
            const startWithRetry = async (facingMode: any, maxRetries = 3): Promise<boolean> => {
                for (let attempt = 0; attempt < maxRetries; attempt++) {
                    try {
                        await html5QrCode.start(facingMode, config, onScanSuccess, onScanError)
                        return true
                    } catch (err: any) {
                        const isTransitionError = err.message?.includes("transition")
                        if (isTransitionError && attempt < maxRetries - 1) {
                            console.log(`Transition error, retrying in 300ms (attempt ${attempt + 1}/${maxRetries})`)
                            await new Promise(r => setTimeout(r, 300))
                        } else {
                            throw err
                        }
                    }
                }
                return false
            }

            // Try environment camera first (back camera on mobile)
            try {
                await startWithRetry({ facingMode: "environment" })
            } catch (envError) {
                // Fallback to any available camera
                console.log("Environment camera failed, trying any camera:", envError)
                await startWithRetry({ facingMode: "user" })
            }
            // Check if startup was aborted during camera.start()
            if (abortStartupRef.current) {
                console.log("Startup aborted, cleaning up")
                if (scannerRef.current?.isScanning) {
                    await scannerRef.current.stop().catch(console.error)
                }
                scannerRef.current = null
                return
            }
            // Camera successfully started
            updateCameraState("running")
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
            } else if (err.message?.includes("transition")) {
                errorMessage = "Camera is busy. Please try again in a moment."
            } else if (err.message) {
                errorMessage = err.message
            }

            setCameraError(errorMessage)
            updateCameraState("idle") // Reset on error
        }
    }

    const stopCamera = async () => {
        // Only allow stopping from running or starting state (use ref for accurate check in closures)
        if (cameraStateRef.current !== "running" && cameraStateRef.current !== "starting") {
            console.log(`Camera in ${cameraStateRef.current} state, ignoring stop request`)
            return
        }

        // Signal any ongoing startup to abort
        abortStartupRef.current = true
        updateCameraState("stopping")

        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop()
                }
                // Don't call clear() - it removes the DOM element
                // Just set ref to null so we can create a new scanner instance
            } catch (err) {
                console.error("Failed to stop scanner", err)
            }
            scannerRef.current = null
        }
        lastStopTimeRef.current = Date.now()
        updateCameraState("idle")
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
                        <Button onClick={startCamera} size="lg" className="w-full" disabled={isStarting}>
                            {isStarting ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Starting Camera...
                                </>
                            ) : (
                                <>
                                    <ScanBarcode className="w-4 h-4 mr-2" />
                                    Enable Camera
                                </>
                            )}
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
