import React, { useCallback, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Code, Edit } from 'lucide-react';

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

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image', 'blockquote', 'code-block'
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
      </div>
      
      <ScrollArea className="h-[500px] w-full border rounded-md">
        {showHtmlSource ? (
          <div className="p-4">
            <Textarea
              value={formatHtml(value || '')}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[450px] font-mono text-sm border-0 resize-none focus:outline-none"
            />
          </div>
        ) : (
          <ReactQuill
            ref={(el) => {
              if (el) {
                (window as any).quillEditor = el.getEditor();
              }
            }}
            theme="snow"
            value={value}
            onChange={onChange}
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