import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { rcmApi } from "@/lib/api/rcm-api";
import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, Upload, X, Loader2, Search, ImageIcon, Trash2 } from "lucide-react";
import VehicleCamera from "@/components/VehicleCamera";

const addTimestampToPhoto = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }

      ctx.drawImage(img, 0, 0);

      const now = new Date();
      const stamp = now.toLocaleString("en-NZ", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      });

      const fontSize = Math.max(16, Math.floor(img.width / 40));
      ctx.font = `bold ${fontSize}px Arial`;
      const textWidth = ctx.measureText(stamp).width;
      const padding = 8;
      const x = img.width - textWidth - padding * 2;
      const y = img.height - padding * 2;

      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(x - padding, y - fontSize - padding, textWidth + padding * 2, fontSize + padding * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(stamp, x, y);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) { resolve(file); return; }
        resolve(new File([blob], file.name, { type: "image/jpeg" }));
      }, "image/jpeg", 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
};

const VehiclePhotos = () => {
  const { user, loading: authLoading } = useAuth();
  const { isOfficeAdmin, isLoading: roleLoading } = useUserRole();

  const [reservationNo, setReservationNo] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingLoaded, setBookingLoaded] = useState(false);
  const [vehicleRego, setVehicleRego] = useState("");
  const [vehicleDesc, setVehicleDesc] = useState("");
  const [reservationRef, setReservationRef] = useState("");
  const [customerName, setCustomerName] = useState("");

  const [cameraOpen, setCameraOpen] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<{ file: File; previewUrl: string }[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<{ url: string; name: string }[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<{ url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
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

  const loadExistingPhotos = async (ref: string, rego: string) => {
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
          // subfolder
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

    if (ref) await tryList(ref);
    if (rego) await tryList(rego);

    setExistingPhotos(photos);
  };

  const handleSearch = async () => {
    if (!reservationNo.trim()) {
      toast.error("Please enter a reservation number");
      return;
    }

    setLoading(true);
    try {
      const response = await rcmApi.getBookingInfo(reservationNo.trim(), lastName.trim());
      const booking = response?.results;

      if (!booking) {
        toast.error("Booking not found");
        return;
      }

      const rego = booking.vehicle_registrationnumber || "";
      const desc = booking.vehicledescription1 || booking.vehiclecategory || "";
      const name = `${booking.firstname || ""} ${booking.lastname || ""}`.trim();
      const ref = booking.reservationref || "";

      setVehicleRego(rego);
      setVehicleDesc(desc);
      setCustomerName(name);
      setReservationRef(ref);
      setBookingLoaded(true);

      await loadExistingPhotos(ref, rego);
      toast.success("Booking loaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load booking");
    } finally {
      setLoading(false);
    }
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
    if (!pendingPhotos.length || !reservationRef) return;

    const rego = vehicleRego.trim() || "unknown-rego";
    setUploading(true);
    try {
      const uploaded: { url: string; name: string }[] = [];
      for (const pending of pendingPhotos) {
        const stampedFile = await addTimestampToPhoto(pending.file);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
        const filePath = `${reservationRef}/${rego}/${fileName}`;
        const { error } = await supabase.storage
          .from("vehicle-photos")
          .upload(filePath, stampedFile);

        if (!error) {
          const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(filePath);
          uploaded.push({ url: urlData.publicUrl, name: `${rego}/${fileName}` });
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

        {/* Search Section */}
        {!bookingLoaded ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Find Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="resNo">Reservation Number</Label>
                <Input
                  id="resNo"
                  value={reservationNo}
                  onChange={e => setReservationNo(e.target.value)}
                  placeholder="e.g. 29823"
                  className="h-14 text-lg"
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Customer Last Name (optional)</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="h-14 text-lg"
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading} className="w-full h-14 text-lg">
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Search className="h-5 w-5 mr-2" />}
                Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Booking Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{customerName}</span></div>
                  <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-medium">{vehicleDesc}</span></div>
                  <div><span className="text-muted-foreground">Rego:</span> <span className="font-medium">{vehicleRego || "N/A"}</span></div>
                  <div>
                    <Button variant="link" className="p-0 h-auto text-sm" onClick={() => { setBookingLoaded(false); setPendingPhotos([]); setUploadedPhotos([]); setExistingPhotos([]); }}>
                      Change booking
                    </Button>
                  </div>
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

            {/* All Photos (existing + newly uploaded) */}
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
