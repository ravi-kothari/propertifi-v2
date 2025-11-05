import { generatePageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { getBlogPost } from '@/lib/api-client';
import { notFound } from 'next/navigation';

// This is a mock function. In a real app, you'd fetch this from your API.
async function getMockBlogPost(slug: string) {
    const posts = [
        { id: 1, slug: 'real-estate-investing-strategies', title: 'Top 5 Real Estate Investing Strategies for 2025', excerpt: 'Discover the best strategies to maximize your real estate returns.', content: '<p>Content goes here...</p>', category: 'Investing', published_at: '2025-10-20' },
        { id: 2, slug: 'property-management-tips', title: '10 Essential Tips for New Property Managers', excerpt: 'Avoid common pitfalls with these expert tips.', content: '<p>Content goes here...</p>', category: 'Management', published_at: '2025-10-15' },
    ];
    const post = posts.find(p => p.slug === slug);
    if (!post) return null;
    return { success: true, data: post };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const postData = await getMockBlogPost(params.slug);
  if (!postData?.success) {
    return {};
  }
  const post = postData.data;
  return generatePageMetadata(
    post.title,
    post.excerpt,
    `/blog/${post.slug}`
  );
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const postData = await getMockBlogPost(params.slug);

  if (!postData?.success) {
    notFound();
  }

  const post = postData.data;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/blog' },
    { name: post.title },
  ]);

  return (
    <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      <article className="container py-12">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-slate-500 mb-8">{post.published_at}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}