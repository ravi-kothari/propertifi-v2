'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import TemplateGrid from '@/components/ui/TemplateGrid';
import TemplateFilters from '@/components/ui/TemplateFilters';
import TemplateSearch from '@/components/ui/TemplateSearch';

const RecentlyDownloaded = dynamic(() => import('@/components/ui/RecentlyDownloaded'));

const allTemplates = [
  { id: 1, name: 'Lease Agreement', category: 'Agreements', state: 'California', downloads: 123 },
  { id: 2, name: 'Eviction Notice', category: 'Notices', state: 'Texas', downloads: 45 },
  { id: 3, name: 'Rental Application', category: 'Applications', state: 'Florida', downloads: 78 },
  { id: 4, name: 'Lease Agreement', category: 'Agreements', state: 'Texas', downloads: 99 },
  { id: 5, name: 'Eviction Notice', category: 'Notices', state: 'California', downloads: 23 },
  { id: 6, name: 'Rental Application', category: 'Applications', state: 'Texas', downloads: 56 },
];

export default function TemplateLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [recentlyDownloaded, setRecentlyDownloaded] = useState([]);

  const handleStateChange = (state) => {
    setStateFilter(state);
  };

  const handleDownload = (template) => {
    setRecentlyDownloaded(prev => [template, ...prev.slice(0, 2)]);
  };

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'All' || template.state === stateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold text-gray-800">Template Library</h1>
        <TemplateSearch onSearch={setSearchQuery} />
      </div>
      <div className="flex">
        <TemplateFilters onStateChange={handleStateChange} />
        <TemplateGrid templates={filteredTemplates} onDownload={handleDownload} />
      </div>
      <RecentlyDownloaded templates={recentlyDownloaded} />
    </div>
  );
}