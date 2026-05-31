import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  read_time: string;
  image_url?: string;
  created_at: string;
}

const Blog = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Helmet>
        <title>Blog – Vehicle Rental Tips & News | James Blond Rentals</title>
        <meta name="description" content="Read the latest tips, guides and news from James Blond Rentals. Moving advice, rental car reviews and travel insights for New Zealand." />
      </Helmet>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">James Blond Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest news, tips, and insights from New Zealand's trusted vehicle rental experts.
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {articles.map((article) => (
          <Link key={article.id} to={`/blog/${article.slug}`} className="group block">
            <Card className="overflow-hidden bg-card border border-border/60 rounded-xl shadow-none hover:shadow-md transition-shadow h-full flex flex-col">
              {article.image_url && (
                <div className="overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-5">
                  {article.excerpt}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-primary font-semibold text-sm">
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Categories */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-8">Blog Categories</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" size="sm">All Posts</Button>
          <Button variant="outline" size="sm">Reviews</Button>
          <Button variant="outline" size="sm">Tips & Guides</Button>
          <Button variant="outline" size="sm">Company News</Button>
          <Button variant="outline" size="sm">Industry Insights</Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
