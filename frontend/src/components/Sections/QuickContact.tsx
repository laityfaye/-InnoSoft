import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MessageSquare, Send, MessageCircle, User, X } from 'lucide-react'
import { useState } from 'react'
import { contactApi } from '../../services/api'
import ChatWidget from '../Chat/ChatWidget'
import ChatWithAccount from '../Chat/ChatWithAccount'

const QuickContact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const [selectedMethod, setSelectedMethod] = useState<'email' | 'chat-anonymous' | 'chat-account' | 'whatsapp' | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await contactApi.send({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        subject: 'Message depuis "Parlons de votre projet"',
      })
      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => {
        setIsSubmitted(false)
        setSelectedMethod(null)
      }, 5000)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactOptions = [
    {
      id: 'email',
      icon: Mail,
      title: 'Envoyer un Email',
      description: 'Contactez-nous directement par email. Nous répondrons dans les plus brefs délais.',
      color: 'from-blue-500 to-blue-600',
      action: () => setSelectedMethod('email'),
    },
    {
      id: 'chat-anonymous',
      icon: MessageCircle,
      title: 'Chat Rapide',
      description: 'Discutez avec nous en temps réel sans créer de compte. Réponses instantanées.',
      color: 'from-primary-500 to-primary-600',
      action: () => {
        // Le widget de chat s'ouvrira automatiquement
        setSelectedMethod('chat-anonymous')
      },
    },
    {
      id: 'chat-account',
      icon: User,
      title: 'Chat avec Compte',
      description: 'Créez un compte pour suivre vos conversations et recevoir des notifications.',
      color: 'from-purple-500 to-purple-600',
      action: () => {
        // Le widget de chat avec compte s'ouvrira automatiquement
        setSelectedMethod('chat-account')
      },
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      title: 'WhatsApp Business',
      description: 'Contactez-nous via WhatsApp pour un support rapide et personnalisé.',
      color: 'from-green-500 to-green-600',
      action: () => {
        window.open('https://wa.me/221780186229?text=Bonjour, je souhaite discuter de mon projet.', '_blank')
      },
    },
  ]

  const contactMethods = [
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+221 78 018 62 29',
      link: 'tel:+221780186229',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'innosoftcreation@gmail.com',
      link: 'mailto:innosoftcreation@gmail.com',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: MessageSquare,
      label: 'WhatsApp',
      value: '+221 78 018 62 29',
      link: 'https://wa.me/221780186229',
      color: 'from-green-400 to-green-500',
    },
  ]

  return (
    <section ref={ref} className="section-padding bg-dark-600/30 [data-theme='light']:bg-secondary-50/50 transition-colors duration-300 w-full">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect text-sm font-medium text-primary-300 mb-6"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Rapide</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
              Parlons de Votre <span className="gradient-text">Projet</span>
            </h2>
            <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 mb-10 transition-colors">
              Contactez-nous dès aujourd'hui et discutons de la façon dont nous pouvons transformer votre vision en réalité
            </p>

            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <motion.a
                    key={method.label}
                    href={method.link}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    whileHover={{ x: 8 }}
                    className="flex items-center space-x-4 p-4 rounded-xl glass-effect card-hover border-primary-500/0 hover:border-primary-500/20 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 transition-colors">
                        {method.label}
                      </p>
                      <p className="text-white [data-theme='light']:text-dark-500 font-semibold transition-colors">
                        {method.value}
                      </p>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Right Side - Contact Options */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {selectedMethod === 'email' ? (
              <div className="p-8 rounded-2xl glass-effect border-primary-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white [data-theme='light']:text-dark-500 transition-colors">
                    Envoyez-nous un email
                  </h3>
                  <button
                    onClick={() => setSelectedMethod(null)}
                    className="text-secondary-400 hover:text-white [data-theme='light']:hover:text-dark-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-400" />
                    </div>
                    <p className="text-green-400 font-semibold">Message envoyé avec succès !</p>
                    <p className="text-secondary-400 [data-theme='light']:text-secondary-600 text-sm mt-2">
                      Nous vous répondrons dans les plus brefs délais
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                        className="w-full px-4 py-3 rounded-xl glass-effect border border-primary-500/20 focus:border-primary-500/50 focus:outline-none text-white [data-theme='light']:text-dark-500 placeholder:text-secondary-400 [data-theme='light']:placeholder:text-secondary-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Votre email"
                        required
                        className="w-full px-4 py-3 rounded-xl glass-effect border border-primary-500/20 focus:border-primary-500/50 focus:outline-none text-white [data-theme='light']:text-dark-500 placeholder:text-secondary-400 [data-theme='light']:placeholder:text-secondary-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Votre message"
                        required
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl glass-effect border border-primary-500/20 focus:border-primary-500/50 focus:outline-none text-white [data-theme='light']:text-dark-500 placeholder:text-secondary-400 [data-theme='light']:placeholder:text-secondary-500 transition-all duration-300 resize-none"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-primary flex items-center justify-center space-x-2 py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Envoyer le message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactOptions.map((option, index) => {
                  const Icon = option.icon
                  return (
                    <motion.button
                      key={option.id}
                      onClick={option.action}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-6 rounded-2xl glass-effect border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 text-left group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-white [data-theme='light']:text-dark-500 transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 transition-colors">
                        {option.description}
                      </p>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Chat Widgets */}
      {selectedMethod === 'chat-anonymous' && <ChatWidget />}
      {selectedMethod === 'chat-account' && <ChatWithAccount />}
    </section>
  )
}

export default QuickContact

