import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Store, Mail, Lock, AlertCircle } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { boutiqueAuthApi } from '../../services/api'

const BoutiqueLogin = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const response = await boutiqueAuthApi.login(formData.email, formData.password)
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Erreur de connexion')
      }

      const { token, must_change_password, user, boutique } = response.data.data

      if (!token) {
        throw new Error('Token manquant dans la réponse')
      }

      // Sauvegarder le token
      localStorage.setItem('boutique_token', token)
      // Supprimer le token admin s'il existe
      localStorage.removeItem('admin_token')
      
      // Mettre à jour les headers de l'API
      const { default: api } = await import('../../services/api')
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Si le mot de passe doit être changé, rediriger vers la page de changement
      if (must_change_password) {
        navigate('/boutique/dashboard?change-password=true')
      } else {
        navigate('/boutique/dashboard')
      }
    } catch (error: any) {
      console.error('Boutique login error:', error)
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message })
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat()
        setErrors({ general: errorMessages[0] || 'Erreur de validation' })
      } else {
        setErrors({ general: error.message || 'Une erreur est survenue. Veuillez réessayer.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-500 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold gradient-text mb-2">
            Connexion Boutique
          </h2>
          <p className="text-secondary-400 [data-theme='light']:text-secondary-600">
            Accédez à votre tableau de bord
          </p>
        </div>

        <div className="glass-effect rounded-2xl p-8">
          {errors.general && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className={`w-full px-4 py-3 rounded-lg 
                    [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                    [data-theme='dark']:hover:bg-secondary-700
                    [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                    border
                    focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                    ${errors.email ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                  placeholder="Entrez votre email"
                  style={{
                    color: isDark ? '#ffffff' : '#111827',
                    WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: errors.email ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                  }}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 rounded-lg 
                    [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                    [data-theme='dark']:hover:bg-secondary-700
                    [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                    border
                    focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                    ${errors.password ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                  placeholder="Entrez votre mot de passe"
                  style={{
                    color: isDark ? '#ffffff' : '#111827',
                    WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: errors.password ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                  }}
                />
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.password}
                  </motion.p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
              Vous n'avez pas encore de compte ?{' '}
              <a href="/boutique-request" className="text-primary-400 hover:text-primary-300 transition-colors">
                Demander une boutique
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default BoutiqueLogin

