import { useState } from 'react'
import { motion } from 'framer-motion'
import { Store, Mail, Phone, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { boutiqueRequestApi } from '../services/api'
import SEO from '../components/SEO'

const BoutiqueRequest = () => {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    boutique_name: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis'
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    if (!formData.boutique_name.trim()) newErrors.boutique_name = 'Le nom de la boutique est requis'
    if (!formData.description.trim()) newErrors.description = 'La description est requise'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await boutiqueRequestApi.create(formData)
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        boutique_name: '',
        description: '',
      })
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {}
        Object.keys(error.response.data.errors).forEach((key) => {
          apiErrors[key] = error.response.data.errors[key][0]
        })
        setErrors(apiErrors)
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <SEO
          title="Demande envoyée - Boutique UIDT"
          description="Votre demande d'ouverture de boutique a été envoyée avec succès"
          url="/boutique-request"
        />
        <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-20 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-2xl p-12 max-w-2xl mx-auto text-center"
          >
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold mb-4 gradient-text">
              Demande envoyée avec succès !
            </h2>
            <p className="text-lg text-secondary-400 [data-theme='light']:text-secondary-600 mb-6">
              Votre demande d'ouverture de boutique a été soumise avec succès. Nous vous contacterons sous peu pour vous informer de la suite.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="btn-primary"
            >
              Faire une autre demande
            </button>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Demander une boutique - Boutique UIDT"
        description="Soumettez votre demande pour ouvrir une boutique sur Boutique UIDT"
        url="/boutique-request"
      />
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-20 min-h-screen">
        <section className="container-custom max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Ouvrir une <span className="gradient-text">Boutique</span>
            </h1>
            <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 leading-relaxed">
              Soumettez votre demande pour ouvrir votre boutique sur Boutique UIDT
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-effect rounded-2xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                  Nom complet *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg 
                      [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                      [data-theme='dark']:hover:bg-secondary-700
                      [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                      border
                      focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                      ${errors.name ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                    placeholder="Votre nom complet"
                    style={{
                      color: isDark ? '#ffffff' : '#111827',
                      WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      borderColor: errors.name ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                    }}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </motion.p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg 
                      [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                      [data-theme='dark']:hover:bg-secondary-700
                      [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                      border
                      focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                      ${errors.email ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                    placeholder="votre@email.com"
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
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                  Téléphone <span className="text-secondary-500 text-xs">(optionnel)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg 
                      [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                      [data-theme='dark']:hover:bg-secondary-700
                      [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                      border
                      focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                      [data-theme='dark']:border-secondary-700 [data-theme='dark']:focus:border-primary-500 [data-theme='light']:border-secondary-300 [data-theme='light']:focus:border-primary-500"
                    placeholder="+221 XX XXX XX XX"
                    style={{
                      color: isDark ? '#ffffff' : '#111827',
                      WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      borderColor: isDark ? '#374151' : '#d1d5db',
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="boutique_name" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                  Nom de la boutique *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="boutique_name"
                    name="boutique_name"
                    value={formData.boutique_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg 
                      [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                      [data-theme='dark']:hover:bg-secondary-700
                      [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                      border
                      focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                      ${errors.boutique_name ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                    placeholder="Nom de votre boutique"
                    style={{
                      color: isDark ? '#ffffff' : '#111827',
                      WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      borderColor: errors.boutique_name ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                    }}
                  />
                  {errors.boutique_name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.boutique_name}
                    </motion.p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                  Description de la boutique *
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg 
                      [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                      [data-theme='dark']:hover:bg-secondary-700
                      [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                      border
                      focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none
                      ${errors.description ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                    placeholder="Décrivez votre boutique, les produits que vous souhaitez vendre, etc."
                    style={{
                      color: isDark ? '#ffffff' : '#111827',
                      WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      borderColor: errors.description ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                    }}
                  />
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.description}
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
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Soumettre la demande</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </section>
      </div>
    </>
  )
}

export default BoutiqueRequest

