import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, Grid, List, Trash2, Download, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MediaFile {
  name: string;
  id: string;
  updated_at: string;
  metadata: Record<string, any>;
}

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (url: string) => void;
  multiple?: boolean;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({
  isOpen,
  onClose,
  onSelect,
  multiple = false
}) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('blog-images')
        .list('', { 
          limit: 100,
          sortBy: { column: 'updated_at', order: 'desc' }
        });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media files',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen, fetchFiles]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setUploading(true);
    const uploadPromises = Array.from(selectedFiles).map(async (file) => {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);
      
      if (error) throw error;
      return fileName;
    });

    try {
      await Promise.all(uploadPromises);
      await fetchFiles();
      toast({
        title: 'Success',
        description: `${selectedFiles.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload files',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('blog-images')
        .remove([fileName]);
      
      if (error) throw error;
      
      setFiles(files.filter(file => file.name !== fileName));
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };

  const getFileUrl = (fileName: string) => {
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);
    return publicUrl;
  };

  const copyUrl = (fileName: string) => {
    const url = getFileUrl(fileName);
    navigator.clipboard.writeText(url);
    toast({
      title: 'Success',
      description: 'URL copied to clipboard',
    });
  };

  const handleFileSelect = (fileName: string) => {
    if (multiple) {
      setSelectedFiles(prev => 
        prev.includes(fileName) 
          ? prev.filter(f => f !== fileName)
          : [...prev, fileName]
      );
    } else {
      if (onSelect) {
        onSelect(getFileUrl(fileName));
        onClose();
      }
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="library" className="h-full">
          <TabsList>
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Files</h3>
              <p className="text-gray-700 mb-4">
                Select files to upload to your media library
              </p>
              <Input
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={handleUpload}
                disabled={uploading}
                className="max-w-sm mx-auto"
              />
              {uploading && (
                <p className="text-sm text-gray-700 mt-2">Uploading...</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="library" className="mt-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-600" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[500px]">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-700">
                  No files found
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-4 gap-4">
                  {filteredFiles.map((file) => (
                    <Card 
                      key={file.name}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedFiles.includes(file.name) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleFileSelect(file.name)}
                    >
                      <CardContent className="p-2">
                        <div className="aspect-square mb-2 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                          {file.metadata?.mimetype?.startsWith('image/') ? (
                            <img
                              src={getFileUrl(file.name)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-2xl">📄</div>
                          )}
                        </div>
                        <p className="text-xs font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formatFileSize(file.metadata?.size || 0)}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyUrl(file.name);
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFile(file.name);
                              }}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <Card 
                      key={file.name}
                      className={`cursor-pointer hover:shadow-sm transition-shadow ${
                        selectedFiles.includes(file.name) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleFileSelect(file.name)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {file.metadata?.mimetype?.startsWith('image/') ? (
                              <img
                                src={getFileUrl(file.name)}
                                alt={file.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-lg">
                                📄
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-gray-700">
                                {formatFileSize(file.metadata?.size || 0)} • {new Date(file.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyUrl(file.name);
                              }}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy URL
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFile(file.name);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            {multiple && selectedFiles.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-gray-700">
                  {selectedFiles.length} file(s) selected
                </p>
                <Button
                  onClick={() => {
                    if (onSelect) {
                      const urls = selectedFiles.map(fileName => getFileUrl(fileName));
                      onSelect(urls.join(', '));
                      onClose();
                    }
                  }}
                >
                  Insert Selected
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;