import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

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

  // Zoom state
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);
  const [supportsZoom, setSupportsZoom] = useState(false);

  // Pinch-to-zoom tracking
  const lastPinchDistance = useRef<number | null>(null);
  const zoomRef = useRef(1);

  const applyZoom = useCallback((track: MediaStreamTrack, level: number) => {
    const capabilities = track.getCapabilities?.() as any;
    if (!capabilities?.zoom) return;

    const clamped = Math.min(Math.max(level, capabilities.zoom.min), capabilities.zoom.max);
    (track as any).applyConstraints({ advanced: [{ zoom: clamped }] });
    setZoom(clamped);
    zoomRef.current = clamped;
  }, []);

  const startCamera = useCallback(async (facing: "environment" | "user") => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);

      // Check zoom capabilities
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        // Small delay to let capabilities populate on some devices
        setTimeout(() => {
          const caps = videoTrack.getCapabilities?.() as any;
          if (caps?.zoom) {
            setMinZoom(caps.zoom.min);
            setMaxZoom(caps.zoom.max);
            setSupportsZoom(true);
            // Start at 2x if supported, otherwise min
            const initial = Math.min(2, caps.zoom.max);
            applyZoom(videoTrack, initial);
          } else {
            setSupportsZoom(false);
            setZoom(1);
            setMinZoom(1);
            setMaxZoom(1);
          }
        }, 300);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please allow camera permissions.");
    }
  }, [applyZoom]);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Pinch-to-zoom handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDistance.current = Math.hypot(dx, dy);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 2 || lastPinchDistance.current === null) return;
    if (!stream || !supportsZoom) return;

    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const distance = Math.hypot(dx, dy);
    const scale = distance / lastPinchDistance.current;
    lastPinchDistance.current = distance;

    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const newZoom = zoomRef.current * scale;
      applyZoom(videoTrack, newZoom);
    }
  }, [stream, supportsZoom, applyZoom]);

  const handleTouchEnd = useCallback(() => {
    lastPinchDistance.current = null;
  }, []);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      applyZoom(videoTrack, parseFloat(e.target.value));
    }
  }, [stream, applyZoom]);

  const handleZoomStep = useCallback((direction: 1 | -1) => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;
    const step = (maxZoom - minZoom) * 0.1;
    applyZoom(videoTrack, zoomRef.current + step * direction);
  }, [stream, minZoom, maxZoom, applyZoom]);

  const switchCamera = () => {
    const newFacing = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newFacing);
    startCamera(newFacing);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    // Detect if the device is in landscape but sensor gives portrait pixels
    const orientationAngle =
      (screen.orientation?.angle ?? (window as any).orientation ?? 0) as number;
    const isLandscape = orientationAngle === 90 || orientationAngle === -90 || orientationAngle === 270;
    const sensorIsPortrait = vh > vw;
    const needsRotation = isLandscape && sensorIsPortrait;

    if (needsRotation) {
      canvas.width = vh;
      canvas.height = vw;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.save();
      if (orientationAngle === 90) {
        ctx.translate(vh, 0);
        ctx.rotate(Math.PI / 2);
      } else {
        ctx.translate(0, vw);
        ctx.rotate(-Math.PI / 2);
      }
      ctx.drawImage(video, 0, 0);
      ctx.restore();
    } else {
      canvas.width = vw;
      canvas.height = vh;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0);
    }

    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(blob);
      onPhotoCaptured(file, previewUrl);
    }, "image/jpeg", 0.95);
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

      {/* Video feed with pinch-to-zoom */}
      <div
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Zoom level indicator */}
        {supportsZoom && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {zoom.toFixed(1)}×
          </div>
        )}
      </div>

      {/* Zoom slider */}
      {supportsZoom && (
        <div className="flex items-center gap-3 px-6 py-2 bg-black/80">
          <button
            onClick={() => handleZoomStep(-1)}
            className="text-white/80 active:text-white p-1"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <input
            type="range"
            min={minZoom}
            max={maxZoom}
            step={(maxZoom - minZoom) / 100 || 0.1}
            value={zoom}
            onChange={handleSliderChange}
            className="flex-1 h-1 appearance-none bg-white/30 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
          />
          <button
            onClick={() => handleZoomStep(1)}
            className="text-white/80 active:text-white p-1"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Capture button */}
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
