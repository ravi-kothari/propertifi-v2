import TemplateCard from './TemplateCard';

interface TemplateGridProps {
  templates: any[];
  onDownload: (template: any) => void;
}

export default function TemplateGrid({ templates, onDownload }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {templates.map(template => (
        <TemplateCard key={template.id} template={template} onDownload={onDownload} />
      ))}
    </div>
  );
}
