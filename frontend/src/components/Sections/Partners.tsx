import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { Building2, CheckCircle, ExternalLink, Sparkles } from 'lucide-react'
import { partnersApi } from '../../services/api'

interface Partner {
  id: number
  name: string
  logo?: string
  website?: string
  order: number
  is_active: boolean
}

const Partners = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setLoading(true)
        const response = await partnersApi.getAll()
        setPartners(response.data.data || [])
      } catch (error) {
        console.error('Error loading partners:', error)
        setPartners([])
      } finally {
        setLoading(false)
      }
    }

    loadPartners()
  }, [])

  // Animation de défilement automatique
  useEffect(() => {
    if (!scrollContainerRef.current || partners.length === 0) return

    const container = scrollContainerRef.current
    let scrollPosition = 0
    const scrollSpeed = 0.8 // Vitesse de défilement améliorée (pixels par frame)
    let isPaused = false

    // Pause au survol
    const handleMouseEnter = () => { isPaused = true }
    const handleMouseLeave = () => { isPaused = false }

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    let animationId: number
    const startAnimation = () => {
      if (!isPaused) {
        scrollPosition += scrollSpeed
        // Si on arrive à la fin (moitié du contenu dupliqué), on revient au début
        if (scrollPosition >= container.scrollWidth / 2) {
          scrollPosition = 0
        }
        container.scrollLeft = scrollPosition
      }
      animationId = requestAnimationFrame(startAnimation)
    }
    animationId = requestAnimationFrame(startAnimation)

    return () => {
      cancelAnimationFrame(animationId)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [partners.length])

  // Ne pas afficher la section si aucun partenaire n'est configuré
  if (!loading && partners.length === 0) {
    return null
  }

  // Dupliquer les partenaires pour le défilement infini
  const duplicatedPartners = [...partners, ...partners]

  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-accent-600',
  }

  // Alterner les couleurs pour chaque partenaire
  const getColorForIndex = (index: number): keyof typeof colorClasses => {
    const colors: (keyof typeof colorClasses)[] = ['primary', 'secondary', 'accent', 'primary']
    return colors[index % colors.length]
  }

  return (
    <section ref={ref} className="section-padding relative overflow-hidden w-full">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20"
          >
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">
              Partenaires
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-8 tracking-tight">
            Ils nous <span className="gradient-text">Font Confiance</span>
          </h2>
          <p className="text-xl text-secondary-400 max-w-2xl mx-auto">
            Des entreprises de toutes tailles nous font confiance pour leurs projets numériques
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative">
            {/* Connection line animée - comme dans Process mais adaptée pour le scroll */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500/20 via-primary-500/40 to-primary-500/20 z-0 origin-left"
            />

            {/* Gradient masks améliorés pour l'effet de fondu sur les bords */}
            <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-dark-900 via-dark-900/80 to-transparent z-10 pointer-events-none" />

            {/* Container de défilement - exactement comme la grille de Process mais en flex horizontal */}
            <div
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-hidden scrollbar-hide relative w-full"
              style={{ scrollBehavior: 'auto' }}
            >
              {duplicatedPartners.map((partner, index) => {
                const color = getColorForIndex(index)
                const Icon = Building2
                
                return (
                  <motion.div
                    key={`${partner.id}-${index}`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: (index % partners.length) * 0.15, duration: 0.6 }}
                    className="relative flex-shrink-0 px-4 pt-4"
                    style={{ minWidth: 'min(280px, calc(100vw - 2rem))', maxWidth: '320px', width: 'min(280px, calc(100vw - 2rem))' }}
                  >
                    {/* Step card amélioré */}
                    <motion.div 
                      className="relative group pb-8"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Card background avec glass effect amélioré */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-dark-600/30 to-dark-700/30 backdrop-blur-sm border border-primary-500/10 group-hover:border-primary-500/30 transition-all duration-500 opacity-0 group-hover:opacity-100" />

                      {/* Icon container amélioré */}
                      <div className="relative z-10 mb-8">
                        {partner.logo ? (
                          <motion.div 
                            className="w-28 h-28 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 p-4 relative overflow-hidden border border-gray-200"
                            whileHover={{ scale: 1.1, rotate: 3 }}
                          >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="max-w-full max-h-full object-contain relative z-10"
                            />
                          </motion.div>
                        ) : (
                          <motion.div 
                            className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-xl shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden`}
                            whileHover={{ scale: 1.1, rotate: 3 }}
                          >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Icon className="w-14 h-14 text-white relative z-10" />
                          </motion.div>
                        )}
                        {/* Glow effect amélioré */}
                        <motion.div 
                          className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10`}
                          animate={inView ? { 
                            scale: [1, 1.2, 1],
                            opacity: [0, 0.2, 0]
                          } : {}}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            delay: index * 0.2 
                          }}
                        />
                      </div>

                      {/* Step number amélioré */}
                      <motion.div 
                        className="absolute top-2 right-2 w-14 h-14 rounded-full bg-dark-600 border-2 border-primary-500/30 flex items-center justify-center group-hover:border-primary-500/60 group-hover:scale-110 transition-all duration-300 shadow-lg z-20"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="text-xl font-black text-primary-400 group-hover:text-primary-300 transition-colors">
                          {String((index % partners.length) + 1).padStart(2, '0')}
                        </span>
                      </motion.div>

                      {/* Content amélioré */}
                      <div className="relative z-10 mt-4">
                        {partner.website ? (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group/link"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                                {partner.name}
                              </h3>
                              <ExternalLink className="w-5 h-5 text-primary-500/0 group-hover/link:text-primary-400 group-hover/link:translate-x-1 transition-all duration-300" />
                            </div>
                            <p className="text-secondary-400 leading-relaxed text-base group-hover/link:text-secondary-300 transition-colors">
                              Visiter le site web
                            </p>
                          </a>
                        ) : (
                          <>
                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary-400 transition-colors">
                              {partner.name}
                            </h3>
                            <p className="text-secondary-400 leading-relaxed text-base">
                              Notre partenaire
                            </p>
                          </>
                        )}
                      </div>

                      {/* Decorative element amélioré avec animation */}
                      <motion.div 
                        className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-primary origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      
                      {/* Particules animées au survol */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-primary-400 rounded-full"
                            initial={{ 
                              x: '50%', 
                              y: '50%', 
                              scale: 0 
                            }}
                            whileHover={{
                              x: `${50 + (Math.random() - 0.5) * 100}%`,
                              y: `${50 + (Math.random() - 0.5) * 100}%`,
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.3
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Bottom CTA amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Link to="/contact">
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-4 rounded-xl glass-effect border border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <CheckCircle className="w-6 h-6 text-primary-400 group-hover:text-primary-300 transition-colors" />
              </motion.div>
              <p className="text-white font-medium group-hover:text-primary-300 transition-colors">
                Rejoignez nos clients satisfaits
              </p>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Partners

