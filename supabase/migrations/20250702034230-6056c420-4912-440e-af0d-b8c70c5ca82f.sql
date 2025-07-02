-- Create blog_articles table
CREATE TABLE public.blog_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL DEFAULT 'James Blond Team',
  category TEXT NOT NULL DEFAULT 'Tips & Guides',
  read_time TEXT NOT NULL DEFAULT '5 min read',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published articles
CREATE POLICY "Anyone can view published articles" 
ON public.blog_articles 
FOR SELECT 
USING (published = true);

-- Create policies for authenticated users to manage articles (admin functionality)
CREATE POLICY "Authenticated users can view all articles" 
ON public.blog_articles 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create articles" 
ON public.blog_articles 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles" 
ON public.blog_articles 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete articles" 
ON public.blog_articles 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_articles_updated_at
BEFORE UPDATE ON public.blog_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing blog articles
INSERT INTO public.blog_articles (title, slug, excerpt, content, image_url, category, read_time, published) VALUES
(
  'Furniture Truck vs. Traditional Moving Van: A Detailed Comparison',
  'furniture-truck-vs-traditional-moving-van-detailed-comparison',
  'For my recent moves, I favour furniture trucks over moving vans. They offer space, efficiency, and are easier to handle. Experience a smoother move today!',
  '<h2>Furniture Truck vs. Traditional Moving Van: A Detailed Comparison</h2><p>When planning a move, one of the most crucial decisions you''ll make is choosing the right vehicle. The debate between furniture trucks and traditional moving vans has been ongoing, with each option offering distinct advantages depending on your specific needs.</p><h3>Understanding the Differences</h3><p>Furniture trucks are specifically designed for moving household items, featuring a low deck height and easy loading capabilities. Traditional moving vans, on the other hand, are more versatile but may require more effort when loading heavy furniture.</p><h3>Space and Efficiency</h3><p>Furniture trucks typically offer better space utilization for household moves, while moving vans provide more flexibility for different types of cargo.</p>',
  '/lovable-uploads/09edf72b-b66c-427e-9744-80a1c1f29b52.png',
  'Tips & Guides',
  '20 min read',
  true
),
(
  'The Essential Guide to Box Trucks: How to Choose the Right Vehicle for Your Move',
  'essential-guide-box-trucks-choose-right-vehicle-move',
  'An in-depth look at the different box truck sizes and specifications, helping readers select the ideal truck for their moving needs.',
  '<h2>The Essential Guide to Box Trucks</h2><p>Box trucks are among the most popular choices for moving, offering excellent protection for your belongings and ample space for most household moves.</p><h3>Sizing Options</h3><p>Box trucks come in various sizes, from small 10-foot trucks suitable for studio apartments to large 26-foot trucks that can handle multi-bedroom homes.</p>',
  '/lovable-uploads/29911b24-b718-42a0-b756-26a3c845c5a0.png',
  'Tips & Guides',
  '18 min read',
  true
),
(
  'The Ultimate Guide to Cargo Vans: How to Choose the Best Vehicle for Your Move',
  'ultimate-guide-cargo-vans-choose-best-vehicle-move',
  'Renting a cargo van for moving can be a game-changer. Here are some essential tips to simplify your rental experience and ensure a smooth journey.',
  '<h2>The Ultimate Guide to Cargo Vans: How to Choose the Best Vehicle for Your Move</h2><p>Choosing the right cargo van for your move can significantly impact both the efficiency and cost of your relocation. With numerous options available, from compact cargo vans to large commercial vehicles, making the right choice requires understanding your specific needs and the capabilities of different van types.</p><h3>Understanding Cargo Van Categories</h3><p>Cargo vans generally fall into three main categories: compact, mid-size, and full-size. Each category serves different purposes and offers varying levels of cargo space, fuel efficiency, and maneuverability.</p>',
  '/lovable-uploads/b1f80cf0-d79d-436a-873f-873d8104aa75.png',
  'Tips & Guides',
  '8 min read',
  true
);