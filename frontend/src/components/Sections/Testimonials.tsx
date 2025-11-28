import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Quote, Star, MessageSquare, X } from 'lucide-react'
import { testimonialsApi } from '../../services/api'
import { useTheme } from '../../hooks/useTheme'

interface Testimonial {
  id: number
  name: string
  role?: string
  content: string
  rating: number
}

const Testimonials = () => {
  const { isDark } = useTheme()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
  })

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const response = await testimonialsApi.getAll()
      setTestimonials(response.data.data || [])
    } catch (error) {
      console.error('Error loading testimonials:', error)
      // Fallback to empty array or default testimonials
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await testimonialsApi.create({
        name: formData.name,
        role: formData.role || undefined,
        content: formData.content,
        rating: formData.rating,
      })

      setIsSubmitted(true)
      setFormData({ name: '', role: '', content: '', rating: 5 })
      setShowForm(false)

      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (error) {
      console.error('Error submitting testimonial:', error)
      alert('Une erreur est survenue lors de la soumission de votre témoignage.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={ref} className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Ce Que Disent Nos <span className="gradient-text">Clients</span>
          </h2>
          <p className="text-xl text-gray-400 [data-theme='light']:text-gray-600 max-w-2xl mx-auto transition-colors mb-6">
            La satisfaction de nos clients est notre priorité
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg glass-effect hover:bg-white/10 [data-theme='light']:hover:bg-gray-100 transition-colors text-primary-400 [data-theme='light']:text-primary-600 font-medium"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Laisser un témoignage</span>
          </button>
        </motion.div>

        {/* Testimonial Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12 p-8 rounded-2xl glass-effect relative"
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white [data-theme='light']:hover:text-dark-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Quote className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2 text-white [data-theme='light']:text-dark-500">
                  Merci pour votre témoignage !
                </h3>
                <p className="text-gray-400 [data-theme='light']:text-gray-600">
                  Votre témoignage sera publié après validation par l'administrateur.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg 
                        [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white [data-theme='dark']:placeholder-gray-400
                        [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                        [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-gray-400
                        border
                        focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder="Votre nom"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                      Poste / Entreprise
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg 
                        [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white [data-theme='dark']:placeholder-gray-400
                        [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                        [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-gray-400
                        border
                        focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder="CEO, TechCorp"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                    Note *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleRatingChange(rating)}
                        className={`transition-transform hover:scale-110 ${
                          formData.rating >= rating
                            ? 'text-accent-500 fill-accent-500'
                            : 'text-gray-400 [data-theme="light"]:text-gray-300'
                        }`}
                      >
                        <Star className="w-6 h-6" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                    Votre témoignage *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={4}
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg 
                      [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white [data-theme='dark']:placeholder-gray-400
                      [data-theme='dark']:hover:bg-gray-750 [data-theme='dark']:hover:border-gray-600
                      [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-gray-400
                      border
                      focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                    placeholder="Partagez votre expérience avec InnoSoft Creation..."
                    style={{
                      color: isDark ? '#ffffff' : '#111827',
                      WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      borderColor: isDark ? '#374151' : '#d1d5db',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer mon témoignage</span>
                      <MessageSquare className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* Testimonials Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl glass-effect card-hover relative"
              >
                <Quote className="w-12 h-12 text-primary-400/30 mb-4" />
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent-500 text-accent-500" />
                  ))}
                </div>
                <p className="text-gray-300 [data-theme='light']:text-gray-700 mb-6 leading-relaxed italic transition-colors">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-white [data-theme='light']:text-dark-500 transition-colors">{testimonial.name}</p>
                  {testimonial.role && (
                    <p className="text-sm text-gray-500 [data-theme='light']:text-gray-600 transition-colors">{testimonial.role}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 [data-theme='light']:text-gray-600">
              Aucun témoignage pour le moment. Soyez le premier à partager votre expérience !
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Testimonials

