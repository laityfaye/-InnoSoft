import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Code, Smartphone } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import ShootingStars from './ShootingStars'

const Hero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 [data-theme='dark']:bg-gradient-to-br [data-theme='dark']:from-dark-500 [data-theme='dark']:via-dark-600 [data-theme='dark']:to-dark-500 [data-theme='light']:bg-gradient-to-br [data-theme='light']:from-white [data-theme='light']:via-blue-50 [data-theme='light']:to-indigo-50">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
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
        
        {/* Shooting Stars */}
        <ShootingStars />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center max-w-6xl mx-auto"
        >
          {/* Enhanced Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full glass-effect text-sm font-semibold text-primary-300 [data-theme='light']:text-primary-600 shadow-lg [data-theme='dark']:shadow-primary-500/20 [data-theme='light']:shadow-primary-500/10"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>Innovation & Excellence Technologique</span>
            </motion.span>
          </motion.div>

          {/* Enhanced Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl lg:text-9xl font-display font-extrabold mb-8 leading-[1.1] tracking-tight"
          >
            <motion.span
              className="block mb-2"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Solutions
            </motion.span>
            <motion.span
              className="block gradient-text mb-2 bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Numériques
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              d'Excellence
            </motion.span>
          </motion.h1>

          {/* Enhanced Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 [data-theme='light']:text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Accompagnons entreprises et institutions dans leur{' '}
            <span className="font-semibold text-primary-300 [data-theme='light']:text-primary-600">
              transformation numérique
            </span>{' '}
            avec des solutions innovantes, accessibles et personnalisées.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="btn-primary group flex items-center space-x-2 text-lg px-10 py-5 shadow-2xl [data-theme='dark']:shadow-primary-500/30 [data-theme='light']:shadow-primary-500/20"
              >
                <span className="font-semibold">Démarrer un projet</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/services"
                className="btn-secondary text-lg px-10 py-5 font-semibold hover:bg-primary-500/10 [data-theme='dark']:hover:bg-primary-500/20"
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
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative p-8 rounded-3xl glass-effect card-hover overflow-hidden"
                >
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.borderGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} flex items-center justify-center mb-6 mx-auto shadow-lg ${feature.shadowColor}`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                    <div className={`absolute inset-0 rounded-2xl ${feature.glowColor} opacity-0 group-hover:opacity-30 blur-xl transition-opacity`} />
                  </motion.div>
                  
                  <h3 className="text-white [data-theme='light']:text-dark-500 font-bold text-xl mb-3 relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 [data-theme='light']:text-gray-600 text-base relative z-10">
                    {feature.desc}
                  </p>
                  
                  {/* Hover Glow Effect */}
                  <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${feature.glowColor} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
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
          <span className="text-xs text-gray-400 [data-theme='light']:text-gray-600 font-medium uppercase tracking-wider group-hover:text-primary-400 transition-colors">
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


