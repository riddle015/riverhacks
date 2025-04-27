// src/pages/HeatMapPage.tsx
import React from 'react';
import HeatMap from '@/components/HeatMap';

const HeatMapPage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Community Safety Heat Map</h1>
      <p className="text-muted-foreground mb-6">
        Explore safety issues across the community with our interactive map.
        Filter by category, time period, and status to identify patterns and hotspots.
      </p>
      <HeatMap />
    </div>
  );
};

export default HeatMapPage;