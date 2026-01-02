import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Code, Smartphone, Palette, Server, ExternalLink } from 'lucide-react'
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
  })

  const [projects, setProjects] = useState<DisplayProject[]>([])
  const [loading, setLoading] = useState(true)

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
    const loadProjects = async () => {
      try {
        setLoading(true)
        const response = await projectsApi.getAll()
        const realProjects: Project[] = response.data.data || []
        
        // Formater les projets réels
        const formattedRealProjects = formatRealProjects(realProjects)
        
        // Prendre les 4 premiers projets réels
        let displayProjects = formattedRealProjects.slice(0, 4)
        
        // Compléter avec des projets fictifs si nécessaire
        if (displayProjects.length < 4) {
          const needed = 4 - displayProjects.length
          displayProjects = [...displayProjects, ...fallbackProjects.slice(0, needed)]
        }
        
        setProjects(displayProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
        // En cas d'erreur, utiliser uniquement les projets fictifs
        setProjects(fallbackProjects.slice(0, 4))
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-accent-600',
  }

  const gradientBgClasses = {
    primary: 'from-primary-500/20 to-primary-600/10',
    secondary: 'from-secondary-500/20 to-secondary-600/10',
    accent: 'from-accent-500/20 to-accent-600/10',
  }

  const getCategoryLabel = (category: string) => {
    const normalizedCategory = category.toLowerCase()
    if (normalizedCategory.includes('web') || normalizedCategory.includes('développement')) return 'Développement Web'
    if (normalizedCategory.includes('mobile') || normalizedCategory.includes('app')) return 'Mobile'
    if (normalizedCategory.includes('design') || normalizedCategory.includes('graphique')) return 'Design'
    return category
  }

  return (
    <section ref={ref} className="min-h-screen bg-dark-600/20 relative overflow-hidden py-16 md:py-20 lg:py-24">
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
            Notre <span className="gradient-text">Portfolio</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, index) => {
              const Icon = project.icon
              const gradientBg = gradientBgClasses[project.color as keyof typeof gradientBgClasses]
              const gradientColor = colorClasses[project.color as keyof typeof colorClasses]

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative rounded-2xl overflow-hidden glass-effect card-hover border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500"
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          console.error('Erreur de chargement de l\'image:', project.image)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    )}
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-500/90 via-dark-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br ${gradientColor} backdrop-blur-sm shadow-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                        <span className="text-xs font-semibold text-white uppercase tracking-wide">
                          {getCategoryLabel(project.category)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 text-white [data-theme='light']:text-dark-500 transition-colors line-clamp-2 group-hover:text-primary-400 [data-theme='light']:group-hover:text-primary-600">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-secondary-400 [data-theme='light']:text-secondary-600 mb-4 line-clamp-2 text-sm leading-relaxed transition-colors">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary-500/20 text-secondary-300 border border-secondary-500/30">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-semibold group/link transition-all duration-300"
                      >
                        <span className="relative">
                          Voir le projet
                          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left" />
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform duration-300" />
                      </a>
                    )}
                  </div>

                  {/* Hover Glow */}
                  <div className={`absolute -inset-4 bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700 -z-10`} />
                </motion.div>
              )
            })}
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
