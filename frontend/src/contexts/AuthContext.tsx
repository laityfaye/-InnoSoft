import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../services/api'

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('admin_token')
    if (storedToken) {
      setToken(storedToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      // Verify token by fetching user
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/admin/me')
      setUser(response.data.data)
    } catch (error) {
      // Token invalid, clear it
      localStorage.removeItem('admin_token')
      setToken(null)
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/admin/login', { email, password })
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Erreur de connexion')
      }
      
      const { token: newToken, user: newUser } = response.data.data
      
      if (!newToken || !newUser) {
        throw new Error('Réponse invalide du serveur')
      }
      
      setToken(newToken)
      setUser(newUser)
      localStorage.setItem('admin_token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } catch (error: any) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.errors?.email?.[0]
        || error.message 
        || 'Erreur de connexion. Vérifiez vos identifiants.'
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await api.post('/admin/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setToken(null)
      setUser(null)
      localStorage.removeItem('admin_token')
      delete api.defaults.headers.common['Authorization']
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

