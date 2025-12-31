import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, Filter } from 'lucide-react'
import { projectsApi } from '../services/api'

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
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl glass-effect card-hover"
            >
              <div className="aspect-video relative overflow-hidden bg-secondary-800">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Si l'image ne charge pas, afficher une image par défaut
                      console.error('Erreur de chargement de l\'image:', project.image)
                      console.error('Tentative de chargement depuis:', project.image)
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                    onLoad={() => {
                      console.log('Image chargée avec succès:', project.image)
                    }}
                  />
                ) : null}
                {!project.image && (
                  <div className="w-full h-full flex items-center justify-center bg-secondary-800 text-secondary-500">
                    <span>Aucune image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-500/90 via-dark-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <ExternalLink className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-gradient-secondary flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Github className="w-6 h-6 text-white" />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{project.title}</h3>
                <p className="text-secondary-400 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-secondary-400 [data-theme='light']:text-secondary-600 text-lg">
              Aucun projet trouvé dans cette catégorie.
            </p>
          </motion.div>
        ) : null}
      </section>
    </div>
  )
}

export default Portfolio

