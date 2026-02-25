const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('pt_token')
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export function apiStreamFetch(path: string, options?: RequestInit) {
  const token = getToken()
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
}

export function setToken(token: string) {
  localStorage.setItem('pt_token', token)
}

export function clearToken() {
  localStorage.removeItem('pt_token')
  localStorage.removeItem('pt_user')
}

export function saveUser(user: object) {
  localStorage.setItem('pt_user', JSON.stringify(user))
}

export function getUser() {
  if (typeof window === 'undefined') return null
  const s = localStorage.getItem('pt_user')
  return s ? JSON.parse(s) : null
}
