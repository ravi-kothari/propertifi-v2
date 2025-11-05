"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Container, Section } from "@/app/components/layout";
import { ManagerCard } from "@/app/components/ManagerCard";
import { ManagerFilters, FilterState } from "@/app/components/ManagerFilters";
import { Input } from "@/app/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getManagersByLocation,
  getAllPropertyTypes,
  getAllServices,
  PropertyManager
} from "@/lib/mock-data/property-managers";
import { ChevronRight, Home, Search } from "lucide-react";
import Link from "next/link";

type SortOption = "best-match" | "highest-rated" | "most-reviews" | "most-experience" | "alphabetical";

export default function PropertyManagerListingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const state = (params.state as string).toUpperCase();
  const city = (params.city as string).replace(/-/g, ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Get managers for this location
  const allManagers = useMemo(() => getManagersByLocation(state, city), [state, city]);

  // Initialize from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "best-match"
  );

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    propertyTypes: searchParams.get("types")?.split(",").filter(Boolean) || [],
    minYearsExperience: Number(searchParams.get("minExp")) || 0,
    minRating: Number(searchParams.get("minRating")) || 0,
    services: searchParams.get("services")?.split(",").filter(Boolean) || [],
  });

  // Update URL when filters, search, or sort changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (sortBy !== "best-match") params.set("sort", sortBy);
    if (filters.propertyTypes.length > 0) params.set("types", filters.propertyTypes.join(","));
    if (filters.minYearsExperience > 0) params.set("minExp", filters.minYearsExperience.toString());
    if (filters.minRating > 0) params.set("minRating", filters.minRating.toString());
    if (filters.services.length > 0) params.set("services", filters.services.join(","));

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [filters, searchQuery, sortBy, router]);

  // Filter managers based on current filters and search
  const filteredManagers = useMemo(() => {
    return allManagers.filter((manager) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          manager.companyName.toLowerCase().includes(query) ||
          manager.description.toLowerCase().includes(query) ||
          manager.services.some(service => service.toLowerCase().includes(query)) ||
          manager.propertyTypes.some(type => type.toLowerCase().includes(query));

        if (!matchesSearch) return false;
      }

      // Property types filter
      if (filters.propertyTypes.length > 0) {
        const hasMatchingType = filters.propertyTypes.some((type) =>
          manager.propertyTypes.includes(type)
        );
        if (!hasMatchingType) return false;
      }

      // Years experience filter
      if (filters.minYearsExperience > 0) {
        if (manager.yearsExperience < filters.minYearsExperience) return false;
      }

      // Rating filter
      if (filters.minRating > 0) {
        if (manager.rating < filters.minRating) return false;
      }

      // Services filter
      if (filters.services.length > 0) {
        const hasMatchingService = filters.services.some((service) =>
          manager.services.includes(service)
        );
        if (!hasMatchingService) return false;
      }

      return true;
    });
  }, [allManagers, filters, searchQuery]);

  // Sort managers based on selected option
  const sortedManagers = useMemo(() => {
    const sorted = [...filteredManagers];

    switch (sortBy) {
      case "highest-rated":
        return sorted.sort((a, b) => b.rating - a.rating);

      case "most-reviews":
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);

      case "most-experience":
        return sorted.sort((a, b) => b.yearsExperience - a.yearsExperience);

      case "alphabetical":
        return sorted.sort((a, b) => a.companyName.localeCompare(b.companyName));

      case "best-match":
      default:
        // Featured first, then by rating
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }
  }, [filteredManagers, sortBy]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  return (
    <main>
      {/* Breadcrumbs */}
      <Section spacing="sm" variant="slate">
        <Container>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link href="/property-managers" className="text-slate-600 hover:text-slate-900">
              Property Managers
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-medium">
              {city}, {state}
            </span>
          </nav>
        </Container>
      </Section>

      {/* Page Header */}
      <Section spacing="md">
        <Container>
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Property Managers in {city}, {state}
            </h1>
            <p className="text-lg text-slate-600">
              Find and compare {allManagers.length} verified property management companies
              serving {city}, {state}. Read reviews, compare pricing, and get matched
              with the perfect manager for your rental property.
            </p>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Left 25% */}
            <aside className="lg:col-span-1">
              <div className="sticky top-4">
                <ManagerFilters
                  onFilterChange={handleFilterChange}
                  availablePropertyTypes={getAllPropertyTypes()}
                  availableServices={getAllServices()}
                />
              </div>
            </aside>

            {/* Results Grid - Right 75% */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by company name, service, or property type..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Results Header with Sort */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {sortedManagers.length} {sortedManagers.length === 1 ? 'Result' : 'Results'}
                  {filteredManagers.length !== allManagers.length && (
                    <span className="text-slate-500 font-normal">
                      {' '}(filtered from {allManagers.length})
                    </span>
                  )}
                </h2>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 whitespace-nowrap">Sort by:</span>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="best-match">Best Match</SelectItem>
                      <SelectItem value="highest-rated">Highest Rated</SelectItem>
                      <SelectItem value="most-reviews">Most Reviews</SelectItem>
                      <SelectItem value="most-experience">Most Experience</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* No Results */}
              {sortedManagers.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">
                    No managers found
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}

              {/* Manager Cards Grid */}
              <div className="grid grid-cols-1 gap-6">
                {sortedManagers.map((manager) => (
                  <ManagerCard key={manager.id} manager={manager} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" spacing="lg">
        <Container>
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold mb-4">
              Don't See What You're Looking For?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Let us help you find the perfect property manager for your specific needs
            </p>
            <Link href="/get-started">
              <button className="px-8 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-lg transition-colors">
                Get Personalized Matches
              </button>
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
