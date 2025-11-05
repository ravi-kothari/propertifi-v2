import { MetadataRoute } from 'next';

const siteUrl = 'https://www.propertifi.co'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Mock blog posts - in a real app, fetch these from your API
  const mockPosts = [
    { slug: 'real-estate-investing-strategies', updatedAt: new Date() },
    { slug: 'property-management-tips', updatedAt: new Date() },
  ];

  const blogEntries: MetadataRoute.Sitemap = mockPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
     {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  return [...staticPages, ...blogEntries];
}
