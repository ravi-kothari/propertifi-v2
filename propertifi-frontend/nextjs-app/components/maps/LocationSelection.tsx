'use client';

import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox, Circle } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places'];

interface LocationSelectionProps {
  center: { lat: number; lng: number };
  radius: number; // in meters
  onLocationChange: (lat: number, lng: number) => void;
  onRadiusChange: (radius: number) => void;
}

export default function LocationSelection({
  center,
  radius,
  onLocationChange,
  onRadiusChange
}: LocationSelectionProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      const place = places?.[0];
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onLocationChange(lat, lng);
        map?.panTo({ lat, lng });
      }
    }
  };

  const onCircleLoad = (circle: google.maps.Circle) => {
    circleRef.current = circle;
  };

  const onCenterChanged = () => {
    if (circleRef.current) {
      const newCenter = circleRef.current.getCenter();
      if (newCenter) {
        onLocationChange(newCenter.lat(), newCenter.lng());
      }
    }
  };

  const onRadiusChanged = () => {
    if (circleRef.current) {
      const newRadius = circleRef.current.getRadius();
      if (newRadius) {
        onRadiusChange(newRadius);
      }
    }
  };

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading Google Maps. Please check your API key configuration.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">Loading Maps...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
        <input
          type="text"
          placeholder="Enter your primary business address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </StandaloneSearchBox>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Circle
          center={center}
          radius={radius}
          draggable
          editable
          onLoad={onCircleLoad}
          onCenterChanged={onCenterChanged}
          onRadiusChanged={onRadiusChanged}
          options={{
            strokeColor: '#4F46E5',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#4F46E5',
            fillOpacity: 0.2,
            draggable: true,
            editable: true,
          }}
        />
      </GoogleMap>

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Search for your business address to set the center point</li>
          <li>Drag the circle to adjust the center location</li>
          <li>Drag the edge of the circle to adjust the service radius</li>
          <li>Use the slider below for precise radius control</li>
        </ul>
      </div>
    </div>
  );
}
