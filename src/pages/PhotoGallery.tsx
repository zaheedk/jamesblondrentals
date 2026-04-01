import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Search, ImageIcon, ChevronLeft, ChevronRight, LogOut } from "lucide-react";

type PhotoItem = { url: string; name: string; folder: string };
type BatchGroup = {
  reservationNo: string;
  rego: string;
  batchId: string;
  batchLabel: string;
  photos: PhotoItem[];
};

const formatBatchDate = (batchId: string): string => {
  const match = batchId.match(/batch-(\d+)/);
  if (!match) return batchId;
  const date = new Date(Number(match[1]));
  if (isNaN(date.getTime())) return batchId;
  return date.toLocaleString("en-NZ", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

const PhotoGallery = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { isOfficeAdmin, isLoading: roleLoading } = useUserRole();

  const [searchTerm, setSearchTerm] = useState("");
  const [batches, setBatches] = useState<BatchGroup[]>([]);
  const [flatPhotos, setFlatPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);
  const [searchMode, setSearchMode] = useState<"reservation" | "rego">("reservation");

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

  const normalize = (s: string) => s.replace(/[\s\-_]/g, "").toUpperCase();

  const collectFiles = async (folder: string): Promise<PhotoItem[]> => {
    const results: PhotoItem[] = [];
    const { data: files } = await supabase.storage.from("vehicle-photos").list(folder, { limit: 200 });
    if (!files) return results;
    for (const file of files) {
      if (file.id) {
        const path = `${folder}/${file.name}`;
        const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
        results.push({ url: urlData.publicUrl, name: file.name, folder });
      }
    }
    return results;
  };

  const searchPhotos = async () => {
    const term = searchTerm.trim().replace(/[\s\-]/g, "").toUpperCase();
    if (!term) return;

    setLoading(true);
    setSearched(true);
    setBatches([]);
    setFlatPhotos([]);

    try {
      const { data: topLevel } = await supabase.storage.from("vehicle-photos").list("", { limit: 1000 });
      if (!topLevel) { setLoading(false); return; }

      // Check if term matches a top-level folder (reservation number)
      const directMatch = topLevel.find(item => !item.id && normalize(item.name).includes(term));

      if (directMatch) {
        // Reservation number search — show all photos flat
        setSearchMode("reservation");
        const allPhotos: PhotoItem[] = [];

        const { data: subItems } = await supabase.storage.from("vehicle-photos").list(directMatch.name, { limit: 200 });
        if (subItems) {
          for (const sub of subItems) {
            if (sub.id) {
              // Legacy: file directly under reservation folder
              const path = `${directMatch.name}/${sub.name}`;
              const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
              allPhotos.push({ url: urlData.publicUrl, name: sub.name, folder: directMatch.name });
            } else {
              // Rego subfolder or batch subfolder
              const regoPath = `${directMatch.name}/${sub.name}`;
              const { data: regoItems } = await supabase.storage.from("vehicle-photos").list(regoPath, { limit: 200 });
              if (regoItems) {
                for (const ri of regoItems) {
                  if (ri.id) {
                    const path = `${regoPath}/${ri.name}`;
                    const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
                    allPhotos.push({ url: urlData.publicUrl, name: ri.name, folder: regoPath });
                  } else {
                    // Batch subfolder
                    const batchPhotos = await collectFiles(`${regoPath}/${ri.name}`);
                    allPhotos.push(...batchPhotos);
                  }
                }
              }
            }
          }
        }
        setFlatPhotos(allPhotos);
      } else {
        // Rego search — find rego subfolders inside all reservation folders, group by batch
        setSearchMode("rego");
        const batchGroups: BatchGroup[] = [];

        for (const resFolder of topLevel) {
          if (resFolder.id) continue;
          const { data: subItems } = await supabase.storage.from("vehicle-photos").list(resFolder.name, { limit: 100 });
          if (!subItems) continue;

          for (const sub of subItems) {
            if (sub.id) continue;
            if (!normalize(sub.name).includes(term)) continue;

            // Found matching rego subfolder — list batch folders inside
            const regoPath = `${resFolder.name}/${sub.name}`;
            const { data: batchFolders } = await supabase.storage.from("vehicle-photos").list(regoPath, { limit: 100 });
            if (!batchFolders) continue;

            // Check for files directly in rego folder (legacy) and batch subfolders
            const legacyPhotos: PhotoItem[] = [];
            for (const bf of batchFolders) {
              if (bf.id) {
                // File directly in rego folder
                const path = `${regoPath}/${bf.name}`;
                const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
                legacyPhotos.push({ url: urlData.publicUrl, name: bf.name, folder: regoPath });
              } else {
                // Batch subfolder
                const batchPhotos = await collectFiles(`${regoPath}/${bf.name}`);
                if (batchPhotos.length > 0) {
                  batchGroups.push({
                    reservationNo: resFolder.name,
                    rego: sub.name,
                    batchId: bf.name,
                    batchLabel: formatBatchDate(bf.name),
                    photos: batchPhotos,
                  });
                }
              }
            }
            if (legacyPhotos.length > 0) {
              batchGroups.push({
                reservationNo: resFolder.name,
                rego: sub.name,
                batchId: "legacy",
                batchLabel: "Earlier uploads",
                photos: legacyPhotos,
              });
            }
          }
        }

        setBatches(batchGroups);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") searchPhotos();
  };

  // Build a flat list for lightbox navigation
  const allPhotosFlat = searchMode === "reservation"
    ? flatPhotos
    : batches.flatMap(b => b.photos);

  const navigatePhoto = (direction: number) => {
    if (viewingIndex === null) return;
    const next = viewingIndex + direction;
    if (next >= 0 && next < allPhotosFlat.length) setViewingIndex(next);
  };

  const openLightbox = (photo: PhotoItem) => {
    const idx = allPhotosFlat.findIndex(p => p.url === photo.url);
    setViewingIndex(idx >= 0 ? idx : 0);
  };

  const totalCount = searchMode === "reservation" ? flatPhotos.length : batches.reduce((s, b) => s + b.photos.length, 0);

  return (
    <>
      <Helmet>
        <title>Photo Gallery | James Blond</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Vehicle Photo Gallery</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => { await signOut(); navigate("/login"); }}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Search by reservation no or rego..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            className="max-w-md uppercase"
          />
          <Button onClick={searchPhotos} disabled={loading || !searchTerm.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
            Search
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Searching...</span>
          </div>
        )}

        {!loading && searched && totalCount === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No photos found for "{searchTerm}"</p>
          </div>
        )}

        {/* Reservation search — flat grid */}
        {!loading && searchMode === "reservation" && flatPhotos.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-4">{flatPhotos.length} photo(s) found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {flatPhotos.map((photo, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-border hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => openLightbox(photo)}
                >
                  <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Rego search — grouped by batch */}
        {!loading && searchMode === "rego" && batches.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {totalCount} photo(s) in {batches.length} batch(es)
            </p>
            <div className="space-y-6">
              {batches.map((batch, bi) => (
                <Card key={bi}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>Reservation: <span className="font-bold">{batch.reservationNo}</span></span>
                      <span className="text-muted-foreground">|</span>
                      <span>Rego: <span className="font-bold">{batch.rego}</span></span>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-sm text-muted-foreground">{batch.batchLabel}</span>
                      <span className="ml-auto text-sm text-muted-foreground">{batch.photos.length} photo(s)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {batch.photos.map((photo, pi) => (
                        <div
                          key={pi}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-border hover:ring-2 hover:ring-primary transition-all"
                          onClick={() => openLightbox(photo)}
                        >
                          <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Lightbox */}
        <Dialog open={viewingIndex !== null} onOpenChange={() => setViewingIndex(null)}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 bg-black/95 border-none">
            {viewingIndex !== null && allPhotosFlat[viewingIndex] && (
              <div className="relative flex items-center justify-center">
                {viewingIndex > 0 && (
                  <button
                    onClick={() => navigatePhoto(-1)}
                    className="absolute left-2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}
                <img
                  src={allPhotosFlat[viewingIndex].url}
                  alt={allPhotosFlat[viewingIndex].name}
                  className="w-full h-full object-contain max-h-[85vh]"
                />
                {viewingIndex < allPhotosFlat.length - 1 && (
                  <button
                    onClick={() => navigatePhoto(1)}
                    className="absolute right-2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}
                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/70 text-xs">
                  {viewingIndex + 1} / {allPhotosFlat.length} — {allPhotosFlat[viewingIndex].folder}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default PhotoGallery;
