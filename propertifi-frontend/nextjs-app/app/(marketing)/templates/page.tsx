import { generatePageMetadata } from '@/lib/seo';
import TemplateLibrary from '@/components/layout/TemplateLibrary';

export const metadata = generatePageMetadata(
  'Document Templates',
  'Find and download document templates for your property management needs.',
  '/templates'
);

export default function TemplatesPage() {
  return <TemplateLibrary />;
}