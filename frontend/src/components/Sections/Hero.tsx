import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Code, Smartphone } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import BackgroundStars from './BackgroundStars'
import SmallShootingStars from './SmallShootingStars'
import { useSectionNavigation } from '../../hooks/useSectionNavigation'

const Hero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Sections cibles pour le swipe horizontal (dans l'ordre)
  // Le Hero est inclus comme première section pour permettre de revenir en arrière
  const sections = [
    'hero', // Hero (point de départ)
    'decouvrez-notre-histoire', // VideoSection
    'nos-realisations', // Portfolio
    'actualites-conseils', // BlogPreview
    'notre-equipe', // Team
  ]

  const heroRef = useRef<HTMLElement | null>(null)

  // Activer le swipe uniquement sur mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('left')
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Utiliser le hook de navigation globale
  // Swipe gauche = section suivante, Swipe droite = section précédente
  useSectionNavigation({
    sections,
    threshold: 80,
    enabled: isMobile,
    onSectionChange: (_index, direction) => {
      setTransitionDirection(direction)
      setIsTransitioning(true)
      // Réinitialiser après la transition
      setTimeout(() => {
        setIsTransitioning(false)
      }, 600)
    },
  })

  const scrollingWords = [
    'Des solutions web modernes',
    'Des applications mobiles innovantes',
    'Des expériences utilisateur exceptionnelles',
    'Des designs sur mesure',
    'Des technologies de pointe',
  ]

  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    if (!inView) return
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % scrollingWords.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [inView, scrollingWords.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Combiner les refs
  const combinedRef = (node: HTMLElement | null) => {
    ref(node) // ref de useInView est toujours une fonction
    heroRef.current = node
  }

  return (
    <>
      {/* Overlay de transition pour l'effet "pages d'un livre" - masque complètement le contenu */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="transition-overlay"
            initial={{ 
              x: transitionDirection === 'left' ? '100%' : '-100%',
              opacity: 1,
            }}
            animate={{ 
              x: 0,
              opacity: 1,
            }}
            exit={{ 
              x: transitionDirection === 'left' ? '-100%' : '100%',
              opacity: 1,
            }}
            transition={{
              type: 'tween',
              ease: [0.4, 0, 0.2, 1],
              duration: 0.15, // Animation rapide pour masquer immédiatement le contenu
            }}
            className="fixed inset-0 z-[9999] pointer-events-auto"
            style={{
              background: 'rgba(0, 0, 0, 1)',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
            onAnimationStart={() => {
              // S'assurer que le scroll est bloqué dès que l'animation commence
              document.body.style.overflow = 'hidden'
              document.documentElement.style.overflow = 'hidden'
            }}
          />
        )}
      </AnimatePresence>

      <section
        id="hero"
        ref={combinedRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-20 sm:pb-24 w-full"
      >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 [data-theme='dark']:bg-gradient-to-br [data-theme='dark']:from-dark-500 [data-theme='dark']:via-dark-600 [data-theme='dark']:to-dark-500 [data-theme='light']:bg-gradient-to-br [data-theme='light']:from-white [data-theme='light']:via-secondary-50 [data-theme='light']:to-secondary-100">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Background Stars */}
        <BackgroundStars />
        
        {/* Small Shooting Stars */}
        <SmallShootingStars />
        
        {/* Animated Gradient Orbs - Responsive sizes */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] [data-theme='dark']:bg-primary-500/30 [data-theme='light']:bg-primary-500/10 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] opacity-40 sm:opacity-50 md:opacity-60"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] [data-theme='dark']:bg-secondary-500/30 [data-theme='light']:bg-secondary-500/10 rounded-full blur-[70px] sm:blur-[100px] md:blur-[120px] opacity-40 sm:opacity-50 md:opacity-60"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute top-1/2 left-1/2 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] [data-theme='dark']:bg-accent-500/20 [data-theme='light']:bg-accent-500/5 rounded-full blur-[50px] sm:blur-[70px] md:blur-[90px] opacity-30 sm:opacity-40 md:opacity-50 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="container-custom relative z-10 w-full max-w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center max-w-6xl mx-auto"
        >
          {/* Enhanced Badge */}
          <motion.div variants={itemVariants} className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 px-2">
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 rounded-full glass-effect text-[10px] xs:text-xs sm:text-sm font-semibold text-primary-300 [data-theme='light']:text-primary-600 shadow-xl [data-theme='dark']:shadow-primary-500/30 [data-theme='light']:shadow-primary-500/20 border-primary-500/20"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary-400" />
              </motion.div>
              <span className="tracking-wide text-center whitespace-nowrap">Innovation & Excellence</span>
            </motion.span>
          </motion.div>

          {/* Enhanced Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-display font-black mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-[1.15] sm:leading-[1.12] md:leading-[1.08] lg:leading-[1.05] tracking-tighter px-3 sm:px-4 md:px-2 lg:px-0"
          >
            <motion.div
              className="block mb-1.5 sm:mb-2 md:mb-3"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-white [data-theme='light']:text-dark-500 break-words">Créons </span>
              <span className="gradient-text bg-gradient-to-r from-primary-400 via-primary-500 via-primary-600 to-primary-700 bg-clip-text text-transparent relative break-words">
              L'Innovation
              <motion.span
                className="absolute -inset-1 sm:-inset-2 md:-inset-3 lg:-inset-4 bg-gradient-to-r from-primary-500/20 via-primary-600/20 to-primary-700/20 blur-lg sm:blur-xl md:blur-2xl -z-10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              </span>
            </motion.div>
            <motion.span
              className="block text-white [data-theme='light']:text-dark-500 break-words"
              initial={{ opacity: 0, x: 80 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              De Demain
            </motion.span>
          </motion.h1>

          {/* Clean & Professional Scrolling Text Section */}
          <motion.div
            variants={itemVariants}
            className="mb-16 max-w-4xl mx-auto px-4"
          >
            {/* Simple Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-white/80 mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center leading-relaxed font-light px-3 sm:px-4 md:px-6 lg:px-0"
            >
              Nous créons des solutions innovantes<br className="sm:hidden" /> qui transforment votre vision en réalité
          </motion.p>
            
            {/* Clean Animated Scrolling Words */}
            <div className="relative h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28 flex items-center justify-center my-6 sm:my-8 md:my-10 lg:my-12">
              <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentWordIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-center px-2"
                  >
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold tracking-tight break-words">
                      <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                        {scrollingWords[currentWordIndex]}
                      </span>
                    </h2>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Simple Progress indicator */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center space-x-2">
                {scrollingWords.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentWordIndex(idx)}
                    className="focus:outline-none"
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentWordIndex 
                          ? 'w-8 bg-primary-500' 
                          : 'w-1.5 bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Subtle Horizontal Scroll Banner */}
          <motion.div
            variants={itemVariants}
            className="relative w-full overflow-hidden py-4 sm:py-5 md:py-6 mb-8 sm:mb-10 md:mb-12 max-w-full"
          >
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling content */}
            <motion.div
              className="flex whitespace-nowrap"
              animate={{
                x: ['0%', '-50%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 35,
                  ease: 'linear',
                },
              }}
              style={{
                width: 'max-content',
              }}
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center space-x-8 sm:space-x-12 md:space-x-16 px-8 sm:px-12 md:px-16">
                  {scrollingWords.map((word, idx) => (
                    <div key={`${i}-${idx}`} className="flex items-center space-x-8 sm:space-x-12 md:space-x-16">
                      <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-white/12 uppercase tracking-wider whitespace-nowrap">
                        {word}
                      </span>
                      <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-primary-500/20" />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-12 sm:mb-16 md:mb-20 lg:mb-24 px-3 sm:px-4 md:px-0"
          >
            <motion.div 
              whileHover={{ y: -4 }} 
              whileTap={{ y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              <Link
                to="/contact"
                className="btn-primary group flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 lg:py-6 font-semibold relative z-10 w-full sm:w-auto"
              >
                <span className="whitespace-nowrap">Démarrer un projet</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ y: -4 }} 
              whileTap={{ y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              <Link
                to="/services"
                className="btn-secondary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 lg:py-6 font-semibold relative z-10 w-full sm:w-auto text-center block whitespace-nowrap"
              >
                Découvrir nos services
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Features Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 mt-6 sm:mt-10 md:mt-14 lg:mt-18 xl:mt-24 px-3 sm:px-4 md:px-0"
          >
            {[
              { 
                icon: Code, 
                title: 'Développement', 
                desc: 'Web, Mobile, Cloud', 
                gradientFrom: 'from-primary-500',
                gradientTo: 'to-primary-600',
                shadowColor: 'shadow-primary-500/30',
                glowColor: 'bg-primary-500/20',
                borderGradient: 'from-primary-500/20'
              },
              { 
                icon: Smartphone, 
                title: 'Matériel', 
                desc: 'Équipements professionnels',
                gradientFrom: 'from-secondary-500',
                gradientTo: 'to-secondary-600',
                shadowColor: 'shadow-secondary-500/30',
                glowColor: 'bg-secondary-500/20',
                borderGradient: 'from-secondary-500/20'
              },
              { 
                icon: Sparkles, 
                title: 'Design', 
                desc: 'Infographie & Branding',
                gradientFrom: 'from-accent-500',
                gradientTo: 'to-accent-600',
                shadowColor: 'shadow-accent-500/30',
                glowColor: 'bg-accent-500/20',
                borderGradient: 'from-accent-500/20'
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 1 + index * 0.15, duration: 0.6 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="group relative p-3 sm:p-5 md:p-7 lg:p-9 xl:p-10 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl glass-effect card-hover overflow-hidden border-primary-500/10 group-hover:border-primary-500/30 transition-all duration-500"
                >
                  {/* Animated Gradient Border */}
                  <div className={`absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl bg-gradient-to-br ${feature.borderGradient} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Background Glow on Hover */}
                  <div className={`absolute -inset-0.5 sm:-inset-1 md:-inset-2 lg:-inset-3 xl:-inset-4 ${feature.glowColor} rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl blur-md sm:blur-lg md:blur-xl lg:blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 -z-10`} />
                  
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} flex items-center justify-center mb-2 sm:mb-3 md:mb-4 lg:mb-6 xl:mb-8 mx-auto shadow-2xl ${feature.shadowColor} group-hover:shadow-2xl transition-all duration-500`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-white relative z-10" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl ${feature.glowColor} blur-sm sm:blur-md md:blur-lg lg:blur-xl`}
                    />
                  </motion.div>
                  
                  <h3 className="text-white [data-theme='light']:text-dark-500 font-bold text-base sm:text-lg md:text-xl lg:text-2xl mb-1 sm:mb-1.5 md:mb-2 lg:mb-3 xl:mb-4 relative z-10 tracking-tight text-center">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-400 [data-theme='light']:text-secondary-600 text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed relative z-10 text-center">
                    {feature.desc}
                  </p>
                  
                  {/* Bottom Accent Line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`} />
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 z-20 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center space-y-2 cursor-pointer group"
        >
          <span className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 font-medium uppercase tracking-wider group-hover:text-primary-400 transition-colors">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-primary-400/60 rounded-full flex justify-center p-1 group-hover:border-primary-400 transition-colors"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-3 bg-primary-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
    </>
  )
}

export default Hero


