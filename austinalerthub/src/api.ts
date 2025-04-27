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
