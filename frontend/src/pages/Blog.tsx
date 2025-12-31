import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link, useSearchParams } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, BookOpen, Filter } from 'lucide-react'
import { newsApi } from '../services/api'

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

const Blog = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'all')
  const [news, setNews] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  // Récupérer toutes les catégories uniques depuis les articles
  const [categories, setCategories] = useState<string[]>(['all'])

  useEffect(() => {
    loadNews()
  }, [activeFilter])

  useEffect(() => {
    // Mettre à jour l'URL quand le filtre change
    if (activeFilter === 'all') {
      setSearchParams({}, { replace: true })
    } else {
      setSearchParams({ category: activeFilter }, { replace: true })
    }
  }, [activeFilter, setSearchParams])

  const loadNews = async () => {
    try {
      setLoading(true)
      const response = await newsApi.getAll(activeFilter === 'all' ? undefined : activeFilter)
      const allNews = response.data.data || []
      setNews(allNews)

      // Extraire les catégories uniques
      const uniqueCategories = ['all', ...new Set(allNews.map((item: NewsPost) => item.category))] as string[]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error loading news:', error)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const filteredNews = activeFilter === 'all' 
    ? news 
    : news.filter((item) => item.category === activeFilter)

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          ref={ref}
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

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            Toutes les <span className="gradient-text">Actualités</span>
          </h1>
          <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 max-w-2xl mx-auto transition-colors">
            Restez à jour avec nos articles, tutoriels et insights sur les technologies modernes
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <div className="flex items-center space-x-2 text-secondary-400 [data-theme='light']:text-secondary-600">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filtrer par catégorie :</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
                  : 'glass-effect text-secondary-400 [data-theme="light"]:text-secondary-600 hover:text-primary-400 hover:bg-primary-500/10'
              }`}
            >
              {category === 'all' ? 'Tous' : category}
            </button>
          ))}
        </motion.div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-secondary-400 [data-theme='light']:text-secondary-600" />
            <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600">
              Aucun article disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((post, index) => (
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
                  <p className="text-secondary-400 [data-theme='light']:text-secondary-600 mb-4 line-clamp-3 text-sm leading-relaxed transition-colors">
                    {post.excerpt}
                  </p>

                  {post.author && (
                    <p className="text-xs text-secondary-500 mb-4">
                      Par {post.author}
                    </p>
                  )}

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
      </div>
    </div>
  )
}

export default Blog

