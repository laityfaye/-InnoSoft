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
    threshold: 0.1,
    rootMargin: '100px', // Charger un peu avant que la section soit visible
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [video, setVideo] = useState<Video | null>(null)
  const [otherVideos, setOtherVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    if (!inView || hasFetched) return

    const fetchVideos = async () => {
      setHasFetched(true)
      try {
        const [featuredResponse, allVideosResponse] = await Promise.all([
          videosApi.getFeatured(),
          videosApi.getAll(),
        ])

        if (featuredResponse.data.success && featuredResponse.data.data) {
          setVideo(featuredResponse.data.data)
        }

        if (allVideosResponse.data.success && allVideosResponse.data.data) {
          const allVideos = allVideosResponse.data.data as Video[]
          const featuredId = featuredResponse.data.data?.id
          const other = allVideos
            .filter(v => v.is_active && v.id !== featuredId)
            .sort((a, b) => a.order - b.order)
          setOtherVideos(other)
        }
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [inView, hasFetched])

  // Skeleton pendant le chargement - évite le trou blanc
  if (loading && !video) {
    return (
      <section ref={ref} className="section-padding relative overflow-hidden w-full">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="aspect-video rounded-2xl bg-dark-600/50 animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-dark-500/50 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!video) {
    return null
  }

  const getVideoUrl = (videoItem: Video) => {
    if (videoItem.video_type === 'direct' && videoItem.video_file) {
      return videoItem.video_file
    }
    if (videoItem.video_url) {
      // Le modèle retourne déjà l'URL embed complète, on ajoute juste autoplay
      const separator = videoItem.video_url.includes('?') ? '&' : '?'
      return `${videoItem.video_url}${separator}autoplay=1`
    }
    return null
  }

  const handleVideoSelect = (selectedVideo: Video) => {
    // Si une vidéo principale existe, la remettre dans la liste des autres vidéos
    if (video) {
      setOtherVideos(prev => {
        const updated = prev.filter(v => v.id !== selectedVideo.id)
        // Ajouter l'ancienne vidéo principale à la liste, triée par order
        updated.push(video)
        return updated.sort((a, b) => a.order - b.order)
      })
    }
    setVideo(selectedVideo)
    setIsPlaying(false)
  }

  const videoUrl = video ? getVideoUrl(video) : null

  return (
    <section ref={ref} className="section-padding relative overflow-hidden w-full">
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
                    className="relative z-30 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-2xl group pointer-events-auto"
                  >
                    <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1" fill="white" />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-gradient-primary blur-xl"
                    />
                  </motion.button>

                  {/* Overlay Text - Masqué en mobile pour éviter le chevauchement avec le bouton play */}
                  <div className="absolute bottom-8 left-8 right-8 z-10 hidden sm:block pointer-events-none">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-sm sm:text-base text-white/80">
                        {video.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Texte pour mobile - Positionné en haut pour éviter le chevauchement */}
                  <div className="absolute top-4 left-4 right-4 z-10 sm:hidden pointer-events-none">
                    <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-xs text-white/90 drop-shadow-md line-clamp-2">
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

          {/* Other Videos Grid */}
          {otherVideos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white [data-theme='light']:text-dark-500 mb-4 sm:mb-6 text-center">
                Autres Vidéos
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {otherVideos.map((otherVideo, index) => (
                    <motion.div
                      key={otherVideo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                      onClick={() => handleVideoSelect(otherVideo)}
                      className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden glass-effect border-primary-500/20 cursor-pointer group hover:border-primary-500/40 transition-all duration-300"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full h-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                        {otherVideo.thumbnail ? (
                          <div 
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300" 
                            style={{ backgroundImage: `url(${otherVideo.thumbnail})` }} 
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200')] bg-cover bg-center opacity-30 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        
                        {/* Overlay sombre au hover */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" fill="white" />
                          </motion.div>
                        </div>
                        
                        {/* Title */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 drop-shadow-lg">
                            {otherVideo.title}
                          </h4>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </div>
            </motion.div>
          )}

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

