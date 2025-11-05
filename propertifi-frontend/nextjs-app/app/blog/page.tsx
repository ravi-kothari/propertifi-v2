"use client";

import { useState } from "react";
import { Section, Grid } from "@/app/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "@/app/components/ui/Search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

// Mock blog post data
const blogPosts = [
  {
    id: 1,
    slug: "top-10-property-management-tips",
    title: "Top 10 Property Management Tips for New Landlords",
    excerpt: "Starting your journey as a landlord? These essential tips will help you manage your rental property effectively and avoid common pitfalls.",
    category: "For Owners",
    categorySlug: "for-owners",
    image: "/images/blog/property-tips.jpg",
    date: "2024-10-15",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 2,
    slug: "choosing-right-property-manager",
    title: "How to Choose the Right Property Manager for Your Investment",
    excerpt: "Learn the key factors to consider when selecting a property management company, from experience to communication style.",
    category: "For Owners",
    categorySlug: "for-owners",
    image: "/images/blog/choosing-manager.jpg",
    date: "2024-10-12",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 3,
    slug: "understanding-rental-laws",
    title: "Understanding Rental Laws: A State-by-State Guide",
    excerpt: "Navigate the complex world of rental regulations with our comprehensive guide to tenant-landlord laws across different states.",
    category: "Legal",
    categorySlug: "legal",
    image: "/images/blog/rental-laws.jpg",
    date: "2024-10-10",
    readTime: "10 min read",
    featured: true,
  },
  {
    id: 4,
    slug: "maximizing-rental-income",
    title: "5 Strategies for Maximizing Your Rental Income",
    excerpt: "Discover proven strategies to increase your rental property's profitability while maintaining tenant satisfaction.",
    category: "For Owners",
    categorySlug: "for-owners",
    image: "/images/blog/rental-income.jpg",
    date: "2024-10-08",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 5,
    slug: "property-maintenance-checklist",
    title: "The Ultimate Property Maintenance Checklist",
    excerpt: "Stay on top of property maintenance with this comprehensive seasonal checklist for landlords and property managers.",
    category: "Maintenance",
    categorySlug: "maintenance",
    image: "/images/blog/maintenance.jpg",
    date: "2024-10-05",
    readTime: "8 min read",
    featured: false,
  },
  {
    id: 6,
    slug: "tenant-screening-best-practices",
    title: "Tenant Screening Best Practices for 2024",
    excerpt: "Learn how to conduct thorough tenant screenings while staying compliant with fair housing laws.",
    category: "For Managers",
    categorySlug: "for-managers",
    image: "/images/blog/tenant-screening.jpg",
    date: "2024-10-01",
    readTime: "9 min read",
    featured: false,
  },
];

const categories = ["All", "For Owners", "For Managers", "Legal", "Maintenance"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <main>
      {/* Hero Section */}
      <Section variant="gradient" spacing="lg">
        <div className="text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Resources & Knowledge Hub
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto">
            Expert insights, tips, and guides for property owners and managers
          </p>
        </div>
      </Section>

      {/* Search and Filter */}
      <Section spacing="lg">
        <div className="space-y-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <Search
              onSearch={handleSearch}
              suggestions={[
                "Property management tips",
                "Tenant screening",
                "Rental laws",
                "Maintenance checklist",
              ]}
            />
          </div>

          {/* Category Tabs */}
          <Tabs defaultValue="All" className="w-full" onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start border-b border-slate-200 rounded-none bg-transparent p-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Results Count */}
          <div className="text-slate-600">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
          </div>

          {/* Blog Posts Grid */}
          <Grid cols={3} gap="lg">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  {/* Featured Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-t-lg">
                    {post.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="featured" size="sm">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <div className="mb-3">
                      <Badge variant="default" size="sm">
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 hover:text-primary-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
                      {post.excerpt}
                    </CardDescription>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
                        Read more →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Grid>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg mb-4">
                No articles found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </Section>

      {/* Newsletter CTA */}
      <Section variant="slate" spacing="lg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-slate-600 mb-6">
            Subscribe to our newsletter for the latest property management insights and tips.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 rounded-lg border border-slate-300 bg-white px-4 text-slate-900 shadow-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
            <Button variant="primary" size="lg">
              Subscribe
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
