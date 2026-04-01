import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, RotateCcw } from "lucide-react";

interface VehicleCameraProps {
  onPhotoCaptured: (file: File, previewUrl: string) => void;
  onClose: () => void;
  photoCount: number;
}

const VehicleCamera = ({ onPhotoCaptured, onClose, photoCount }: VehicleCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flash, setFlash] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async (facing: "environment" | "user") => {
    // Stop existing stream
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          zoom: { ideal: 2 },
        } as MediaTrackConstraints,
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please allow camera permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const switchCamera = () => {
    const newFacing = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newFacing);
    startCamera(newFacing);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    // Flash effect
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(blob);
      onPhotoCaptured(file, previewUrl);
    }, "image/jpeg", 0.85);
  };

  const handleClose = () => {
    stream?.getTracks().forEach(t => t.stop());
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white p-4">
        <p className="text-center mb-4">{error}</p>
        <Button variant="outline" onClick={handleClose} className="text-white border-white">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Flash overlay */}
      {flash && <div className="absolute inset-0 z-50 bg-white pointer-events-none" />}

      {/* Top bar */}
      <div className="flex items-center justify-between p-3 bg-black/80 text-white z-10">
        <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-white/20">
          <X className="h-6 w-6" />
        </Button>
        <span className="text-sm font-medium">
          {photoCount} photo{photoCount !== 1 ? "s" : ""} taken
        </span>
        <Button variant="ghost" size="icon" onClick={switchCamera} className="text-white hover:bg-white/20">
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* Video feed */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Bottom bar with capture button */}
      <div className="flex items-center justify-center p-6 bg-black/80">
        <button
          onClick={capturePhoto}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Take photo"
        >
          <div className="w-16 h-16 rounded-full bg-white" />
        </button>
      </div>

      {/* Done button */}
      <div className="p-3 bg-black/80 flex justify-center">
        <Button
          onClick={handleClose}
          variant="default"
          size="lg"
          className="min-w-[200px] text-base font-semibold"
        >
          Done ({photoCount} photos)
        </Button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default VehicleCamera;
