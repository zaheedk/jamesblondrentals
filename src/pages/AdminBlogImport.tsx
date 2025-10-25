import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Upload, FileText, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AdminBlogImport = () => {
  const [importing, setImporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);
  const [createdArticles, setCreatedArticles] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    setProgress(0);
    setTotalArticles(0);
    setCreatedArticles(0);
    
    toast({
      title: 'File Selected',
      description: `${file.name} ready to parse. Click "Parse and Import Articles" to begin.`,
    });
  };

  const parseAndImportArticles = async () => {
    if (!uploadedFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select a document first.',
        variant: 'destructive',
      });
      return;
    }

    setParsing(true);
    setProgress(1);
    setCreatedArticles(0);

    try {
      // Helper utilities (scoped to this function for minimal changes)
      const slugify = (s: string) =>
        s
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');

      const estimateReadTime = (txt: string) => {
        const words = txt.trim().split(/\s+/).length || 1;
        const minutes = Math.max(1, Math.round(words / 200));
        return `${minutes} min read`;
      };

      const extractArticlesFromText = (t: string) => {
        const lines = t.split(/\r?\n/);
        type Acc = { title: string; body: string[] };
        const articles: Acc[] = [];
        let current: Acc | null = null;

        for (let i = 0; i < lines.length; i++) {
          const prevBlank = i === 0 || lines[i - 1].trim() === '';
          const line = lines[i].trim();
          const isHeading =
            prevBlank &&
            /^([A-Z][A-Za-z0-9 ,&'()\-:]{5,120})$/.test(line) &&
            (i + 1 < lines.length ? lines[i + 1].trim().length > 0 : true);

          if (isHeading) {
            if (current) articles.push(current);
            current = { title: line, body: [] };
          } else if (current) {
            current.body.push(line);
          }
        }
        if (current) articles.push(current);

        if (articles.length === 0) {
          const fallbackTitle = uploadedFile.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim() || 'Untitled';
          articles.push({ title: fallbackTitle, body: [t] });
        }

        return articles.map((a) => {
          const bodyText = a.body.join('\n').replace(/\n{3,}/g, '\n\n').trim();
          const firstPara = bodyText.split(/\n{2,}/).find((p) => p.trim().length > 0) || bodyText;
          const excerpt = firstPara.substring(0, 160);
          const html = `<p>${bodyText
            .split(/\n{2,}/)
            .map((p) => p.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
            .join('</p><p>')}</p>`;

          return {
            title: a.title,
            slug: slugify(a.title),
            excerpt,
            content: html,
            category: 'Tips & Guides',
            read_time: estimateReadTime(bodyText),
            author: 'James Blond Team',
          };
        });
      };

      // Read file into ArrayBuffer for parsing
      const arrayBuffer = await uploadedFile.arrayBuffer();
      let extractedText = '';

      // Detect type by extension or mime
      const name = uploadedFile.name.toLowerCase();
      const isPdf = name.endsWith('.pdf') || uploadedFile.type.includes('pdf');
      const isDocx = name.endsWith('.docx') || uploadedFile.type.includes('word');
      const isImage = /image\/(png|jpe?g|webp|gif|bmp|tiff)/i.test(uploadedFile.type) || /\.(png|jpe?g|jpg|webp|gif|bmp|tif|tiff)$/i.test(name);

      if (isPdf) {
        toast({ title: 'Parsing PDF', description: 'Extracting text from pages...' });
        // Dynamic import to avoid bundler issues and heavy initial load
        const pdfjsLib: any = await import('pdfjs-dist');
        // Run without a web worker to simplify setup
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true });
        const pdf = await loadingTask.promise;

        const textParts: string[] = [];
        const pages = pdf.numPages as number;
        for (let i = 1; i <= pages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((it: any) => (it && 'str' in it ? it.str : '') as string);
          textParts.push(strings.join(' '));
          setProgress(5 + Math.round((i / pages) * 45));
        }
        extractedText = textParts.join('\n\n');
      } else if (isDocx) {
        toast({ title: 'Parsing DOCX', description: 'Extracting text...' });
        const mammothMod: any = await import('mammoth');
        const result = await mammothMod.default.extractRawText({ arrayBuffer });
        extractedText = result.value || '';
        setProgress(50);
      } else if (isImage) {
        toast({ title: 'Performing OCR', description: 'Recognising text in the image...' });
        const TesseractMod: any = await import('tesseract.js');
        const Tesseract = TesseractMod.default || TesseractMod;
        const blob = new Blob([arrayBuffer], { type: uploadedFile.type || 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
        try {
          const result = await Tesseract.recognize(imageUrl, 'eng', {
            logger: (m: any) => {
              if (m?.progress != null) {
                setProgress(5 + Math.round(Math.min(1, Math.max(0, m.progress)) * 45));
              }
            },
          });
          extractedText = result?.data?.text || '';
          setProgress(50);
        } finally {
          URL.revokeObjectURL(imageUrl);
        }
      } else {
        // Fallback: try to read as UTF-8 text
        extractedText = new TextDecoder().decode(arrayBuffer);
        setProgress(50);
      }

      // Build articles from extracted text
      const articles = extractArticlesFromText(extractedText);
      setTotalArticles(articles.length);

      // Insert into Supabase
      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const { error } = await supabase.from('blog_articles').insert({
          ...article,
          published: false,
        });
        if (error) throw error;
        setCreatedArticles(i + 1);
        setProgress(50 + Math.round(((i + 1) / articles.length) * 50));
      }

      toast({
        title: 'Import Complete',
        description: `Successfully imported ${articles.length} article(s) to drafts.`,
      });

      setProgress(100);
    } catch (error: any) {
      console.error('Error importing articles:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to parse and import document',
        variant: 'destructive',
      });
    } finally {
      setParsing(false);
    }
  };
  const importPeopleMoversArticle = async () => {
    setImporting(true);
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .insert({
          title: 'The Benefits of Using People Movers for Home Moves: Why They\'re the Smart Choice',
          slug: 'benefits-people-movers-home-moves-smart-choice',
          excerpt: 'Moving can be overwhelming, especially for families juggling multiple responsibilities. Learn why hiring people movers saves time, reduces stress, and is cost-effective for your next home move.',
          content: `<h1>Optimise Your Home Move With People Movers in Auckland Today</h1>

<p>Moving can be overwhelming, especially for families juggling multiple responsibilities during a home transition. Having experienced both DIY moves and professional services, I can confirm, drawing on insights from James Blond, that hiring people movers saves time, reduces stress, and is cost-effective. This article outlines the benefits of hiring people movers, explains cost factors, and provides moving tips—all while showcasing a customised, transparent, and secure moving experience enhanced by James Blond.</p>

<h2>What Are the Key Benefits of Hiring People Movers for Your Home Move?</h2>

<p>People movers simplify your move by saving time and reducing stress through professional expertise and efficient handling of your belongings. Their organised process eliminates guesswork and delays common in DIY moves, allowing you to focus on settling into your new home.</p>

<h3>How Do People Movers Save You Time During a Home Move?</h3>

<p>People movers use systematic packing, loading, and transport techniques that shorten the moving process. With dedicated teams managing heavy items and delicate goods, tasks like disassembling furniture and protecting fragile items are completed swiftly and professionally.</p>

<h3>In What Ways Do People Movers Reduce Moving Stress?</h3>

<p>By handling the heavy lifting and logistics, people movers eliminate much of the physical and mental strain of moving. Their expertise in traffic, permits, and safety regulations ensures that items are carefully managed, letting you concentrate on personal priorities while they manage the move.</p>

<h3>How Do People Movers Ensure the Safety and Protection of Your Belongings?</h3>

<p>Using specialised equipment such as dollies, protective blankets, and custom crates, professional movers secure everything from large furniture to delicate heirlooms. With insurance policies in place, any rare damages are quickly resolved, giving you peace of mind throughout the move.</p>

<h2>What Factors Affect the Cost of Using People Movers for Home Moves?</h2>

<p>Moving costs depend on the distance, volume and weight of your items, and additional services provided. Although DIY moves might seem cheaper initially, hidden expenses like truck rentals, packing supplies, fuel, and potential injuries often make professional movers a more economical choice overall.</p>

<h3>Which Elements Influence Moving Costs When Hiring People Movers?</h3>

<p>Costs vary based on your home's size, the number and nature of items to be moved, and the manpower required. Additional factors include the time of year, travel distance, and services like packing, unpacking, or storage, all of which influence the overall quote.</p>

<h3>How Does the Cost of People Movers Compare to DIY Moving Options?</h3>

<p>While DIY moves incur costs for rentals, supplies, and potential injuries, people movers charge a predictable fee that bundles labour, transport, and insurance. This predictability and overall efficiency often lead to lower hidden costs and reduced risk of damage.</p>

<h3>How Can You Get an Accurate Moving Quote From People Movers?</h3>

<p>Requesting an in-home or virtual survey allows movers to assess the volume, special handling needs, and logistical challenges of your move. Comparing quotes from reputable companies helps ensure transparency and avoid unexpected fees on moving day.</p>

<h2>What Are the Best Moving Tips for Families Using People Movers?</h2>

<p>Even when using professional movers, preparation is key for a smooth move. Planning in advance, especially with children and busy schedules, can transform a chaotic move into an organised transition.</p>

<h3>What Are Effective Packing Strategies for Families During a Move?</h3>

<p>Create an inventory of your items, use high-quality packing materials, and label each box with its contents and destination. Packing an essentials box with clothing, toiletries, and important documents ensures that your family has what they need immediately upon arrival.</p>

<h3>How Can Families Manage Moving With Children Smoothly?</h3>

<p>Engage children by designating a special moving box filled with their favorite items. Keeping to regular meal and sleep routines on moving day helps reduce anxiety, and having a trusted adult supervise the kids ensures a safe and calm move.</p>

<h3>Why Is Decluttering Important Before Using People Movers?</h3>

<p>Sorting through your possessions ahead of time and donating or selling items you no longer need reduces moving costs and time. Decluttering streamlines packing and ensures that only essential items are handled carefully during the move.</p>

<h2>How Do You Choose the Right People Mover for Your Home Move?</h2>

<p>Selecting the ideal moving company is crucial for a stress-free move. Look for movers offering reliability, professionalism, and services tailored to your needs while maintaining transparent pricing and clear communication.</p>

<h3>What Should You Look for When Selecting a Professional Moving Company?</h3>

<p>Ensure the mover has certifications, proper insurance, and a strong track record of customer testimonials. Transparent pricing, clear service breakdowns, and reliable customer support are also essential for making a confident decision.</p>

<h3>How Important Are Reviews and Reputation When Choosing People Movers?</h3>

<p>Customer reviews provide insight into a mover's professionalism and reliability. Positive testimonials and word-of-mouth recommendations are strong indicators of a company's capability and trustworthiness.</p>

<h3>What Specialised Services Can People Movers Offer for Families?</h3>

<p>Many companies offer family-specific services like packing assistance, temporary storage, unpacking, and even child-friendly or senior moving options. Customised moving kits for delicate or valuable items further ease the stress of relocating.</p>

<h2>How Do People Movers Provide Customised and Transparent Moving Solutions?</h2>

<p>People movers tailor their services to meet your unique moving needs through detailed assessments and clear, upfront pricing. Their customised plans ensure that all aspects of your move are addressed without hidden fees.</p>

<h3>How Do People Movers Tailor Moving Plans to Fit Your Needs and Budget?</h3>

<p>Movers assess your belongings, special handling needs, and timeline to create a personalised plan that fits your budget. This careful planning avoids surprises and ties in with your specific requirements.</p>

<h3>What Pricing Transparency Can You Expect From Professional Movers?</h3>

<p>Reputable movers provide itemised estimates covering all aspects of the move—from labour and transport to packing materials. Written contracts with clear cost breakdowns enable better financial planning and prevent unexpected charges.</p>

<h3>How Does Moving Insurance Protect Your Belongings During the Move?</h3>

<p>Most movers offer options for full-value protection, ensuring compensation in case of damage or loss. This insurance reinforces the trust in their secure and professional handling of your valuables.</p>

<h2>What Are the Latest Trends and Innovations in People Moving Services?</h2>

<p>The moving industry is evolving with technology and sustainability. Modern advancements enhance the moving experience by making it more efficient, interactive, and eco-friendly.</p>

<h3>How Is Technology Enhancing the People Moving Experience?</h3>

<p>Mobile apps and online booking systems now allow for real-time tracking of your move, automated scheduling, and virtual surveys. These tools facilitate an integrated moving experience from start to finish.</p>

<h3>Why Is Sustainability Becoming Important in Moving Services?</h3>

<p>Eco-friendly practices, such as using reusable packing materials and fuel-efficient vehicles, reduce waste and lower carbon emissions. This approach appeals to environmentally conscious families and businesses alike.</p>

<h3>How Are Full-Service Moves Becoming the Preferred Choice for Homeowners?</h3>

<p>By offering comprehensive solutions—from packing to unpacking—full-service moves eliminate many common move-day stresses. This all-in-one approach saves time, minimizes disruption, and ensures a secure move.</p>

<h2>What Are Common Questions About Using People Movers for Home Moves?</h2>

<p>Many homeowners have questions about the moving process. Here are some frequently asked questions to help you plan your move.</p>

<h3>How Much Does It Typically Cost to Hire People Movers?</h3>

<p>Costs depend on the size of your home, distance, and additional services needed, with detailed, itemised quotes provided by movers.</p>

<h3>What Are the Main Advantages of Hiring Professional Movers?</h3>

<p>Professional movers save time, reduce stress, and ensure safe transport of belongings with expert handling and insurance coverage.</p>

<h3>How Can You Prepare Your Home for a People Mover Service?</h3>

<p>Preparation includes decluttering, labelling boxes by room, and securing delicate items to ensure an efficient move.</p>

<h2>Detailed Comparison Table of Services</h2>

<table>
<thead>
<tr>
<th>Factor</th>
<th>People Movers</th>
<th>DIY Moving Options</th>
</tr>
</thead>
<tbody>
<tr>
<td>Time Efficiency</td>
<td>Highly efficient; reduces moving time</td>
<td>Time-consuming with risk of delays</td>
</tr>
<tr>
<td>Stress Reduction</td>
<td>Minimises personal stress with professional handling</td>
<td>High physical and mental stress</td>
</tr>
<tr>
<td>Safety & Protection</td>
<td>Uses specialised equipment and offers insurance</td>
<td>Higher risk of damage and injury</td>
</tr>
<tr>
<td>Cost Transparency</td>
<td>Clear, itemised pricing</td>
<td>Potential hidden costs and extra expenses</td>
</tr>
</tbody>
</table>

<h2>Final Thoughts</h2>

<p>Hiring people movers is a smart solution for those seeking a stress-free and secure home move. Their professional approach, clear pricing, and specialised equipment make the process efficient and reliable. By preparing in advance and choosing a reputable mover, you can enjoy a smooth transition to your new home.</p>

<p>Call <strong>0800 525 663</strong> today, book online at <a href="https://www.jamesblond.co.nz">www.jamesblond.co.nz</a>, or visit us to choose the right vehicle for your move.</p>

<h2>Frequently Asked Questions</h2>

<h3>Q: What is the typical timeline for a professional home move in Auckland?</h3>
<p>A: The timeline varies based on the size of your home and distance, but most local moves are completed within a day.</p>

<h3>Q: Are moving supplies provided by people movers?</h3>
<p>A: Yes, most reputable companies provide high-quality packing materials and use specialised equipment.</p>

<h3>Q: Can professional movers help with furniture assembly?</h3>
<p>A: Many companies offer additional services like disassembly, reassembly, and unpacking to ensure a hassle-free move.</p>

<h3>Q: Is moving insurance mandatory when hiring people movers?</h3>
<p>A: While not legally required, moving insurance is highly recommended to cover any potential damage.</p>

<h3>Q: How far in advance should I book a people mover?</h3>
<p>A: It is advisable to book your move at least a few weeks in advance, especially during peak seasons, to ensure availability and secure an accurate quotation.</p>`,
          author: 'James Blond Team',
          category: 'Tips & Guides',
          read_time: '8 min read',
          published: true,
          page_title: 'People Movers for Home Moves | James Blond Rentals',
          meta_title: 'The Benefits of Using People Movers for Home Moves in Auckland',
          meta_description: 'Discover why hiring people movers is the smart choice for your home move in Auckland. Learn about cost savings, stress reduction, safety features, and professional moving tips from James Blond.'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Blog article imported successfully!',
      });

      navigate('/admin/blog');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to import article',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/admin/blog')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>
        <h1 className="text-3xl font-bold mb-2">Import Blog Articles</h1>
        <p className="text-muted-foreground">Import pre-formatted blog articles from documents</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Upload your PDF document with blog articles. I'll parse it and create all articles automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={parsing}
                className="flex-1"
              />
              {uploadedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {uploadedFile.name}
                </div>
              )}
            </div>
            
            {uploadedFile && (
              <Button 
                onClick={parseAndImportArticles} 
                disabled={parsing}
                className="w-full"
              >
                {parsing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Parsing and Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Parse and Import Articles
                  </>
                )}
              </Button>
            )}
            
            {parsing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Articles: {totalArticles}</span>
                  <span className="font-medium">Created: {createdArticles} / {totalArticles}</span>
                </div>
              </div>
            )}
            
            {!parsing && createdArticles > 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  ✓ Successfully created {createdArticles} article{createdArticles !== 1 ? 's' : ''} in draft state
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Articles to Import</CardTitle>
          <CardDescription>
            Click the button below to import pre-formatted articles or upload your document above
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">
              The Benefits of Using People Movers for Home Moves: Why They're the Smart Choice
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive guide about people movers for home moves in Auckland, covering benefits, costs, tips, and FAQs.
            </p>
            <div className="flex gap-2 text-sm text-muted-foreground mb-4">
              <span>Category: Tips & Guides</span>
              <span>•</span>
              <span>Read time: 8 min</span>
              <span>•</span>
              <span>Author: James Blond Team</span>
            </div>
            <Button onClick={importPeopleMoversArticle} disabled={importing}>
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Importing...' : 'Import Article'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogImport;
