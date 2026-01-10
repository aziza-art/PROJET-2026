import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { Camera, X, ShieldAlert } from 'lucide-react';

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        let animationFrameId: number;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.setAttribute("playsinline", "true");
                    videoRef.current.play();
                    requestAnimationFrame(tick);
                }
            } catch (err) {
                setError("Accès caméra refusé. Veuillez autoriser l'accès pour scanner les codes modules.");
            }
        };

        const tick = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    canvas.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) onScan(code.data);
                }
            }
            animationFrameId = requestAnimationFrame(tick);
        };

        startCamera();
        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
            cancelAnimationFrame(animationFrameId);
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-slate-900 glass-panel">
                <h3 className="font-black text-xs uppercase tracking-[0.3em] text-white flex items-center gap-3">
                    <Camera className="w-4 h-4 text-indigo-400" /> Scanner Module ISGI
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-900 rounded-xl transition-colors"><X className="w-6 h-6 text-slate-500" /></button>
            </div>
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {error ? (
                    <div className="text-center p-8 max-w-xs">
                        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-500 font-black uppercase text-[10px] tracking-widest leading-relaxed">{error}</p>
                    </div>
                ) : (
                    <video ref={videoRef} className="h-full w-full object-cover opacity-60" />
                )}
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-72 h-72 border-2 border-indigo-500/50 rounded-3xl relative">
                        <div className="scanline"></div>
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl"></div>
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl"></div>
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl"></div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
