import { useState, useRef, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import PageSEO from '@/components/PageSEO';
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Camera, Upload, X, Loader2, ImageIcon, RefreshCw, WifiOff, AlertTriangle } from "lucide-react";
import VehicleCamera from "@/components/VehicleCamera";
import { addTimestampToPhoto, normalizeImageFile } from "@/lib/vehicle-photo-utils";
import {
  savePhotoOffline,
  getPendingPhotos,
  removePhoto,
  updatePhotoStatus,
  getAllPendingCount,
  type OfflinePhoto,
} from "@/lib/offline-photo-store";

const VehiclePhotos = () => {
  const { user, loading: authLoading } = useAuth();
  const { isOfficeAdmin, isLoading: roleLoading } = useUserRole();

  const [reservationRef, setReservationRef] = useState("");
  const [vehicleRego, setVehicleRego] = useState("");
  const [photoMode, setPhotoMode] = useState(false);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<{ file: File; previewUrl: string }[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<{ url: string; name: string }[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<{ url: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);
  const [offlinePhotos, setOfflinePhotos] = useState<OfflinePhoto[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [totalOfflineCount, setTotalOfflineCount] = useState(0);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const canStart = reservationRef.trim() !== "" && vehicleRego.trim() !== "";

  const loadOfflinePhotos = useCallback(async (ref?: string) => {
    try {
      const photos = await getPendingPhotos(ref);
      setOfflinePhotos(photos);
      const count = await getAllPendingCount();
      setTotalOfflineCount(count);
    } catch (err) {
      console.error("Failed to load offline photos:", err);
    }
  }, []);

  // Load total offline count on mount
  useEffect(() => {
    getAllPendingCount().then(setTotalOfflineCount).catch(() => {});
  }, []);

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
    if (!reservationRef.trim() || !vehicleRego.trim()) {
      toast.error("Please enter both reservation number and vehicle registration");
      return;
    }
    setLoadingPhotos(true);
    await loadExistingPhotos(reservationRef.trim());
    await loadOfflinePhotos(reservationRef.trim());
    setPhotoMode(true);
    setLoadingPhotos(false);
  };

  const handleCameraCapture = (file: File, previewUrl: string) => {
    setPendingPhotos(prev => [...prev, { file, previewUrl }]);
  };

  const handleGallerySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (!files.length) return;

    try {
      const normalizedPending = await Promise.all(
        files.map(async (file) => {
          const normalizedFile = await normalizeImageFile(file);
          return {
            file: normalizedFile,
            previewUrl: URL.createObjectURL(normalizedFile),
          };
        }),
      );

      setPendingPhotos(prev => [...prev, ...normalizedPending]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to process selected photos");
    }
  };

  const removePending = (index: number) => {
    setPendingPhotos(prev => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadSinglePhoto = async (
    stampedFile: File,
    basePath: string,
    originalBlob: Blob,
    ref: string,
    rego: string,
  ): Promise<{ url: string; name: string } | null> => {
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const filePath = `${basePath}/${fileName}`;

    const { error } = await supabase.storage
      .from("vehicle-photos")
      .upload(filePath, stampedFile);

    if (!error) {
      const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(filePath);
      return { url: urlData.publicUrl, name: fileName };
    }

    // Upload failed — save offline
    console.error("Upload error, saving offline:", error);
    await savePhotoOffline({
      reservationRef: ref,
      vehicleRego: rego,
      fileName,
      blob: originalBlob,
    });
    return null;
  };

  const handleUpload = async () => {
    if (!pendingPhotos.length || !reservationRef.trim() || !vehicleRego.trim()) {
      toast.error("Reservation number and rego are required");
      return;
    }

    setUploading(true);
    try {
      const uploaded: { url: string; name: string }[] = [];
      let savedOffline = 0;
      const batchId = `batch-${Date.now()}`;
      const ref = reservationRef.trim();
      const rego = vehicleRego.trim() || "no-rego";
      const basePath = `${ref}/${rego}/${batchId}`;

      for (const pending of pendingPhotos) {
        const stampedFile = await addTimestampToPhoto(pending.file, vehicleRego.trim() || undefined);
        const result = await uploadSinglePhoto(stampedFile, basePath, pending.file, ref, rego);
        if (result) {
          uploaded.push(result);
        } else {
          savedOffline++;
        }
      }

      setUploadedPhotos(prev => [...prev, ...uploaded]);
      pendingPhotos.forEach(p => URL.revokeObjectURL(p.previewUrl));
      setPendingPhotos([]);

      if (uploaded.length > 0 && savedOffline === 0) {
        toast.success(`${uploaded.length} photo(s) uploaded!`);
      } else if (uploaded.length > 0 && savedOffline > 0) {
        toast.success(`${uploaded.length} uploaded, ${savedOffline} saved offline for later sync`);
      } else {
        toast.warning(`${savedOffline} photo(s) saved offline — sync when you have a connection`, {
          icon: <WifiOff className="h-4 w-4" />,
        });
      }

      await loadOfflinePhotos(ref);
    } catch (err) {
      console.error(err);
      // On total failure, save all pending photos offline
      const ref = reservationRef.trim();
      const rego = vehicleRego.trim() || "no-rego";
      let saved = 0;
      for (const pending of pendingPhotos) {
        try {
          await savePhotoOffline({
            reservationRef: ref,
            vehicleRego: rego,
            fileName: `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
            blob: pending.file,
          });
          saved++;
        } catch {
          /* ignore */
        }
      }
      pendingPhotos.forEach(p => URL.revokeObjectURL(p.previewUrl));
      setPendingPhotos([]);
      toast.warning(`Network error — ${saved} photo(s) saved offline`, {
        icon: <WifiOff className="h-4 w-4" />,
      });
      await loadOfflinePhotos(ref);
    } finally {
      setUploading(false);
    }
  };

  const handleSync = async () => {
    return handleSyncPhotos(offlinePhotos);
  };

  const handleSyncAll = async () => {
    const all = await getPendingPhotos();
    if (!all.length) {
      toast.info("No photos waiting to sync");
      return;
    }
    await handleSyncPhotos(all);
  };

  const handleSyncPhotos = async (photos: OfflinePhoto[]) => {
    if (!photos.length) return;
    setSyncing(true);

    const CONCURRENCY = 4;
    let synced = 0;
    let failed = 0;
    let lastError: string | null = null;

    for (let i = 0; i < photos.length; i += CONCURRENCY) {
      const batch = photos.slice(i, i + CONCURRENCY);
      const batchId = `batch-${Date.now()}`;

      const results = await Promise.all(
        batch.map(async (photo) => {
          try {
            await updatePhotoStatus(photo.id, "uploading");

            const file = new File([photo.blob], photo.fileName, { type: "image/jpeg" });
            const stampedFile = await addTimestampToPhoto(file, photo.vehicleRego || undefined);
            const basePath = `${photo.reservationRef}/${photo.vehicleRego || "no-rego"}/${batchId}`;
            const filePath = `${basePath}/${photo.fileName}`;

            const { error } = await supabase.storage
              .from("vehicle-photos")
              .upload(filePath, stampedFile, {
                contentType: "image/jpeg",
                upsert: true,
              });

            if (!error) {
              await removePhoto(photo.id);
              const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(filePath);
              setUploadedPhotos(prev => [...prev, { url: urlData.publicUrl, name: photo.fileName }]);
              return { ok: true };
            } else {
              console.error("Sync upload failed:", error);
              await updatePhotoStatus(photo.id, "failed", error.message);
              return { ok: false, error: error.message };
            }
          } catch (err) {
            console.error("Sync exception:", err);
            await updatePhotoStatus(photo.id, "failed", String(err));
            return { ok: false, error: String(err) };
          }
        }),
      );

      for (const r of results) {
        if (r.ok) synced++;
        else {
          failed++;
          if (r.error) lastError = r.error;
        }
      }
    }

    if (synced > 0 && failed === 0) {
      toast.success(`${synced} photo(s) synced successfully!`);
    } else if (synced > 0) {
      toast.warning(`${synced} synced, ${failed} failed: ${lastError ?? "unknown error"}`);
    } else {
      toast.error(`Sync failed: ${lastError ?? "check your connection"}`);
    }

    await loadOfflinePhotos(reservationRef.trim() || undefined);
    setSyncing(false);
  };

  const removeOfflinePhoto = async (id: string) => {
    await removePhoto(id);
    await loadOfflinePhotos(reservationRef.trim());
  };

  const allPhotos = [...existingPhotos, ...uploadedPhotos];

  return (
    <>
      <Helmet>
        <link rel="manifest" href="/manifest.json" />
      </Helmet>
      <PageSEO
        title="Vehicle Photos | James Blond"
        description="Capture and upload vehicle condition photos for James Blond Rentals."
        noindex
      />

      {cameraOpen && (
        <VehicleCamera
          onPhotoCaptured={handleCameraCapture}
          onClose={() => setCameraOpen(false)}
          photoCount={pendingPhotos.length}
        />
      )}

      <div className="min-h-[calc(100vh-4rem)] flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Vehicle Inspection Photos</h1>

        {!photoMode ? (
          <div className="space-y-4">
            {totalOfflineCount > 0 && (
              <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <WifiOff className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {totalOfflineCount} photo{totalOfflineCount !== 1 ? "s" : ""} waiting to sync
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the reservation details and tap sync to upload
                  </p>
                  <Button
                    onClick={handleSyncAll}
                    disabled={syncing}
                    variant="outline"
                    className="w-full mt-3 h-11 border-amber-500 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  >
                    {syncing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Sync All Now
                  </Button>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Enter Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="resRef">Reservation No</Label>
                  <Input
                    id="resRef"
                    value={reservationRef}
                    onChange={e => setReservationRef(e.target.value)}
                    placeholder="e.g. 29823"
                    required
                    inputMode="numeric"
                    className="h-14 text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleRego">Vehicle Registration</Label>
                  <Input
                    id="vehicleRego"
                    value={vehicleRego}
                    onChange={e => setVehicleRego(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC123"
                    required
                    className="h-14 text-lg uppercase"
                    onKeyDown={e => e.key === "Enter" && handleStart()}
                  />
                </div>
                <Button onClick={handleStart} disabled={loadingPhotos || !canStart} className="w-full h-14 text-lg">
                  {loadingPhotos ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Camera className="h-5 w-5 mr-2" />}
                  Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-muted-foreground">Reservation No:</span>{" "}
                      <span className="font-medium">{reservationRef}</span>
                    </div>
                    {vehicleRego && (
                      <div>
                        <span className="text-muted-foreground">Rego:</span>{" "}
                        <span className="font-medium">{vehicleRego}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="link" className="p-0 h-auto text-sm" onClick={() => { setPhotoMode(false); setPendingPhotos([]); setUploadedPhotos([]); setExistingPhotos([]); setOfflinePhotos([]); }}>
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
                        <img src={p.previewUrl} alt={`Pending ${i + 1}`} className="w-full h-full object-cover rounded-md" style={{ imageOrientation: "from-image" }} />
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

            {/* Offline / Pending Sync Photos */}
            {offlinePhotos.length > 0 && (
              <Card className="border-amber-500/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Saved Offline ({offlinePhotos.length})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {offlinePhotos.map((photo) => {
                      const previewUrl = URL.createObjectURL(photo.blob);
                      return (
                        <div key={photo.id} className="relative aspect-square">
                          <img
                            src={previewUrl}
                            alt={photo.fileName}
                            className="w-full h-full object-cover rounded-md opacity-75"
                            style={{ imageOrientation: "from-image" }}
                            onLoad={() => URL.revokeObjectURL(previewUrl)}
                          />
                          <div className="absolute top-1 left-1">
                            <WifiOff className="h-3 w-3 text-amber-500 drop-shadow-md" />
                          </div>
                          <button
                            onClick={() => removeOfflinePhoto(photo.id)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {photo.status === "failed" && (
                            <div className="absolute bottom-1 left-1 right-1 bg-red-600/80 text-white text-[10px] px-1 rounded text-center">
                              Failed
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Button onClick={handleSync} disabled={syncing} variant="outline" className="w-full h-12 text-base border-amber-500 text-amber-700 hover:bg-amber-50">
                    {syncing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <RefreshCw className="h-5 w-5 mr-2" />}
                    Sync {offlinePhotos.length} Photo{offlinePhotos.length !== 1 ? "s" : ""}
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
                      <div key={i} className="relative aspect-square cursor-pointer" onClick={() => setViewingPhoto(photo.url)}>
                         <img src={photo.url} alt={photo.name} className="w-full h-full object-cover rounded-md" style={{ imageOrientation: "from-image" }} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Photo Lightbox */}
            <Dialog open={!!viewingPhoto} onOpenChange={() => setViewingPhoto(null)}>
              <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 bg-black/95 border-none">
                {viewingPhoto && (
                  <img
                    src={viewingPhoto}
                    alt="Full size"
                    className="w-full h-full object-contain max-h-[90vh]"
                      style={{ imageOrientation: "from-image" }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default VehiclePhotos;
