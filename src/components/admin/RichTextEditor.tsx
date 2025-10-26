
import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Code, Edit, Link, Upload, Table, Image, Video, Type, Palette } from 'lucide-react';
import MediaLibrary from './MediaLibrary';

// Import Quill modules
// Note: Image resize might need to be imported differently based on the package
// import ImageResize from 'quill-image-resize-module-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your article content..."
}) => {
  const { toast } = useToast();
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [htmlValue, setHtmlValue] = useState('');
  const quillRef = useRef<ReactQuill>(null);
  const isUpdatingRef = useRef(false);

  // Format HTML when switching to HTML mode
  useEffect(() => {
    if (showHtmlSource) {
      setHtmlValue(formatHtml(value || ''));
    }
  }, [showHtmlSource]);

  const handleHtmlChange = (newValue: string) => {
    setHtmlValue(newValue);
    onChange(newValue);
  };

  const insertLink = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        if (linkText) {
          quill.insertText(range.index, linkText);
          quill.formatText(range.index, linkText.length, 'link', linkUrl);
        } else {
          quill.format('link', linkUrl);
        }
      }
    }
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  };

  const insertTable = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        const tableHtml = `
          <table>
            <tr><td>Cell 1</td><td>Cell 2</td></tr>
            <tr><td>Cell 3</td><td>Cell 4</td></tr>
          </table>
        `;
        quill.clipboard.dangerouslyPasteHTML(range.index, tableHtml);
      }
    }
  };

  const handleMediaSelect = (url: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, 'image', url);
      }
    }
  };

  const imageHandler = useCallback(async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        // Upload image to Supabase storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('blog-images')
          .upload(fileName, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName);

        // Insert image into editor
        const quill = (window as any).quillEditor;
        if (quill) {
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', publicUrl);
        }

        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          variant: 'destructive',
        });
      }
    };
  }, [toast]);

  const handleQuillChange = useCallback((content: string, delta: any, source: any, editor: any) => {
    if (!isUpdatingRef.current) {
      // Save current selection before onChange
      const selection = editor.getSelection();
      onChange(content);
      
      // Restore selection after onChange if it exists
      if (selection && quillRef.current) {
        setTimeout(() => {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            quill.setSelection(selection.index, selection.length);
          }
        }, 0);
      }
    }
  }, [onChange]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'image', 'video', 'formula'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true
    },
    clipboard: {
      matchVisual: false
    }
  }), [imageHandler]);

  const formats = [
    'font', 'size', 'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'script', 'list', 'bullet', 'check', 'indent',
    'direction', 'align', 'link', 'image', 'video', 'formula', 
    'blockquote', 'code-block'
  ];

  const formatHtml = (html: string) => {
    if (!html) return '';
    
    // Simple HTML formatter
    let formatted = html
      .replace(/></g, '>\n<')
      .replace(/^\s+|\s+$/g, '');
    
    const lines = formatted.split('\n');
    let indent = 0;
    const indentSize = 2;
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - indentSize);
      }
      
      const indentedLine = ' '.repeat(indent) + trimmed;
      
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
        indent += indentSize;
      }
      
      return indentedLine;
    }).join('\n');
  };

  return (
    <div className="rich-text-editor">
      <style dangerouslySetInnerHTML={{
        __html: `
          .quill .ql-toolbar {
            position: sticky !important;
            top: 0 !important;
            z-index: 10 !important;
            background: white !important;
            border-bottom: 1px solid #e5e7eb !important;
          }
          
          .quill .ql-editor table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 10px 0 !important;
            border: 2px solid #374151 !important;
          }
          
          .quill .ql-editor table td,
          .quill .ql-editor table th {
            border: 1px solid #6b7280 !important;
            padding: 8px 12px !important;
            min-width: 100px !important;
            background: white !important;
            vertical-align: top !important;
          }
          
          .quill .ql-editor table th {
            background: #f3f4f6 !important;
            font-weight: 600 !important;
            text-align: left !important;
          }
          
          .quill .ql-editor table tr:nth-child(even) td {
            background: #f9fafb !important;
          }
          
          .quill .ql-editor table tr:hover td {
            background: #f3f4f6 !important;
          }
          
          /* HTML Editor table markup readability */
          .html-editor {
            line-height: 1.6 !important;
          }
        `
      }} />
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <Button
            variant={!showHtmlSource ? "default" : "outline"}
            size="sm"
            type="button"
            onClick={() => setShowHtmlSource(false)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Visual
          </Button>
          <Button
            variant={showHtmlSource ? "default" : "outline"}
            size="sm"
            type="button" 
            onClick={() => setShowHtmlSource(true)}
          >
            <Code className="h-4 w-4 mr-1" />
            HTML
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => setShowMediaLibrary(true)}
          >
            <Image className="h-4 w-4 mr-1" />
            Media
          </Button>
          
          <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" type="button">
                <Link className="h-4 w-4 mr-1" />
                Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input
                    id="linkUrl"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="linkText">Link Text (optional)</Label>
                  <Input
                    id="linkText"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Click here"
                  />
                </div>
                <Button onClick={insertLink} disabled={!linkUrl}>
                  Insert Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={insertTable}
          >
            <Table className="h-4 w-4 mr-1" />
            Table
          </Button>
        </div>
      </div>
      
      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={handleMediaSelect}
      />
      
      <ScrollArea className="h-[500px] w-full border rounded-md">
        {showHtmlSource ? (
          <div className="p-4">
            <Textarea
              value={htmlValue || formatHtml(value || '')}
              onChange={(e) => handleHtmlChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[450px] font-mono text-sm border-0 resize-none focus:outline-none html-editor"
            />
          </div>
        ) : (
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={handleQuillChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            style={{ minHeight: '400px' }}
          />
        )}
      </ScrollArea>
    </div>
  );
};

export default RichTextEditor;
