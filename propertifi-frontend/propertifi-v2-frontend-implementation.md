# Propertifi v2 - Frontend Implementation Guide (Next.js)

## Overview
This document provides step-by-step instructions for AI agents to implement the Next.js frontend for Propertifi v2. Each section includes specific prompts, code examples, and SEO optimization strategies.

---

## Project Setup & Architecture

### Task 1.1: Next.js Project Initialization

**Objective**: Set up Next.js 14+ with App Router for optimal SEO performance

**AI Agent Prompt**:
```
Create a Next.js 14+ project with the following requirements:
1. App Router structure for better SEO and performance
2. TypeScript configuration for type safety
3. Tailwind CSS for styling with custom design system
4. SEO optimization packages (next-seo, next-sitemap)
5. API integration setup for Laravel backend
6. Performance monitoring and analytics setup

Include proper folder structure, configuration files, and development tools.
```

**Implementation Steps**:

1. **Initialize Project**:
```bash
npx create-next-app@latest propertifi-v2 --typescript --tailwind --eslint --app
cd propertifi-v2
```

2. **Install Required Dependencies**:
```bash
npm install next-seo next-sitemap @headlessui/react @heroicons/react framer-motion
npm install @tanstack/react-query axios date-fns
npm install -D @types/node @typescript-eslint/eslint-plugin prettier
```

3. **Project Structure**:
```
app/
├── (marketing)/          # Marketing pages with SEO focus
│   ├── laws/
│   ├── templates/
│   ├── calculators/
│   └── page.tsx
├── (dashboard)/          # Dashboard pages (protected)
│   ├── owner/
│   └── property-manager/
├── api/                  # API route handlers
├── globals.css
└── layout.tsx

components/
├── ui/                   # Reusable UI components
├── forms/               # Form components
├── seo/                 # SEO-specific components
└── layout/              # Layout components

lib/
├── api.ts               # API client configuration
├── seo.ts               # SEO utilities
├── utils.ts             # General utilities
└── validations.ts       # Form validation schemas
```

4. **Configuration Files**:

**next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'propertifi.co'],
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
    ];
  },
  // Enable static export for SEO pages
  trailingSlash: true,
  generateEtags: false,
};

module.exports = nextConfig;
```

**tailwind.config.js**:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Add Propertifi brand colors
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

**Validation**: Project builds and runs successfully with proper TypeScript configuration.

---

### Task 1.2: SEO Foundation Setup

**Objective**: Implement comprehensive SEO foundation for maximum search visibility

**AI Agent Prompt**:
```
Set up comprehensive SEO infrastructure:
1. Meta tag management with next-seo
2. Structured data (JSON-LD) for legal content, businesses, articles
3. Sitemap generation for all static and dynamic routes
4. Robots.txt configuration
5. Open Graph and Twitter Card optimization
6. Page speed optimization setup

Include dynamic meta generation for programmatic SEO pages.
```

**Implementation Steps**:

1. **SEO Configuration** (`lib/seo.ts`):
```typescript
import { DefaultSeoProps } from 'next-seo';

export const defaultSEO: DefaultSeoProps = {
  title: 'Propertifi - Property Management Solutions & Legal Resources',
  description: 'Connect with verified property managers and access comprehensive landlord-tenant law resources, document templates, and property management tools.',
  canonical: 'https://propertifi.co',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://propertifi.co',
    siteName: 'Propertifi',
    images: [
      {
        url: 'https://propertifi.co/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Propertifi - Property Management Solutions',
      },
    ],
  },
  twitter: {
    handle: '@propertifi',
    site: '@propertifi',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
  ],
};

export const generateStateLawSEO = (state: string, topic: string, content: any) => ({
  title: `${content.title} - ${state} Laws | Propertifi`,
  description: content.meta_description,
  canonical: `https://propertifi.co/laws/${state.toLowerCase()}/${topic}`,
  openGraph: {
    title: `${content.title} - ${state} Laws`,
    description: content.meta_description,
    url: `https://propertifi.co/laws/${state.toLowerCase()}/${topic}`,
    type: 'article',
    publishedTime: content.last_updated,
  },
});
```

2. **Structured Data Component** (`components/seo/StructuredData.tsx`):
```typescript
interface StructuredDataProps {
  type: 'LegalService' | 'LocalBusiness' | 'Article' | 'FAQPage';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const generateSchema = () => {
    switch (type) {
      case 'LegalService':
        return {
          '@context': 'https://schema.org',
          '@type': 'LegalService',
          name: data.title,
          description: data.description,
          provider: {
            '@type': 'Organization',
            name: 'Propertifi',
            url: 'https://propertifi.co',
          },
          areaServed: data.state,
          serviceType: 'Legal Information',
        };
      
      case 'Article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.description,
          author: {
            '@type': 'Organization',
            name: 'Propertifi',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Propertifi',
            logo: {
              '@type': 'ImageObject',
              url: 'https://propertifi.co/logo.png',
            },
          },
          datePublished: data.publishedDate,
          dateModified: data.lastUpdated,
        };
      
      default:
        return null;
    }
  };

  const schema = generateSchema();
  
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Validation**: SEO tags render correctly and structured data validates with Google's tools.

---

## Phase 1: Legal Resource Center Frontend

### Task 2.1: State Laws Landing Pages

**Objective**: Create SEO-optimized state law pages with static generation

**AI Agent Prompt**:
```
Create a comprehensive state laws section with:
1. Static generation for all state/topic combinations
2. Interactive state map for navigation
3. Topic filtering and search functionality
4. Breadcrumb navigation for SEO
5. Related content recommendations
6. Mobile-responsive design with excellent UX

Optimize for "landlord tenant laws [state]" keyword variations.
```

**Implementation Steps**:

1. **State Laws Index Page** (`app/(marketing)/laws/page.tsx`):
```typescript
import { Metadata } from 'next';
import { NextSeo } from 'next-seo';
import { StateMap } from '@/components/laws/StateMap';
import { LegalTopics } from '@/components/laws/LegalTopics';
import { FeaturedContent } from '@/components/laws/FeaturedContent';

export const metadata: Metadata = {
  title: 'Landlord Tenant Laws by State | Propertifi Legal Resource Center',
  description: 'Comprehensive database of landlord-tenant laws for all 50 states. Free legal resources, forms, and guides for property owners and managers.',
};

export default async function LawsPage() {
  const [states, topics] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/legal/states`).then(r => r.json()),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/legal/topics`).then(r => r.json()),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NextSeo
        title="Landlord Tenant Laws by State | Propertifi"
        description="Access comprehensive landlord-tenant law resources for all 50 states. Free legal guides, forms, and compliance information for property managers."
        canonical="https://propertifi.co/laws/"
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Landlord Tenant Laws by State
          </h1>
          <p className="text-xl mb-8 max-w-3xl">
            Navigate complex rental property regulations with our comprehensive legal resource center. 
            Access state-specific laws, document templates, and compliance guides.
          </p>
        </div>
      </div>

      {/* Interactive State Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Select Your State
          </h2>
          <StateMap states={states.data} />
        </div>
      </section>

      {/* Legal Topics Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Legal Topics Covered
          </h2>
          <LegalTopics topics={topics.data} />
        </div>
      </section>

      {/* Featured Content */}
      <FeaturedContent />
    </div>
  );
}
```

2. **Dynamic State Law Page** (`app/(marketing)/laws/[state]/[topic]/page.tsx`):
```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextSeo } from 'next-seo';
import { StructuredData } from '@/components/seo/StructuredData';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { RelatedContent } from '@/components/laws/RelatedContent';
import { generateStateLawSEO } from '@/lib/seo';

interface Props {
  params: { state: string; topic: string };
}

// Generate static params for all state/topic combinations
export async function generateStaticParams() {
  const states = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/legal/states`)
    .then(r => r.json());
  const topics = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/legal/topics`)
    .then(r => r.json());

  const params: { state: string; topic: string }[] = [];
  
  for (const state of states.data) {
    for (const topic of topics.data) {
      params.push({
        state: state.slug,
        topic: topic.slug,
      });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/legal/states/${params.state}/laws/${params.topic}`
  ).then(r => r.json());

  if (!content) return {};

  return {
    title: `${content.title} - ${params.state.toUpperCase()} Laws | Propertifi`,
    description: content.meta_description,
    canonical: `https://propertifi.co/laws/${params.state}/${params.topic}/`,
  };
}

export default async function StateLawPage({ params }: Props) {
  const [content, relatedTopics] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/legal/states/${params.state}/laws/${params.topic}`)
      .then(r => r.ok ? r.json() : null),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/legal/states/${params.state}/laws`)
      .then(r => r.json()),
  ]);

  if (!content) {
    notFound();
  }

  const seoData = generateStateLawSEO(params.state, params.topic, content);

  return (
    <div className="min-h-screen bg-white">
      <NextSeo {...seoData} />
      <StructuredData type="LegalService" data={content} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: 'Laws', href: '/laws' },
            { label: params.state.toUpperCase(), href: `/laws/${params.state}` },
            { label: content.title, href: '' },
          ]}
        />
        
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-6">{content.title}</h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <p className="text-lg text-blue-800">{content.summary}</p>
          </div>
          
          <div 
            dangerouslySetInnerHTML={{ __html: content.content }}
            className="mb-12"
          />
          
          {content.official_link && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-2">Official Source</h3>
              <a 
                href={content.official_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View Official Documentation →
              </a>
            </div>
          )}
        </article>
        
        <RelatedContent 
          currentTopic={params.topic}
          state={params.state}
          topics={relatedTopics.data}
        />
      </div>
    </div>
  );
}
```

**Validation**: All state/topic pages generate statically and load quickly.

---

### Task 2.2: Interactive State Map Component

**Objective**: Create an engaging, interactive US map for state selection

**AI Agent Prompt**:
```
Create an interactive SVG-based US map component with:
1. Hover effects and state highlighting
2. Click navigation to state-specific pages
3. Data visualization showing content count per state
4. Mobile-responsive design
5. Accessibility features (keyboard navigation, screen reader support)
6. Loading states and error handling

Include smooth animations and modern design aesthetics.
```

**Implementation Steps**:

1. **Interactive State Map Component** (`components/laws/StateMap.tsx`):
```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface State {
  code: string;
  name: string;
  slug: string;
  law_count: number;
}

interface StateMapProps {
  states: State[];
}

export function StateMap({ states }: StateMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  
  const getStateData = (stateCode: string) => 
    states.find(state => state.code === stateCode);

  const getStateColor = (lawCount: number) => {
    if (lawCount > 15) return '#1d4ed8'; // blue-700
    if (lawCount > 10) return '#3b82f6'; // blue-500
    if (lawCount > 5) return '#60a5fa';  // blue-400
    return '#93c5fd'; // blue-300
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Legend */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-300 rounded mr-2"></div>
              <span>1-5 laws</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
              <span>6-10 laws</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span>11-15 laws</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-700 rounded mr-2"></div>
              <span>15+ laws</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map SVG */}
      <div className="relative">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-auto border rounded-lg bg-gray-50"
          role="img"
          aria-label="Interactive map of United States"
        >
          {/* State paths - you'll need actual SVG path data for each state */}
          {statePathData.map((state) => {
            const stateData = getStateData(state.code);
            const isHovered = hoveredState === state.code;
            
            return (
              <Link
                key={state.code}
                href={`/laws/${stateData?.slug || state.code.toLowerCase()}`}
              >
                <motion.path
                  d={state.path}
                  fill={stateData ? getStateColor(stateData.law_count) : '#e5e7eb'}
                  stroke="#ffffff"
                  strokeWidth="1"
                  className="cursor-pointer transition-all duration-200"
                  whileHover={{ 
                    scale: 1.05,
                    strokeWidth: 2,
                    stroke: '#1f2937'
                  }}
                  onMouseEnter={() => setHoveredState(state.code)}
                  onMouseLeave={() => setHoveredState(null)}
                  aria-label={`${state.name} - ${stateData?.law_count || 0} laws available`}
                />
              </Link>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredState && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            {(() => {
              const state = getStateData(hoveredState);
              return state ? (
                <>
                  <div className="font-semibold">{state.name}</div>
                  <div>{state.law_count} laws available</div>
                </>
              ) : (
                <div>Coming soon</div>
              );
            })()}
          </motion.div>
        )}
      </div>

      {/* Mobile State List */}
      <div className="md:hidden mt-8">
        <div className="grid grid-cols-2 gap-2">
          {states.map((state) => (
            <Link
              key={state.code}
              href={`/laws/${state.slug}`}
              className="block p-3 bg-white border rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="font-semibold">{state.name}</div>
              <div className="text-sm text-gray-600">{state.law_count} laws</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// You'll need to include actual SVG path data for all 50 states
const statePathData = [
  { code: 'CA', name: 'California', path: 'M...' }, // SVG path data
  { code: 'TX', name: 'Texas', path: 'M...' },
  // ... other states
];
```

**Validation**: Map is interactive, responsive, and accessible across all devices.

---

### Task 2.3: Document Template Library

**Objective**: Create a searchable, filterable document template library

**AI Agent Prompt**:
```
Build a document template library with:
1. Advanced filtering by state, category, and type
2. Search functionality with autocomplete
3. Download tracking and user authentication gates
4. Preview functionality for templates
5. Favorite/bookmark system for logged-in users
6. Related template recommendations

Optimize for template-related keywords and conversion to leads.
```

**Implementation Steps**:

1. **Template Library Page** (`app/(marketing)/templates/page.tsx`):
```typescript
import { Metadata } from 'next';
import { Suspense } from 'react';
import { TemplateFilters } from '@/components/templates/TemplateFilters';
import { TemplateGrid } from '@/components/templates/TemplateGrid';
import { TemplateSearch } from '@/components/templates/TemplateSearch';
import { FeaturedTemplates } from '@/components/templates/FeaturedTemplates';

export const metadata: Metadata = {
  title: 'Free Property Management Forms & Templates | Propertifi',
  description: 'Download free landlord forms, lease agreements, and property management templates. State-specific documents for property owners and managers.',
};

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filters = {
    state: searchParams.state as string,
    category: searchParams.category as string,
    search: searchParams.search as string,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Property Management Forms & Templates
          </h1>
          <p className="text-xl mb-8 max-w-3xl">
            Download free, state-specific forms and templates for landlords and property managers. 
            Lease agreements, notices, applications, and more.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          <TemplateSearch initialValue={filters.search} />
          <TemplateFilters initialFilters={filters} />
        </div>

        {/* Featured Templates */}
        <Suspense fallback={<div>Loading featured templates...</div>}>
          <FeaturedTemplates />
        </Suspense>

        {/* Template Grid */}
        <Suspense fallback={<div>Loading templates...</div>}>
          <TemplateGrid filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
```

2. **Template Grid Component** (`components/templates/TemplateGrid.tsx`):
```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentArrowDownIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Template {
  id: number;
  title: string;
  description: string;
  category: string;
  state_code: string | null;
  is_free: boolean;
  requires_signup: boolean;
  download_count: number;
  file_size_mb: string;
  tags: string[];
}

interface TemplateGridProps {
  filters: {
    state?: string;
    category?: string;
    search?: string;
  };
}

export function TemplateGrid({ filters }: TemplateGridProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchTemplates();
  }, [filters]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.state) params.append('state', filters.state);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/backend/templates?${params}`);
      const data = await response.json();
      setTemplates(data.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (template: Template) => {
    if (template.requires_signup && !user) {
      // Redirect to signup with template ID
      router.push(`/signup?template=${template.id}`);
      return;
    }

    try {
      const response = await fetch(`/api/backend/templates/${template.id}/download`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const toggleFavorite = async (templateId: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const newFavorites = new Set(favorites);
    if (favorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);

    // API call to update favorites
    await fetch(`/api/backend/templates/${templateId}/favorite`, {
      method: 'POST',
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{template.description}</p>
            </div>
            <button
              onClick={() => toggleFavorite(template.id)}
              className="ml-2 p-1 hover:bg-gray-100 rounded"
            >
              {favorites.has(template.id) ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {template.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>{template.state_code || 'Federal'}</span>
            <span>{template.download_count} downloads</span>
            <span>{template.file_size_mb} MB</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleDownload(template)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              {template.is_free ? 'Free Download' : 'Download'}
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <EyeIcon className="w-4 h-4" />
            </button>
          </div>

          {template.requires_signup && !user && (
            <p className="text-xs text-orange-600 mt-2 text-center">
              Sign up required for download
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
```

**Validation**: Template library is fully functional with filtering and download capabilities.

---

## Phase 2: Property Calculators

### Task 3.1: Rental ROI Calculator

**Objective**: Create interactive property investment calculators

**AI Agent Prompt**:
```
Build a comprehensive rental ROI calculator with:
1. Multi-step input form with validation
2. Real-time calculation updates
3. Visual charts and graphs showing projections
4. Save/share functionality for results
5. Print-friendly results page
6. Lead capture integration

Include proper financial formulas and mobile-responsive design.
```

**Implementation Steps**:

1. **ROI Calculator Page** (`app/(marketing)/calculators/rental-roi/page.tsx`):
```typescript
import { Metadata } from 'next';
import { ROICalculator } from '@/components/calculators/ROICalculator';
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout';

export const metadata: Metadata = {
  title: 'Rental Property ROI Calculator | Free Investment Analysis Tool',
  description: 'Calculate rental property return on investment with our free ROI calculator. Analyze cash flow, cap rates, and investment returns for real estate properties.',
};

export default function RentalROIPage() {
  return (
    <CalculatorLayout
      title="Rental Property ROI Calculator"
      description="Calculate your rental property's return on investment, cash flow, and key financial metrics"
    >
      <ROICalculator />
    </CalculatorLayout>
  );
}
```

2. **ROI Calculator Component** (`components/calculators/ROICalculator.tsx`):
```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ROIInputs {
  purchasePrice: number;
  downPayment: number;
  monthlyRent: number;
  monthlyExpenses: number;
  closingCosts: number;
  renovationCosts: number;
  vacancy: number;
  appreciationRate: number;
}

interface ROIResults {
  monthlyGainLoss: number;
  annualGainLoss: number;
  totalCashInvested: number;
  cashOnCashReturn: number;
  capRate: number;
  totalROI: number;
  breakEvenRent: number;
}

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    purchasePrice: 300000,
    downPayment: 60000,
    monthlyRent: 2500,
    monthlyExpenses: 800,
    closingCosts: 5000,
    renovationCosts: 10000,
    vacancy: 5,
    appreciationRate: 3,
  });

  const [results, setResults] = useState<ROIResults>({
    monthlyGainLoss: 0,
    annualGainLoss: 0,
    totalCashInvested: 0,
    cashOnCashReturn: 0,
    capRate: 0,
    totalROI: 0,
    breakEvenRent: 0,
  });

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const calculateROI = () => {
    const adjustedRent = inputs.monthlyRent * (1 - inputs.vacancy / 100);
    const monthlyGainLoss = adjustedRent - inputs.monthlyExpenses;
    const annualGainLoss = monthlyGainLoss * 12;
    const totalCashInvested = inputs.downPayment + inputs.closingCosts + inputs.renovationCosts;
    const cashOnCashReturn = (annualGainLoss / totalCashInvested) * 100;
    const capRate = (annualGainLoss / inputs.purchasePrice) * 100;
    
    // Simplified total ROI including appreciation
    const totalROI = cashOnCashReturn + inputs.appreciationRate;
    const breakEvenRent = inputs.monthlyExpenses / (1 - inputs.vacancy / 100);

    setResults({
      monthlyGainLoss,
      annualGainLoss,
      totalCashInvested,
      cashOnCashReturn,
      capRate,
      totalROI,
      breakEvenRent,
    });
  };

  const handleInputChange = (field: keyof ROIInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent.toFixed(2)}%`;
  };

  const chartData = {
    labels: ['Monthly Income', 'Monthly Expenses', 'Monthly Cash Flow'],
    datasets: [
      {
        label: 'Amount',
        data: [
          inputs.monthlyRent * (1 - inputs.vacancy / 100),
          inputs.monthlyExpenses,
          results.monthlyGainLoss,
        ],
        backgroundColor: ['#10b981', '#ef4444', results.monthlyGainLoss >= 0 ? '#10b981' : '#ef4444'],
        borderColor: ['#059669', '#dc2626', results.monthlyGainLoss >= 0 ? '#059669' : '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Property Details</h2>
          
          <div className="space-y-6">
            <InputField
              label="Purchase Price"
              value={inputs.purchasePrice}
              onChange={(value) => handleInputChange('purchasePrice', value)}
              prefix="$"
            />
            
            <InputField
              label="Down Payment"
              value={inputs.downPayment}
              onChange={(value) => handleInputChange('downPayment', value)}
              prefix="$"
            />
            
            <InputField
              label="Monthly Rent"
              value={inputs.monthlyRent}
              onChange={(value) => handleInputChange('monthlyRent', value)}
              prefix="$"
            />
            
            <InputField
              label="Monthly Expenses"
              value={inputs.monthlyExpenses}
              onChange={(value) => handleInputChange('monthlyExpenses', value)}
              prefix="$"
            />
            
            <InputField
              label="Closing Costs"
              value={inputs.closingCosts}
              onChange={(value) => handleInputChange('closingCosts', value)}
              prefix="$"
            />
            
            <InputField
              label="Renovation Costs"
              value={inputs.renovationCosts}
              onChange={(value) => handleInputChange('renovationCosts', value)}
              prefix="$"
            />
            
            <InputField
              label="Vacancy Rate"
              value={inputs.vacancy}
              onChange={(value) => handleInputChange('vacancy', value)}
              suffix="%"
            />
            
            <InputField
              label="Annual Appreciation"
              value={inputs.appreciationRate}
              onChange={(value) => handleInputChange('appreciationRate', value)}
              suffix="%"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowResults(true)}
            className="w-full mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Calculate ROI
          </motion.button>
        </div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: showResults ? 1 : 0.5, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Investment Analysis</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <ResultCard
              title="Monthly Cash Flow"
              value={formatCurrency(results.monthlyGainLoss)}
              positive={results.monthlyGainLoss >= 0}
            />
            
            <ResultCard
              title="Annual Cash Flow"
              value={formatCurrency(results.annualGainLoss)}
              positive={results.annualGainLoss >= 0}
            />
            
            <ResultCard
              title="Cash-on-Cash Return"
              value={formatPercent(results.cashOnCashReturn)}
              positive={results.cashOnCashReturn >= 0}
            />
            
            <ResultCard
              title="Cap Rate"
              value={formatPercent(results.capRate)}
              positive={results.capRate >= 0}
            />
          </div>

          {/* Chart */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Breakdown</h3>
            <Bar data={chartData} options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return formatCurrency(value as number);
                    },
                  },
                },
              },
            }} />
          </div>

          {/* Key Metrics */}
          <div className="border-t pt-4">
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Total Cash Invested:</span>
                <span className="font-semibold">{formatCurrency(results.totalCashInvested)}</span>
              </div>
              <div className="flex justify-between">
                <span>Break-even Rent:</span>
                <span className="font-semibold">{formatCurrency(results.breakEvenRent)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total ROI (with appreciation):</span>
                <span className="font-semibold">{formatPercent(results.totalROI)}</span>
              </div>
            </div>
          </div>

          {/* Save Results */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Save Results
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// Helper Components
interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}

function InputField({ label, value, onChange, prefix, suffix }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-3 text-gray-500">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            prefix ? 'pl-8' : ''
          } ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-3 text-gray-500">{suffix}</span>
        )}
      </div>
    </div>
  );
}

interface ResultCardProps {
  title: string;
  value: string;
  positive: boolean;
}

function ResultCard({ title, value, positive }: ResultCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="text-sm text-gray-600">{title}</div>
      <div className={`text-lg font-bold ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {value}
      </div>
    </div>
  );
}
```

**Validation**: Calculator provides accurate financial calculations and responsive design.

---

## Phase 3: User Dashboards

### Task 4.1: Property Owner Dashboard

**Objective**: Create comprehensive dashboard for property owners

**AI Agent Prompt**:
```
Build a property owner dashboard with:
1. Lead history and status tracking
2. Bookmark management for saved resources
3. Saved calculator results
4. Property portfolio overview
5. Market insights and trends
6. Communication center with property managers

Include responsive design and real-time updates.
```

**Implementation Steps**:

1. **Owner Dashboard Layout** (`app/(dashboard)/owner/page.tsx`):
```typescript
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentLeads } from '@/components/dashboard/RecentLeads';
import { BookmarkedContent } from '@/components/dashboard/BookmarkedContent';
import { SavedCalculations } from '@/components/dashboard/SavedCalculations';

export const metadata: Metadata = {
  title: 'Property Owner Dashboard | Propertifi',
  description: 'Manage your property portfolio, track leads, and access saved resources.',
};

export default async function OwnerDashboard() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'owner') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-600">
            Manage your property portfolio and track your leads
          </p>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats userId={user.id} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <RecentLeads userId={user.id} />
            <SavedCalculations userId={user.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <BookmarkedContent userId={user.id} />
            
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/submit-property"
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit New Property
                </a>
                <a
                  href="/calculators"
                  className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Use Calculators
                </a>
                <a
                  href="/laws"
                  className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Browse Legal Resources
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

2. **Recent Leads Component** (`components/dashboard/RecentLeads.tsx`):
```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface Lead {
  id: number;
  property_address: string;
  property_type: string;
  created_at: string;
  status: string;
  matched_managers: number;
  response_count: number;
}

export function RecentLeads({ userId }: { userId: number }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, [userId]);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`/api/backend/owner/${userId}/leads`);
      const data = await response.json();
      setLeads(data.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Property Submissions</h2>
        <a
          href="/owner/leads"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All
        </a>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No property submissions yet</p>
          <a
            href="/submit-property"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Your First Property
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium">{lead.property_address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="mr-4">{lead.property_type}</span>
                    <span className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <span className="text-gray-600">
                      {lead.matched_managers} managers matched
                    </span>
                    <span className="text-gray-600">
                      {lead.response_count} responses
                    </span>
                  </div>
                </div>
                
                <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                  <EyeIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Validation**: Dashboard loads correctly with real data and responsive design.

---

### Task 4.2: Property Manager Dashboard

**Objective**: Create feature-rich dashboard for property managers

**AI Agent Prompt**:
```
Build a property manager dashboard with:
1. Lead pipeline management with status updates
2. Performance analytics and conversion metrics
3. Calendar integration for follow-ups
4. Revenue tracking and reporting
5. Team management features
6. Market insights and competitive analysis

Include real-time notifications and mobile optimization.
```

**Implementation Steps**:

1. **PM Dashboard Layout** (`app/(dashboard)/property-manager/page.tsx`):
```typescript
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { LeadPipeline } from '@/components/dashboard/pm/LeadPipeline';
import { PerformanceMetrics } from '@/components/dashboard/pm/PerformanceMetrics';
import { RecentActivity } from '@/components/dashboard/pm/RecentActivity';
import { MarketInsights } from '@/components/dashboard/pm/MarketInsights';

export const metadata: Metadata = {
  title: 'Property Manager Dashboard | Propertifi',
  description: 'Manage leads, track performance, and grow your property management business.',
};

export default async function PMDashboard() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'property_manager') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Track your leads and manage your business
          </p>
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics userId={user.id} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <LeadPipeline userId={user.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <RecentActivity userId={user.id} />
            <MarketInsights />
          </div>
        </div>
      </div>
    </div>
  );
}
```

2. **Lead Pipeline Component** (`components/dashboard/pm/LeadPipeline.tsx`):
```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Lead {
  id: number;
  property_address: string;
  owner_name: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  created_at: string;
  notes: string;
  value: number;
}

const statusColumns = [
  { id: 'new', title: 'New Leads', color: 'bg-blue-500' },
  { id: 'contacted', title: 'Contacted', color: 'bg-yellow-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-orange-500' },
  { id: 'proposal', title: 'Proposal Sent', color: 'bg-purple-500' },
  { id: 'won', title: 'Won', color: 'bg-green-500' },
  { id: 'lost', title: 'Lost', color: 'bg-red-500' },
];

export function LeadPipeline({ userId }: { userId: number }) {
  const [leads, setLeads] = useState<{ [key: string]: Lead[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, [userId]);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`/api/backend/pm/${userId}/leads`);
      const data = await response.json();
      
      // Group leads by status
      const groupedLeads = data.data.reduce((acc: any, lead: Lead) => {
        if (!acc[lead.status]) acc[lead.status] = [];
        acc[lead.status].push(lead);
        return acc;
      }, {});
      
      setLeads(groupedLeads);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = leads[source.droppableId];
    const finish = leads[destination.droppableId];

    if (start === finish) {
      const newLeads = Array.from(start);
      const [removed] = newLeads.splice(source.index, 1);
      newLeads.splice(destination.index, 0, removed);

      setLeads({
        ...leads,
        [source.droppableId]: newLeads,
      });
    } else {
      const startLeads = Array.from(start);
      const [removed] = startLeads.splice(source.index, 1);
      const finishLeads = Array.from(finish);
      finishLeads.splice(destination.index, 0, { ...removed, status: destination.droppableId as any });

      setLeads({
        ...leads,
        [source.droppableId]: startLeads,
        [destination.droppableId]: finishLeads,
      });

      // Update status in backend
      await fetch(`/api/backend/leads/${draggableId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: destination.droppableId }),
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-white p-6 rounded-lg shadow-sm h-96"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Lead Pipeline</h2>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statusColumns.map((column) => (
            <div key={column.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className={`w-3 h-3 rounded-full ${column.color} mr-2`}></div>
                <h3 className="font-medium text-sm">{column.title}</h3>
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {leads[column.id]?.length || 0}
                </span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[200px] ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                  >
                    {(leads[column.id] || []).map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-3 rounded-lg shadow-sm mb-3 cursor-pointer ${
                              snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="text-sm font-medium mb-1">
                              {lead.property_address}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              {lead.owner_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ${lead.value.toLocaleString()}/mo
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
```

**Validation**: Dashboard provides full lead management functionality with drag-and-drop pipeline.

---

## Phase 4: SEO & Performance Optimization

### Task 5.1: Sitemap and SEO Implementation

**Objective**: Implement comprehensive SEO optimization for maximum search visibility

**AI Agent Prompt**:
```
Implement advanced SEO optimization:
1. Dynamic sitemap generation for all routes
2. Meta tag optimization for programmatic pages
3. Schema markup for all content types
4. Page speed optimization with Next.js features
5. Image optimization and lazy loading
6. Core Web Vitals optimization

Include monitoring and reporting for SEO metrics.
```

**Implementation Steps**:

1. **Dynamic Sitemap Generation** (`app/sitemap.ts`):
```typescript
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://propertifi.co';
  
  // Static pages
  const staticPages = [
    '',
    '/laws',
    '/templates',
    '/calculators',
    '/calculators/rental-roi',
    '/calculators/rent-vs-buy',
    '/about',
    '/contact',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  // Fetch dynamic content
  const [states, topics, cities, templates] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/legal/states`).then(r => r.json()),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/legal/topics`).then(r => r.json()),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`).then(r => r.json()),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/templates`).then(r => r.json()),
  ]);

  // State law pages
  const stateLawPages: MetadataRoute.Sitemap = [];
  for (const state of states.data) {
    // State overview page
    stateLawPages.push({
      url: `${baseUrl}/laws/${state.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });

    // Individual topic pages
    for (const topic of topics.data) {
      stateLawPages.push({
        url: `${baseUrl}/laws/${state.slug}/${topic.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // City pages
  const cityPages = cities.data.map((city: any) => ({
    url: `${baseUrl}/property-management/${city.state_slug}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  // Template pages
  const templatePages = templates.data.map((template: any) => ({
    url: `${baseUrl}/templates/${template.slug}`,
    lastModified: new Date(template.updated_at),
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  return [
    ...staticPages,
    ...stateLawPages,
    ...cityPages,
    ...templatePages,
  ];
}
```

2. **Performance Optimization** (`next.config.js`):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  
  // Image optimization
  images: {
    domains: ['localhost', 'propertifi.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compression
  compress: true,
  
  // Static optimization
  generateEtags: true,
  
  // Headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/law/:state',
        destination: '/laws/:state',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

**Validation**: Sitemap generates correctly and includes all dynamic routes.

---

## Final Testing & Deployment

### Task 6.1: Comprehensive Testing Suite

**Objective**: Implement testing for all critical functionality

**AI Agent Prompt**:
```
Create comprehensive testing suite:
1. Unit tests for utility functions and components
2. Integration tests for API endpoints
3. E2E tests for critical user flows
4. Performance tests for page load times
5. Accessibility testing with automated tools
6. SEO validation tests

Include CI/CD pipeline integration and automated testing.
```

**Implementation Steps**:

1. **Testing Setup** (`jest.config.js`):
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
};

module.exports = createJestConfig(customJestConfig);
```

2. **Component Tests** (`__tests__/components/StateMap.test.tsx`):
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { StateMap } from '@/components/laws/StateMap';

const mockStates = [
  { code: 'CA', name: 'California', slug: 'california', law_count: 15 },
  { code: 'TX', name: 'Texas', slug: 'texas', law_count: 12 },
];

describe('StateMap', () => {
  it('renders state map with correct data', () => {
    render(<StateMap states={mockStates} />);
    
    expect(screen.getByRole('img', { name: /interactive map/i })).toBeInTheDocument();
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('15 laws available')).toBeInTheDocument();
  });

  it('shows tooltip on state hover', async () => {
    render(<StateMap states={mockStates} />);
    
    const californiaPath = screen.getByLabelText(/california.*15 laws/i);
    fireEvent.mouseEnter(californiaPath);
    
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('15 laws available')).toBeInTheDocument();
  });

  it('navigates to state page on click', () => {
    const mockPush = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
    }));

    render(<StateMap states={mockStates} />);
    
    const californiaPath = screen.getByLabelText(/california.*15 laws/i);
    fireEvent.click(californiaPath);
    
    expect(mockPush).toHaveBeenCalledWith('/laws/california');
  });
});
```

3. **E2E Tests** (`e2e/lead-submission.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';

test.describe('Lead Submission Flow', () => {
  test('should complete lead submission successfully', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to lead form
    await page.click('text=Get Property Manager Quotes');
    
    // Fill out form
    await page.fill('[name="property_address"]', '123 Main St, Sacramento, CA');
    await page.fill('[name="owner_name"]', 'John Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="phone"]', '(555) 123-4567');
    
    // Select property type
    await page.selectOption('[name="property_type"]', 'single-family');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('text=Thank you for your submission')).toBeVisible();
    await expect(page.locator('text=Property managers will contact you')).toBeVisible();
  });

  test('should show validation errors for incomplete form', async ({ page }) => {
    await page.goto('/submit-property');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Property address is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });
});
```

**Validation**: All tests pass and provide good coverage of critical functionality.

---

This comprehensive frontend implementation guide provides detailed, step-by-step instructions for AI agents to build the complete Propertifi v2 frontend with Next.js. Each task includes specific prompts, implementation steps, and validation criteria to ensure successful development and tracking of progress.
