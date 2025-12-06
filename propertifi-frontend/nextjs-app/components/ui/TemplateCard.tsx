import { useState } from 'react';
import dynamic from 'next/dynamic';
import DownloadButton from './DownloadButton';

const TemplatePreview = dynamic(() => import('./TemplatePreview'));

const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <button onClick={onClose} className="absolute top-4 right-4">Close</button>
      {children}
    </div>
  </div>
);

interface TemplateCardProps {
  template: any;
  onDownload: (template: any) => void;
}

export default function TemplateCard({ template, onDownload }: TemplateCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-xl font-semibold">{template.name}</h2>
      <p className="text-gray-600">{template.category}</p>
      <p className="text-gray-600">{template.state}</p>
      <p className="text-gray-600">Downloads: {template.downloads}</p>
      <div className="mt-4 flex space-x-2">
        <DownloadButton template={template} onDownload={onDownload} />
        <button onClick={() => setShowPreview(true)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          Preview
        </button>
      </div>
      {showPreview && (
        <Modal onClose={() => setShowPreview(false)}>
          <TemplatePreview template={template} />
        </Modal>
      )}
    </div>
  );
}