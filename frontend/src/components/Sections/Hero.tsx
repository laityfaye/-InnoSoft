import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Code, Smartphone } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import BackgroundStars from './BackgroundStars'
import SmallShootingStars from './SmallShootingStars'

const Hero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
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

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32"
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 [data-theme='dark']:bg-gradient-to-br [data-theme='dark']:from-dark-500 [data-theme='dark']:via-dark-600 [data-theme='dark']:to-dark-500 [data-theme='light']:bg-gradient-to-br [data-theme='light']:from-white [data-theme='light']:via-secondary-50 [data-theme='light']:to-secondary-100">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Background Stars */}
        <BackgroundStars />
        
        {/* Small Shooting Stars */}
        <SmallShootingStars />
        
        {/* Animated Gradient Orbs */}
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
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] [data-theme='dark']:bg-primary-500/30 [data-theme='light']:bg-primary-500/10 rounded-full blur-[100px] opacity-60"
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
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] [data-theme='dark']:bg-secondary-500/30 [data-theme='light']:bg-secondary-500/10 rounded-full blur-[120px] opacity-60"
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
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] [data-theme='dark']:bg-accent-500/20 [data-theme='light']:bg-accent-500/5 rounded-full blur-[90px] opacity-50 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center max-w-6xl mx-auto"
        >
          {/* Enhanced Badge */}
          <motion.div variants={itemVariants} className="mb-10">
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center space-x-3 px-6 py-3 rounded-full glass-effect text-sm font-semibold text-primary-300 [data-theme='light']:text-primary-600 shadow-xl [data-theme='dark']:shadow-primary-500/30 [data-theme='light']:shadow-primary-500/20 border-primary-500/20"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5 text-primary-400" />
              </motion.div>
              <span className="tracking-wide">Innovation & Excellence Technologique</span>
            </motion.span>
          </motion.div>

          {/* Enhanced Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-black mb-10 leading-[1.05] tracking-tighter"
          >
            <motion.div
              className="block mb-3"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-white [data-theme='light']:text-dark-500">Créons </span>
              <span className="gradient-text bg-gradient-to-r from-primary-400 via-primary-500 via-primary-600 to-primary-700 bg-clip-text text-transparent relative">
              L'Innovation
              <motion.span
                className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-primary-600/20 to-primary-700/20 blur-2xl -z-10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              </span>
            </motion.div>
            <motion.span
              className="block text-white [data-theme='light']:text-dark-500"
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
              className="text-xl sm:text-2xl md:text-3xl text-white/80 mb-12 text-center leading-relaxed font-light"
            >
              Nous créons des solutions innovantes qui transforment votre vision en réalité
          </motion.p>
            
            {/* Clean Animated Scrolling Words */}
            <div className="relative h-20 sm:h-24 md:h-28 flex items-center justify-center my-12">
              <div className="absolute inset-0 flex items-center justify-center">
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
                    className="text-center"
                  >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
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
            className="relative w-full overflow-hidden py-6 mb-12"
          >
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling content */}
            <motion.div
              className="flex whitespace-nowrap"
              animate={{
                x: [0, -1600],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 35,
                  ease: 'linear',
                },
              }}
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center space-x-16 px-16">
                  {scrollingWords.map((word, idx) => (
                    <div key={`${i}-${idx}`} className="flex items-center space-x-16">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-white/12 uppercase tracking-wider whitespace-nowrap">
                        {word}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-primary-500/20" />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
          >
            <motion.div 
              whileHover={{ y: -4 }} 
              whileTap={{ y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to="/contact"
                className="btn-primary group flex items-center space-x-3 text-lg px-12 py-6 font-semibold relative z-10"
              >
                <span>Démarrer un projet</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ y: -4 }} 
              whileTap={{ y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to="/services"
                className="btn-secondary text-lg px-12 py-6 font-semibold relative z-10"
              >
                Découvrir nos services
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Features Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
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
                  className="group relative p-10 rounded-3xl glass-effect card-hover overflow-hidden border-primary-500/10 group-hover:border-primary-500/30 transition-all duration-500"
                >
                  {/* Animated Gradient Border */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.borderGradient} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Background Glow on Hover */}
                  <div className={`absolute -inset-4 ${feature.glowColor} rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 -z-10`} />
                  
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} flex items-center justify-center mb-8 mx-auto shadow-2xl ${feature.shadowColor} group-hover:shadow-2xl transition-all duration-500`}
                  >
                    <Icon className="w-10 h-10 text-white relative z-10" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 rounded-2xl ${feature.glowColor} blur-xl`}
                    />
                  </motion.div>
                  
                  <h3 className="text-white [data-theme='light']:text-dark-500 font-bold text-2xl mb-4 relative z-10 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-400 [data-theme='light']:text-secondary-600 text-base leading-relaxed relative z-10">
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
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
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
  )
}

export default Hero


