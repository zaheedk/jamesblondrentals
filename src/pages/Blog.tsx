
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 'why-mini-bus-ideal-family-adventure',
    title: 'Why a Mini Bus Is Ideal for Your Next Family Adventure',
    excerpt: 'Renting a mini bus for family trips has transformed our holidays! I enjoy stress-free travel, spacious comfort, and unforgettable memories on the road together.',
    date: '2025-01-03',
    author: 'James Blond Team',
    category: 'Tips & Guides',
    readTime: '12 min read'
  },
  {
    id: 'benefits-people-movers-home-moves-smart-choice',
    title: 'The Benefits of Using People Movers for Home Moves: Why They\'re the Smart Choice',
    excerpt: 'Examine the advantages of employing people movers for residential moves, focusing on convenience, efficiency, and cost-effectiveness.',
    date: '2025-01-02',
    author: 'James Blond Team',
    category: 'Tips & Guides', 
    readTime: '10 min read',
    image: '/lovable-uploads/45e25787-f858-4ba8-91c9-dff871af2b63.png'
  },
  {
    id: 'ultimate-guide-cargo-vans-choose-best-vehicle-move',
    title: 'The Ultimate Guide to Cargo Vans: How to Choose the Best Vehicle for Your Move',
    excerpt: 'Renting a cargo van for moving can be a game-changer. Here are some essential tips to simplify your rental experience and ensure a smooth journey.',
    date: '2025-01-01',
    author: 'James Blond Team',
    category: 'Tips & Guides',
    readTime: '8 min read',
    image: '/lovable-uploads/d39a3bf7-069f-46c2-b68e-29bd7a3cb8b0.png'
  },
  {
    id: 'james-blond-best-west-auckland',
    title: 'FAQ: Why I Believe James Blond Rentals Is the Best in West Auckland 🚛',
    excerpt: 'Discover why James Blond Rentals stands out as the top choice for vehicle rentals in West Auckland, from their extensive fleet to exceptional customer service.',
    date: '2024-12-29',
    author: 'James Blond Team',
    category: 'Reviews',
    readTime: '5 min read',
    image: '/lovable-uploads/e650d007-a5e7-41eb-b673-5ea4ebdf5896.png'
  }
];

const Blog = () => {
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
        {blogPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                  {post.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
              </div>
              
              <CardTitle className="mb-3 line-clamp-2">
                {post.title}
              </CardTitle>
              
              <CardDescription className="mb-4 line-clamp-3">
                {post.excerpt}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/blog/${post.id}`} className="flex items-center gap-1">
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
