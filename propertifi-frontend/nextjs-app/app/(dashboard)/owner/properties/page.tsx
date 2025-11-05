'use client';

import { useState, useEffect } from 'react';
import { Building2, MapPin, DollarSign } from 'lucide-react';

interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  type: string;
  value: number;
  status: 'active' | 'pending' | 'inactive';
}

export default function OwnerPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching properties
    setTimeout(() => {
      setProperties([
        {
          id: 1,
          address: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          type: 'Single Family Home',
          value: 850000,
          status: 'active',
        },
        {
          id: 2,
          address: '456 Oak Avenue',
          city: 'San Francisco',
          state: 'CA',
          type: 'Condo',
          value: 625000,
          status: 'active',
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">My Properties</h1>
          <p className="text-gray-600 mt-1">Manage your investment properties</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Add Property
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {properties.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
                <Building2 className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No properties yet
              </h3>
              <p className="text-gray-500 mb-4">
                Add your first property to get started
              </p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Add Property
              </button>
            </div>
          ) : (
            properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {property.address}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            {property.city}, {property.state}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            {property.type}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              property.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : property.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {property.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-lg font-semibold text-gray-900">
                        {formatCurrency(property.value)}
                      </span>
                    </div>
                    <button className="mt-4 px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                      View Details
                    </button>
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
