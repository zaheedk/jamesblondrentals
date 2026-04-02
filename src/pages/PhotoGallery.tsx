import { useState, useEffect, useRef, useCallback } from "react";
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
  sortKey: number;
  photos: PhotoItem[];
  isHydrated?: boolean;
};

const BATCH_PAGE_SIZE = 5;

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

const getBatchSortKey = (batchId: string): number => {
  const match = batchId.match(/batch-(\d+)/);
  return match ? Number(match[1]) : 0;
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
  const [activeBatchPhotos, setActiveBatchPhotos] = useState<PhotoItem[]>([]);
  const [searchMode, setSearchMode] = useState<"reservation" | "rego" | "recent">("recent");

  // All discovered batches (for recent feed & infinite scroll)
  const [allBatches, setAllBatches] = useState<BatchGroup[]>([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_PAGE_SIZE);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const collectFiles = async (folder: string): Promise<PhotoItem[]> => {
    try {
      const results: PhotoItem[] = [];
      const { data: files, error } = await supabase.storage.from("vehicle-photos").list(folder, { limit: 200 });
      if (error || !files) {
        if (error) console.error("Failed to list files for folder:", folder, error);
        return results;
      }

      for (const file of files) {
        if (file.id) {
          const path = `${folder}/${file.name}`;
          const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
          results.push({ url: urlData.publicUrl, name: file.name, folder });
        }
      }

      return results;
    } catch (error) {
      console.error("Failed to collect files for folder:", folder, error);
      return [];
    }
  };

  const getBatchFolder = (batch: BatchGroup): string => {
    if (batch.batchId === "legacy-flat") return batch.reservationNo;
    if (batch.batchId === "legacy-rego") return `${batch.reservationNo}/${batch.rego}`;
    return `${batch.reservationNo}/${batch.rego}/${batch.batchId}`;
  };

  const getBatchKey = (batch: Pick<BatchGroup, "reservationNo" | "rego" | "batchId">) =>
    `${batch.reservationNo}::${batch.rego}::${batch.batchId}`;

  const mergeLoadedBatches = (existing: BatchGroup[], loaded: BatchGroup[]) => {
    const loadedMap = new Map(loaded.map((batch) => [getBatchKey(batch), batch]));
    return existing.map((batch) => loadedMap.get(getBatchKey(batch)) ?? batch);
  };

  // Scan all folders to discover batches on mount
  const scanAllBatches = useCallback(async () => {
    setInitialLoading(true);
    try {
      const { data: topLevel } = await supabase.storage.from("vehicle-photos").list("", { limit: 1000 });
      if (!topLevel) { setInitialLoading(false); setScanComplete(true); return; }

      const discovered: BatchGroup[] = [];

      for (const resFolder of topLevel) {
        if (resFolder.id) continue; // skip files
        const { data: subItems } = await supabase.storage.from("vehicle-photos").list(resFolder.name, { limit: 200 });
        if (!subItems) continue;

        // Check if this folder has files directly (legacy flat structure)
        const hasDirectFiles = subItems.some(item => item.id);
        const hasSubFolders = subItems.some(item => !item.id);

        if (hasDirectFiles) {
          // Legacy flat upload: files directly in {reservationNo}/
          const oldestFile = subItems.filter(f => f.id).sort((a, b) => 
            new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          )[0];
          const sortKey = oldestFile?.created_at ? new Date(oldestFile.created_at).getTime() : 0;
          discovered.push({
            reservationNo: resFolder.name,
            rego: "",
            batchId: "legacy-flat",
            batchLabel: "Earlier uploads",
            sortKey,
            photos: [],
            isHydrated: false,
          });
        }

        if (hasSubFolders) {
          for (const sub of subItems) {
            if (sub.id) continue; // skip files at this level
            const regoPath = `${resFolder.name}/${sub.name}`;
            const { data: regoItems } = await supabase.storage.from("vehicle-photos").list(regoPath, { limit: 200 });
            if (!regoItems) continue;

            // Check if rego folder has direct files (legacy with rego but no batch)
            const regoHasFiles = regoItems.some(item => item.id);
            const regoHasBatches = regoItems.some(item => !item.id && item.name.startsWith("batch-"));

            if (regoHasFiles) {
              const oldestFile = regoItems.filter(f => f.id).sort((a, b) =>
                new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
              )[0];
              const sortKey = oldestFile?.created_at ? new Date(oldestFile.created_at).getTime() : 0;
              discovered.push({
                reservationNo: resFolder.name,
                rego: sub.name,
                batchId: "legacy-rego",
                batchLabel: "Earlier uploads",
                sortKey,
                photos: [],
                isHydrated: false,
              });
            }

            if (regoHasBatches) {
              for (const bf of regoItems) {
                if (bf.id) continue;
                if (bf.name.startsWith("batch-")) {
                  discovered.push({
                    reservationNo: resFolder.name,
                    rego: sub.name,
                    batchId: bf.name,
                    batchLabel: formatBatchDate(bf.name),
                    sortKey: getBatchSortKey(bf.name),
                    photos: [],
                    isHydrated: false,
                  });
                }
              }
            }
          }
        }
      }

      // Sort newest first
      discovered.sort((a, b) => b.sortKey - a.sortKey);
      setAllBatches(discovered);
      setVisibleCount(BATCH_PAGE_SIZE);
      setScanComplete(true);
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    scanAllBatches();
  }, [scanAllBatches]);

  // Infinite scroll observer
  useEffect(() => {
    if (searchMode !== "recent") return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !initialLoading && !loadingMore && visibleCount < allBatches.length) {
          setLoadingMore(true);
          setVisibleCount(prev => Math.min(prev + BATCH_PAGE_SIZE, allBatches.length));
        }
      },
      { rootMargin: "300px 0px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [searchMode, visibleCount, allBatches.length, initialLoading, loadingMore]);

  // Load photos for newly visible batches
  useEffect(() => {
    if (searchMode !== "recent" || initialLoading) return;

    let cancelled = false;

    const loadNewBatches = async () => {
      const toLoad = allBatches.slice(0, visibleCount).filter((batch) => !batch.isHydrated);
      if (toLoad.length === 0) {
        setLoadingMore(false);
        return;
      }

      const results = await Promise.allSettled(
        toLoad.map(async (batch) => ({
          ...batch,
          photos: await collectFiles(getBatchFolder(batch)),
          isHydrated: true,
        }))
      );

      if (cancelled) return;

      const loaded = results.flatMap((result) => {
        if (result.status === "fulfilled") return [result.value];
        console.error("Failed to load batch photos:", result.reason);
        return [];
      });

      if (loaded.length > 0) {
        setAllBatches((prev) => mergeLoadedBatches(prev, loaded));
      }

      setLoadingMore(false);
    };

    loadNewBatches();

    return () => {
      cancelled = true;
    };
  }, [allBatches, visibleCount, searchMode, initialLoading]);

  const normalize = (s: string) => s.replace(/[\s\-_]/g, "").toUpperCase();

  const searchPhotos = async () => {
    const term = searchTerm.trim().replace(/[\s\-]/g, "").toUpperCase();
    if (!term) {
      // Clear search, go back to recent feed
      setSearchMode("recent");
      setVisibleCount(BATCH_PAGE_SIZE);
      setSearched(false);
      setBatches([]);
      setFlatPhotos([]);
      return;
    }

    setLoading(true);
    setSearched(true);
    setBatches([]);
    setFlatPhotos([]);

    try {
      const { data: topLevel } = await supabase.storage.from("vehicle-photos").list("", { limit: 1000 });
      if (!topLevel) { setLoading(false); return; }

      const directMatch = topLevel.find(item => !item.id && normalize(item.name).includes(term));

      if (directMatch) {
        setSearchMode("reservation");
        const allPhotos: PhotoItem[] = [];
        const { data: subItems } = await supabase.storage.from("vehicle-photos").list(directMatch.name, { limit: 200 });
        if (subItems) {
          for (const sub of subItems) {
            if (sub.id) {
              const path = `${directMatch.name}/${sub.name}`;
              const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
              allPhotos.push({ url: urlData.publicUrl, name: sub.name, folder: directMatch.name });
            } else {
              const regoPath = `${directMatch.name}/${sub.name}`;
              const { data: regoItems } = await supabase.storage.from("vehicle-photos").list(regoPath, { limit: 200 });
              if (regoItems) {
                for (const ri of regoItems) {
                  if (ri.id) {
                    const path = `${regoPath}/${ri.name}`;
                    const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
                    allPhotos.push({ url: urlData.publicUrl, name: ri.name, folder: regoPath });
                  } else {
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
        setSearchMode("rego");
        const batchGroups: BatchGroup[] = [];

        for (const resFolder of topLevel) {
          if (resFolder.id) continue;
          const { data: subItems } = await supabase.storage.from("vehicle-photos").list(resFolder.name, { limit: 100 });
          if (!subItems) continue;

          for (const sub of subItems) {
            if (sub.id) continue;
            if (!normalize(sub.name).includes(term)) continue;

            const regoPath = `${resFolder.name}/${sub.name}`;
            const { data: batchFolders } = await supabase.storage.from("vehicle-photos").list(regoPath, { limit: 100 });
            if (!batchFolders) continue;

            const legacyPhotos: PhotoItem[] = [];
            for (const bf of batchFolders) {
              if (bf.id) {
                const path = `${regoPath}/${bf.name}`;
                const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
                legacyPhotos.push({ url: urlData.publicUrl, name: bf.name, folder: regoPath });
              } else {
                const batchPhotos = await collectFiles(`${regoPath}/${bf.name}`);
                if (batchPhotos.length > 0) {
                  batchGroups.push({
                    reservationNo: resFolder.name,
                    rego: sub.name,
                    batchId: bf.name,
                    batchLabel: formatBatchDate(bf.name),
                    sortKey: getBatchSortKey(bf.name),
                    photos: batchPhotos,
                  isHydrated: true,
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
                sortKey: 0,
                photos: legacyPhotos,
                isHydrated: true,
              });
            }
          }
        }

        batchGroups.sort((a, b) => b.sortKey - a.sortKey);
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

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchMode("recent");
    setVisibleCount(BATCH_PAGE_SIZE);
    setSearched(false);
    setBatches([]);
    setFlatPhotos([]);
  };

  // Determine which batches to show
  const displayBatches = searchMode === "rego" ? batches : searchMode === "recent" ? allBatches.slice(0, visibleCount) : [];

  const allPhotosFlat = searchMode === "reservation"
    ? flatPhotos
    : displayBatches.flatMap(b => b.photos);

  const navigatePhoto = (direction: number) => {
    if (viewingIndex === null) return;
    const next = viewingIndex + direction;
    if (next >= 0 && next < allPhotosFlat.length) setViewingIndex(next);
  };

  const openLightbox = (photo: PhotoItem) => {
    const idx = allPhotosFlat.findIndex(p => p.url === photo.url);
    setViewingIndex(idx >= 0 ? idx : 0);
  };

  const totalCount = searchMode === "reservation" ? flatPhotos.length : displayBatches.reduce((s, b) => s + b.photos.length, 0);

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
          {searched && (
            <Button variant="ghost" size="sm" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </div>

        {(loading || initialLoading) && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              {initialLoading ? "Loading recent uploads..." : "Searching..."}
            </span>
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

        {/* Batch view (recent feed or rego search) */}
        {!loading && !initialLoading && (searchMode === "rego" || searchMode === "recent") && displayBatches.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {searchMode === "recent" ? "Recent uploads" : `${totalCount} photo(s) in ${displayBatches.length} batch(es)`}
              {searchMode === "recent" && scanComplete && ` — ${allBatches.length} batch(es) total`}
            </p>
            <div className="space-y-6">
              {displayBatches.map((batch, bi) => (
                <Card key={`${batch.reservationNo}-${batch.rego}-${batch.batchId}`}>
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
                    {batch.photos.length === 0 ? (
                      batch.isHydrated ? (
                        <div className="py-4 text-sm text-muted-foreground text-center">
                          No photos available in this batch.
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          <span className="ml-2 text-sm text-muted-foreground">Loading photos...</span>
                        </div>
                      )
                    ) : (
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
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            {searchMode === "recent" && visibleCount < allBatches.length && (
              <div ref={sentinelRef} className="flex items-center justify-center py-8">
                {loadingMore ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading more...</span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Scroll to load more batches</span>
                )}
              </div>
            )}
          </>
        )}

        {!loading && !initialLoading && searchMode === "recent" && allBatches.length === 0 && scanComplete && (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No photo batches found. Upload photos from the Vehicle Photos page.</p>
          </div>
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
