import { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, Upload, X, Loader2, ImageIcon } from "lucide-react";
import VehicleCamera from "@/components/VehicleCamera";

const addTimestampToPhoto = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { console.warn("No canvas context"); resolve(file); return; }

        ctx.drawImage(img, 0, 0);

        const now = new Date();
        const stamp = now.toLocaleString("en-NZ", {
          day: "2-digit", month: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
        });

        const fontSize = Math.max(20, Math.floor(img.width / 30));
        ctx.font = `bold ${fontSize}px Arial`;
        const textWidth = ctx.measureText(stamp).width;
        const padding = 12;
        const x = img.width - textWidth - padding * 2;
        const y = img.height - padding * 2;

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(x - padding, y - fontSize - padding, textWidth + padding * 2, fontSize + padding * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(stamp, x, y);

        canvas.toBlob((blob) => {
          if (!blob) { console.warn("Canvas toBlob failed"); resolve(file); return; }
          console.log("Timestamp added to photo successfully");
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        }, "image/jpeg", 0.85);
      };
      img.onerror = () => { console.warn("Image load error for timestamp"); resolve(file); };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => { console.warn("FileReader error"); resolve(file); };
    reader.readAsDataURL(file);
  });
};

const VehiclePhotos = () => {
  const { user, loading: authLoading } = useAuth();
  const { isOfficeAdmin, isLoading: roleLoading } = useUserRole();

  const [reservationRef, setReservationRef] = useState("");
  const [photoMode, setPhotoMode] = useState(false);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<{ file: File; previewUrl: string }[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<{ url: string; name: string }[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<{ url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isOfficeAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">You do not have permission to access this page.</p>
      </div>
    );
  }

  const loadExistingPhotos = async (ref: string) => {
    const photos: { url: string; name: string }[] = [];

    const tryList = async (prefix: string) => {
      const { data: items } = await supabase.storage
        .from("vehicle-photos")
        .list(prefix, { limit: 100 });
      if (!items) return;
      for (const item of items) {
        if (item.id) {
          const path = `${prefix}/${item.name}`;
          const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
          photos.push({ url: urlData.publicUrl, name: item.name });
        } else {
          const { data: subFiles } = await supabase.storage
            .from("vehicle-photos")
            .list(`${prefix}/${item.name}`, { limit: 100 });
          if (subFiles) {
            for (const f of subFiles) {
              if (f.id) {
                const path = `${prefix}/${item.name}/${f.name}`;
                const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
                photos.push({ url: urlData.publicUrl, name: `${item.name}/${f.name}` });
              }
            }
          }
        }
      }
    };

    await tryList(ref);
    setExistingPhotos(photos);
  };

  const handleStart = async () => {
    if (!reservationRef.trim()) {
      toast.error("Please enter a reservation number");
      return;
    }
    setLoadingPhotos(true);
    await loadExistingPhotos(reservationRef.trim());
    setPhotoMode(true);
    setLoadingPhotos(false);
  };

  const handleCameraCapture = (file: File, previewUrl: string) => {
    setPendingPhotos(prev => [...prev, { file, previewUrl }]);
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPending: { file: File; previewUrl: string }[] = [];
    for (const file of Array.from(files)) {
      newPending.push({ file, previewUrl: URL.createObjectURL(file) });
    }
    setPendingPhotos(prev => [...prev, ...newPending]);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const removePending = (index: number) => {
    setPendingPhotos(prev => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (!pendingPhotos.length || !reservationRef.trim()) return;

    setUploading(true);
    try {
      const uploaded: { url: string; name: string }[] = [];
      for (const pending of pendingPhotos) {
        const stampedFile = await addTimestampToPhoto(pending.file);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
        const filePath = `${reservationRef.trim()}/${fileName}`;
        const { error } = await supabase.storage
          .from("vehicle-photos")
          .upload(filePath, stampedFile);

        if (!error) {
          const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(filePath);
          uploaded.push({ url: urlData.publicUrl, name: fileName });
        } else {
          console.error("Upload error:", error);
        }
      }
      setUploadedPhotos(prev => [...prev, ...uploaded]);
      pendingPhotos.forEach(p => URL.revokeObjectURL(p.previewUrl));
      setPendingPhotos([]);
      toast.success(`${uploaded.length} photo(s) uploaded!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload photos");
    } finally {
      setUploading(false);
    }
  };

  const allPhotos = [...existingPhotos, ...uploadedPhotos];

  return (
    <>
      <Helmet>
        <title>Vehicle Photos | James Blond</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {cameraOpen && (
        <VehicleCamera
          onPhotoCaptured={handleCameraCapture}
          onClose={() => setCameraOpen(false)}
          photoCount={pendingPhotos.length}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Vehicle Inspection Photos</h1>

        {!photoMode ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enter Reservation No</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="resRef">Reservation No</Label>
                <Input
                  id="resRef"
                  value={reservationRef}
                  onChange={e => setReservationRef(e.target.value)}
                  placeholder="e.g. 29823"
                  inputMode="numeric"
                  className="h-14 text-lg"
                  onKeyDown={e => e.key === "Enter" && handleStart()}
                />
              </div>
              <Button onClick={handleStart} disabled={loadingPhotos} className="w-full h-14 text-lg">
                {loadingPhotos ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Camera className="h-5 w-5 mr-2" />}
                Continue
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Reservation No:</span>{" "}
                    <span className="font-medium">{reservationRef}</span>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-sm" onClick={() => { setPhotoMode(false); setPendingPhotos([]); setUploadedPhotos([]); setExistingPhotos([]); }}>
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Camera & Gallery Buttons */}
            <div className="flex gap-3">
              <Button onClick={() => setCameraOpen(true)} className="flex-1 h-14 text-base">
                <Camera className="h-5 w-5 mr-2" /> Take Photo
              </Button>
              <Button variant="outline" onClick={() => galleryInputRef.current?.click()} className="flex-1 h-14 text-base">
                <ImageIcon className="h-5 w-5 mr-2" /> Gallery
              </Button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGallerySelect}
              />
            </div>

            {/* Pending Photos */}
            {pendingPhotos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ready to Upload ({pendingPhotos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {pendingPhotos.map((p, i) => (
                      <div key={i} className="relative aspect-square">
                        <img src={p.previewUrl} alt={`Pending ${i + 1}`} className="w-full h-full object-cover rounded-md" />
                        <button
                          onClick={() => removePending(i)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleUpload} disabled={uploading} className="w-full h-12 text-base">
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Upload className="h-5 w-5 mr-2" />}
                    Upload {pendingPhotos.length} Photo{pendingPhotos.length !== 1 ? "s" : ""}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* All Photos */}
            {allPhotos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Uploaded Photos ({allPhotos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {allPhotos.map((photo, i) => (
                      <div key={i} className="relative aspect-square">
                        <img src={photo.url} alt={photo.name} className="w-full h-full object-cover rounded-md" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default VehiclePhotos;
