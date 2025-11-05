'use client';

import { useState } from 'react';

export default function DownloadButton({ template, onDownload }: any) {
  const [isRateLimited, setIsRateLimited] = useState(false);

  const handleDownload = () => {
    if (isRateLimited) {
      alert('You are downloading too frequently. Please try again later.');
      return;
    }

    onDownload(template);

    // Simulate rate limiting
    setIsRateLimited(true);
    setTimeout(() => {
      setIsRateLimited(false);
    }, 5000); // 5 second cooldown
  };

  return (
    <button
      onClick={handleDownload}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isRateLimited ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isRateLimited}
    >
      {isRateLimited ? 'Cooldown...' : 'Download'}
    </button>
  );
}
