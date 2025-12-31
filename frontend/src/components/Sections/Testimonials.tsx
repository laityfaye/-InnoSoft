import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      const loadedTestimonials = response.data.data || []
      setTestimonials(loadedTestimonials)
    } catch (error) {
      console.error('Error loading testimonials:', error)
      // Fallback testimonials
      setTestimonials([
        {
          id: 1,
          name: 'Jean Dupont',
          role: 'CEO, TechCorp',
          content: 'Service exceptionnel ! L\'équipe a su comprendre nos besoins et livrer un projet de qualité dans les délais.',
          rating: 5,
        },
        {
          id: 2,
          name: 'Marie Martin',
          role: 'Directrice Marketing',
          content: 'Une expertise remarquable et une approche professionnelle. Nous recommandons vivement leurs services.',
          rating: 5,
        },
        {
          id: 3,
          name: 'Pierre Durand',
          role: 'Fondateur, StartupX',
          content: 'Grâce à InnoSoft, nous avons pu développer notre plateforme rapidement. Excellente communication tout au long du projet.',
          rating: 5,
        },
        {
          id: 4,
          name: 'Sophie Bernard',
          role: 'CTO, Innovation Labs',
          content: 'Une équipe talentueuse qui a su transformer nos idées en réalité. Résultats dépassant nos attentes !',
          rating: 5,
        },
        {
          id: 5,
          name: 'Thomas Laurent',
          role: 'Directeur Digital',
          content: 'Professionalisme et réactivité exemplaires. InnoSoft a su s\'adapter à nos contraintes avec brio.',
          rating: 5,
        },
      ])
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
      loadTestimonials()

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

  // Duplicate testimonials for infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section ref={ref} className="section-padding bg-dark-600/20 relative overflow-hidden py-16 md:py-20 lg:py-24">
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 right-10 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-accent-500/6 rounded-full blur-3xl"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-sm"
          >
            <Star className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Témoignages</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 text-white">
            Ce Que Disent Nos <span className="gradient-text">Clients</span>
          </h2>
          <p className="text-base md:text-lg text-secondary-400 max-w-2xl mx-auto mb-8">
            La satisfaction de nos clients est notre priorité
          </p>
          <motion.button
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass-effect hover:bg-white/10 transition-all text-primary-400 font-medium border border-primary-500/20 hover:border-primary-500/40"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Laisser un témoignage</span>
          </motion.button>
        </motion.div>

        {/* Testimonial Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-12 p-8 rounded-2xl glass-effect relative overflow-hidden"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4"
                  >
                    <Quote className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold mb-2 text-white">
                    Merci pour votre témoignage !
                  </h3>
                  <p className="text-secondary-400">
                    Votre témoignage sera publié après validation par l'administrateur.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-secondary-300 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-secondary-800/50 border border-white/10 text-white placeholder-secondary-400 hover:bg-secondary-800 hover:border-primary-500/30 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all backdrop-blur-sm"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-secondary-300 mb-2">
                        Poste / Entreprise
                      </label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-secondary-800/50 border border-white/10 text-white placeholder-secondary-400 hover:bg-secondary-800 hover:border-primary-500/30 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all backdrop-blur-sm"
                        placeholder="CEO, TechCorp"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Note *
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <motion.button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingChange(rating)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className={`transition-all ${
                            formData.rating >= rating
                              ? 'text-accent-500 fill-accent-500'
                              : 'text-secondary-400'
                          }`}
                        >
                          <Star className="w-6 h-6" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-secondary-300 mb-2">
                      Votre témoignage *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      required
                      rows={4}
                      value={formData.content}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-secondary-800/50 border border-white/10 text-white placeholder-secondary-400 hover:bg-secondary-800 hover:border-primary-500/30 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none backdrop-blur-sm"
                      placeholder="Partagez votre expérience avec InnoSoft Creation..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                  </motion.button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Infinite Horizontal Scroll */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-secondary-400 text-sm">Chargement des témoignages...</p>
            </div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="relative">
            {/* Enhanced Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-dark-600/20 via-dark-600/10 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-dark-600/20 via-dark-600/10 to-transparent z-10 pointer-events-none" />

            {/* Scroll Container */}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: ['0%', '-50%'], // Move by exactly 50% (one complete set of testimonials)
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: testimonials.length * 25, // Adjust speed - higher number = slower
                    ease: 'linear',
                  },
                }}
                style={{
                  width: 'max-content',
                }}
              >
                {duplicatedTestimonials.map((testimonial, index) => (
                  <div
                    key={`${testimonial.id}-${index}`}
                    className="flex-shrink-0 w-[380px] md:w-[420px] lg:w-[460px]"
                  >
                    <div className="h-full backdrop-blur-2xl bg-gradient-to-br from-dark-500/90 via-dark-500/80 to-dark-500/90 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl hover:shadow-primary-500/20 hover:border-primary-500/30 transition-all duration-300 group relative overflow-hidden">
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-x-full group-hover:translate-x-full" />
                      
                      {/* Decorative Quote Icon - Large Background */}
                      <div className="absolute top-4 right-4 text-primary-500/5 group-hover:text-primary-500/10 transition-colors duration-300">
                        <Quote className="w-36 h-36" />
                      </div>

                      {/* Decorative gradient orbs */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10 space-y-6">
                        {/* Rating */}
                        <div className="flex gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 transition-all duration-300 ${
                                i < testimonial.rating
                                  ? 'fill-accent-500 text-accent-500 drop-shadow-lg'
                                  : 'text-secondary-600'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                          <Quote className="w-8 h-8 text-primary-500/40" />
                          <p className="text-base md:text-lg text-secondary-100 leading-relaxed font-light italic pl-2">
                            {testimonial.content}
                          </p>
                        </div>

                        {/* Author Section */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-xl ring-2 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all duration-300 group-hover:scale-110">
                              {testimonial.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 blur-md opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-white text-lg">{testimonial.name}</p>
                            {testimonial.role && (
                              <p className="text-sm text-secondary-400 mt-1 font-medium">{testimonial.role}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-secondary-400">
              Aucun témoignage pour le moment. Soyez le premier à partager votre expérience !
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Testimonials
