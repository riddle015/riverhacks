// src/components/SimpleClusterGroup.tsx
import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { CircleMarker, Popup, Marker } from 'react-leaflet';

interface SimpleClusterProps {
  children: React.ReactNode;
  clusterRadius?: number;
}

const SimpleClusterGroup: React.FC<SimpleClusterProps> = ({ 
  children, 
  clusterRadius = 80 
}) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  
  // Update zoom level when map is zoomed
  useEffect(() => {
    const onZoom = () => {
      setZoom(map.getZoom());
    };
    
    map.on('zoom', onZoom);
    return () => {
      map.off('zoom', onZoom);
    };
  }, [map]);
  
  // Get all markers from children
  const markers = React.Children.toArray(children);
  
  // If zoom level is high enough, show individual markers
  if (zoom > 13) {
    return <>{children}</>;
  }
  
  // Otherwise, cluster markers
  const clusters: any[][] = [];
  const processed = new Set();
  
  // Simple clustering algorithm
  markers.forEach((marker: any, i) => {
    if (processed.has(i)) return;
    
    const cluster = [marker];
    processed.add(i);
    
    const pos1 = marker.props.position;
    
    markers.forEach((marker2: any, j) => {
      if (processed.has(j)) return;
      
      const pos2 = marker2.props.position;
      
      // Calculate distance in pixels
      const p1 = map.latLngToContainerPoint(pos1);
      const p2 = map.latLngToContainerPoint(pos2);
      const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
      
      if (distance <= clusterRadius) {
        cluster.push(marker2);
        processed.add(j);
      }
    });
    
    clusters.push(cluster);
  });
  
  return (
    <>
      {clusters.map((cluster, i) => {
        if (cluster.length === 1) {
          // Single marker
          return cluster[0];
        } else {
          // Cluster of markers
          // Calculate average position
          const sumLat = cluster.reduce((sum, marker: any) => 
            sum + marker.props.position[0], 0);
          const sumLng = cluster.reduce((sum, marker: any) => 
            sum + marker.props.position[1], 0);
          
          const avgLat = sumLat / cluster.length;
          const avgLng = sumLng / cluster.length;
          
          return (
            <CircleMarker
              key={`cluster-${i}`}
              center={[avgLat, avgLng]}
              radius={10 + Math.min(5, Math.log(cluster.length) * 5)}
              eventHandlers={{
                click: () => {
                  // Zoom in when clicking a cluster
                  map.setView([avgLat, avgLng], zoom + 2);
                }
              }}
              pathOptions={{
                fillColor: '#1e88e5',
                fillOpacity: 0.7,
                color: '#0d47a1',
                weight: 1
              }}
            >
              <Popup>
                <div>
                  <strong>{cluster.length} items</strong>
                  <p>Click to zoom in</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        }
      })}
    </>
  );
};

export default SimpleClusterGroup;