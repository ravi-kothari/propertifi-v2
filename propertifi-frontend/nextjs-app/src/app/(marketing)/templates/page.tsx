
'use client';

import React from 'react';
import TemplateLibrary from '@/app/components/templates/TemplateLibrary';

const TemplatesPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Document Templates</h1>
      <TemplateLibrary />
    </div>
  );
};

export default TemplatesPage;
