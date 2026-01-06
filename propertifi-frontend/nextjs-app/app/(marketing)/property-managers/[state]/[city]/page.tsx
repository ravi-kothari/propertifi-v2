"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Section } from "@/app/components/layout";
import { ManagerCardApi, ApiPropertyManager } from "@/app/components/ManagerCardApi";
import { Input } from "@/app/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Home, Search, Loader2, MapPin, Sparkles, Building2 } from "lucide-react";
import Link from "next/link";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

type SortOption = "best-match" | "name-asc" | "name-desc";

export default function PropertyManagerListingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const stateCode = (params.state as string).toUpperCase();
  const citySlug = params.city as string;
  const city = citySlug.replace(/-/g, ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // State
  const [managers, setManagers] = useState<ApiPropertyManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "best-match"
  );

  // Fetch managers from API
  useEffect(() => {
    const fetchManagers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/property-managers/${stateCode.toLowerCase()}/${citySlug}`
        );

        if (response.ok) {
          const result = await response.json();
          setManagers(result.data || []);
        } else {
          throw new Error('Failed to fetch managers');
        }
      } catch (err) {
        console.error('API fetch error:', err);
        setError('Unable to load property managers. Please try again.');
        setManagers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [stateCode, citySlug]);

  // Update URL when search or sort changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy !== "best-match") params.set("sort", sortBy);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [searchQuery, sortBy, router]);

  // Filter managers based on search
  const filteredManagers = useMemo(() => {
    if (!searchQuery) return managers;

    const query = searchQuery.toLowerCase();
    return managers.filter((manager) => {
      return (
        manager.name.toLowerCase().includes(query) ||
        manager.description?.toLowerCase().includes(query) ||
        manager.service_types?.toLowerCase().includes(query)
      );
    });
  }, [managers, searchQuery]);

  // Sort managers
  const sortedManagers = useMemo(() => {
    const sorted = [...filteredManagers];

    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "best-match":
      default:
        return sorted.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          const ratingOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'N/A'];
          const aIdx = ratingOrder.indexOf(a.bbb_rating) !== -1 ? ratingOrder.indexOf(a.bbb_rating) : 99;
          const bIdx = ratingOrder.indexOf(b.bbb_rating) !== -1 ? ratingOrder.indexOf(b.bbb_rating) : 99;
          if (aIdx !== bIdx) return aIdx - bIdx;
          return a.name.localeCompare(b.name);
        });
    }
  }, [filteredManagers, sortBy]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  return (
    <main className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 w-64 h-64 bg-propertifi-blue rounded-full opacity-20 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-80 h-80 bg-propertifi-orange rounded-full opacity-20 blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <Container>
          <div className="relative z-10 py-12 md:py-16">
            {/* Breadcrumbs */}
            <motion.nav
              className="flex items-center gap-2 text-sm mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href="/" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <Link href="/property-managers" className="text-gray-400 hover:text-white transition-colors">
                Property Managers
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className="text-propertifi-orange-light font-medium">
                {city}, {stateCode}
              </span>
            </motion.nav>

            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-propertifi-orange to-propertifi-orange-dark rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="text-propertifi-orange-light text-sm font-semibold bg-propertifi-orange/20 px-3 py-1 rounded-full">
                  {loading ? '...' : `${managers.length} Companies`}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Property Managers in{' '}
                <span className="bg-gradient-to-r from-propertifi-orange to-propertifi-blue bg-clip-text text-transparent">
                  {city}, {stateCode}
                </span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed">
                Find and compare top-rated property management companies serving {city}. Compare pricing, BBB ratings, and get matched with the perfect manager for your rental property.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Search and Filters */}
      <section className="relative -mt-6 z-20">
        <Container>
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by company name or service type..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-12 py-3 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px] bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best-match">Best Match</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading results...
                  </span>
                ) : (
                  <>
                    Showing <span className="font-semibold text-gray-900">{sortedManagers.length}</span> {sortedManagers.length === 1 ? 'result' : 'results'}
                    {searchQuery && filteredManagers.length !== managers.length && (
                      <span className="text-gray-500"> (filtered from {managers.length})</span>
                    )}
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Results */}
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Loading State */}
            {loading && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-propertifi-orange/20 to-propertifi-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 animate-spin text-propertifi-orange" />
                </div>
                <p className="text-gray-600">Loading property managers...</p>
              </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                className="text-center py-16 bg-red-50 rounded-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load</h3>
                <p className="text-gray-600 mb-6">{error}</p>
              </motion.div>
            )}

            {/* No Results */}
            {!loading && !error && sortedManagers.length === 0 && (
              <motion.div
                className="text-center py-16 bg-gray-50 rounded-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No managers found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? 'Try a different search term' : `No property managers found in ${city}, ${stateCode}`}
                </p>
                <Link
                  href="/get-started"
                  className="inline-flex items-center gap-2 bg-propertifi-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-propertifi-orange-dark transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Personalized Matches
                </Link>
              </motion.div>
            )}

            {/* Manager Cards */}
            {!loading && !error && (
              <div className="grid grid-cols-1 gap-6">
                {sortedManagers.map((manager, index) => (
                  <ManagerCardApi key={manager.id} manager={manager} index={index} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-propertifi-orange rounded-full opacity-20 blur-3xl" />
        </div>

        <Container>
          <motion.div
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Don&apos;t See What You&apos;re Looking For?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Let us help you find the perfect property manager for your specific needs
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/get-started"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all text-lg"
              >
                <Sparkles className="w-5 h-5" />
                Get Personalized Matches
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}
