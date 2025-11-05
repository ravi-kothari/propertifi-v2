import TemplateCard from './TemplateCard';

export default function TemplateGrid({ templates, onDownload }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {templates.map(template => (
        <TemplateCard key={template.id} template={template} onDownload={onDownload} />
      ))}
    </div>
  );
}
