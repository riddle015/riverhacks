// src/components/BasicMap.tsx
import React from 'react';

interface BasicMapProps {
  children?: React.ReactNode;
}

const BasicMap: React.FC<BasicMapProps> = () => {
  return (
    <div className="h-[600px] w-full rounded-md overflow-hidden border bg-gray-100 flex items-center justify-center">
      <p className="text-gray-600">
        Map component will be displayed here. Due to compatibility issues with the map library, we're displaying this placeholder for now.
      </p>
    </div>
  );
};

export default BasicMap;