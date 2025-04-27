// src/components/HeatMapLayer.tsx
import React, { useMemo } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface HeatMapPoint {
  lat: number;
  lng: number;
  intensity?: number;
}

interface HeatMapProps {
  points: HeatMapPoint[];
  radius?: number;
  maxIntensity?: number;
  minOpacity?: number;
  blur?: number;
  gradient?: Record<number, string>;
}

// Custom HeatMap component that uses Leaflet.heat
const HeatMapLayer: React.FC<HeatMapProps> = ({
  points,
  radius = 25,
  maxIntensity = 30,
  minOpacity = 0.05,
  blur = 15,
  gradient = { 0.4: 'blue', 0.6: 'lime', 0.7: 'yellow', 0.8: 'orange', 1.0: 'red' }
}) => {
  const map = useMap();
  
  // Format points for Leaflet.heat
  const formattedPoints = useMemo(() => {
    return points.map(p => [p.lat, p.lng, p.intensity || 1]);
  }, [points]);
  
  // Create and manage the heat layer
  React.useEffect(() => {
    // Dynamically load the Leaflet.heat plugin
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
    script.async = true;
    
    script.onload = () => {
      if (!map || !L.heatLayer || formattedPoints.length === 0) return;
      
      // Create the heat layer
      const heatLayer = L.heatLayer(formattedPoints, {
        radius,
        max: maxIntensity,
        minOpacity,
        blur,
        gradient
      });
      
      // Add the layer to the map
      map.addLayer(heatLayer);
      
      // Return a cleanup function
      return () => {
        map.removeLayer(heatLayer);
      };
    };
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [map, formattedPoints, radius, maxIntensity, minOpacity, blur, gradient]);
  
  // This component doesn't render anything itself
  return null;
};

export default HeatMapLayer;