import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Share2, MessageCircle, Music } from 'lucide-react'
import { useState, useEffect } from 'react'
import { socialLinksApi } from '../../services/api'

interface SocialLink {
  id: number
  platform: string
  name: string
  url: string
  icon_type: string
  color_gradient?: string
  followers?: string
  order: number
  is_active: boolean
}

const SocialMedia = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await socialLinksApi.getAll()
        if (response.data.success && response.data.data) {
          setSocialLinks(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching social links:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSocialLinks()
  }, [])

  // Mapping des plateformes vers les icônes Lucide
  const getIcon = (platform: string) => {
    const platformLower = platform.toLowerCase()
    switch (platformLower) {
      case 'facebook':
        return Facebook
      case 'twitter':
        return Twitter
      case 'instagram':
        return Instagram
      case 'linkedin':
        return Linkedin
      case 'youtube':
        return Youtube
      case 'github':
        return Github
      case 'tiktok':
        return Music
      case 'discord':
      case 'telegram':
      case 'whatsapp':
        return MessageCircle
      default:
        return Share2
    }
  }

  // Couleurs par défaut si non spécifiées
  const getDefaultColor = (platform: string) => {
    const platformLower = platform.toLowerCase()
    switch (platformLower) {
      case 'facebook':
        return 'from-blue-600 to-blue-700'
      case 'twitter':
        return 'from-sky-500 to-sky-600'
      case 'instagram':
        return 'from-pink-500 via-purple-500 to-orange-500'
      case 'linkedin':
        return 'from-blue-700 to-blue-800'
      case 'youtube':
        return 'from-red-600 to-red-700'
      case 'github':
        return 'from-gray-700 to-gray-800'
      case 'tiktok':
        return 'from-black to-gray-900'
      case 'discord':
        return 'from-indigo-500 to-indigo-600'
      case 'telegram':
        return 'from-blue-400 to-blue-500'
      case 'whatsapp':
        return 'from-green-500 to-green-600'
      default:
        return 'from-primary-500 to-secondary-500'
    }
  }

  if (loading) {
    return null
  }

  if (socialLinks.length === 0) {
    return null
  }

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-accent-500/5" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-8 shadow-xl"
          >
            <Share2 className="w-10 h-10 text-white" />
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            Suivez-nous sur les <span className="gradient-text">Réseaux</span>
          </h2>
          <p className="text-xl text-white/70 [data-theme='light']:text-secondary-600 mb-12 max-w-2xl mx-auto transition-colors">
            Rejoignez notre communauté et restez connecté avec nos dernières actualités, conseils et projets
          </p>

          {/* Social Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {socialLinks.map((social, index) => {
              const Icon = getIcon(social.platform)
              const color = social.color_gradient || getDefaultColor(social.platform)
              return (
                <motion.a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative p-6 rounded-2xl glass-effect card-hover border-primary-500/0 group-hover:border-primary-500/20 transition-all duration-500 text-center"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`relative w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500`}
                  >
                    <Icon className="w-8 h-8 text-white relative z-10" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 rounded-xl bg-gradient-to-br ${color} blur-xl`}
                    />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg font-bold mb-2 text-white [data-theme='light']:text-dark-500 transition-colors">
                    {social.name}
                  </h3>
                  {social.followers && (
                    <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 transition-colors">
                      {social.followers} abonnés
                    </p>
                  )}

                  {/* Hover Glow */}
                  <div className={`absolute -inset-4 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700 -z-10`} />
                </motion.a>
              )
            })}
          </div>

          {/* CTA Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 text-secondary-400 [data-theme='light']:text-secondary-600 text-sm"
          >
            Rejoignez notre communauté de passionnés de technologie
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default SocialMedia

