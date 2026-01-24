"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Camera, Loader2, RefreshCw, X } from "lucide-react"

interface IngredientScannerProps {
    onScanComplete: (base64: string) => void
    isScanning: boolean
}

export function IngredientScanner({ onScanComplete, isScanning }: IngredientScannerProps) {
    const [isCameraOpen, setIsCameraOpen] = useState(false)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            // Pass base64 to parent
            onScanComplete(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            })
            setStream(mediaStream)
            setIsCameraOpen(true)
            // Wait for render
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream
                }
            }, 100)
        } catch (err) {
            console.error("Camera access denied", err)
            // Fallback or error handling could go here
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
        setIsCameraOpen(false)
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            // Draw video frame to canvas
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

                // Convert to base64
                const base64 = canvas.toDataURL('image/jpeg', 0.9)

                stopCamera()
                onScanComplete(base64)
            }
        }
    }

    return (
        <div className="space-y-6">
            {!isCameraOpen ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Upload Section */}
                    <div className="relative group cursor-pointer border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-muted/30">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                            disabled={isScanning}
                        />
                        <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">Upload Image</h3>
                            <p className="text-sm text-muted-foreground">Select from gallery</p>
                        </div>
                    </div>

                    {/* Camera Trigger */}
                    <div
                        onClick={startCamera}
                        className="relative group cursor-pointer border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-muted/30">
                        <div className="p-4 rounded-full bg-secondary text-secondary-foreground group-hover:scale-110 transition-transform">
                            <Camera className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">Take Photo</h3>
                            <p className="text-sm text-muted-foreground">Detailed scan</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4] sm:aspect-video shadow-2xl border-4 border-primary/20 max-w-2xl mx-auto">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                        <div className="w-[85%] h-[60%] border-2 border-white/50 rounded-lg relative">
                            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white"></div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white"></div>
                            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white"></div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-white/80 font-medium text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                    Align ingredients here
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6">
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={stopCamera}
                            className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md"
                        >
                            <X className="w-5 h-5" />
                        </Button>

                        <button
                            onClick={capturePhoto}
                            className="h-16 w-16 rounded-full bg-white border-4 border-primary/50 relative flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                        >
                            <div className="w-12 h-12 rounded-full bg-primary" />
                        </button>

                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={startCamera} // Re-init (switch camera logic could go here)
                            className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            )}

            <div className="col-span-full pt-4 text-center">
                <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Supported formats: JPG, PNG, WebP</p>
                    <p>• Ensure text is legible and well-lit</p>
                </div>
            </div>
        </div>
    )
}
