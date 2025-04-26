
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MapPin } from 'lucide-react';

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

  // Fetch the current location when component mounts
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Get address from coordinates using reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        
        if (!response.ok) {
          throw new Error('Failed to get address');
        }
        
        const data = await response.json();
        const address = data.display_name;
        
        const locationData: LocationData = { 
          latitude, 
          longitude,
          address
        };
        
        setLocation(locationData);
        onLocationSelect(locationData);
        
      } catch (error) {
        // If reverse geocoding fails, still use the coordinates
        const locationData: LocationData = { latitude, longitude };
        setLocation(locationData);
        onLocationSelect(locationData);
        toast.warning("Could not retrieve address, but coordinates were captured");
      }
      
    } catch (err: any) {
      let message = "Failed to get your location";
      
      if (err.code === 1) {
        message = "Location access denied. Please enable location services.";
      } else if (err.code === 2) {
        message = "Location unavailable. Please try again.";
      } else if (err.code === 3) {
        message = "Location request timed out. Please try again.";
      }
      
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 border rounded-md p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Location</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLoading}
        >
          <MapPin className="mr-2 h-4 w-4" />
          {isLoading ? "Getting location..." : "Update Location"}
        </Button>
      </div>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      {location && (
        <div className="bg-muted p-3 rounded-md">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-safety-blue mr-2" />
            {location.address ? (
              <span className="text-sm">{location.address}</span>
            ) : (
              <span className="text-sm">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Placeholder for map (would require implementing an actual map library) */}
      <div className="bg-gray-100 rounded-md h-48 flex items-center justify-center">
        <p className="text-gray-500">Map Preview</p>
      </div>
    </div>
  );
};

export default LocationPicker;
