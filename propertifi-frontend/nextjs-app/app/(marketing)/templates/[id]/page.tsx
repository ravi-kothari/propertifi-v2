import TemplateDetail from '@/components/templates/TemplateDetail';

export default function TemplatePage({ params }: { params: { id: string } }) {
  // Fetch template data based on params.id
  const template = { id: params.id, name: `Template ${params.id}`, category: 'Category' };

  return <TemplateDetail template={template} />;
}
