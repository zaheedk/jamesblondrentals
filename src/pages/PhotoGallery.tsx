import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Search, ImageIcon, ChevronLeft, ChevronRight, LogOut } from "lucide-react";

const PhotoGallery = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { isOfficeAdmin, isLoading: roleLoading } = useUserRole();

  const [searchTerm, setSearchTerm] = useState("");
  const [photos, setPhotos] = useState<{ url: string; name: string; folder: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);

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

  const searchPhotos = async () => {
    const term = searchTerm.trim().replace(/[\s\-]/g, "").toUpperCase();
    if (!term) return;

    setLoading(true);
    setSearched(true);
    const results: { url: string; name: string; folder: string }[] = [];

    try {
      const { data: topLevel } = await supabase.storage
        .from("vehicle-photos")
        .list("", { limit: 1000 });

      if (!topLevel) { setPhotos([]); setLoading(false); return; }

      const matchingFolders: string[] = [];
      const normalize = (s: string) => s.replace(/[\s\-_]/g, "").toUpperCase();

      for (const item of topLevel) {
        if (!item.id && normalize(item.name).includes(term)) {
          matchingFolders.push(item.name);
        }
      }

      // If no direct folder match, search inside all folders for rego subfolder
      if (matchingFolders.length === 0) {
        for (const item of topLevel) {
          if (item.id) continue; // skip files
          const { data: subItems } = await supabase.storage
            .from("vehicle-photos")
            .list(item.name, { limit: 100 });
          if (!subItems) continue;
          for (const sub of subItems) {
            if (!sub.id && sub.name.toUpperCase().includes(term)) {
              matchingFolders.push(`${item.name}/${sub.name}`);
            }
          }
        }
      }

      // Load photos from matching folders
      for (const folder of matchingFolders) {
        const { data: files } = await supabase.storage
          .from("vehicle-photos")
          .list(folder, { limit: 200 });
        if (!files) continue;

        for (const file of files) {
          if (file.id) {
            const path = `${folder}/${file.name}`;
            const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
            results.push({ url: urlData.publicUrl, name: file.name, folder });
          } else {
            // One more level deep
            const subPath = `${folder}/${file.name}`;
            const { data: subFiles } = await supabase.storage
              .from("vehicle-photos")
              .list(subPath, { limit: 200 });
            if (subFiles) {
              for (const sf of subFiles) {
                if (sf.id) {
                  const path = `${subPath}/${sf.name}`;
                  const { data: urlData } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
                  results.push({ url: urlData.publicUrl, name: sf.name, folder: subPath });
                }
              }
            }
          }
        }
      }

      setPhotos(results);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") searchPhotos();
  };

  const navigatePhoto = (direction: number) => {
    if (viewingIndex === null) return;
    const next = viewingIndex + direction;
    if (next >= 0 && next < photos.length) setViewingIndex(next);
  };

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

        {!loading && searched && photos.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No photos found for "{searchTerm}"</p>
          </div>
        )}

        {!loading && photos.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-4">{photos.length} photo(s) found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-border hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => setViewingIndex(i)}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Lightbox */}
        <Dialog open={viewingIndex !== null} onOpenChange={() => setViewingIndex(null)}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 bg-black/95 border-none">
            {viewingIndex !== null && photos[viewingIndex] && (
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
                  src={photos[viewingIndex].url}
                  alt={photos[viewingIndex].name}
                  className="w-full h-full object-contain max-h-[85vh]"
                />
                {viewingIndex < photos.length - 1 && (
                  <button
                    onClick={() => navigatePhoto(1)}
                    className="absolute right-2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}
                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/70 text-xs">
                  {viewingIndex + 1} / {photos.length} — {photos[viewingIndex].folder}
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
