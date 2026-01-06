"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Section } from "@/app/components/layout";
import { Input } from "@/app/components/ui/Input";
import { Search, MapPin, Building2, Users, Star, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface LocationResult {
    state: string;
    stateCode: string;
    city: string;
    count: number;
}

// Popular locations for quick access
const POPULAR_LOCATIONS = [
    { state: "California", stateCode: "CA", city: "Los Angeles", slug: "los-angeles" },
    { state: "California", stateCode: "CA", city: "San Francisco", slug: "san-francisco" },
    { state: "Texas", stateCode: "TX", city: "Austin", slug: "austin" },
    { state: "Texas", stateCode: "TX", city: "Houston", slug: "houston" },
    { state: "Florida", stateCode: "FL", city: "Miami", slug: "miami" },
    { state: "Florida", stateCode: "FL", city: "Orlando", slug: "orlando" },
    { state: "New York", stateCode: "NY", city: "New York City", slug: "new-york-city" },
    { state: "Arizona", stateCode: "AZ", city: "Phoenix", slug: "phoenix" },
    { state: "Colorado", stateCode: "CO", city: "Denver", slug: "denver" },
    { state: "Washington", stateCode: "WA", city: "Seattle", slug: "seattle" },
    { state: "Georgia", stateCode: "GA", city: "Atlanta", slug: "atlanta" },
    { state: "North Carolina", stateCode: "NC", city: "Charlotte", slug: "charlotte" },
];

const FEATURED_STATES = [
    { name: "California", code: "CA", icon: "🏝️", count: "2,500+" },
    { name: "Texas", code: "TX", icon: "⛪", count: "1,800+" },
    { name: "Florida", code: "FL", icon: "🌴", count: "2,100+" },
    { name: "New York", code: "NY", icon: "🗽", count: "1,500+" },
];

export default function PropertyManagersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Search for locations
    useEffect(() => {
        const searchLocations = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                setShowResults(false);
                return;
            }

            setIsSearching(true);
            setShowResults(true);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/property-managers/locations?search=${encodeURIComponent(searchQuery)}`
                );

                if (response.ok) {
                    const result = await response.json();
                    setSearchResults(result.data || []);
                } else {
                    // Fallback: filter popular locations
                    const query = searchQuery.toLowerCase();
                    const filtered = POPULAR_LOCATIONS.filter(
                        loc =>
                            loc.city.toLowerCase().includes(query) ||
                            loc.state.toLowerCase().includes(query) ||
                            loc.stateCode.toLowerCase().includes(query)
                    ).map(loc => ({
                        state: loc.state,
                        stateCode: loc.stateCode,
                        city: loc.city,
                        count: 0,
                    }));
                    setSearchResults(filtered);
                }
            } catch (err) {
                console.error('Search error:', err);
                const query = searchQuery.toLowerCase();
                const filtered = POPULAR_LOCATIONS.filter(
                    loc =>
                        loc.city.toLowerCase().includes(query) ||
                        loc.state.toLowerCase().includes(query) ||
                        loc.stateCode.toLowerCase().includes(query)
                ).map(loc => ({
                    state: loc.state,
                    stateCode: loc.stateCode,
                    city: loc.city,
                    count: 0,
                }));
                setSearchResults(filtered);
            } finally {
                setIsSearching(false);
            }
        };

        const debounce = setTimeout(searchLocations, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    return (
        <main className="bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
                {/* Animated background blurs */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-20 left-20 w-96 h-96 bg-propertifi-blue rounded-full opacity-20 blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-20 w-96 h-96 bg-propertifi-orange rounded-full opacity-20 blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, -50, 0],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <Container>
                    <div className="relative z-10 py-20 md:py-28">
                        <motion.div
                            className="text-center max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Badge */}
                            <motion.span
                                className="inline-flex items-center gap-2 bg-propertifi-orange/20 text-propertifi-orange-light px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-propertifi-orange/30"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Sparkles className="w-4 h-4" />
                                AI-Powered Matching
                            </motion.span>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Find the Best{' '}
                                <span className="bg-gradient-to-r from-propertifi-orange via-propertifi-orange-light to-propertifi-blue bg-clip-text text-transparent">
                                    Property Managers
                                </span>{' '}
                                Near You
                            </h1>

                            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Search thousands of vetted property management companies across the United States.
                                Compare ratings, services, and get matched with the perfect manager for your rental property.
                            </p>

                            {/* Search Box */}
                            <motion.div
                                className="relative max-w-xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Enter a city or state (e.g., Austin, TX)"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 pr-4 py-5 text-lg bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-gray-400 rounded-xl shadow-2xl focus:bg-white/20 focus:border-propertifi-orange/50"
                                    />
                                    {isSearching && (
                                        <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-propertifi-orange animate-spin" />
                                    )}
                                </div>

                                {/* Search Results Dropdown */}
                                {showResults && (searchResults.length > 0 || isSearching) && (
                                    <motion.div
                                        className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden z-50 shadow-2xl"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {isSearching ? (
                                            <div className="p-4 text-center text-gray-400">
                                                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                                                Searching...
                                            </div>
                                        ) : (
                                            <ul className="divide-y divide-white/10">
                                                {searchResults.slice(0, 6).map((result, index) => {
                                                    const citySlug = result.city.toLowerCase().replace(/\s+/g, '-');
                                                    const href = `/property-managers/${result.stateCode.toLowerCase()}/${citySlug}`;
                                                    return (
                                                        <motion.li
                                                            key={index}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                        >
                                                            <Link
                                                                href={href}
                                                                className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between group transition-colors"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-propertifi-orange/20 flex items-center justify-center">
                                                                        <MapPin className="w-4 h-4 text-propertifi-orange" />
                                                                    </div>
                                                                    <span className="font-medium text-white">
                                                                        {result.city}, {result.stateCode}
                                                                    </span>
                                                                </div>
                                                                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-propertifi-orange group-hover:translate-x-1 transition-all" />
                                                            </Link>
                                                        </motion.li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </motion.div>
                                )}

                                {showResults && !isSearching && searchResults.length === 0 && searchQuery.trim() && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 p-4 z-50">
                                        <p className="text-gray-400 text-center">
                                            No locations found for &quot;{searchQuery}&quot;. Try a different city or state.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="relative -mt-8 z-20">
                <Container>
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {[
                            { value: "10,000+", label: "Property Managers" },
                            { value: "50", label: "States Covered" },
                            { value: "4.8★", label: "Average Rating" },
                            { value: "$0", label: "Free to Use" },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                            >
                                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-propertifi-orange to-propertifi-blue bg-clip-text text-transparent mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </Container>
            </section>

            {/* Featured States Section */}
            <section className="py-16 md:py-24">
                <Container>
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block bg-propertifi-blue/10 text-propertifi-blue px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Browse by Location
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Connect with Property Managers{' '}
                            <span className="bg-gradient-to-r from-propertifi-orange to-propertifi-blue bg-clip-text text-transparent">
                                Across USA
                            </span>
                        </h2>
                    </motion.div>

                    {/* Featured State Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {FEATURED_STATES.map((state, index) => (
                            <motion.div
                                key={state.code}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                            >
                                <Link
                                    href={`/property-managers/${state.code.toLowerCase()}`}
                                    className="group block p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 hover:border-propertifi-orange/50 hover:shadow-xl transition-all text-center"
                                >
                                    <motion.div
                                        className="w-16 h-16 bg-gradient-to-br from-propertifi-orange/20 to-propertifi-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                        <Building2 className="w-8 h-8 text-propertifi-orange" />
                                    </motion.div>
                                    <div className="font-bold text-white text-lg mb-1 group-hover:text-propertifi-orange-light transition-colors">
                                        {state.name}
                                    </div>
                                    <div className="text-gray-400 text-sm">{state.count} Managers</div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Browse Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-propertifi-orange" />
                                Find by State
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["CA", "TX", "FL", "NY", "AZ", "CO", "GA", "WA"].map((code) => (
                                    <Link
                                        key={code}
                                        href={`/property-managers/${code.toLowerCase()}`}
                                        className="px-4 py-2 bg-gray-100 hover:bg-propertifi-orange hover:text-white text-gray-700 text-sm font-medium rounded-full transition-all"
                                    >
                                        {code}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-propertifi-blue" />
                                Find by City
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_LOCATIONS.slice(0, 7).map((location) => (
                                    <Link
                                        key={location.slug}
                                        href={`/property-managers/${location.stateCode.toLowerCase()}/${location.slug}`}
                                        className="px-4 py-2 bg-gray-100 hover:bg-propertifi-blue hover:text-white text-gray-700 text-sm font-medium rounded-full transition-all"
                                    >
                                        {location.city}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </Container>
            </section>

            {/* Popular Locations */}
            <section className="py-16 bg-gray-50" id="all-cities">
                <Container>
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Locations</h2>
                        <p className="text-lg text-gray-600">Browse property managers in top markets</p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {POPULAR_LOCATIONS.map((location, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/property-managers/${location.stateCode.toLowerCase()}/${location.slug}`}
                                    className="group block p-4 bg-white rounded-xl border border-gray-200 hover:border-propertifi-orange hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-propertifi-orange/10 to-propertifi-blue/10 rounded-lg flex items-center justify-center group-hover:from-propertifi-orange/20 group-hover:to-propertifi-blue/20 transition-all">
                                            <MapPin className="w-5 h-5 text-propertifi-orange" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 group-hover:text-propertifi-orange transition-colors">
                                                {location.city}
                                            </div>
                                            <div className="text-sm text-gray-500">{location.state}</div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-propertifi-blue rounded-full opacity-20 blur-3xl" />
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-propertifi-orange rounded-full opacity-20 blur-3xl" />
                </div>

                <Container>
                    <div className="relative z-10">
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-block bg-propertifi-orange/20 text-propertifi-orange-light px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                Why Propertifi
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Why Choose{' '}
                                <span className="bg-gradient-to-r from-propertifi-orange to-propertifi-blue bg-clip-text text-transparent">
                                    Us?
                                </span>
                            </h2>
                            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                                We make finding the right property manager simple and stress-free
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: <Building2 className="w-6 h-6" />,
                                    title: "Verified Companies",
                                    description: "Every property manager is vetted with verified BBB ratings, licensing, and customer reviews."
                                },
                                {
                                    icon: <Users className="w-6 h-6" />,
                                    title: "Easy Comparison",
                                    description: "Compare multiple property managers side-by-side to find the best fit for your needs."
                                },
                                {
                                    icon: <Star className="w-6 h-6" />,
                                    title: "Personalized Matches",
                                    description: "Get matched with managers who specialize in your property type and investment goals."
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-propertifi-orange/30 transition-all group"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-propertifi-orange to-propertifi-orange-dark rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-propertifi-orange-light transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24">
                <Container>
                    <motion.div
                        className="text-center bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark rounded-3xl p-10 md:p-16 shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Find Your Perfect Property Manager?
                        </h2>
                        <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
                            Answer a few questions and get matched with top-rated property managers in your area
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/get-started"
                                className="inline-flex items-center gap-3 bg-white text-propertifi-orange font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all text-lg"
                            >
                                <Sparkles className="w-5 h-5" />
                                Get Started Free
                            </Link>
                        </motion.div>
                    </motion.div>
                </Container>
            </section>
        </main>
    );
}
