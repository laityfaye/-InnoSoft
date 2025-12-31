import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Play, Youtube } from 'lucide-react'
import { useState, useEffect } from 'react'
import { videosApi } from '../../services/api'

interface Video {
  id: number
  title: string
  description?: string
  video_type: string
  video_url?: string
  video_file?: string
  thumbnail?: string
  order: number
  is_active: boolean
  is_featured: boolean
}

const VideoSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await videosApi.getFeatured()
        if (response.data.success && response.data.data) {
          setVideo(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching featured video:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [])

  if (loading) {
    return null
  }

  if (!video) {
    return null
  }

  const getVideoUrl = () => {
    if (video.video_type === 'direct' && video.video_file) {
      return video.video_file
    }
    if (video.video_url) {
      // Le modèle retourne déjà l'URL embed complète, on ajoute juste autoplay
      const separator = video.video_url.includes('?') ? '&' : '?'
      return `${video.video_url}${separator}autoplay=1`
    }
    return null
  }

  const videoUrl = getVideoUrl()

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect text-sm font-medium text-primary-300 mb-6"
            >
              <Youtube className="w-4 h-4" />
              <span>Découvrez Notre Histoire</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
              Regardez Notre <span className="gradient-text">Présentation</span>
            </h2>
            <p className="text-xl text-white/70 [data-theme='light']:text-secondary-600 max-w-2xl mx-auto transition-colors">
              Découvrez qui nous sommes, notre vision et comment nous transformons les idées en réalité
            </p>
          </div>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden glass-effect border-primary-500/20 shadow-2xl"
          >
            {!isPlaying ? (
              <>
                {/* Thumbnail/Poster */}
                <div className="relative aspect-video bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                  {video.thumbnail ? (
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${video.thumbnail})` }} />
                  ) : (
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200')] bg-cover bg-center opacity-30" />
                  )}
                  
                  {/* Play Button */}
                  <motion.button
                    onClick={() => setIsPlaying(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative z-10 w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-2xl group"
                  >
                    <Play className="w-12 h-12 text-white ml-1" fill="white" />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-gradient-primary blur-xl"
                    />
                  </motion.button>

                  {/* Overlay Text */}
                  <div className="absolute bottom-8 left-8 right-8 z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-white/80">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="relative aspect-video">
                {video.video_type === 'direct' && video.video_file ? (
                  <video
                    src={videoUrl || undefined}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                ) : (
                  <iframe
                    src={videoUrl || undefined}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
              </div>
            )}
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-secondary-400 [data-theme='light']:text-secondary-600 text-sm">
              Abonnez-vous à notre chaîne YouTube pour plus de contenu
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default VideoSection

