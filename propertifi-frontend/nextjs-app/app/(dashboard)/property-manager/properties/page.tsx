'use client';

import { useState } from 'react';
import { Building2, MapPin, Users, DollarSign, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: 'residential' | 'multi_family' | 'commercial';
  units: number;
  occupied: number;
  price: number;
  status: 'active' | 'inactive' | 'pending';
}

// Mock data - TODO: Replace with actual API call
const mockProperties: Property[] = [
  {
    id: 1,
    name: 'Sunset Apartments',
    address: '456 Oak Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    type: 'residential',
    units: 50,
    occupied: 47,
    price: 1200,
    status: 'active',
  },
  {
    id: 2,
    name: 'Downtown Lofts',
    address: '123 Main Street',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90015',
    type: 'multi_family',
    units: 100,
    occupied: 95,
    price: 1800,
    status: 'active',
  },
  {
    id: 3,
    name: 'Maple Grove Complex',
    address: '789 Pine Boulevard',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    type: 'residential',
    units: 25,
    occupied: 20,
    price: 2200,
    status: 'active',
  },
  {
    id: 4,
    name: 'Harbor View Towers',
    address: '321 Beach Avenue',
    city: 'Miami',
    state: 'FL',
    zip: '33139',
    type: 'multi_family',
    units: 75,
    occupied: 68,
    price: 1600,
    status: 'active',
  },
];

export default function PropertiesPage() {
  const [properties] = useState<Property[]>(mockProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProperties = properties.filter((property) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        property.name.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (typeFilter !== 'all' && property.type !== typeFilter) {
      return false;
    }

    if (statusFilter !== 'all' && property.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalStats = {
    total: properties.length,
    totalUnits: properties.reduce((sum, p) => sum + p.units, 0),
    totalOccupied: properties.reduce((sum, p) => sum + p.occupied, 0),
    avgOccupancy: Math.round(
      (properties.reduce((sum, p) => sum + p.occupied, 0) /
        properties.reduce((sum, p) => sum + p.units, 0)) *
        100
    ),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your property portfolio
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalUnits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Occupied Units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalOccupied}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Occupancy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getOccupancyColor(totalStats.avgOccupancy)}`}>
              {totalStats.avgOccupancy}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search properties by name, city, address..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="multi_family">Multi Family</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredProperties.length} of {properties.length} properties
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => {
          const occupancyRate = Math.round((property.occupied / property.units) * 100);

          return (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {property.city}, {property.state}
                      </div>
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Property
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  {property.address}<br />
                  {property.city}, {property.state} {property.zip}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Units</div>
                      <div className="text-sm font-semibold">{property.units}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Occupied</div>
                      <div className={`text-sm font-semibold ${getOccupancyColor(occupancyRate)}`}>
                        {property.occupied} ({occupancyRate}%)
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Occupancy</span>
                    <span className="text-xs font-medium">{occupancyRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        occupancyRate >= 90
                          ? 'bg-green-500'
                          : occupancyRate >= 70
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Avg Rent</div>
                    <div className="text-lg font-bold text-indigo-600">
                      ${property.price.toLocaleString()}/mo
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <Badge className={getStatusColor(property.status)}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </Badge>
                <span className="text-xs text-gray-500 capitalize">
                  {property.type.replace('_', ' ')}
                </span>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No properties found matching your filters.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
              setStatusFilter('all');
            }}
            className="mt-2"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
