"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, Clock } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/components/ui/button";

interface SearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  suggestions?: string[];
}

export function Search({ onSearch, isLoading, suggestions }: SearchProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleSearch = () => {
    if (query.trim() !== "") {
      const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
      onSearch(query);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch();
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-lg mx-auto">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search..."
        leftIcon={<SearchIcon className="h-5 w-5" />}
        rightIcon={
          query && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuery("")}>
              <X className="h-4 w-4" />
            </Button>
          )
        }
      />
      {isFocused && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-white shadow-lg z-10">
          {suggestions && suggestions.length > 0 && (
            <div className="py-2">
              <h4 className="px-4 py-2 text-sm font-semibold text-slate-500">Suggestions</h4>
              <ul>
                {suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recentSearches.length > 0 && (
            <div className="py-2">
              <h4 className="px-4 py-2 text-sm font-semibold text-slate-500">Recent Searches</h4>
              <ul>
                {recentSearches.map((search, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 cursor-pointer hover:bg-slate-100 flex items-center"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    {search}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
