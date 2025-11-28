import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add token to requests if available
const token = localStorage.getItem('admin_token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Request interceptor to add token dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token')
      delete api.defaults.headers.common['Authorization']
      // Redirect to login if not already there
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

// Testimonials
export const testimonialsApi = {
  getAll: () => api.get('/testimonials'),
  create: (data: { name: string; role?: string; content: string; rating: number }) =>
    api.post('/testimonials', data),
}

// Projects
export const projectsApi = {
  getAll: (category?: string) => {
    const params = category && category !== 'all' ? { category } : {}
    return api.get('/projects', { params })
  },
  getById: (id: number) => api.get(`/projects/${id}`),
}

// Admin APIs (will require authentication token)
export const adminApi = {
  testimonials: {
    getAll: () => api.get('/admin/testimonials'),
    update: (id: number, data: any) => api.put(`/admin/testimonials/${id}`, data),
    delete: (id: number) => api.delete(`/admin/testimonials/${id}`),
    approve: (id: number) => api.post(`/admin/testimonials/${id}/approve`),
    reject: (id: number) => api.post(`/admin/testimonials/${id}/reject`),
  },
  projects: {
    create: (data: any) => {
      // Si c'est FormData, ne pas définir Content-Type (laisser le navigateur le faire)
      if (data instanceof FormData) {
        return api.post('/admin/projects', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.post('/admin/projects', data)
    },
    update: (id: number, data: any) => {
      // Si c'est FormData, utiliser POST avec _method=PUT ou utiliser PUT avec FormData
      if (data instanceof FormData) {
        data.append('_method', 'PUT')
        return api.post(`/admin/projects/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.put(`/admin/projects/${id}`, data)
    },
    delete: (id: number) => api.delete(`/admin/projects/${id}`),
  },
}

export default api

