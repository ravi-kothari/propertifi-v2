'use client';

import { useState, useEffect } from 'react';
import { Users, Star, MapPin, Phone, Mail } from 'lucide-react';

interface PropertyManager {
  id: number;
  name: string;
  company: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  propertiesManaged: number;
  specialties: string[];
}

export default function OwnerManagersPage() {
  const [managers, setManagers] = useState<PropertyManager[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching property managers
    setTimeout(() => {
      setManagers([
        {
          id: 1,
          name: 'John Smith',
          company: 'Bay Area Property Management',
          city: 'San Francisco',
          state: 'CA',
          rating: 4.8,
          reviewCount: 45,
          phone: '(415) 555-0123',
          email: 'john@bayareapm.com',
          propertiesManaged: 125,
          specialties: ['Residential', 'Single Family'],
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          company: 'Premier Properties SF',
          city: 'San Francisco',
          state: 'CA',
          rating: 4.9,
          reviewCount: 62,
          phone: '(415) 555-0456',
          email: 'sarah@premierpropsf.com',
          propertiesManaged: 87,
          specialties: ['Condos', 'Luxury'],
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Property Managers
          </h1>
          <p className="text-gray-600 mt-1">
            Find and connect with property managers
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Search Managers
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {managers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
                <Users className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No property managers yet
              </h3>
              <p className="text-gray-500 mb-4">
                Search for property managers in your area
              </p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Search Managers
              </button>
            </div>
          ) : (
            managers.map((manager) => (
              <div
                key={manager.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {manager.name}
                        </h3>
                        <p className="text-indigo-600 font-medium">
                          {manager.company}
                        </p>
                        <div className="flex items-center text-gray-600 mt-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            {manager.city}, {manager.state}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm font-semibold">
                              {manager.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            ({manager.reviewCount} reviews)
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {manager.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {manager.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {manager.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:text-right space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {manager.propertiesManaged}
                      </div>
                      <div className="text-sm text-gray-600">
                        Properties Managed
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Contact Manager
                      </button>
                      <button className="w-full px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
