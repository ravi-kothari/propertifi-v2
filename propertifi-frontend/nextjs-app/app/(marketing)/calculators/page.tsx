'use client';

import React from 'react';
import Link from 'next/link';

interface Calculator {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  badge?: string;
  status: 'live' | 'coming-soon';
}

const calculators: Record<string, Calculator[]> = {
  'Investment & Deal Analysis': [
    {
      id: 'roi',
      name: 'Advanced ROI Calculator',
      description: 'Calculate cash flow, cap rate, IRR, and multi-year projections for rental properties.',
      icon: '📊',
      href: '/calculators/roi',
      badge: 'Most Popular',
      status: 'live',
    },
    {
      id: 'brrrr',
      name: 'BRRRR Method Calculator',
      description: 'Model the Buy, Rehab, Rent, Refinance, Repeat strategy and equity extraction.',
      icon: '🔄',
      href: '/calculators/brrrr',
      status: 'live',
    },
    {
      id: 'buy-vs-rent',
      name: 'Buy vs. Rent Calculator',
      description: 'Compare the financial impact of buying versus renting over time.',
      icon: '⚖️',
      href: '/calculators/buy-vs-rent',
      status: 'live',
    },
    {
      id: 'house-hacking',
      name: 'House Hacking Calculator',
      description: 'Analyze living in one unit while renting out others to reduce housing costs.',
      icon: '🏘️',
      href: '/calculators/house-hacking',
      status: 'live',
    },
    {
      id: '1031-exchange',
      name: '1031 Exchange Calculator',
      description: 'Calculate tax deferral benefits and timeline for like-kind exchanges.',
      icon: '🔁',
      href: '/calculators/1031-exchange',
      status: 'live',
    },
    {
      id: 'str',
      name: 'Airbnb / STR Calculator',
      description: 'Compare short-term rental income versus traditional long-term rentals.',
      icon: '🏖️',
      href: '/calculators/short-term-rental',
      status: 'live',
    },
  ],
  'Financial Planning': [
    {
      id: 'mortgage',
      name: 'Mortgage Calculator (PITI)',
      description: 'Calculate monthly payments including principal, interest, taxes, and insurance.',
      icon: '🏦',
      href: '/calculators/mortgage',
      status: 'live',
    },
    {
      id: 'depreciation',
      name: 'Depreciation Calculator',
      description: 'Calculate annual tax depreciation deductions for rental properties.',
      icon: '📉',
      href: '/calculators/depreciation',
      status: 'live',
    },
  ],
  'Rental & Property Management': [
    {
      id: 'rent-estimate',
      name: 'Rent Estimate Calculator',
      description: 'Get data-driven market rental rates based on location, size, and features.',
      icon: '💰',
      href: '/calculators/rent-estimate',
      badge: 'High Demand',
      status: 'live',
    },
    {
      id: 'pm-fee',
      name: 'Property Management Fee Calculator',
      description: 'Estimate the cost of professional property management for your property.',
      icon: '🤝',
      href: '/calculators/property-management-fee',
      badge: 'New',
      status: 'live',
    },
    {
      id: 'rehab',
      name: 'Rehab Cost Estimator',
      description: 'Estimate renovation costs from cosmetic updates to full gut rehabs.',
      icon: '🔨',
      href: '/calculators/rehab-cost',
      badge: 'New',
      status: 'live',
    },
    {
      id: 'security-deposit',
      name: 'Security Deposit Calculator',
      description: 'Calculate lawful deductions from tenant security deposits.',
      icon: '🔒',
      href: '/calculators/security-deposit',
      status: 'coming-soon',
    },
    {
      id: 'lease-buyout',
      name: 'Lease Buyout Calculator',
      description: 'Determine fair pricing for early lease termination.',
      icon: '📝',
      href: '/calculators/lease-buyout',
      status: 'coming-soon',
    },
  ],
};

export default function CalculatorHub() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Real Estate Calculator Hub
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Free, powerful tools to help you analyze deals, manage properties, and grow your portfolio.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.entries(calculators).map(([category, tools]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((calc) => (
                <CalculatorCard key={calc.id} calculator={calc} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 border-t border-blue-100 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want to save your calculations?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Create a free Propertifi account to save your analyses, track multiple properties, and connect with top property managers in your area.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}

function CalculatorCard({ calculator }: { calculator: Calculator }) {
  const isLive = calculator.status === 'live';

  const cardContent = (
    <div
      className={`group relative bg-white rounded-lg shadow-sm border-2 transition-all duration-200 h-full ${
        isLive
          ? 'border-gray-200 hover:border-blue-500 hover:shadow-md cursor-pointer'
          : 'border-gray-100 opacity-75 cursor-not-allowed'
      }`}
    >
      {/* Badge */}
      {calculator.badge && (
        <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {calculator.badge}
        </div>
      )}

      {/* Coming Soon Badge */}
      {!isLive && (
        <div className="absolute -top-3 -right-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          Coming Soon
        </div>
      )}

      <div className="p-6">
        {/* Icon */}
        <div className="text-4xl mb-4">{calculator.icon}</div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {calculator.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {calculator.description}
        </p>

        {/* CTA */}
        {isLive ? (
          <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
            Calculate Now
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
        ) : (
          <div className="text-gray-400 text-sm font-medium">
            Notify me when available
          </div>
        )}
      </div>
    </div>
  );

  if (isLive) {
    return <Link href={calculator.href}>{cardContent}</Link>;
  }

  return cardContent;
}
