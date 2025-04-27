// src/components/LocationPicker.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Compass } from 'lucide-react';

// Define the LocationData interface
export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Default location (center of map if user doesn't share location)
  const defaultLocation: LocationData = {
    latitude: 40.7128,
    longitude: -74.0060, // New York City coordinates as default
  };

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => {
      setMapInitialized(true);
    };
    document.head.appendChild(script);

    return () => {
      // Clean up
      document.head.removeChild(link);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    // Initialize map after Leaflet is loaded
    if (!mapInitialized) return;

    const L = window.L;
    if (!L) return;

    // Use the user's location or default
    const initialLocation = location || defaultLocation;
    
    // Initialize map
    const map = L.map('map').setView(
      [initialLocation.latitude, initialLocation.longitude], 
      13
    );

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker for the current location
    const marker = L.marker(
      [initialLocation.latitude, initialLocation.longitude],
      { draggable: true }
    ).addTo(map);

    // Update location when marker is dragged
    marker.on('dragend', function(e) {
      const position = marker.getLatLng();
      const newLocation = {
        latitude: position.lat,
        longitude: position.lng
      };
      setLocation(newLocation);
      onLocationSelect(newLocation);
      
      // Reverse geocode to get address (optional)
      reverseGeocode(position.lat, position.lng);
    });

    // Handle clicks on the map to reposition marker
    map.on('click', function(e) {
      const position = e.latlng;
      marker.setLatLng(position);
      
      const newLocation = {
        latitude: position.lat,
        longitude: position.lng
      };
      setLocation(newLocation);
      onLocationSelect(newLocation);
      
      // Reverse geocode to get address (optional)
      reverseGeocode(position.lat, position.lng);
    });

    // For cleanup when component unmounts
    return () => {
      map.remove();
    };
  }, [mapInitialized, location, onLocationSelect]);

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(userLocation);
          onLocationSelect(userLocation);
          setIsLoading(false);
          
          // Reverse geocode to get address (optional)
          reverseGeocode(userLocation.latitude, userLocation.longitude);
          
          // Update map view if map exists
          if (mapInitialized && window.L) {
            const map = window.L.map('map');
            if (map) {
              map.setView([userLocation.latitude, userLocation.longitude], 13);
              // Update marker position
              const markers = document.querySelectorAll('.leaflet-marker-icon');
              if (markers.length > 0) {
                // Remove existing markers
                markers.forEach(marker => marker.remove());
              }
              // Add new marker
              window.L.marker([userLocation.latitude, userLocation.longitude], { draggable: true }).addTo(map);
            }
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to retrieve your location. Please select manually or try again.');
          setIsLoading(false);
          // Set default location
          setLocation(defaultLocation);
          onLocationSelect(defaultLocation);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      // Set default location
      setLocation(defaultLocation);
      onLocationSelect(defaultLocation);
    }
  };

  // Optional: Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        const updatedLocation = {
          ...location,
          latitude: lat,
          longitude: lng,
          address: data.display_name
        };
        setLocation(updatedLocation as LocationData);
        onLocationSelect(updatedLocation as LocationData);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {location ? (
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Latitude:</span> {location.latitude.toFixed(6)}
              </p>
              <p>
                <span className="font-medium">Longitude:</span> {location.longitude.toFixed(6)}
              </p>
              {location.address && (
                <p className="text-muted-foreground text-xs">{location.address}</p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No location selected</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          {isLoading ? (
            'Getting location...'
          ) : (
            <>
              <Compass className="h-4 w-4" />
              <span>Use my location</span>
            </>
          )}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Card className="overflow-hidden">
        <div 
          id="map" 
          className="h-64 w-full bg-gray-100"
          style={{ 
            background: !mapInitialized ? 
              'linear-gradient(135deg, #f5f7ff 25%, #e4e8ff 25%, #e4e8ff 50%, #f5f7ff 50%, #f5f7ff 75%, #e4e8ff 75%, #e4e8ff 100%)' : 
              undefined,
            backgroundSize: '20px 20px'
          }}
        >
          {!mapInitialized && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse flex flex-col items-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Click on the map to set a location or drag the marker to adjust
      </p>
    </div>
  );
};

export default LocationPicker;