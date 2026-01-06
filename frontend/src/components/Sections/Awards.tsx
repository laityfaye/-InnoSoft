import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Trophy, Award, Medal, Star, TrendingUp } from 'lucide-react'
import { awardsApi } from '../../services/api'

interface AwardItem {
  id: number
  title: string
  organization: string
  year: number
  description: string
  image?: string
  icon_type: string
  color: string
  award_url?: string
  is_active: boolean
}

const Awards = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [awards, setAwards] = useState<AwardItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAwards()
  }, [])

  const loadAwards = async () => {
    try {
      setLoading(true)
      const response = await awardsApi.getAll()
      setAwards(response.data.data || [])
    } catch (error) {
      console.error('Error loading awards:', error)
      setAwards([])
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'award':
        return Award
      case 'medal':
        return Medal
      case 'star':
        return Star
      case 'trending-up':
        return TrendingUp
      default:
        return Trophy
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
            <TrendingUp className="w-4 h-4" />
            <span>Récompenses & Reconnaissances</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            Nos <span className="gradient-text">Récompenses</span>
          </h2>
          <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 max-w-2xl mx-auto transition-colors">
            Des reconnaissances qui témoignent de notre engagement et de notre excellence
          </p>
        </motion.div>

        {/* Awards Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : awards.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-secondary-400 [data-theme='light']:text-secondary-600" />
            <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600">
              Aucune récompense disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, index) => {
              const Icon = getIcon(award.icon_type)
              return (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="relative p-8 rounded-2xl glass-effect card-hover border-primary-500/0 group-hover:border-primary-500/20 transition-all duration-500">
                    {/* Icon & Year */}
                    <div className="flex items-start justify-between mb-6">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${award.color} flex items-center justify-center shadow-xl`}
                      >
                        {award.image ? (
                          <img src={award.image} alt={award.title} className="w-16 h-16 object-contain relative z-10" />
                        ) : (
                          <Icon className="w-10 h-10 text-white relative z-10" />
                        )}
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${award.color} blur-xl`}
                        />
                      </motion.div>
                      <span className="px-4 py-2 rounded-full glass-effect text-sm font-bold text-primary-400">
                        {award.year}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-3 text-white [data-theme='light']:text-dark-500 transition-colors">
                      {award.title}
                    </h3>
                    <p className="text-primary-400 mb-4 font-medium">
                      {award.organization}
                    </p>
                    <p className="text-secondary-400 [data-theme='light']:text-secondary-600 leading-relaxed transition-colors">
                      {award.description}
                    </p>

                    {/* Hover Glow */}
                    <div className={`absolute -inset-4 bg-gradient-to-br ${award.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700 -z-10`} />
                    
                    {/* Bottom Accent */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${award.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl`} />
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

export default Awards

