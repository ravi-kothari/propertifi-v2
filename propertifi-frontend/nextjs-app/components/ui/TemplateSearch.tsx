interface TemplateSearchProps {
  onSearch: (value: string) => void;
}

export default function TemplateSearch({ onSearch }: TemplateSearchProps) {
  return (
    <input
      type="text"
      placeholder="Search templates..."
      onChange={(e) => onSearch(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}