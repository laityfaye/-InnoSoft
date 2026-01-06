import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { newsApi } from '../../services/api'

interface NewsPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  category: string
  author?: string
  read_time: number
  is_published: boolean
  published_at?: string
  views: number
  created_at: string
}

const BlogPreview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [blogPosts, setBlogPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const response = await newsApi.getAll('all', 3) // Limiter à 3 articles
      setBlogPosts(response.data.data || [])
    } catch (error) {
      console.error('Error loading news:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
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
            <BookOpen className="w-4 h-4" />
            <span>Actualités & Conseils</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            Dernières <span className="gradient-text">Actualités</span>
          </h2>
          <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 max-w-2xl mx-auto transition-colors">
            Restez à jour avec nos articles, tutoriels et insights sur les technologies modernes
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
            Aucun article disponible pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-2xl overflow-hidden glass-effect card-hover border-primary-500/0 group-hover:border-primary-500/20 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {post.image ? (
                    <motion.img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-primary-400/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-500/80 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-effect text-xs font-semibold text-white">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-secondary-400 [data-theme='light']:text-secondary-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.read_time} min</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white [data-theme='light']:text-dark-500 transition-colors line-clamp-2 group-hover:text-primary-400 [data-theme='light']:group-hover:text-primary-600">
                    {post.title}
                  </h3>
                  <p className="text-secondary-400 [data-theme='light']:text-secondary-600 mb-4 line-clamp-2 text-sm leading-relaxed transition-colors">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.slug || post.id}`}
                    className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-medium text-sm group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <span>Lire la suite</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Hover Glow */}
                <div className="absolute -inset-4 bg-gradient-primary opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700 -z-10" />
              </motion.article>
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <Link
            to="/blog"
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <span>Voir tous les articles</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default BlogPreview

