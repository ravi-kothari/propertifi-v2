'use client';

import { useEffect, useState } from 'react';
import { getStates, getCitiesByState, ApiClientError } from '@/lib/api-client';
import type { State, City } from '@/lib/types/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function LocationBrowser() {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStates() {
      try {
        setIsLoadingStates(true);
        const response = await getStates();

        // Remove duplicates by state code
        const uniqueStates = Array.from(
          new Map(response.data.map(state => [state.code, state])).values()
        ).slice(0, 12); // Limit to 12 states for UI

        setStates(uniqueStates);
        if (uniqueStates.length > 0) {
          handleStateClick(uniqueStates[0]);
        }
        setError(null);
      } catch (e) {
        const error = e as Error;
        setError('Failed to load states. ' + error.message);
      } finally {
        setIsLoadingStates(false);
      }
    }
    loadStates();
  }, []);

  const handleStateClick = async (state: State) => {
    if (selectedState?.code === state.code) return;

    setSelectedState(state);
    setCities([]);
    try {
      setIsLoadingCities(true);
      const response = await getCitiesByState(state.code);

      // Remove duplicates by city slug
      const uniqueCities = Array.from(
        new Map(response.data.map(city => [city.slug, city])).values()
      );

      setCities(uniqueCities);
      setError(null);
    } catch (e) {
      const error = e as Error;
      setError(`Failed to load cities for ${state.name}. ` + error.message);
    } finally {
      setIsLoadingCities(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {isLoadingStates ? (
            Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
          ) : (
            states.map((state) => (
              <Button
                key={state.code}
                variant={selectedState?.code === state.code ? 'secondary' : 'outline'}
                className="w-full"
                onClick={() => handleStateClick(state)}
              >
                {state.code}
              </Button>
            ))
          )}
        </div>
      </div>
      <div className="md:col-span-2">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-wrap gap-2">
          {isLoadingCities ? (
            Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-9 w-24" />)
          ) : (
            cities.map((city) => (
              <Button key={city.slug} variant="ghost">
                {city.name}
              </Button>
            ))
          )}
        </div>
        {selectedState && !isLoadingCities && cities.length > 0 && (
          <div className="mt-4">
            <Button variant="link">View All Cities in {selectedState.code}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
