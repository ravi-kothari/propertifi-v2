
'use client';

import React, { useState } from 'react';
import { useTemplates } from '@/app/hooks/useTemplates';
import TemplateCard from './TemplateCard';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';

const TemplateLibrary = () => {
  const { data: templates, isLoading, isError } = useTemplates();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading templates.</div>;

  const filteredTemplates = templates.filter((template: any) => {
    const searchTermMatch = searchTerm ? template.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const categoryMatch = categoryFilter ? template.category === categoryFilter : true;
    return searchTermMatch && categoryMatch;
  });

  const categories = templates ? [...new Set(templates.map((t: any) => t.category))] : [];

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Categories</option>
          {categories.map((category: any) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template: any) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary;
