// src/api.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL

export interface SignupPayload {
  email: string
  password: string
  first_name?: string
  last_name?: string
  phone_number?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ReportPayload {
  title: string
  category: string
  description: string
  severity: 'low' | 'medium' | 'high'
  location: { latitude: number; longitude: number; address?: string }
  mediaFiles?: any[]
}

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

// helper to wrap fetch + JWT
async function fetchWithAuth(
  url: string,
  token: string | null,
  opts: RequestInit = {}
) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
  const res = await fetch(API_BASE + url, { ...opts, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

export function signup(data: SignupPayload) {
  return fetchWithAuth(`/api/v1/auth/signup`, null, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function login(data: LoginPayload) {
  return fetchWithAuth('/api/v1/auth/login', null, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function createReport(data: ReportPayload, token: string) {
  return fetchWithAuth('/api/v1/reports', token, {
    method: 'POST',
    body: JSON.stringify({
      user_id: '',         // will be injected from context
      category_id: data.category,
      description: data.description,
      severity: data.severity,
      latitude: data.location.latitude,
      longitude: data.location.longitude
    })
  })
}

// Heat map API functions
export function getHeatmapData(filters: HeatMapFilters = {}, token: string | null) {
  const { categoryId, startDate, endDate, status, councilDistrict } = filters;
  
  // Build query parameters
  const params = new URLSearchParams();
  if (categoryId) params.append('category_id', categoryId);
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (status) params.append('status', status);
  if (councilDistrict) params.append('council_district', councilDistrict?.toString() || '');
  
  return fetchWithAuth(`/api/v1/heatmap?${params}`, token);
}

export function getHeatmapStatistics(filters: HeatMapFilters = {}, token: string | null) {
  const { categoryId, startDate, endDate, status } = filters;
  
  // Build query parameters
  const params = new URLSearchParams();
  if (categoryId) params.append('category_id', categoryId);
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (status) params.append('status', status);
  
  return fetchWithAuth(`/api/v1/heatmap/statistics?${params}`, token);
}

export function getInfrastructureData(token: string | null) {
  return fetchWithAuth('/api/v1/heatmap/infrastructure', token);
}