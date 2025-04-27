// src/components/SimpleHeatMap.tsx
import React from 'react';
import { CircleMarker } from 'react-leaflet';

interface Point {
  lat: number;
  lng: number;
  intensity?: number;
}

interface SimpleHeatMapProps {
  points: Point[];
  intensityFactor?: number;
  maxRadius?: number;
}

const SimpleHeatMap: React.FC<SimpleHeatMapProps> = ({ 
  points = [], 
  intensityFactor = 1,
  maxRadius = 30
}) => {
  // Safety check for undefined points
  if (!points || points.length === 0) {
    return null;
  }

  return (
    <>
      {points.map((point, index) => {
        // Safety checks for each point
        if (typeof point.lat !== 'number' || typeof point.lng !== 'number') {
          return null;
        }

        const intensity = typeof point.intensity === 'number' ? point.intensity : 1;
        const radius = Math.min(intensity * intensityFactor, maxRadius);
        
        return (
          <CircleMarker
            key={`heat-${index}`}
            center={[point.lat, point.lng]}
            radius={radius}
            pathOptions={{
              fillColor: 'red',
              fillOpacity: 0.6,
              stroke: false
            }}
          />
        );
      })}
    </>
  );
};

export default SimpleHeatMap;