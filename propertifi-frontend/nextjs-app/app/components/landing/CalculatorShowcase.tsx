'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const featuredCalculators = [
    {
        id: 'roi',
        name: 'ROI Calculator',
        description: 'Calculate cash flow, cap rate, and multi-year projections for rental properties.',
        icon: '📊',
        href: '/calculators/roi',
        color: 'from-blue-500 to-blue-600',
    },
    {
        id: 'mortgage',
        name: 'Mortgage Calculator',
        description: 'Calculate monthly payments including principal, interest, taxes, and insurance.',
        icon: '🏦',
        href: '/calculators/mortgage',
        color: 'from-green-500 to-green-600',
    },
    {
        id: 'rent-estimate',
        name: 'Rent Estimate',
        description: 'Get data-driven market rental rates based on location, size, and features.',
        icon: '💰',
        href: '/calculators/rent-estimate',
        color: 'from-orange-500 to-orange-600',
    },
];

const CalculatorShowcase: React.FC = () => {
    return (
        <section id="calculators" className="py-20 bg-gradient-to-br from-propertifi-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-4 py-1 text-sm font-semibold text-propertifi-blue-dark bg-propertifi-blue-light rounded-full mb-4">
                        Free Tools
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-propertifi-gray-900 mb-4">
                        Powerful Real Estate Calculators
                    </h2>
                    <p className="text-lg text-propertifi-gray-600 max-w-2xl mx-auto">
                        Make smarter investment decisions with our suite of professional-grade calculators.
                        Analyze deals, estimate costs, and project returns — all for free.
                    </p>
                </motion.div>

                {/* Calculator Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {featuredCalculators.map((calc, index) => (
                        <motion.div
                            key={calc.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link href={calc.href}>
                                <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full border border-gray-100">
                                    {/* Gradient Top Bar */}
                                    <div className={`h-2 bg-gradient-to-r ${calc.color}`} />

                                    <div className="p-6">
                                        {/* Icon */}
                                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            {calc.icon}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-propertifi-gray-900 mb-2 group-hover:text-propertifi-blue-dark transition-colors">
                                            {calc.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-propertifi-gray-600 text-sm mb-4">
                                            {calc.description}
                                        </p>

                                        {/* CTA */}
                                        <div className="flex items-center text-propertifi-blue-dark font-semibold text-sm group-hover:text-propertifi-orange transition-colors">
                                            Try Calculator
                                            <svg
                                                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View All + Save CTA */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/calculators"
                            className="inline-flex items-center px-8 py-3 bg-propertifi-blue-dark hover:bg-propertifi-blue text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            View All 14 Calculators
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>

                        <Link
                            href="/register"
                            className="inline-flex items-center px-8 py-3 bg-white border-2 border-propertifi-gray-300 hover:border-propertifi-orange text-propertifi-gray-700 hover:text-propertifi-orange font-bold rounded-full transition-all duration-300"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                            </svg>
                            Save Your Calculations
                        </Link>
                    </div>

                    <p className="text-sm text-propertifi-gray-500 mt-4">
                        Create a free account to save and compare your analyses
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default CalculatorShowcase;
