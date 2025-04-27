// src/components/MarkerClusterGroup.tsx
import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MarkerClusterProps {
  children: React.ReactNode;
}

const MarkerClusterGroup: React.FC<MarkerClusterProps> = ({ children }) => {
  const map = useMap();
  const [clusterLayer, setClusterLayer] = useState<any>(null);
  
  useEffect(() => {
    // Load the Leaflet.markercluster plugin
    const cssLink1 = document.createElement('link');
    cssLink1.rel = 'stylesheet';
    cssLink1.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
    document.head.appendChild(cssLink1);
    
    const cssLink2 = document.createElement('link');
    cssLink2.rel = 'stylesheet';
    cssLink2.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
    document.head.appendChild(cssLink2);
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';
    script.async = true;
    
    script.onload = () => {
      if (!map || !L.markerClusterGroup) return;
      
      // Create a marker cluster group
      const cluster = L.markerClusterGroup();
      setClusterLayer(cluster);
      map.addLayer(cluster);
    };
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
      document.head.removeChild(cssLink1);
      document.head.removeChild(cssLink2);
      
      if (clusterLayer) {
        map.removeLayer(clusterLayer);
      }
    };
  }, [map]);
  
  // When the cluster layer is created and children (markers) change,
  // add them to the cluster
  useEffect(() => {
    if (!clusterLayer) return;
    
    // Clear existing markers
    clusterLayer.clearLayers();
    
    // Find all marker elements
    const markerElements = React.Children.toArray(children);
    const markers = markerElements.map((child: any) => {
      if (!child || !child.props || !child.props.position) {
        return null;
      }
      
      // Create a marker from each child's props
      const marker = L.marker(child.props.position, {
        icon: child.props.icon || new L.Icon.Default()
      });
      
      // Add popup if the child has one
      if (child.props.children) {
        // Extract popup content
        const popupContent = document.createElement('div');
        React.Children.forEach(child.props.children, (popupChild: any) => {
          if (popupChild && popupChild.type && popupChild.type.name === 'Popup') {
            const text = React.Children.toArray(popupChild.props.children).map((c: any) => 
              typeof c === 'string' ? c : ''
            ).join('');
            popupContent.innerHTML = text;
          }
        });
        
        if (popupContent.innerHTML) {
          marker.bindPopup(popupContent);
        }
      }
      
      return marker;
    }).filter(Boolean);
    
    // Add all markers to the cluster
    markers.forEach(m => m && clusterLayer.addLayer(m));
    
  }, [clusterLayer, children]);
  
  return null;
};

export default MarkerClusterGroup;