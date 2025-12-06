interface TemplatePreviewProps {
  template: any;
}

export default function TemplatePreview({ template }: TemplatePreviewProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{template.name}</h2>
      <div className="border p-4 rounded-lg">
        <p>This is a preview of the {template.name} template.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...</p>
      </div>
    </div>
  );
}
