export default function TemplateDetail({ template }) {
  return (
    <div>
      <h1 className="text-3xl font-semibold">{template.name}</h1>
      <p>{template.category}</p>
      {/* Placeholder for template details */}
    </div>
  );
}