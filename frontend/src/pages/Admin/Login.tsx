import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import { Zap, Lock, Mail } from 'lucide-react'

const Login = () => {
  const { isDark } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Erreur de connexion. Vérifiez vos identifiants et que le serveur backend est démarré.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="p-8 rounded-2xl glass-effect">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Zap className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-display font-bold gradient-text">
                InnoSoft Admin
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold mb-2 text-white [data-theme='light']:text-dark-500">
              Connexion
            </h1>
            <p className="text-secondary-400 [data-theme='light']:text-secondary-600">
              Accédez au panneau d'administration
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border
                    [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                    [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                    [data-theme='light']:bg-white [data-theme='light']:border-2 [data-theme='light']:border-secondary-300 [data-theme='light']:text-secondary-900 [data-theme='light']:placeholder-secondary-400
                    focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="Entrez votre email"
                  style={{
                    color: isDark ? '#ffffff' : '#111827',
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: isDark ? '#374151' : '#d1d5db',
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border
                    [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                    [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                    [data-theme='light']:bg-white [data-theme='light']:border-2 [data-theme='light']:border-secondary-300 [data-theme='light']:text-secondary-900 [data-theme='light']:placeholder-secondary-400
                    focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="Entrez votre mot de passe"
                  style={{
                    color: isDark ? '#ffffff' : '#111827',
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: isDark ? '#374151' : '#d1d5db',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        </div>
      </motion.div>
    </div>
  )
}

export default Login

