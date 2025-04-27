// src/components/LeafletMap.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Category colors for markers
const categoryColors: Record<string, string> = {
  'infrastructure': '#FFA000',
  'traffic': '#F44336',
  'crime': '#3F51B5',
  'environment': '#4CAF50',
  'public_services': '#9C27B0',
  'noise': '#FF5722',
  'animals': '#795548',
  'other': '#9E9E9E'
};

// Custom icon function - now with size based on severity
const createCategoryIcon = (category: string, severity: number = 3) => {
  const color = categoryColors[category] || '#9E9E9E';
  const size = 12 + (severity * 2); // Base size of 12px + 2px per severity level
  const borderSize = 2 + (severity > 3 ? 1 : 0); // Thicker border for high severity
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color}; 
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 50%; 
        border: ${borderSize}px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
      "></div>
    `,
    iconSize: [size + (borderSize * 2), size + (borderSize * 2)],
    iconAnchor: [(size + (borderSize * 2))/2, (size + (borderSize * 2))/2]
  });
};

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
    id?: string;
    category?: string;
    severity?: number;
  }>;
  onMarkerClick?: (id: string) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  center = [30.2672, -97.7431], // Austin, TX
  zoom = 12,
  markers = [],
  onMarkerClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current) {
      // Create the map
      const map = L.map(mapRef.current).setView(center, zoom);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add zoom controls
      L.control.zoom({
        position: 'topleft'
      }).addTo(map);
      
      // Create a layer group for markers
      markersLayerRef.current = L.layerGroup().addTo(map);
      
      // Store the map instance
      leafletMapRef.current = map;
      
      console.log("Map initialized");
    }
    
    return () => {
      // Clean up on unmount
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Add a legend control to the map
useEffect(() => {
  if (leafletMapRef.current) {
    // Create a legend control
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '4px';
      div.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
      
      // Add title
      div.innerHTML = '<h4 style="margin: 0 0 8px 0; font-weight: bold;">Categories</h4>';
      
      // Add category colors
      Object.entries(categoryColors).forEach(([category, color]) => {
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        
        div.innerHTML += `
          <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px;"></div>
            <span>${formattedCategory}</span>
          </div>
        `;
      });
      
      // Add severity explanation
      div.innerHTML += `
        <h4 style="margin: 10px 0 8px 0; font-weight: bold;">Severity</h4>
        <div style="display: flex; align-items: center;">
          <div style="display: flex; align-items: center; margin-right: 10px;">
            <div style="background-color: #9E9E9E; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px;"></div>
            <span style="font-size: 12px;">Low</span>
          </div>
          <div style="display: flex; align-items: center; margin-right: 10px;">
            <div style="background-color: #9E9E9E; width: 12px; height: 12px; border-radius: 50%; margin-right: 5px;"></div>
            <span style="font-size: 12px;">Medium</span>
          </div>
          <div style="display: flex; align-items: center;">
            <div style="background-color: #9E9E9E; width: 16px; height: 16px; border-radius: 50%; margin-right: 5px;"></div>
            <span style="font-size: 12px;">High</span>
          </div>
        </div>
      `;
      
      return div;
    };
    
    legend.addTo(leafletMapRef.current);
    
    return () => {
      if (leafletMapRef.current) {
        legend.remove();
      }
    };
  }
}, [leafletMapRef.current]);
  
  // Update center and zoom when props change
  useEffect(() => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);
  
  // Update markers when props change
  useEffect(() => {
    if (markersLayerRef.current) {
      // Clear existing markers
      markersLayerRef.current.clearLayers();
      
      console.log("Adding markers:", markers.length);
      
      // Add new markers
      markers.forEach(marker => {
        const { position, popup, id, category, severity = 3 } = marker;
        
        // Create marker with category icon if available
        const leafletMarker = category 
          ? L.marker(position, { icon: createCategoryIcon(category, severity) })
          : L.marker(position);
        
        // Add popup content if provided
        if (popup) {
          leafletMarker.bindPopup(popup, {
            maxWidth: 300,
            className: 'custom-popup',
          });
        }
        
        // Add click handler if provided
        if (id && onMarkerClick) {
          leafletMarker.on('click', () => {
            onMarkerClick(id);
          });
        }
        
        // Add marker to layer group
        markersLayerRef.current?.addLayer(leafletMarker);
      });
    }
  }, [markers, onMarkerClick]);
  
  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default LeafletMap;