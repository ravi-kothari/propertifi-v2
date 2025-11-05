"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";
import { useState } from "react";

export interface FilterState {
  propertyTypes: string[];
  minYearsExperience: number;
  minRating: number;
  services: string[];
}

interface ManagerFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  availablePropertyTypes: string[];
  availableServices: string[];
}

export function ManagerFilters({
  onFilterChange,
  availablePropertyTypes,
  availableServices,
}: ManagerFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    propertyTypes: [],
    minYearsExperience: 0,
    minRating: 0,
    services: [],
  });

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.propertyTypes, type]
      : filters.propertyTypes.filter((t) => t !== type);

    const newFilters = { ...filters, propertyTypes: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    const newServices = checked
      ? [...filters.services, service]
      : filters.services.filter((s) => s !== service);

    const newFilters = { ...filters, services: newServices };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleExperienceChange = (value: number[]) => {
    const newFilters = { ...filters, minYearsExperience: value[0] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, minRating: rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      propertyTypes: [],
      minYearsExperience: 0,
      minRating: 0,
      services: [],
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilterCount =
    filters.propertyTypes.length +
    filters.services.length +
    (filters.minYearsExperience > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Header with Clear Filters */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold">Filters</h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs"
          >
            Clear All ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Property Types Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Property Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {availablePropertyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.propertyTypes.includes(type)}
                onCheckedChange={(checked) =>
                  handlePropertyTypeChange(type, checked as boolean)
                }
              />
              <Label
                htmlFor={`type-${type}`}
                className="text-sm font-normal cursor-pointer"
              >
                {type}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Years of Experience Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Years of Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-slate-600">
            Minimum: <span className="font-semibold">{filters.minYearsExperience} years</span>
          </div>
          <Slider
            value={[filters.minYearsExperience]}
            onValueChange={handleExperienceChange}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>0 years</span>
            <span>20+ years</span>
          </div>
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                filters.minRating === rating
                  ? "bg-primary-50 border-2 border-primary-500"
                  : "hover:bg-slate-50 border-2 border-transparent"
              }`}
            >
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-slate-200 text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">{rating}+</span>
            </button>
          ))}
          {filters.minRating > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRatingChange(0)}
              className="w-full text-xs"
            >
              Clear Rating Filter
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Services Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Services Offered</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-64 overflow-y-auto">
          {availableServices.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={`service-${service}`}
                checked={filters.services.includes(service)}
                onCheckedChange={(checked) =>
                  handleServiceChange(service, checked as boolean)
                }
              />
              <Label
                htmlFor={`service-${service}`}
                className="text-sm font-normal cursor-pointer"
              >
                {service}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
