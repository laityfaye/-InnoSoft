import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, Shield, CheckCircle, Star } from 'lucide-react'
import { certificationsApi } from '../../services/api'

interface Certification {
  id: number
  name: string
  description: string
  image?: string
  icon_type: string
  color: string
  issuer?: string
  issued_date?: string
  expiry_date?: string
  certificate_url?: string
  is_active: boolean
}

const Certifications = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCertifications()
  }, [])

  const loadCertifications = async () => {
    try {
      setLoading(true)
      const response = await certificationsApi.getAll()
      setCertifications(response.data.data || [])
    } catch (error) {
      console.error('Error loading certifications:', error)
      setCertifications([])
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'shield':
        return Shield
      case 'check-circle':
        return CheckCircle
      case 'star':
        return Star
      default:
        return Award
    }
  }

  return (
    <section ref={ref} className="section-padding bg-dark-600/30 [data-theme='light']:bg-secondary-50/50 transition-colors duration-300 w-full">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect text-sm font-medium text-primary-300 mb-6"
          >
            <Award className="w-4 h-4" />
            <span>Certifications & Accréditations</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            Nos <span className="gradient-text">Certifications</span>
          </h2>
          <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 max-w-2xl mx-auto transition-colors">
            Des certifications qui garantissent notre expertise et notre engagement qualité
          </p>
        </motion.div>

        {/* Certifications Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : certifications.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-16 h-16 mx-auto mb-4 text-secondary-400 [data-theme='light']:text-secondary-600" />
            <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600">
              Aucune certification disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {certifications.map((cert, index) => {
              const Icon = getIcon(cert.icon_type)
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group relative"
                >
                  <div className="relative p-6 rounded-2xl glass-effect card-hover border-primary-500/0 group-hover:border-primary-500/20 transition-all duration-500 text-center">
                    {/* Icon/Image */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`relative w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500`}
                    >
                      {cert.image ? (
                        <img src={cert.image} alt={cert.name} className="w-12 h-12 object-contain relative z-10" />
                      ) : (
                        <Icon className="w-8 h-8 text-white relative z-10" />
                      )}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${cert.color} blur-xl`}
                      />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-sm font-bold mb-2 text-white [data-theme='light']:text-dark-500 transition-colors line-clamp-2">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 leading-relaxed transition-colors">
                      {cert.description}
                    </p>

                    {/* Hover Glow */}
                    <div className={`absolute -inset-4 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700 -z-10`} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Certifications

