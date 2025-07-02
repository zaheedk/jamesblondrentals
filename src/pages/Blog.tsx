import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
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
          <Card key={article.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              {article.image_url && (
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                  {article.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <CardTitle className="mb-3 line-clamp-2">
                {article.title}
              </CardTitle>
              
              <CardDescription className="mb-4 line-clamp-3">
                {article.excerpt}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{article.read_time}</span>
                </div>
                
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/blog/${article.slug}`} className="flex items-center gap-1">
                    Read More
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
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
