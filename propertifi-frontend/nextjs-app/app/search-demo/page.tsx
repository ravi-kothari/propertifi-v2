"use client";

import { useState } from "react";
import { Search } from "@/app/components/ui/Search";

const mockSuggestions = [
  "property management in Los Angeles",
  "best property managers in New York",
  "HOA management companies in Florida",
  "commercial property management in Texas",
];

export default function SearchDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setIsLoading(true);
    setSearchResults([]);
    console.log("Searching for:", query);
    setTimeout(() => {
      setSearchResults([
        `Result 1 for "${query}"`,
        `Result 2 for "${query}"`,
        `Result 3 for "${query}"`,
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-heading text-4xl font-bold text-slate-900 mb-4">
            Search Component Demo
          </h1>
          <p className="text-lg text-slate-600">
            A demonstration of the search component with mock suggestions and recent searches.
          </p>
        </div>
        <Search
          onSearch={handleSearch}
          isLoading={isLoading}
          suggestions={mockSuggestions}
        />
        <div className="mt-8">
          {isLoading && <p className="text-center">Loading...</p>}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <ul className="space-y-2">
                {searchResults.map((result, i) => (
                  <li key={i} className="p-4 border rounded-md bg-white shadow-sm">
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
