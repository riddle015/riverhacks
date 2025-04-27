// src/components/HeatMap.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LeafletMap from './LeafletMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { getHeatmapData, getHeatmapStatistics, getInfrastructureData, HeatMapFilters } from '@/api';
import { sampleMapData, sampleStatistics } from '@/data/sampleMapData';

const HeatMap = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [mapData, setMapData] = useState<any>({ features: [] });
  const [statistics, setStatistics] = useState<any>({ neighborhood_statistics: [], time_trends: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30'); // Last 30 days
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  
  // Display options
  const [mapView, setMapView] = useState('markers'); // Just using markers for now
  const [centerPosition, setCenterPosition] = useState<[number, number]>([30.2672, -97.7431]); // Austin, TX
  const [zoomLevel, setZoomLevel] = useState(12);
  
  // Categories data
  const categories = [
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'traffic', name: 'Traffic' },
    { id: 'crime', name: 'Crime' },
    { id: 'environment', name: 'Environment' },
    { id: 'public_services', name: 'Public Services' },
    { id: 'noise', name: 'Noise' },
    { id: 'animals', name: 'Animals' },
    { id: 'other', name: 'Other' },
  ];
  
  // Status options
  const statusOptions = [
    { value: 'submitted', label: 'Submitted' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];
  
  // Prepare markers for the map
  // Prepare markers for the map
const mapMarkers = React.useMemo(() => {
  return mapData.features?.map((feature: any) => {
    if (!feature || !feature.geometry || !feature.geometry.coordinates) {
      return null;
    }
    
    const coords = feature.geometry.coordinates;
    const props = feature.properties || {};
    const categoryId = props.category_id;
    const category = categories.find(c => c.id === categoryId)?.name || 'Unknown';
    const severity = props.severity || 3; // Default to medium severity if not specified
    
    // Create popup content - make it more attractive
    const statusClass = props.status === 'resolved' ? 'text-green-600' : 
                       props.status === 'in_progress' ? 'text-blue-600' : 'text-orange-600';
    
    const popupContent = `
      <div class="p-3 min-w-[200px]">
        <h3 class="font-bold text-lg mb-2">${props.title || category}</h3>
        <p class="text-sm mb-1">${props.description || 'No description provided'}</p>
        <div class="flex justify-between text-xs mt-3 mb-2">
          <span class="${statusClass} font-semibold">${props.status || 'N/A'}</span>
          <span>Severity: ${severity}/5</span>
        </div>
        <p class="text-xs text-gray-600">Reported: ${props.created_at ? new Date(props.created_at).toLocaleDateString() : 'N/A'}</p>
        <button 
          class="mt-3 p-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded w-full transition-colors"
          onclick="window.openReport('${props.report_id}')"
        >
          View Details
        </button>
      </div>
    `;
    
    return {
      position: [coords[1], coords[0]] as [number, number],
      popup: popupContent,
      id: props.report_id,
      category: categoryId,
      severity: severity
    };
  }).filter(Boolean) || [];
}, [mapData, categories]);
  
  // Fetch data with applied filters
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Here we would normally fetch from API - temporarily using sample data
      // const heatmapData = await getHeatmapData(filters, token);
      // const statsData = await getHeatmapStatistics(filters, token);
      
      // Use sample data instead
      setMapData(sampleMapData);
      setStatistics(sampleStatistics);
      
      // For debugging
      console.log("Sample data loaded:", sampleMapData.features.length, "features");
    } catch (err: any) {
      console.error('Error fetching map data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, dateRange, token]);
  
  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Handle predefined time ranges
  const handleTimeRangeChange = (days: string) => {
    setSelectedTimeRange(days);
    
    if (days === 'custom') return;
    
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - parseInt(days));
    setDateRange({ from, to });
  };
  
  // Handle marker click
  const handleMarkerClick = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };
  
  // Setup global function for popup buttons
  useEffect(() => {
    // @ts-ignore
    window.openReport = (reportId: string) => {
      handleMarkerClick(reportId);
    };
    
    return () => {
      // @ts-ignore
      window.openReport = undefined;
    };
  }, [handleMarkerClick]);
  
  return (
    <div className="flex flex-col space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Community Safety Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Category filter */}
            <div className="w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Time range filter */}
            <div className="w-full sm:w-auto">
              <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="180">Last 6 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Status filter */}
            <div className="w-full sm:w-auto">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Apply filters button */}
            <Button onClick={fetchData} className="ml-auto">Apply Filters</Button>
          </div>
          
          {/* Tabs for map views */}
          <div className="flex flex-wrap gap-4 mb-4">
            <Tabs defaultValue="markers" value={mapView} onValueChange={setMapView} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="markers">Markers</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Map */}
          <div className="h-[600px] w-full rounded-md overflow-hidden border">
            {loading ? (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <span className="text-lg">Loading map data...</span>
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <span className="text-lg text-red-500">Error: {error}</span>
              </div>
            ) : (
              <LeafletMap 
                center={centerPosition}
                zoom={zoomLevel}
                markers={mapMarkers}
                onMarkerClick={handleMarkerClick}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Statistics panel */}
      <Card>
        <CardHeader>
          <CardTitle>Community Safety Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="neighborhood">
            <TabsList className="mb-4">
              <TabsTrigger value="neighborhood">Neighborhood</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="neighborhood">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Neighborhood</th>
                      <th className="p-2 text-right">Reports</th>
                      <th className="p-2 text-right">Avg. Resolution Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.neighborhood_statistics?.map((stat: any, index: number) => (
                      <tr key={stat.neighborhood_id || index} className={index % 2 ? 'bg-gray-50' : ''}>
                        <td className="p-2">{stat.neighborhood_name || 'Unknown'}</td>
                        <td className="p-2 text-right">{stat.report_count || 0}</td>
                        <td className="p-2 text-right">
                          {stat.avg_resolution_hours ? `${Math.round(stat.avg_resolution_hours)} hours` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                    {!statistics.neighborhood_statistics?.length && (
                      <tr>
                        <td colSpan={3} className="p-4 text-center">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="h-64">
                {/* Trend visualization */}
                <div className="flex h-full items-end gap-1">
                  {statistics.time_trends?.map((trend: any, index: number) => (
                    <div 
                      key={trend.month || index} 
                      className="flex flex-col items-center"
                      style={{ 
                        width: `${100 / Math.max(statistics.time_trends.length, 1)}%`,
                        maxWidth: '80px'
                      }}
                    >
                      <div 
                        className="bg-blue-500 w-full rounded-t-sm"
                        style={{ 
                          height: `${(trend.report_count / Math.max(...statistics.time_trends.map((t: any) => t.report_count || 0), 1)) * 90}%`,
                          minHeight: '4px' 
                        }}
                        title={`${trend.report_count || 0} reports`}
                      ></div>
                      <span className="text-xs mt-2 truncate w-full text-center">{trend.month || 'Unknown'}</span>
                    </div>
                  ))}
                  {!statistics.time_trends?.length && (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-gray-400">No trend data available</span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatMap;