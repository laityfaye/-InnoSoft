import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import { Store, Search, MapPin, Phone, Mail, ShoppingBag, Building2 } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useDebounce } from '../hooks/useDebounce'
import { boutiquesApi } from '../services/api'
import SEO from '../components/SEO'

interface Boutique {
  id: number
  name: string
  slug: string
  description?: string
  email: string
  phone?: string
  address?: string
  logo?: string
  status: string
  owner?: {
    id: number
    name: string
    email: string
  }
}

const Boutiques = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [boutiques, setBoutiques] = useState<Boutique[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300) // Debounce de 300ms

  // Load boutiques on mount and when debounced search term changes
  useEffect(() => {
    loadBoutiques()
  }, [debouncedSearchTerm])

  const loadBoutiques = useCallback(async () => {
    setLoading(true)
    try {
      const response = await boutiquesApi.getAll(debouncedSearchTerm || undefined)
      setBoutiques(response.data.data || [])
    } catch (error) {
      console.error('Error loading boutiques:', error)
      setBoutiques([])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearchTerm])

  return (
    <>
      <SEO
        title="Boutique UIDT - Découvrez nos boutiques partenaires"
        description="Explorez toutes les boutiques disponibles sur Boutique UIDT. Trouvez les produits et services qui vous intéressent."
        url="/boutiques"
      />
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-20 min-h-screen">
        {/* Hero Section */}
        <section className="container-custom mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Boutique <span className="gradient-text">UIDT</span>
            </h1>
            <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 leading-relaxed mb-6">
              Découvrez toutes nos boutiques partenaires et leurs produits
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate('/boutique-request')}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Store className="w-5 h-5" />
                <span>Ouvrir une boutique</span>
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* Search Section */}
        <section ref={ref} className="container-custom mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Rechercher une boutique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg 
                [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                [data-theme='dark']:hover:bg-secondary-700
                [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                border
                focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                [data-theme='dark']:border-secondary-700 [data-theme='dark']:focus:border-primary-500 [data-theme='light']:border-secondary-300 [data-theme='light']:focus:border-primary-500"
              style={{
                color: isDark ? '#ffffff' : '#111827',
                WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                borderColor: isDark ? '#374151' : '#d1d5db',
              }}
            />
          </div>
          <div className="text-center mt-4 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
            {boutiques.length} boutique{boutiques.length > 1 ? 's' : ''} trouvée{boutiques.length > 1 ? 's' : ''}
          </div>
        </section>

        {/* Boutiques Grid */}
        <section className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-secondary-400 [data-theme='light']:text-secondary-600">Chargement des boutiques...</p>
            </div>
          ) : boutiques.length === 0 ? (
            <div className="text-center py-20">
              <Store className="w-20 h-20 text-secondary-400 mx-auto mb-4" />
              <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 mb-2">
                Aucune boutique trouvée
              </p>
              <p className="text-sm text-secondary-500 [data-theme='light']:text-secondary-500">
                Essayez de modifier votre recherche
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pb-12">
              {boutiques.map((boutique, index) => (
                <motion.div
                  key={boutique.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8, rotateY: 3, scale: 1.03 }}
                  className="group relative"
                  style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
                >
                  {/* 3D Building Container */}
                  <div
                    className="relative w-full cursor-pointer"
                    onClick={() => navigate(`/boutiques/${boutique.slug || boutique.id}`)}
                  >
                    {/* Premium Building Facade */}
                    <div className="relative w-full min-h-[320px] sm:min-h-[450px] 
                      [data-theme='dark']:bg-gradient-to-b [data-theme='dark']:from-secondary-800/95 [data-theme='dark']:via-secondary-850 [data-theme='dark']:to-secondary-900
                      [data-theme='light']:bg-gradient-to-b [data-theme='light']:from-white [data-theme='light']:via-slate-50 [data-theme='light']:to-slate-100
                      border-2 border-primary-500/40
                      group-hover:border-primary-500/60
                      rounded-3xl
                      shadow-[0_20px_60px_rgba(0,0,0,0.4)] 
                      group-hover:shadow-[0_25px_70px_rgba(244,67,54,0.2)]
                      overflow-hidden
                      transition-all duration-300
                      backdrop-blur-xl
                      relative
                      transform-gpu
                      will-change-transform"
                      style={{
                        background: 'linear-gradient(135deg, rgba(33, 33, 33, 0.95) 0%, rgba(18, 18, 18, 0.98) 100%)',
                      }}
                    >
                      {/* Animated Background Gradient */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          background: 'radial-gradient(ellipse at top, rgba(244,67,54,0.06), transparent 50%)',
                        }}
                      />


                      {/* Status Badge with Premium Design */}
                      {boutique.status === 'active' && (
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30">
                          <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-semibold
                              bg-gradient-to-r from-green-400 via-green-500 to-green-600 
                              text-white 
                              border border-white/50 shadow-lg backdrop-blur-sm
                              relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              translate-x-[-100%] animate-[shimmer_3s_infinite]" />
                            <span className="relative z-10 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />✓ Ouvert
                            </span>
                          </motion.div>
                        </div>
                      )}

                      {/* Premium Logo Display Area */}
                      <div className="relative w-full h-32 sm:h-56 pt-3 sm:pt-6 pb-3 sm:pb-6 px-3 sm:px-8 flex items-center justify-center
                        bg-gradient-to-b from-primary-500/8 via-primary-600/12 to-transparent
                        relative overflow-hidden">
                        
                        {/* Decorative Corner Brackets */}
                        <div className="absolute top-2 left-2 sm:top-8 sm:left-6 w-3 h-3 sm:w-6 sm:h-6 border-l-2 border-t-2 border-primary-400/40 
                          group-hover:border-primary-400/80 transition-colors duration-500" />
                        <div className="absolute top-2 right-2 sm:top-8 sm:right-6 w-3 h-3 sm:w-6 sm:h-6 border-r-2 border-t-2 border-primary-400/40 
                          group-hover:border-primary-400/80 transition-colors duration-500" />
                        <div className="absolute bottom-2 left-2 sm:bottom-6 sm:left-6 w-3 h-3 sm:w-6 sm:h-6 border-l-2 border-b-2 border-primary-400/40 
                          group-hover:border-primary-400/80 transition-colors duration-500" />
                        <div className="absolute bottom-2 right-2 sm:bottom-6 sm:right-6 w-3 h-3 sm:w-6 sm:h-6 border-r-2 border-b-2 border-primary-400/40 
                          group-hover:border-primary-400/80 transition-colors duration-500" />

                        {/* Premium Logo Container with Advanced 3D Effect */}
                        <motion.div 
                          className="relative w-28 h-28 sm:w-40 sm:h-40 
                            bg-gradient-to-br from-white/15 via-white/10 to-white/5
                            rounded-3xl
                            border-[3px] border-primary-400/40
                            group-hover:border-primary-400/80
                            shadow-[0_20px_60px_rgba(244,67,54,0.15),inset_0_10px_30px_rgba(0,0,0,0.3)]
                            backdrop-blur-2xl
                            flex items-center justify-center
                            overflow-hidden
                            transition-all duration-300
                            transform-gpu
                            relative
                            will-change-transform"
                          whileHover={{ scale: 1.1, rotate: [0, -1, 1, 0], z: 50 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {/* Animated Background Glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/8 via-primary-600/4 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Radial Pattern */}
                          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                            style={{
                              backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(244,67,54,0.4), transparent 70%)',
                            }}
                          />
                          
                          {/* Logo Image with Premium Effects */}
                          {boutique.logo ? (
                            <motion.img
                              src={boutique.logo}
                              alt={boutique.name}
                              loading="lazy"
                              className="relative z-10 w-full h-full object-contain p-3 sm:p-6
                                drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]
                                filter brightness-110"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                            />
                          ) : (
                            <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                              <Building2 className="w-full h-full text-primary-400 
                                group-hover:text-primary-300 transition-colors duration-500
                                drop-shadow-2xl" />
                            </div>
                          )}

                          {/* Premium 3D Frame with Multiple Layers */}
                          <div className="absolute inset-0 rounded-3xl"
                            style={{
                              boxShadow: `
                                inset 0 2px 0 rgba(255,255,255,0.4), 
                                inset 0 -2px 0 rgba(0,0,0,0.3),
                                inset 2px 0 0 rgba(255,255,255,0.2),
                                inset -2px 0 0 rgba(0,0,0,0.2)
                              `,
                            }}
                          />
                          
                          {/* Shine Effect on Logo Frame */}
                          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent 
                              rounded-3xl" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Professional Title Section - Clean Design */}
                      <div className="px-3 sm:px-8 pb-3 sm:pb-6 text-center relative">
                        <div className="absolute inset-x-3 sm:inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
                        <h3 className="text-base sm:text-xl md:text-2xl font-display font-semibold 
                          text-white [data-theme='light']:text-dark-900 mb-1.5 sm:mb-3 mt-3 sm:mt-6
                          group-hover:text-transparent group-hover:bg-clip-text 
                          group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-primary-600
                          transition-all duration-500 line-clamp-1
                          tracking-normal">
                          {boutique.name}
                        </h3>
                        {boutique.description && (
                          <p className="text-sm leading-relaxed
                            text-secondary-400 [data-theme='light']:text-secondary-600 
                            line-clamp-2 px-4 max-w-xl mx-auto">
                            {boutique.description}
                          </p>
                        )}
                      </div>


                      {/* Contact Info - Clean Professional Design */}
                      <div className="px-3 sm:px-8 pb-3 sm:pb-6 space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-sm
                        border-t border-secondary-700/50 [data-theme='light']:border-secondary-200 pt-3 sm:pt-6">
                        {boutique.address && (
                          <div className="flex items-start gap-1.5 sm:gap-3
                            text-secondary-300 [data-theme='light']:text-secondary-600
                            group-hover:text-secondary-200 [data-theme='light']:group-hover:text-secondary-700
                            transition-colors duration-300">
                            <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-primary-400 
                              group-hover:text-primary-300 transition-colors duration-300" />
                            <span className="line-clamp-2 leading-relaxed">{boutique.address}</span>
                          </div>
                        )}
                        {boutique.phone && (
                          <div className="flex items-center gap-1.5 sm:gap-3
                            text-secondary-300 [data-theme='light']:text-secondary-600
                            group-hover:text-secondary-200 [data-theme='light']:group-hover:text-secondary-700
                            transition-colors duration-300">
                            <Phone className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex-shrink-0 text-primary-400 
                              group-hover:text-primary-300 transition-colors duration-300" />
                            <span className="line-clamp-1">{boutique.phone}</span>
                          </div>
                        )}
                        {boutique.email && (
                          <div className="flex items-center gap-1.5 sm:gap-3
                            text-secondary-300 [data-theme='light']:text-secondary-600
                            group-hover:text-secondary-200 [data-theme='light']:group-hover:text-secondary-700
                            transition-colors duration-300">
                            <Mail className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex-shrink-0 text-primary-400 
                              group-hover:text-primary-300 transition-colors duration-300" />
                            <span className="line-clamp-1">{boutique.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Professional Action Button */}
                      <div className="px-3 sm:px-8 pb-3 sm:pb-6">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/boutiques/${boutique.slug || boutique.id}`)
                          }}
                          className="w-full relative overflow-hidden
                            bg-gradient-to-r from-primary-500 to-primary-600
                            hover:from-primary-600 hover:to-primary-700
                            text-white font-semibold py-2 sm:py-3.5 px-3 sm:px-6 rounded-xl
                            flex items-center justify-center gap-1.5 sm:gap-2.5
                            shadow-lg shadow-primary-500/20
                            group-hover:shadow-xl group-hover:shadow-primary-500/30
                            transition-all duration-300
                            transform-gpu
                            text-xs sm:text-base
                            before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0
                            before:translate-x-[-100%] group-hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-5 sm:h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                          <span className="relative z-10">Visiter la boutique</span>
                        </motion.button>
                      </div>

                    </div>

                    {/* Advanced Glow Effect on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none 
                      rounded-3xl overflow-hidden -z-10"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(244,67,54,0.08), transparent 70%)',
                        filter: 'blur(20px)',
                      }}
                    />

                    {/* Premium Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default Boutiques

