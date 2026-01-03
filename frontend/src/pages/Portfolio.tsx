import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, Filter } from 'lucide-react'
import { projectsApi } from '../services/api'
import SEO from '../components/SEO'

interface Project {
  id: number
  title: string
  category: string
  description: string
  image?: string
  tags?: string[]
  link?: string
}

const Portfolio = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [activeFilter, setActiveFilter] = useState('all')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'web', label: 'Web' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'design', label: 'Design' },
  ]

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    loadProjects()
  }, [activeFilter])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const response = await projectsApi.getAll(activeFilter)
      setProjects(response.data.data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects

  return (
    <>
      <SEO
        title="Notre Portfolio - Réalisations InnoSoft Creation"
        description="Découvrez nos réalisations : projets web, applications mobiles, designs et solutions innovantes développées par InnoSoft Creation."
        url="/portfolio"
      />
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
            Notre <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="text-xl text-secondary-400 leading-relaxed">
            Découvrez quelques-unes de nos réalisations
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="container-custom mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Filter className="w-5 h-5 text-secondary-400" />
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'glass-effect text-secondary-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section ref={ref} className="container-custom">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-secondary-400 [data-theme='light']:text-secondary-600">
              Chargement des projets...
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500/10 mb-6">
              <Filter className="w-10 h-10 text-primary-400" />
            </div>
            <p className="text-xl font-semibold text-white [data-theme='light']:text-dark-500 mb-2">
              Aucun projet trouvé
            </p>
            <p className="text-secondary-400 [data-theme='light']:text-secondary-600">
              Essayez de sélectionner une autre catégorie
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ 
                    opacity: 0, 
                    y: 60,
                    scale: 0.85
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.8,
                    y: -30,
                    transition: { duration: 0.3, ease: "easeIn" }
                  }}
                  transition={{ 
                    delay: index * 0.08, 
                    duration: 0.7, 
                    ease: [0.22, 1, 0.36, 1],
                    layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl glass-effect card-hover border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500"
                >
              {/* Gradient Background on Hover */}
              <div className="absolute -inset-4 bg-gradient-primary opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700 -z-10" />
              
              {/* Border Gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/20 group-hover:to-primary-500/0 transition-opacity duration-500" />

              {/* Image Container */}
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-secondary-800 to-secondary-900">
                {project.image ? (
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    onError={(e) => {
                      console.error('Erreur de chargement de l\'image:', project.image)
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                {!project.image && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary-800 to-secondary-900 text-secondary-400">
                    <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mb-3">
                      <Github className="w-8 h-8 text-primary-400" />
                    </div>
                    <span className="text-sm font-medium">Aucune image</span>
                  </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-500/95 via-dark-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full glass-effect text-xs font-semibold text-white backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.category}
                </div>
                
                {/* Action Buttons */}
                {project.link && (
                  <div className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-xl shadow-primary-500/50 backdrop-blur-sm border border-white/20"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <ExternalLink className="w-6 h-6 text-white" />
                    </motion.a>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold mb-3 text-white [data-theme='light']:text-dark-500 transition-colors group-hover:text-primary-400 [data-theme='light']:group-hover:text-primary-600">
                  {project.title}
                </h3>
                <p className="text-secondary-400 [data-theme='light']:text-secondary-600 text-sm mb-5 leading-relaxed line-clamp-3 transition-colors">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-300 border border-primary-500/20 hover:bg-primary-500/20 hover:border-primary-500/40 transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-secondary-400">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </div>
    </>
  )
}

export default Portfolio

