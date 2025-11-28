import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Users, Briefcase, Award, TrendingUp } from 'lucide-react'

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const stats = [
    { icon: Users, value: '500+', label: 'Clients satisfaits', color: 'primary' },
    { icon: Briefcase, value: '1000+', label: 'Projets réalisés', color: 'secondary' },
    { icon: Award, value: '50+', label: 'Prix & Reconnaissances', color: 'accent' },
    { icon: TrendingUp, value: '98%', label: 'Taux de satisfaction', color: 'primary' },
  ]

  const Counter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
      if (!inView) return
      
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
    }, [inView, end, duration])

    return <span>{count}{end.toString().includes('+') ? '+' : end.toString().includes('%') ? '%' : ''}</span>
  }

  return (
    <section ref={ref} className="section-padding bg-dark-600/50 [data-theme='light']:bg-gray-50 transition-colors duration-300">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl glass-effect card-hover"
              >
                <div className={`w-16 h-16 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-glow`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
                  {stat.value.includes('+') || stat.value.includes('%') ? (
                    stat.value
                  ) : (
                    <Counter end={parseInt(stat.value)} />
                  )}
                </div>
                <p className="text-gray-400 [data-theme='light']:text-gray-600 text-sm font-medium transition-colors">{stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Stats

