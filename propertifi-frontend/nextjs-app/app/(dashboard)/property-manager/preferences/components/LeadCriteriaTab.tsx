'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Loader2,
  MapPin,
  Home,
  Building,
  Factory,
  Plus,
  X,
  Search,
  Sparkles,
  Check
} from 'lucide-react';
import type { PreferencesData, ServiceArea } from '../page';

// Simple checkbox replacement to avoid Radix UI infinite loop bug
function SimpleCheckbox({ checked }: { checked: boolean }) {
  return (
    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
      ${checked ? 'bg-propertifi-orange border-propertifi-orange' : 'border-gray-300 bg-white'}`}>
      {checked && <Check className="h-3 w-3 text-white" />}
    </div>
  );
}

const PROPERTY_TYPES = [
  { id: 'residential_sfh', label: 'Single Family Homes', description: 'Houses, townhomes', category: 'Residential' },
  { id: 'residential_multifamily', label: 'Multi-Family', description: 'Duplexes, apartments, condos', category: 'Residential' },
  { id: 'short_term_rentals', label: 'Short-Term Rentals', description: 'Airbnb, VRBO, vacation rentals', category: 'Residential' },
  { id: 'commercial', label: 'Commercial', description: 'Office, retail, shopping centers', category: 'Commercial' },
  { id: 'industrial', label: 'Industrial', description: 'Warehouses, manufacturing', category: 'Commercial' },
  { id: 'mixed_use', label: 'Mixed Use', description: 'Combined residential & commercial', category: 'Commercial' },
  { id: 'hoa', label: 'HOA Management', description: 'Homeowners associations', category: 'Associations' },
  { id: 'coa', label: 'COA Management', description: 'Condo/community associations', category: 'Associations' },
];

const HOA_COA_SERVICES = [
  { id: 'full_service', label: 'Full-Service Management' },
  { id: 'accounting_only', label: 'Accounting & Financial Only' },
  { id: 'maintenance_only', label: 'Maintenance Coordination Only' },
  { id: 'admin_only', label: 'Administrative Support Only' },
  { id: 'collections', label: 'Collections & Dues Management' },
  { id: 'board_support', label: 'Board Meeting & Governance Support' },
];

const POPULAR_AREAS = [
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
  { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611 },
  { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
  { name: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
  { name: 'Miami, FL', lat: 25.7617, lng: -80.1918 },
  { name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740 },
  { name: 'Denver, CO', lat: 39.7392, lng: -104.9903 },
];

const US_CITIES = [
  { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
  { name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740 },
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
  { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611 },
  { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
  { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
  { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321 },
  { name: 'Denver, CO', lat: 39.7392, lng: -104.9903 },
  { name: 'Boston, MA', lat: 42.3601, lng: -71.0589 },
  { name: 'Atlanta, GA', lat: 33.7490, lng: -84.3880 },
  { name: 'Miami, FL', lat: 25.7617, lng: -80.1918 },
  { name: 'Orlando, FL', lat: 28.5383, lng: -81.3792 },
  { name: 'Tampa, FL', lat: 27.9506, lng: -82.4572 },
  { name: 'Portland, OR', lat: 45.5152, lng: -122.6784 },
  { name: 'Las Vegas, NV', lat: 36.1699, lng: -115.1398 },
  { name: 'Sacramento, CA', lat: 38.5816, lng: -121.4944 },
  { name: 'Oakland, CA', lat: 37.8044, lng: -122.2712 },
];

function migrateToServiceAreas(data?: PreferencesData['leadCriteria']): ServiceArea[] {
  if (!data) return [];
  if (data.service_areas && data.service_areas.length > 0) return data.service_areas;
  if (data.latitude && data.longitude) {
    return [{
      id: 'legacy-' + Date.now(),
      name: 'Primary Service Area',
      latitude: data.latitude,
      longitude: data.longitude,
      radius_miles: data.service_radius_miles || 25,
    }];
  }
  return [];
}

interface LeadCriteriaTabProps {
  data?: PreferencesData;
  onSave: (data: Partial<PreferencesData>) => void;
  isSaving: boolean;
}

export default function LeadCriteriaTab({ data, onSave, isSaving }: LeadCriteriaTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState(25);
  const searchRef = useRef<HTMLDivElement>(null);

  const [propertyTypes, setPropertyTypes] = useState<string[]>(data?.leadCriteria?.property_types || []);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(migrateToServiceAreas(data?.leadCriteria));
  const [minUnits, setMinUnits] = useState<number | null>(data?.leadCriteria?.min_units || null);
  const [maxUnits, setMaxUnits] = useState<number | null>(data?.leadCriteria?.max_units || null);
  const [isDirty, setIsDirty] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = US_CITIES.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !serviceAreas.some(area => area.name === city.name)
  ).slice(0, 8);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (propertyTypes.length === 0) {
      setValidationError('Please select at least one property type');
      return;
    }
    if (serviceAreas.length === 0) {
      setValidationError('Please add at least one service area');
      return;
    }
    setValidationError(null);
    onSave({
      leadCriteria: {
        property_types: propertyTypes,
        service_areas: serviceAreas,
        min_units: minUnits,
        max_units: maxUnits,
      }
    });
    setIsDirty(false);
  };

  const togglePropertyType = (typeId: string) => {
    setPropertyTypes(prev =>
      prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
    );
    setIsDirty(true);
  };

  const addServiceArea = (city: { name: string; lat: number; lng: number }) => {
    setServiceAreas(prev => [...prev, {
      id: 'area-' + Date.now(),
      name: city.name,
      latitude: city.lat,
      longitude: city.lng,
      radius_miles: selectedRadius,
    }]);
    setSearchQuery('');
    setShowSuggestions(false);
    setIsDirty(true);
  };

  const removeServiceArea = (areaId: string) => {
    setServiceAreas(prev => prev.filter(a => a.id !== areaId));
    setIsDirty(true);
  };

  const showHoaCoa = propertyTypes.includes('hoa') || propertyTypes.includes('coa');

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {validationError}
        </div>
      )}

      {/* Property Types */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">Property Types *</Label>
          <p className="text-sm text-gray-600">Select the types of properties you want to receive leads for</p>
        </div>

        {/* Residential */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Home className="h-4 w-4 text-propertifi-orange" /> Residential
          </h4>
          <div className="grid gap-2 md:grid-cols-3">
            {PROPERTY_TYPES.filter(t => t.category === 'Residential').map((type) => (
              <div
                key={type.id}
                onClick={() => togglePropertyType(type.id)}
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all
                  ${propertyTypes.includes(type.id) ? 'border-propertifi-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                <SimpleCheckbox checked={propertyTypes.includes(type.id)} />
                <div>
                  <span className="font-medium text-sm">{type.label}</span>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Building className="h-4 w-4 text-propertifi-blue" /> Commercial
          </h4>
          <div className="grid gap-2 md:grid-cols-3">
            {PROPERTY_TYPES.filter(t => t.category === 'Commercial').map((type) => (
              <div
                key={type.id}
                onClick={() => togglePropertyType(type.id)}
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all
                  ${propertyTypes.includes(type.id) ? 'border-propertifi-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                <SimpleCheckbox checked={propertyTypes.includes(type.id)} />
                <div>
                  <span className="font-medium text-sm">{type.label}</span>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Associations */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Building className="h-4 w-4 text-purple-600" /> Association Management (HOA/COA)
          </h4>
          <div className="grid gap-2 md:grid-cols-2">
            {PROPERTY_TYPES.filter(t => t.category === 'Associations').map((type) => (
              <div
                key={type.id}
                onClick={() => togglePropertyType(type.id)}
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all
                  ${propertyTypes.includes(type.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                <SimpleCheckbox checked={propertyTypes.includes(type.id)} />
                <div>
                  <span className="font-medium text-sm">{type.label}</span>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </div>
              </div>
            ))}
          </div>

          {showHoaCoa && (
            <Card className="mt-3 border-purple-200 bg-purple-50/50">
              <CardContent className="p-4">
                <Label className="text-sm font-medium text-purple-800 mb-3 block">
                  Which HOA/COA services do you offer?
                </Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {HOA_COA_SERVICES.map((service) => {
                    const serviceId = `hoa_service_${service.id}`;
                    return (
                      <div
                        key={service.id}
                        onClick={() => togglePropertyType(serviceId)}
                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all text-sm
                          ${propertyTypes.includes(serviceId) ? 'border-purple-500 bg-white' : 'border-purple-200 hover:border-purple-300 bg-white/50'}`}
                      >
                        <SimpleCheckbox checked={propertyTypes.includes(serviceId)} />
                        <span className={propertyTypes.includes(serviceId) ? 'text-purple-900' : 'text-gray-700'}>{service.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Service Areas */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-propertifi-orange" /> Service Areas *
          </Label>
          <p className="text-sm text-gray-600 mt-1">
            Select cities where you want to receive leads (within {selectedRadius} miles of city center)
          </p>
        </div>

        {/* Radius Selection */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Lead radius:</span>
          <div className="flex gap-2">
            {[10, 25, 50, 100].map((miles) => (
              <Button
                key={miles}
                type="button"
                size="sm"
                variant={selectedRadius === miles ? "default" : "outline"}
                className={selectedRadius === miles ? "bg-propertifi-orange hover:bg-propertifi-orange-dark" : ""}
                onClick={() => setSelectedRadius(miles)}
              >
                {miles} mi
              </Button>
            ))}
          </div>
        </div>

        {/* City Search */}
        <div ref={searchRef} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10"
            />
          </div>
          {showSuggestions && searchQuery && filteredCities.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => addServiceArea(city)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b last:border-0"
                >
                  <MapPin className="h-4 w-4 text-propertifi-orange flex-shrink-0" />
                  <span className="font-medium">{city.name}</span>
                  <Plus className="h-4 w-4 text-gray-400 ml-auto" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Select */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600 flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Quick add popular areas:
          </Label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_AREAS.filter(area => !serviceAreas.some(a => a.name === area.name)).slice(0, 8).map((area) => (
              <Button key={area.name} type="button" variant="outline" size="sm" className="text-xs gap-1 h-8" onClick={() => addServiceArea(area)}>
                <Plus className="h-3 w-3" /> {area.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Areas */}
        {serviceAreas.length > 0 && (
          <Card className="border-propertifi-orange/20 bg-orange-50/30">
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-3 block">Your Service Areas ({serviceAreas.length})</Label>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <Badge key={area.id} className="bg-propertifi-orange text-white px-3 py-1.5 text-sm flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {area.name}
                    <span className="text-orange-200 text-xs">({area.radius_miles}mi)</span>
                    <button type="button" onClick={() => removeServiceArea(area.id)} className="ml-1 hover:bg-white/20 rounded p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {serviceAreas.length === 0 && (
          <Card className="border-dashed border-2 bg-gray-50/50">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <MapPin className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">Search or click popular areas above to add service areas</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Unit Range */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Property Unit Range</Label>
        <p className="text-sm text-gray-600">Set the minimum and maximum number of units you're interested in managing</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="min_units">Minimum Units</Label>
            <Input
              id="min_units"
              type="number"
              value={minUnits ?? ''}
              onChange={(e) => { setMinUnits(e.target.value ? parseInt(e.target.value) : null); setIsDirty(true); }}
              placeholder="e.g., 1"
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_units">Maximum Units</Label>
            <Input
              id="max_units"
              type="number"
              value={maxUnits ?? ''}
              onChange={(e) => { setMaxUnits(e.target.value ? parseInt(e.target.value) : null); setIsDirty(true); }}
              placeholder="e.g., 500"
              min={0}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={!isDirty || isSaving} className="min-w-[120px] bg-propertifi-orange hover:bg-propertifi-orange-dark">
          {isSaving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
