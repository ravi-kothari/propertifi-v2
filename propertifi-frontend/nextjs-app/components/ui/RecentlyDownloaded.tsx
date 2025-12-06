interface RecentlyDownloadedProps {
  templates: any[];
}

export default function RecentlyDownloaded({ templates }: RecentlyDownloadedProps) {
  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">Recently Downloaded</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {templates.map(template => (
          <div key={template.id} className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold">{template.name}</h3>
            <p className="text-gray-600">{template.category}</p>
            <p className="text-gray-600">{template.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
