import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowLeft, User, Eye, BookOpen } from 'lucide-react'
import { newsApi } from '../services/api'
import SEO from '../components/SEO'

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
  updated_at: string
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<NewsPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<NewsPost[]>([])

  useEffect(() => {
    loadPost()
  }, [slug])

  const loadPost = async () => {
    try {
      setLoading(true)
      setError(null)

      // Charger l'article par slug ou ID
      const response = await newsApi.getById(slug || '')
      const foundPost = response.data.data

      if (!foundPost) {
        setError('Article non trouvé')
        return
      }

      setPost(foundPost)

      // Charger tous les articles pour trouver les articles liés
      const allNewsResponse = await newsApi.getAll()
      const allNews = allNewsResponse.data.data || []

      // Charger les articles liés (même catégorie, exclure l'article actuel)
      const related = allNews
        .filter((item: NewsPost) => 
          item.category === foundPost.category && 
          item.id !== foundPost.id &&
          item.is_published
        )
        .slice(0, 3)
      setRelatedPosts(related)
    } catch (error: any) {
      console.error('Error loading post:', error)
      if (error.response?.status === 404) {
        setError('Article non trouvé')
      } else {
        setError('Erreur lors du chargement de l\'article')
      }
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

  const formatContent = (content: string) => {
    // Convertir les sauts de ligne en paragraphes
    const paragraphs = content.split('\n\n').filter(p => p.trim())
    return paragraphs.map((paragraph, index) => {
      // Détecter les titres (lignes qui commencent par **)
      if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
        const title = paragraph.replace(/\*\*/g, '').trim()
        return (
          <h2
            key={index}
            className="text-2xl font-bold mt-8 mb-4 text-white [data-theme='light']:text-dark-500"
          >
            {title}
          </h2>
        )
      }
      return (
        <p
          key={index}
          className="mb-4 text-secondary-300 [data-theme='light']:text-secondary-700 leading-relaxed"
        >
          {paragraph.trim()}
        </p>
      )
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-secondary-400 [data-theme='light']:text-secondary-600">
            Chargement de l'article...
          </p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-secondary-400 [data-theme='light']:text-secondary-600" />
          <h2 className="text-2xl font-bold mb-4 text-white [data-theme='light']:text-dark-500">
            {error || 'Article non trouvé'}
          </h2>
          <Link
            to="/blog"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au blog</span>
          </Link>
        </div>
      </div>
    )
  }

  // Formater les dates pour les meta tags
  const publishedTime = post.published_at || post.created_at
  const modifiedTime = post.updated_at
  const publishedISO = publishedTime ? new Date(publishedTime).toISOString() : undefined
  const modifiedISO = modifiedTime ? new Date(modifiedTime).toISOString() : undefined

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt || post.content.substring(0, 160)}
        image={post.image}
        url={`/blog/${post.slug}`}
        type="article"
        author={post.author || 'InnoSoft Creation'}
        publishedTime={publishedISO}
        modifiedTime={modifiedISO}
        section={post.category}
        tags={[post.category]}
      />
      <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-20">
        <div className="container-custom max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-secondary-400 [data-theme='light']:text-secondary-600 hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </motion.div>

        {/* Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full glass-effect text-sm font-medium text-primary-400">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{post.read_time} min de lecture</span>
            </div>
            {post.author && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{post.views} vues</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-12 rounded-2xl overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          )}

          {/* Excerpt */}
          <div className="mb-8 p-6 rounded-xl glass-effect border-l-4 border-primary-500">
            <p className="text-lg text-secondary-300 [data-theme='light']:text-secondary-700 italic">
              {post.excerpt}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <div className="text-lg leading-relaxed">
              {formatContent(post.content)}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-white/10 [data-theme='light']:border-secondary-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 mb-2">
                  Publié le {formatDate(post.published_at || post.created_at)}
                </p>
                {post.updated_at !== post.created_at && (
                  <p className="text-xs text-secondary-500">
                    Mis à jour le {formatDate(post.updated_at)}
                  </p>
                )}
              </div>
              <Link
                to="/blog"
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <span>Voir tous les articles</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 pt-16 border-t border-white/10 [data-theme='light']:border-secondary-200"
          >
            <h2 className="text-3xl font-bold mb-8 text-white [data-theme='light']:text-dark-500">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug || relatedPost.id}`}
                  className="group rounded-xl overflow-hidden glass-effect card-hover transition-all duration-300"
                >
                  {relatedPost.image && (
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-500/80 to-transparent" />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-xs px-2 py-1 rounded bg-primary-500/20 text-primary-400 mb-2 inline-block">
                      {relatedPost.category}
                    </span>
                    <h3 className="text-lg font-bold mb-2 text-white [data-theme='light']:text-dark-500 line-clamp-2 group-hover:text-primary-400 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
        </div>
      </div>
    </>
  )
}

export default BlogPost

