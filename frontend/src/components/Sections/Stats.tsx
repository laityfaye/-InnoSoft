import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Users, Briefcase, Award, TrendingUp } from 'lucide-react'

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const [isHovered, setIsHovered] = useState(false)

  const stats = [
    { icon: Users, value: '500+', label: 'Clients satisfaits', color: 'primary' },
    { icon: Briefcase, value: '1000+', label: 'Projets réalisés', color: 'secondary' },
    { icon: Award, value: '50+', label: 'Prix & Reconnaissances', color: 'accent' },
    { icon: TrendingUp, value: '98%', label: 'Taux de satisfaction', color: 'primary' },
  ]

  const Counter = ({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) => {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)

    React.useEffect(() => {
      // Réinitialiser le compteur et l'animation quand on survole
      if (isHovered && !hasAnimated) {
        setCount(0)
        setHasAnimated(true)
        
        let startTime: number
        const animate = (currentTime: number) => {
          if (!startTime) startTime = currentTime
          const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
          setCount(Math.floor(progress * end))
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        requestAnimationFrame(animate)
      }
      
      // Réinitialiser quand on ne survole plus
      if (!isHovered) {
        setHasAnimated(false)
        setCount(end)
      }
    }, [isHovered, end, duration, hasAnimated])

    // Afficher la valeur finale si on n'a pas encore survolé
    if (!isHovered && !hasAnimated) {
      return <span>{end}{suffix}</span>
    }

    return <span>{count}{suffix}</span>
  }

  // Fonction pour extraire le nombre et le suffixe
  const parseValue = (value: string): { num: number; suffix: string } => {
    const num = parseInt(value.replace(/[^0-9]/g, ''))
    const suffix = value.includes('+') ? '+' : value.includes('%') ? '%' : ''
    return { num, suffix }
  }

  return (
    <section 
      ref={ref} 
      className="section-padding bg-dark-600/50 [data-theme='light']:bg-secondary-50 transition-colors duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const colorClasses = {
              primary: 'bg-gradient-primary',
              secondary: 'bg-gradient-secondary',
              accent: 'bg-gradient-to-r from-accent-500 to-accent-400',
            }

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="group relative text-center p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl glass-effect card-hover overflow-hidden border-primary-500/0 group-hover:border-primary-500/20 transition-all duration-500"
              >
                {/* Background Glow */}
                <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 bg-gradient-primary opacity-0 group-hover:opacity-10 blur-xl sm:blur-2xl transition-opacity duration-700 -z-10" />
                
                <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white relative z-10" />
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black gradient-text mb-2 sm:mb-3 tracking-tight">
                  {(() => {
                    const { num, suffix } = parseValue(stat.value)
                    return <Counter end={num} suffix={suffix} />
                  })()}
                </div>
                <p className="text-secondary-400 [data-theme='light']:text-secondary-600 text-xs sm:text-sm font-semibold transition-colors uppercase tracking-wider px-1">{stat.label}</p>
                
                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Stats

