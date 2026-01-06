'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// States with their cities
const STATES_WITH_CITIES = [
    {
        name: "California",
        code: "CA",
        cities: [
            { name: "Los Angeles", slug: "los-angeles" },
            { name: "San Francisco", slug: "san-francisco" },
            { name: "San Diego", slug: "san-diego" },
            { name: "Sacramento", slug: "sacramento" },
            { name: "San Jose", slug: "san-jose" },
            { name: "Oakland", slug: "oakland" },
        ]
    },
    {
        name: "Texas",
        code: "TX",
        cities: [
            { name: "Austin", slug: "austin" },
            { name: "Houston", slug: "houston" },
            { name: "Dallas", slug: "dallas" },
            { name: "San Antonio", slug: "san-antonio" },
            { name: "Fort Worth", slug: "fort-worth" },
            { name: "El Paso", slug: "el-paso" },
        ]
    },
    {
        name: "Florida",
        code: "FL",
        cities: [
            { name: "Miami", slug: "miami" },
            { name: "Orlando", slug: "orlando" },
            { name: "Tampa", slug: "tampa" },
            { name: "Jacksonville", slug: "jacksonville" },
            { name: "Fort Lauderdale", slug: "fort-lauderdale" },
            { name: "Naples", slug: "naples" },
        ]
    },
    {
        name: "New York",
        code: "NY",
        cities: [
            { name: "New York City", slug: "new-york-city" },
            { name: "Buffalo", slug: "buffalo" },
            { name: "Rochester", slug: "rochester" },
            { name: "Albany", slug: "albany" },
            { name: "Syracuse", slug: "syracuse" },
        ]
    },
    {
        name: "Arizona",
        code: "AZ",
        cities: [
            { name: "Phoenix", slug: "phoenix" },
            { name: "Tucson", slug: "tucson" },
            { name: "Scottsdale", slug: "scottsdale" },
            { name: "Mesa", slug: "mesa" },
            { name: "Chandler", slug: "chandler" },
        ]
    },
    {
        name: "Colorado",
        code: "CO",
        cities: [
            { name: "Denver", slug: "denver" },
            { name: "Colorado Springs", slug: "colorado-springs" },
            { name: "Boulder", slug: "boulder" },
            { name: "Aurora", slug: "aurora" },
            { name: "Fort Collins", slug: "fort-collins" },
        ]
    },
    {
        name: "Georgia",
        code: "GA",
        cities: [
            { name: "Atlanta", slug: "atlanta" },
            { name: "Savannah", slug: "savannah" },
            { name: "Augusta", slug: "augusta" },
            { name: "Columbus", slug: "columbus" },
            { name: "Macon", slug: "macon" },
        ]
    },
    {
        name: "Washington",
        code: "WA",
        cities: [
            { name: "Seattle", slug: "seattle" },
            { name: "Tacoma", slug: "tacoma" },
            { name: "Spokane", slug: "spokane" },
            { name: "Bellevue", slug: "bellevue" },
            { name: "Vancouver", slug: "vancouver" },
        ]
    },
];

export default function BrowseByLocation() {
    const [selectedState, setSelectedState] = useState<string>("CA");

    const selectedStateData = STATES_WITH_CITIES.find(s => s.code === selectedState);
    const cities = selectedStateData?.cities || [];

    return (
        <section className="section-padding bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-propertifi-orange rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-propertifi-blue rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span
                        className="inline-block bg-propertifi-blue/10 text-propertifi-blue px-4 py-2 rounded-full text-sm font-semibold mb-4"
                        whileHover={{ scale: 1.05 }}
                    >
                        Browse Locations
                    </motion.span>

                    <h2 className="heading-2 mb-4">
                        Connect with Property Managers{' '}
                        <span className="text-gradient">Across USA</span>
                    </h2>

                    <p className="text-lg md:text-xl text-propertifi-gray-500 max-w-3xl mx-auto leading-relaxed">
                        Find trusted property management professionals in your area
                    </p>
                </motion.div>

                {/* Featured State Cards */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {STATES_WITH_CITIES.slice(0, 4).map((state, index) => (
                        <motion.div
                            key={state.code}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <Link
                                href={`/property-managers/${state.code.toLowerCase()}`}
                                className="group block p-6 bg-white rounded-2xl border border-gray-100 hover:border-propertifi-blue/30 hover:shadow-xl transition-all text-center"
                            >
                                <motion.div
                                    className="w-16 h-16 bg-gradient-to-br from-propertifi-blue-light to-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg border border-propertifi-blue/10"
                                    whileHover={{ scale: 1.05, rotate: -5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-propertifi-blue-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </motion.div>
                                <div className="w-8 h-8 bg-propertifi-orange/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-propertifi-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="font-bold text-propertifi-gray-900 group-hover:text-propertifi-blue transition-colors">
                                    {state.name}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Browse by State and City Cards */}
                <motion.div
                    className="grid md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    {/* Find by State */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <h3 className="text-xl font-bold text-propertifi-gray-900 mb-4">
                            Find Property Managers by State
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {STATES_WITH_CITIES.map((state) => (
                                <motion.button
                                    key={state.code}
                                    onClick={() => setSelectedState(state.code)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${selectedState === state.code
                                            ? 'bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark text-white shadow-md'
                                            : 'bg-gray-100 hover:bg-propertifi-blue-light text-propertifi-gray-700 hover:text-propertifi-blue-dark'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {state.code}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Find by City - Filtered by selected state */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <h3 className="text-xl font-bold text-propertifi-gray-900 mb-4">
                            Find Property Managers by City
                            {selectedStateData && (
                                <span className="text-propertifi-orange ml-1">
                                    in {selectedStateData.name}
                                </span>
                            )}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {cities.map((city, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={`/property-managers/${selectedState.toLowerCase()}/${city.slug}`}
                                        className="inline-block px-4 py-2 bg-gray-100 hover:bg-propertifi-orange/10 text-propertifi-gray-700 hover:text-propertifi-orange-dark text-sm font-medium rounded-full transition-all hover:shadow-sm"
                                    >
                                        {city.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <Link
                            href="/property-managers"
                            className="inline-flex items-center gap-2 text-sm text-propertifi-blue font-semibold hover:text-propertifi-blue-dark transition-colors"
                        >
                            View All Cities
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
