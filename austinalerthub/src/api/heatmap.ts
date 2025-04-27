// src/api/heatmap.ts
import { fetchWithAuth } from '../api';

export interface HeatMapFilters {
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  councilDistrict?: number;
}

export interface NeighborhoodStatistic {
  neighborhood_id: number;
  neighborhood_name: string;
  report_count: number;
  avg_resolution_hours: number | null;
}

export interface TimeTrend {
  month: string;
  report_count: number;
}

export interface HeatMapStatistics {
  neighborhood_statistics: NeighborhoodStatistic[];
  time_trends: TimeTrend[];
}

export interface InfrastructureFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    name: string;
    type: string;
    address: string;
  };
}

export interface InfrastructureData {
  type: string;
  features: InfrastructureFeature[];
}

/**
 * Fetch heat map data with optional filters
 */
export function getHeatmapData(filters: HeatMapFilters = {}, token: string | null) {
  const { categoryId, startDate, endDate, status, councilDistrict } = filters;
  
  // Build query parameters
  const params = new URLSearchParams();
  if (categoryId) params.append('category_id', categoryId);
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (status) params.append('status', status);
  if (councilDistrict) params.append('council_district', councilDistrict.toString());
  
  return fetchWithAuth(`/api/v1/heatmap?${params}`, token);
}

/**
 * Fetch heat map statistics
 */
export function getHeatmapStatistics(filters: HeatMapFilters = {}, token: string | null) {
  const { categoryId, startDate, endDate, status } = filters;
  
  // Build query parameters
  const params = new URLSearchParams();
  if (categoryId) params.append('category_id', categoryId);
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (status) params.append('status', status);
  
  return fetchWithAuth(`/api/v1/heatmap/statistics?${params}`, token) as Promise<HeatMapStatistics>;
}

/**
 * Fetch infrastructure data for overlay
 */
export function getInfrastructureData(token: string | null) {
  return fetchWithAuth('/api/v1/heatmap/infrastructure', token) as Promise<InfrastructureData>;
}