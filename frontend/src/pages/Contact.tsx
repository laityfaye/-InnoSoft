import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const Contact = () => {
  const { isDark } = useTheme()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })

    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'contact@innosoft-creation.com',
      href: 'mailto:contact@innosoft-creation.com',
    },
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+221 00 000 00 00',
      href: 'tel:+221000000000',
    },
    {
      icon: MapPin,
      label: 'Adresse',
      value: 'Dakar, Sénégal',
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
          <p className="text-xl text-gray-400 [data-theme='light']:text-gray-600 leading-relaxed">
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
                      className="flex items-start space-x-4 p-4 rounded-xl glass-effect hover:bg-white/5 [data-theme='light']:hover:bg-gray-100 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 [data-theme='light']:text-gray-600 mb-1">{info.label}</p>
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
                  <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2 text-white [data-theme='light']:text-dark-500">
                    Message Envoyé !
                  </h3>
                  <p className="text-gray-400 [data-theme='light']:text-gray-600">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg 
                          [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white [data-theme='dark']:placeholder-gray-400
                          [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                          [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-gray-400
                          [data-theme='light']:hover:border-primary-400
                          border
                          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                        placeholder="Votre nom"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg 
                          [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white [data-theme='dark']:placeholder-gray-400
                          [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                          [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-gray-400
                          [data-theme='light']:hover:border-primary-400
                          border
                          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                        placeholder="votre@email.com"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg 
                          [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white [data-theme='dark']:placeholder-gray-400
                          [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                          [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-gray-400
                          [data-theme='light']:hover:border-primary-400
                          border
                          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                        placeholder="+221 XX XXX XX XX"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                        Sujet *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg 
                          [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                          [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          [data-theme='light']:hover:border-primary-400
                          border focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all
                          [data-theme='dark']:[&>option]:bg-gray-800 [data-theme='dark']:[&>option]:text-white"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="web">Développement Web</option>
                        <option value="mobile">Application Mobile</option>
                        <option value="design">Design & Infographie</option>
                        <option value="hardware">Matériel</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg 
                        [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white [data-theme='dark']:placeholder-gray-400
                        [data-theme='dark']:hover:bg-gray-750 [data-theme='dark']:hover:border-gray-600
                        [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-gray-400
                        border
                        focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                      placeholder="Décrivez votre projet..."
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
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

