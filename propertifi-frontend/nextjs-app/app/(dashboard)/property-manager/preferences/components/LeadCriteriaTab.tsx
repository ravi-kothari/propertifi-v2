'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Loader2, MapPin, Home, Building, Factory, Map } from 'lucide-react';
import type { PreferencesData } from '../page';
import LocationSelection from '@/components/maps/LocationSelection';

const leadCriteriaSchema = z.object({
  property_types: z.array(z.string()).min(1, 'Select at least one property type'),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  min_units: z.number().nullable(),
  max_units: z.number().nullable(),
  service_radius_miles: z.number().min(1).max(100),
}).refine((data) => {
  if (data.min_units !== null && data.max_units !== null) {
    return data.min_units <= data.max_units;
  }
  return true;
}, {
  message: 'Min units must be less than or equal to max units',
  path: ['min_units'],
}).refine(data => data.latitude && data.longitude, {
  message: "Please set your service area on the map by searching for your business address",
  path: ["latitude"],
});

type LeadCriteriaFormData = z.infer<typeof leadCriteriaSchema>;

interface LeadCriteriaTabProps {
  data?: PreferencesData;
  onSave: (data: Partial<PreferencesData>) => void;
  isSaving: boolean;
}

const PROPERTY_TYPES = [
  { id: 'residential', label: 'Residential', icon: Home, description: 'Single-family homes, apartments' },
  { id: 'commercial', label: 'Commercial', icon: Building, description: 'Office buildings, retail spaces' },
  { id: 'industrial', label: 'Industrial', icon: Factory, description: 'Warehouses, manufacturing' },
  { id: 'mixed_use', label: 'Mixed Use', icon: Building, description: 'Combined residential & commercial' },
  { id: 'land', label: 'Land', icon: Map, description: 'Vacant land, lots' },
];

export default function LeadCriteriaTab({ data, onSave, isSaving }: LeadCriteriaTabProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<LeadCriteriaFormData>({
    resolver: zodResolver(leadCriteriaSchema),
    defaultValues: {
      property_types: data?.leadCriteria.property_types || [],
      latitude: data?.leadCriteria.latitude || 34.0522, // Default to LA
      longitude: data?.leadCriteria.longitude || -118.2437, // Default to LA
      min_units: data?.leadCriteria.min_units || null,
      max_units: data?.leadCriteria.max_units || null,
      service_radius_miles: data?.leadCriteria.service_radius_miles || 25,
    },
  });

  const propertyTypes = watch('property_types');
  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const serviceRadius = watch('service_radius_miles');

  const onSubmit = (formData: LeadCriteriaFormData) => {
    onSave({ leadCriteria: formData });
  };

  const togglePropertyType = (typeId: string) => {
    const current = propertyTypes || [];
    const updated = current.includes(typeId)
      ? current.filter((t) => t !== typeId)
      : [...current, typeId];
    setValue('property_types', updated, { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Property Types */}
      <div className="space-y-3">
        <Label>Property Types *</Label>
        <p className="text-sm text-gray-600">
          Select the types of properties you want to receive leads for
        </p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PROPERTY_TYPES.map((type) => {
            const Icon = type.icon;
            const isChecked = propertyTypes.includes(type.id);

            return (
              <div
                key={type.id}
                onClick={() => togglePropertyType(type.id)}
                className={`
                  relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${isChecked
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'}
                `}
              >
                <div className="flex items-start space-x-3 w-full">
                  <Checkbox
                    checked={isChecked}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${isChecked ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className="font-medium text-sm">{type.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {errors.property_types && (
          <p className="text-sm text-red-600">{errors.property_types.message}</p>
        )}
      </div>

      {/* Service Area Map */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Service Area *
        </Label>
        <p className="text-sm text-gray-600">
          Define your service area by searching for your business address and adjusting the radius.
        </p>

        <LocationSelection
          center={{ lat: latitude!, lng: longitude! }}
          radius={serviceRadius * 1609.34} // Convert miles to meters
          onLocationChange={(newLat, newLng) => {
            setValue('latitude', newLat, { shouldDirty: true });
            setValue('longitude', newLng, { shouldDirty: true });
          }}
          onRadiusChange={(newRadius) => {
            // Convert meters to miles and round
            setValue('service_radius_miles', Math.round(newRadius / 1609.34), { shouldDirty: true });
          }}
        />

        {errors.latitude && (
          <p className="text-sm text-red-600">{errors.latitude.message}</p>
        )}
      </div>

      {/* Service Radius */}
      <div className="space-y-3">
        <Label htmlFor="service_radius">
          Service Radius: {serviceRadius} miles
        </Label>
        <p className="text-sm text-gray-600">
          Maximum distance from your business location to receive leads (drag the circle edge on the map or use the slider)
        </p>
        <Controller
          name="service_radius_miles"
          control={control}
          render={({ field }) => (
            <Slider
              value={[field.value]}
              onValueChange={(values) => field.onChange(values[0])}
              max={100}
              step={1}
              className="w-full"
            />
          )}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 mile</span>
          <span>100 miles</span>
        </div>
      </div>

      {/* Unit Range */}
      <div className="space-y-3">
        <Label>Property Unit Range</Label>
        <p className="text-sm text-gray-600">
          Set the minimum and maximum number of units you're interested in managing
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="min_units">Minimum Units</Label>
            <Input
              id="min_units"
              type="number"
              {...register('min_units', { valueAsNumber: true })}
              placeholder="e.g., 50"
              min={0}
              className={errors.min_units ? 'border-red-500' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_units">Maximum Units</Label>
            <Input
              id="max_units"
              type="number"
              {...register('max_units', { valueAsNumber: true })}
              placeholder="e.g., 500"
              min={0}
              className={errors.max_units ? 'border-red-500' : ''}
            />
          </div>
        </div>
        {errors.min_units && (
          <p className="text-sm text-red-600">{errors.min_units.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button
          type="submit"
          disabled={!isDirty || isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
