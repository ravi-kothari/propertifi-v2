'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLoadScript, Libraries } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

const libraries: Libraries = ['places'];

interface AddressData {
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
}

interface AddressAutocompleteProps {
  onSelect: (data: AddressData) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

// Inner component that uses the Places Autocomplete hook
function PlacesAutocompleteInput({
  onSelect,
  defaultValue = '',
  placeholder,
  className,
  error,
  disabled,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'us' },
    },
    debounce: 300,
  });

  useEffect(() => {
    if (defaultValue && !value) {
      setValue(defaultValue, false);
    }
  }, [defaultValue, value, setValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parseAddressComponents = (components: google.maps.GeocoderAddressComponent[]) => {
    const parsed: Partial<AddressData> = {
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
    };

    let streetNumber = '';
    let route = '';

    components.forEach((component) => {
      const types = component.types;

      if (types.includes('street_number')) {
        streetNumber = component.long_name;
      }
      if (types.includes('route')) {
        route = component.long_name;
      }
      if (types.includes('locality')) {
        parsed.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        parsed.state = component.short_name;
      }
      if (types.includes('postal_code')) {
        parsed.zip_code = component.long_name;
      }
    });

    parsed.street_address = `${streetNumber} ${route}`.trim();
    return parsed as AddressData;
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();
    setShowDropdown(false);

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);

      const components = results[0].address_components;
      const parsedAddress = parseAddressComponents(components);

      onSelect({
        ...parsedAddress,
        latitude: lat,
        longitude: lng,
      });
    } catch (error) {
      console.error('Error fetching place details:', error);
      onSelect({
        street_address: description,
        city: '',
        state: '',
        zip_code: '',
      });
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setShowDropdown(true);
  };

  const handleFocus = () => {
    if (data.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInput}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={!ready || disabled}
        className={className}
        autoComplete="off"
      />

      {/* Autocomplete Dropdown */}
      {showDropdown && status === 'OK' && data.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
              <button
                key={place_id}
                type="button"
                onClick={() => handleSelect(suggestion.description)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{main_text}</div>
                <div className="text-sm text-gray-600">{secondary_text}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="mt-1 text-xs text-gray-500">
          Start typing to see address suggestions
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

// Main component that loads the Google Maps script
export function AddressAutocomplete(props: AddressAutocompleteProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // If API key is missing, show warning
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div>
        <input
          type="text"
          placeholder={props.placeholder}
          className={props.className}
          disabled={props.disabled}
          onChange={(e) => {
            // Manual fallback - just update street address
            props.onSelect({
              street_address: e.target.value,
              city: '',
              state: '',
              zip_code: '',
            });
          }}
        />
        <p className="mt-1 text-xs text-amber-600">
          ⚠️ Address autocomplete unavailable (API key not configured). Manual entry enabled.
        </p>
      </div>
    );
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div>
        <input
          type="text"
          placeholder="Loading address autocomplete..."
          className={props.className}
          disabled
        />
      </div>
    );
  }

  // Show error state
  if (loadError) {
    return (
      <div>
        <input
          type="text"
          placeholder={props.placeholder}
          className={props.className}
          disabled={props.disabled}
          onChange={(e) => {
            props.onSelect({
              street_address: e.target.value,
              city: '',
              state: '',
              zip_code: '',
            });
          }}
        />
        <p className="mt-1 text-xs text-red-600">
          Address autocomplete failed to load. Please enter manually.
        </p>
      </div>
    );
  }

  // Render the Places Autocomplete component only when loaded
  return <PlacesAutocompleteInput {...props} />;
}
