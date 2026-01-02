import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { contactApi } from '../services/api'

interface FieldErrors {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
}

const Contact = () => {
  const { isDark } = useTheme()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Le nom est requis'
        if (value.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères'
        return undefined
      case 'email':
        if (!value.trim()) return 'L\'email est requis'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Veuillez entrer un email valide'
        return undefined
      case 'phone':
        if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) return 'Format de téléphone invalide'
        return undefined
      case 'subject':
        if (!value) return 'Veuillez sélectionner un sujet'
        return undefined
      case 'message':
        if (!value.trim()) return 'Le message est requis'
        if (value.trim().length < 10) return 'Le message doit contenir au moins 10 caractères'
        if (value.length > 2000) return 'Le message ne doit pas dépasser 2000 caractères'
        return undefined
      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const fieldError = validateField(name, value)
      setFieldErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }))
    }
    
    // Clear general error when user starts typing
    if (error) setError(null)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const fieldError = validateField(name, value)
    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Mark all fields as touched
    const allTouched = {
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
    }
    setTouched(allTouched)

    // Validate all fields
    const errors: FieldErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) errors[key as keyof FieldErrors] = error
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsSubmitting(false)
      // Scroll to first error
      const firstErrorField = document.querySelector('[name]') as HTMLElement
      if (firstErrorField) {
        firstErrorField.focus()
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    try {
      await contactApi.send({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || undefined,
        message: formData.message.trim(),
        subject: formData.subject || 'Nouveau message depuis le formulaire de contact',
      })

      setIsSubmitted(true)
      setFieldErrors({})
      setTouched({})
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })

      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err: any) {
      console.error('Error sending message:', err)
      
      // Handle field-specific errors from API
      if (err.response?.data?.errors) {
        const apiErrors: FieldErrors = {}
        Object.keys(err.response.data.errors).forEach(key => {
          apiErrors[key as keyof FieldErrors] = err.response.data.errors[key][0]
        })
        setFieldErrors(apiErrors)
      } else {
        setError(
          err.response?.data?.message || 
          'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const messageLength = formData.message.length
  const maxMessageLength = 2000

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'innosoftcreation@gmail.com',
      href: 'mailto:innosoftcreation@gmail.com',
    },
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+221 78 018 62 29',
      href: 'tel:+221780186229',
    },
    {
      icon: MapPin,
      label: 'Adresse',
      value: 'Ville verte, Thiès, Sénégal',
      href: '#',
    },
  ]

  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Contactez-<span className="gradient-text">Nous</span>
          </h1>
          <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 leading-relaxed">
            Discutons de votre projet et découvrons comment nous pouvons vous aider
          </p>
        </motion.div>
      </section>

      <section ref={ref} className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-display font-bold mb-6 text-white [data-theme='light']:text-dark-500">
                Informations de Contact
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon
                  return (
                    <a
                      key={info.label}
                      href={info.href}
                      className="flex items-start space-x-4 p-4 rounded-xl glass-effect hover:bg-white/5 [data-theme='light']:hover:bg-secondary-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-500 [data-theme='light']:text-secondary-600 mb-1">{info.label}</p>
                        <p className="text-white [data-theme='light']:text-dark-500 font-medium">{info.value}</p>
                      </div>
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="p-8 rounded-2xl glass-effect">
              {isSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/50"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-display font-bold mb-2 text-white [data-theme='light']:text-dark-500"
                  >
                    Message Envoyé avec Succès !
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-secondary-400 [data-theme='light']:text-secondary-600 mb-6"
                  >
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => setIsSubmitted(false)}
                    className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
                  >
                    Envoyer un autre message
                  </motion.button>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Nom complet *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 rounded-lg 
                            [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                            [data-theme='dark']:hover:bg-secondary-700
                            [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                            border
                            focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                            ${fieldErrors.name ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                          placeholder="Votre nom"
                          style={{
                            color: isDark ? '#ffffff' : '#111827',
                            WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            borderColor: fieldErrors.name ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                          }}
                        />
                        {fieldErrors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            {fieldErrors.name}
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
                          required
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 rounded-lg 
                            [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                            [data-theme='dark']:hover:bg-secondary-700
                            [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                            border
                            focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                            ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                          placeholder="votre@email.com"
                          style={{
                            color: isDark ? '#ffffff' : '#111827',
                            WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            borderColor: fieldErrors.email ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                          }}
                        />
                        {fieldErrors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            {fieldErrors.email}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 rounded-lg 
                            [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                            [data-theme='dark']:hover:bg-secondary-700
                            [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                            border
                            focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                            ${fieldErrors.phone ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                          placeholder="+221 XX XXX XX XX"
                          style={{
                            color: isDark ? '#ffffff' : '#111827',
                            WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            borderColor: fieldErrors.phone ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                          }}
                        />
                        {fieldErrors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            {fieldErrors.phone}
                          </motion.p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Sujet *
                      </label>
                      <div className="relative">
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 rounded-lg 
                            [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white
                            [data-theme='dark']:hover:bg-secondary-700
                            [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                            border focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                            [data-theme='dark']:[&>option]:bg-secondary-800 [data-theme='dark']:[&>option]:text-white
                            ${fieldErrors.subject ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                          style={{
                            color: isDark ? '#ffffff' : '#111827',
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            borderColor: fieldErrors.subject ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                          }}
                        >
                          <option value="">Sélectionnez un sujet</option>
                          <option value="web">Développement Web</option>
                          <option value="mobile">Application Mobile</option>
                          <option value="design">Design & Infographie</option>
                          <option value="hardware">Matériel</option>
                          <option value="other">Autre</option>
                        </select>
                        {fieldErrors.subject && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            {fieldErrors.subject}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="message" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700">
                        Message *
                      </label>
                      <span className={`text-xs ${messageLength > maxMessageLength ? 'text-red-400' : 'text-secondary-500'}`}>
                        {messageLength} / {maxMessageLength}
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={maxMessageLength}
                        className={`w-full px-4 py-3 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                          [data-theme='dark']:hover:bg-secondary-700
                          [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                          border
                          focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none
                          ${fieldErrors.message ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                        placeholder="Décrivez votre projet en détail..."
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: fieldErrors.message ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                        }}
                      />
                      {fieldErrors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          {fieldErrors.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>Envoyer le message</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact

