import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCcw, Check } from 'lucide-react';

interface CapturePhotoProps {
    onCapture: (file: File) => void;
    label?: string;
}

export function CapturePhoto({ onCapture, label = "Capture Live Photo" }: CapturePhotoProps) {
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setImgSrc(imageSrc);

                // Convert base64 to File
                fetch(imageSrc)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "live_capture.jpg", { type: "image/jpeg" });
                        onCapture(file);
                    });
            }
        }
    }, [webcamRef, onCapture]);

    const retake = () => {
        setImgSrc(null);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                {label} <span className="text-red-500">*</span>
            </label>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
                {!imgSrc ? (
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-full object-cover"
                            onUserMedia={() => setIsCameraReady(true)}
                            mirrored
                        />
                        {isCameraReady && (
                            <button
                                type="button"
                                onClick={capture}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full p-4 shadow-lg hover:bg-slate-100 transition-colors"
                            >
                                <Camera className="w-6 h-6 text-slate-900" />
                            </button>
                        )}
                        {!isCameraReady && (
                            <div className="absolute inset-0 flex items-center justify-center text-white">
                                <p>Loading Camera...</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="relative w-full h-full">
                        <img src={imgSrc} alt="captured" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={retake}
                                    className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/30"
                                >
                                    <RefreshCcw className="w-4 h-4" /> Retake
                                </button>
                                <div className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Captured
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <p className="text-xs text-slate-500">
                Please ensure your face is clearly visible. This photo will be used for patient verification.
            </p>
        </div>
    );
}
