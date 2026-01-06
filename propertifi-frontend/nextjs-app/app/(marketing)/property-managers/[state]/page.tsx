"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/app/components/layout";
import { ChevronRight, Home, MapPin, Loader2, Building2, Sparkles, Users } from "lucide-react";
import Link from "next/link";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// State names mapping
const STATE_NAMES: Record<string, string> = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
    CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
    HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
    KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
    MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
    MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
    NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
    OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
    SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
    VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
    DC: "District of Columbia"
};

interface CityData {
    city: string;
    slug: string;
    count: number;
}

export default function StatePropertyManagersPage() {
    const params = useParams();
    const stateCode = (params.state as string).toUpperCase();
    const stateName = STATE_NAMES[stateCode] || stateCode;

    const [cities, setCities] = useState<CityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalManagers, setTotalManagers] = useState(0);

    useEffect(() => {
        const fetchCities = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/property-managers/${stateCode.toLowerCase()}/cities`
                );

                if (response.ok) {
                    const result = await response.json();
                    setCities(result.data || []);
                    setTotalManagers(result.total || result.data?.reduce((acc: number, c: CityData) => acc + c.count, 0) || 0);
                } else {
                    // Fallback: show empty state
                    setCities([]);
                }
            } catch (err) {
                console.error('API fetch error:', err);
                setCities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, [stateCode]);

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
                                {stateName}
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
                                    {loading ? '...' : `${totalManagers} Companies`}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                Property Managers in{' '}
                                <span className="bg-gradient-to-r from-propertifi-orange to-propertifi-blue bg-clip-text text-transparent">
                                    {stateName}
                                </span>
                            </h1>

                            <p className="text-lg text-gray-300 leading-relaxed">
                                Browse property management companies across {stateName}. Select a city to view local managers and compare services.
                            </p>
                        </motion.div>
                    </div>
                </Container>
            </section>

            {/* Stats Card */}
            <section className="relative -mt-6 z-20">
                <Container>
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-propertifi-orange to-propertifi-blue bg-clip-text text-transparent">
                                    {loading ? '...' : totalManagers}
                                </div>
                                <div className="text-gray-600 text-sm">Total Managers</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-propertifi-orange to-propertifi-blue bg-clip-text text-transparent">
                                    {loading ? '...' : cities.length}
                                </div>
                                <div className="text-gray-600 text-sm">Cities Covered</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-propertifi-orange to-propertifi-blue bg-clip-text text-transparent">
                                    4.8★
                                </div>
                                <div className="text-gray-600 text-sm">Avg Rating</div>
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* Cities Grid */}
            <section className="py-12">
                <Container>
                    <motion.div
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Browse by City
                        </h2>
                        <p className="text-gray-600">
                            Select a city to view property managers
                        </p>
                    </motion.div>

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
                            <p className="text-gray-600">Loading cities...</p>
                        </motion.div>
                    )}

                    {/* No Cities */}
                    {!loading && cities.length === 0 && (
                        <motion.div
                            className="text-center py-16 bg-gray-50 rounded-2xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No cities found</h3>
                            <p className="text-gray-600 mb-6">
                                We don&apos;t have property managers listed in {stateName} yet.
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

                    {/* Cities Grid */}
                    {!loading && cities.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {cities.map((city, index) => (
                                <motion.div
                                    key={city.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <Link
                                        href={`/property-managers/${stateCode.toLowerCase()}/${city.slug}`}
                                        className="group block p-4 bg-white rounded-xl border border-gray-200 hover:border-propertifi-orange hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-propertifi-orange/10 to-propertifi-blue/10 rounded-lg flex items-center justify-center group-hover:from-propertifi-orange/20 group-hover:to-propertifi-blue/20 transition-all">
                                                <MapPin className="w-5 h-5 text-propertifi-orange" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-gray-900 group-hover:text-propertifi-orange transition-colors truncate">
                                                    {city.city}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {city.count} {city.count === 1 ? 'manager' : 'managers'}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
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
                            Can&apos;t Find Your City?
                        </h2>
                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                            Let us help you find the perfect property manager for your specific location and needs
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
