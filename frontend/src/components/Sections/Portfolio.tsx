import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Code, Smartphone, Palette, Server, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { projectsApi } from '../../services/api'

interface Project {
  id: number
  title: string
  category: string
  description: string
  image?: string
  tags?: string[]
  link?: string
}

interface DisplayProject extends Project {
  icon: typeof Code
  color: 'primary' | 'secondary' | 'accent'
}

// Projets fictifs pour compléter si nécessaire
const fallbackProjects: DisplayProject[] = [
  {
    id: 9991,
    title: 'Plateforme E-Commerce',
    description: 'Solution complète de commerce en ligne avec gestion de stock et paiement sécurisé.',
    category: 'web',
    image: undefined,
    tags: ['React', 'Node.js', 'MongoDB'],
    icon: Code,
    color: 'primary',
    link: '/portfolio/ecommerce',
  },
  {
    id: 9992,
    title: 'Application Mobile Fitness',
    description: 'Application mobile iOS et Android pour suivi d\'entraînement et nutrition.',
    category: 'mobile',
    image: undefined,
    tags: ['React Native', 'Firebase'],
    icon: Smartphone,
    color: 'secondary',
    link: '/portfolio/fitness-app',
  },
  {
    id: 9993,
    title: 'Identité Visuelle Entreprise',
    description: 'Refonte complète de l\'identité visuelle avec logo, charte graphique et supports.',
    category: 'design',
    image: undefined,
    tags: ['Branding', 'UI/UX', 'Print'],
    icon: Palette,
    color: 'accent',
    link: '/portfolio/branding',
  },
  {
    id: 9994,
    title: 'Infrastructure Cloud',
    description: 'Mise en place d\'une infrastructure cloud sécurisée pour une entreprise.',
    category: 'web',
    image: undefined,
    tags: ['AWS', 'Docker', 'Kubernetes'],
    icon: Server,
    color: 'primary',
    link: '/portfolio/cloud-infra',
  },
]

const Portfolio = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '150px',
  })

  const [projects, setProjects] = useState<DisplayProject[]>([])
  const [loading, setLoading] = useState(true)
  const [hasFetched, setHasFetched] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayInterval = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fonction pour mapper la catégorie à l'icône et la couleur
  const getCategoryIconAndColor = (category: string): { icon: typeof Code; color: 'primary' | 'secondary' | 'accent' } => {
    const normalizedCategory = category.toLowerCase()
    if (normalizedCategory.includes('web') || normalizedCategory.includes('développement')) {
      return { icon: Code, color: 'primary' }
    }
    if (normalizedCategory.includes('mobile') || normalizedCategory.includes('app')) {
      return { icon: Smartphone, color: 'secondary' }
    }
    if (normalizedCategory.includes('design') || normalizedCategory.includes('graphique')) {
      return { icon: Palette, color: 'accent' }
    }
    return { icon: Server, color: 'primary' }
  }

  // Fonction pour formater les projets réels
  const formatRealProjects = (realProjects: Project[]): DisplayProject[] => {
    return realProjects.map((project) => {
      const { icon, color } = getCategoryIconAndColor(project.category)
      return {
        ...project,
        icon,
        color,
      }
    })
  }

  useEffect(() => {
    if (!inView || hasFetched) return

    const loadProjects = async () => {
      setHasFetched(true)
      try {
        const response = await projectsApi.getAll()
        const realProjects: Project[] = response.data.data || []
        const formattedRealProjects = formatRealProjects(realProjects)
        let displayProjects = formattedRealProjects.slice(0, 4)
        if (displayProjects.length < 4) {
          displayProjects = [...displayProjects, ...fallbackProjects.slice(0, 4 - displayProjects.length)]
        }
        setProjects(displayProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
        setProjects(fallbackProjects.slice(0, 4))
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasFetched])

  // Auto-play carousel
  useEffect(() => {
    if (projects.length === 0 || !isAutoPlaying) return

    autoPlayInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
    }, 6000)

    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current)
      }
    }
  }, [projects.length, isAutoPlaying, currentIndex])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
  }

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-accent-600',
  }

  const getCategoryLabel = (category: string) => {
    const normalizedCategory = category.toLowerCase()
    if (normalizedCategory.includes('web') || normalizedCategory.includes('développement')) return 'Développement Web'
    if (normalizedCategory.includes('mobile') || normalizedCategory.includes('app')) return 'Mobile'
    if (normalizedCategory.includes('design') || normalizedCategory.includes('graphique')) return 'Design'
    return category
  }

  return (
    <section ref={ref} className="min-h-screen bg-dark-600/20 relative overflow-hidden py-16 md:py-20 lg:py-24 w-full">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-600/10 to-transparent pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 text-white">
            Nos <span className="gradient-text">Réalisations</span>
          </h2>
          <p className="text-base md:text-lg text-secondary-400 max-w-2xl mx-auto">
            Découvrez nos projets récents qui témoignent de notre expertise
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative">
            {/* Carousel */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {projects.map((project, index) => {
                  if (index !== currentIndex) return null
                  
                  const Icon = project.icon
                  
                  return (
                    <motion.div
                      key={`${project.id}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                    >
                      {/* Image Section */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="relative"
                      >
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-white/10">
                          {project.image ? (
                            <div className="w-full h-full flex items-center justify-center p-8">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="max-w-full max-h-full w-auto h-auto object-contain"
                                onError={(e) => {
                                  console.error('Erreur de chargement de l\'image:', project.image)
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
                              <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${colorClasses[project.color as keyof typeof colorClasses]} flex items-center justify-center shadow-xl`}>
                                <Icon className="w-16 h-16 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Content Section */}
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="space-y-6"
                      >
                        {/* Category */}
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[project.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-primary-400 uppercase tracking-wide">
                              {getCategoryLabel(project.category)}
                            </div>
                            <div className="text-xs text-secondary-500">
                              Projet #{String(project.id).padStart(2, '0')}
                            </div>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-base md:text-lg text-secondary-300 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-500/10 text-primary-300 border border-primary-500/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* CTA */}
                        {project.link && (
                          <div className="pt-4">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl hover:shadow-primary-500/30"
                            >
                              Voir le projet
                              <ArrowRight className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-primary-500'
                        : 'w-2 bg-secondary-400/40 hover:bg-secondary-400/60'
                    }`}
                    aria-label={`Aller au projet ${index + 1}`}
                  />
                ))}
              </div>

              {/* Arrows */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevious}
                  className="w-10 h-10 rounded-lg bg-dark-700/50 border border-white/10 hover:border-primary-500/50 hover:bg-primary-500/10 flex items-center justify-center transition-all"
                  aria-label="Projet précédent"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-lg bg-dark-700/50 border border-white/10 hover:border-primary-500/50 hover:bg-primary-500/10 flex items-center justify-center transition-all"
                  aria-label="Projet suivant"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/portfolio"
            className="btn-secondary inline-flex items-center gap-2"
          >
            Voir tous nos projets
            <ExternalLink className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Portfolio
