import { Metadata } from 'next';

const siteConfig = {
  title: 'Propertifi - AI-Powered Property Manager Matching',
  description: 'Find the best property manager for your rental properties. Propertifi uses AI to match you with verified, top-rated professionals in your area.',
  url: 'https://www.propertifi.co', // Replace with your actual domain
  ogImage: 'https://www.propertifi.co/og-image.png', // Replace with your actual OG image URL
};

/**
 * Default metadata for static pages
 */
export const defaultMetadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    // creator: '@yourtwitterhandle', // Optional: add your Twitter handle
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

/**
 * Generates metadata for dynamic pages
 * @param title - The title of the page
 * @param description - The description of the page
 * @param path - The path of the page (e.g., /blog/my-post)
 * @returns Metadata object
 */
export function generatePageMetadata(title: string, description: string, path: string): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    openGraph: {
      ...defaultMetadata.openGraph,
      url,
      title,
      description,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generates JSON-LD structured data for an organization
 */
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Propertifi',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`, // Replace with your actual logo URL
    sameAs: [
      // 'https://www.facebook.com/your-page',
      // 'https://twitter.com/your-handle',
      // 'https://www.linkedin.com/company/your-company',
    ],
  };
}

/**
 * Generates JSON-LD structured data for a website
 */
export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generates JSON-LD structured data for a web page
 */
export function getWebPageJsonLd(title: string, description: string, path: string) {
  const url = `${siteConfig.url}${path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    name: title,
    description,
    isPartOf: {
      '@id': siteConfig.url,
    },
  };
}

/**
 * Generates JSON-LD structured data for a breadcrumb list
 */
export function getBreadcrumbJsonLd(items: { name: string; item?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.item && { item: `${siteConfig.url}${item.item}` }),
    })),
  };
}
