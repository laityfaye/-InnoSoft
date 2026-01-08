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
const adminToken = localStorage.getItem('admin_token')
const boutiqueToken = localStorage.getItem('boutique_token')
const token = adminToken || boutiqueToken
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Request interceptor to add token dynamically
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('admin_token')
    const boutiqueToken = localStorage.getItem('boutique_token')
    const token = adminToken || boutiqueToken
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
      const isAdminRoute = window.location.pathname.startsWith('/admin')
      const isBoutiqueRoute = window.location.pathname.startsWith('/boutique')
      
      if (isAdminRoute) {
        localStorage.removeItem('admin_token')
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login'
        }
      } else if (isBoutiqueRoute) {
        localStorage.removeItem('boutique_token')
        if (window.location.pathname !== '/boutique/login') {
          window.location.href = '/boutique/login'
        }
      }
      delete api.defaults.headers.common['Authorization']
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

// Products
export const productsApi = {
  getAll: (category?: string, search?: string) => {
    const params: any = {}
    if (category && category !== 'all') params.category = category
    if (search) params.search = search
    return api.get('/products', { params })
  },
  getById: (id: number) => api.get(`/products/${id}`),
}

// Partners
export const partnersApi = {
  getAll: () => api.get('/partners'),
  getById: (id: number) => api.get(`/partners/${id}`),
}

// News
export const newsApi = {
  getAll: (category?: string, limit?: number) => {
    const params: any = {}
    if (category && category !== 'all') params.category = category
    if (limit) params.limit = limit
    return api.get('/news', { params })
  },
  getById: (id: number | string) => api.get(`/news/${id}`),
}

// Team
export const teamApi = {
  getAll: () => api.get('/team'),
  getById: (id: number) => api.get(`/team/${id}`),
}

// Certifications
export const certificationsApi = {
  getAll: () => api.get('/certifications'),
  getById: (id: number) => api.get(`/certifications/${id}`),
}

// Awards
export const awardsApi = {
  getAll: () => api.get('/awards'),
  getById: (id: number) => api.get(`/awards/${id}`),
}

// Videos
export const videosApi = {
  getAll: () => api.get('/videos'),
  getFeatured: () => api.get('/videos/featured'),
  getById: (id: number) => api.get(`/videos/${id}`),
}

// Social Links
export const socialLinksApi = {
  getAll: () => api.get('/social-links'),
  getById: (id: number) => api.get(`/social-links/${id}`),
}

// Chat
export const chatApi = {
  createAnonymousConversation: (data: { session_id?: string; name?: string; email?: string }) =>
    api.post('/chat/anonymous/conversation', data),
  createAuthenticatedConversation: () =>
    api.post('/chat/authenticated/conversation'),
  getMessages: (conversationId: number, sessionId?: string) =>
    api.get(`/chat/conversations/${conversationId}/messages`, { params: { session_id: sessionId } }),
  sendMessage: (conversationId: number, content: string, sessionId?: string) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { content, session_id: sessionId }),
}

// Contact
export const contactApi = {
  send: (data: { name: string; email: string; message: string; subject?: string; phone?: string }) =>
    api.post('/contact', data),
}

// Orders
export const ordersApi = {
  create: (data: {
    customer_name: string
    customer_email: string
    customer_phone?: string
    shipping_address: string
    city?: string
    country?: string
    payment_method?: string
    delivery_type?: 'pickup' | 'delivery'
    customer_latitude?: number
    customer_longitude?: number
    notes?: string
    items: Array<{ product_id: number; quantity: number }>
  }) => api.post('/orders', data),
  getById: (id: number) => api.get(`/orders/${id}`),
}

// Contact Messages (Admin)
export const contactMessagesApi = {
  getAll: () => api.get('/admin/contact-messages'),
  getById: (id: number) => api.get(`/admin/contact-messages/${id}`),
  markAsRead: (id: number) => api.post(`/admin/contact-messages/${id}/mark-read`),
  reply: (id: number, replyMessage: string) => 
    api.post(`/admin/contact-messages/${id}/reply`, { reply_message: replyMessage }),
  delete: (id: number) => api.delete(`/admin/contact-messages/${id}`),
}

// Boutique_UIDT APIs
export const boutiqueRequestApi = {
  create: (data: {
    name: string
    email: string
    phone?: string
    boutique_name: string
    description?: string
  }) => api.post('/boutique-requests', data),
}

export const boutiquesApi = {
  getAll: (search?: string) => {
    const params = search ? { search } : {}
    return api.get('/boutiques', { params })
  },
  getById: (id: number) => api.get(`/boutiques/${id}`),
  getBySlug: (slug: string) => api.get(`/boutiques/slug/${slug}`),
  getProducts: (id: number, category?: string, search?: string) => {
    const params: any = {}
    if (category && category !== 'all') params.category = category
    if (search) params.search = search
    return api.get(`/boutiques/${id}/products`, { params })
  },
  getProduct: (boutiqueId: number, productId: number) => 
    api.get(`/boutiques/${boutiqueId}/products/${productId}`),
  createOrder: (id: number, data: {
    customer_name: string
    customer_email: string
    customer_phone?: string
    shipping_address: string
    city?: string
    country?: string
    payment_method?: string
    notes?: string
    items: Array<{ product_id: number; quantity: number }>
  }) => api.post(`/boutiques/${id}/orders`, data),
}

export const boutiqueAuthApi = {
  login: (email: string, password: string) => 
    api.post('/boutique/login', { email, password }),
  logout: () => api.post('/boutique/logout'),
  me: () => api.get('/boutique/me'),
  changePassword: (currentPassword: string, newPassword: string, newPasswordConfirmation: string) =>
    api.post('/boutique/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    }),
}

export const boutiqueRequestAdminApi = {
  getAll: (status?: string) => {
    const params = status ? { status } : {}
    return api.get('/admin/boutique-requests', { params })
  },
  getById: (id: number) => api.get(`/admin/boutique-requests/${id}`),
  approve: (id: number) => api.post(`/admin/boutique-requests/${id}/approve`),
  reject: (id: number, adminNotes?: string) => 
    api.post(`/admin/boutique-requests/${id}/reject`, { admin_notes: adminNotes }),
  delete: (id: number) => api.delete(`/admin/boutique-requests/${id}`),
}

export const boutiqueOwnerApi = {
  getMyBoutique: () => api.get('/boutique/my-boutique'),
  updateMyBoutique: (data: any) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT')
      return api.post('/boutique/my-boutique', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.put('/boutique/my-boutique', data)
  },
  getMyProducts: () => api.get('/boutique/products'),
  createProduct: (data: any) => {
    if (data instanceof FormData) {
      return api.post('/boutique/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.post('/boutique/products', data)
  },
  updateProduct: (productId: number, data: any) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT')
      return api.post(`/boutique/products/${productId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    return api.put(`/boutique/products/${productId}`, data)
  },
  deleteProduct: (productId: number) => api.delete(`/boutique/products/${productId}`),
  getMyOrders: (status?: string) => {
    const params = status ? { status } : {}
    return api.get('/boutique/orders', { params })
  },
  getOrder: (orderId: number) => api.get(`/boutique/orders/${orderId}`),
  updateOrderStatus: (orderId: number, status: string) =>
    api.put(`/boutique/orders/${orderId}/status`, { status }),
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
  products: {
    create: (data: any) => {
      if (data instanceof FormData) {
        return api.post('/admin/products', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.post('/admin/products', data)
    },
    update: (id: number, data: any) => {
      if (data instanceof FormData) {
        data.append('_method', 'PUT')
        return api.post(`/admin/products/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.put(`/admin/products/${id}`, data)
    },
    delete: (id: number) => api.delete(`/admin/products/${id}`),
  },
  partners: {
    getAll: () => api.get('/admin/partners'),
    create: (data: any) => {
      if (data instanceof FormData) {
        return api.post('/admin/partners', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.post('/admin/partners', data)
    },
    update: (id: number, data: any) => {
      if (data instanceof FormData) {
        data.append('_method', 'PUT')
        return api.post(`/admin/partners/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.put(`/admin/partners/${id}`, data)
    },
    delete: (id: number) => api.delete(`/admin/partners/${id}`),
  },
  news: {
    getAll: () => api.get('/admin/news'),
    create: (data: any) => {
      if (data instanceof FormData) {
        return api.post('/admin/news', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.post('/admin/news', data)
    },
    update: (id: number, data: any) => {
      if (data instanceof FormData) {
        data.append('_method', 'PUT')
        return api.post(`/admin/news/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.put(`/admin/news/${id}`, data)
    },
    delete: (id: number) => api.delete(`/admin/news/${id}`),
  },
  team: {
    getAll: () => api.get('/admin/team'),
    create: (data: any) => {
      if (data instanceof FormData) {
        return api.post('/admin/team', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.post('/admin/team', data)
    },
    update: (id: number, data: any) => {
      if (data instanceof FormData) {
        data.append('_method', 'PUT')
        return api.post(`/admin/team/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.put(`/admin/team/${id}`, data)
    },
    delete: (id: number) => api.delete(`/admin/team/${id}`),
  },
  certifications: {
    getAll: () => api.get('/admin/certifications'),
    create: (data: any) => {
      if (data instanceof FormData) {
        return api.post('/admin/certifications', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.post('/admin/certifications', data)
    },
    update: (id: number, data: any) => {
      if (data instanceof FormData) {
        data.append('_method', 'PUT')
        return api.post(`/admin/certifications/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.put(`/admin/certifications/${id}`, data)
    },
    delete: (id: number) => api.delete(`/admin/certifications/${id}`),
  },
  awards: {
    getAll: () => api.get('/admin/awards'),
    create: (data: any) => {
      if (data instanceof FormData) {
        return api.post('/admin/awards', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.post('/admin/awards', data)
    },
    update: (id: number, data: any) => {
      if (data instanceof FormData) {
        data.append('_method', 'PUT')
        return api.post(`/admin/awards/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.put(`/admin/awards/${id}`, data)
    },
    delete: (id: number) => api.delete(`/admin/awards/${id}`),
  },
  videos: {
    getAll: () => api.get('/admin/videos'),
    create: (data: any) => {
      if (data instanceof FormData) {
        return api.post('/admin/videos', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.post('/admin/videos', data)
    },
    update: (id: number, data: any) => {
      if (data instanceof FormData) {
        data.append('_method', 'PUT')
        return api.post(`/admin/videos/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.put(`/admin/videos/${id}`, data)
    },
    delete: (id: number) => api.delete(`/admin/videos/${id}`),
  },
  socialLinks: {
    getAll: () => api.get('/admin/social-links'),
    create: (data: any) => api.post('/admin/social-links', data),
    update: (id: number, data: any) => api.put(`/admin/social-links/${id}`, data),
    delete: (id: number) => api.delete(`/admin/social-links/${id}`),
  },
  chat: {
    getAllConversations: () => api.get('/admin/chat/conversations'),
    getConversation: (id: number) => api.get(`/admin/chat/conversations/${id}`),
    replyToConversation: (id: number, content: string) => api.post(`/admin/chat/conversations/${id}/reply`, { content }),
    markAsRead: (id: number) => api.post(`/admin/chat/conversations/${id}/mark-read`),
  },
}

export default api

