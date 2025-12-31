import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Search, Lightbulb, Code2, Rocket, CheckCircle } from 'lucide-react'

const Process = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const steps = [
    {
      number: '01',
      title: 'Consultation',
      description: 'Analyse approfondie de vos besoins, objectifs et contraintes pour définir le périmètre du projet.',
      icon: Search,
      color: 'primary',
    },
    {
      number: '02',
      title: 'Conception',
      description: 'Élaboration de l\'architecture, design des interfaces et planification détaillée de la solution.',
      icon: Lightbulb,
      color: 'secondary',
    },
    {
      number: '03',
      title: 'Développement',
      description: 'Implémentation agile avec itérations régulières, tests continus et validation progressive.',
      icon: Code2,
      color: 'accent',
    },
    {
      number: '04',
      title: 'Livraison',
      description: 'Déploiement, formation, documentation complète et support post-lancement pour garantir le succès.',
      icon: Rocket,
      color: 'primary',
    },
  ]

  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-accent-600',
  }

  return (
    <section ref={ref} className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-14 md:mb-16 px-4 sm:px-0"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4 sm:mb-5 md:mb-6 tracking-tight">
            Notre <span className="gradient-text">Processus</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-secondary-400 max-w-2xl mx-auto px-4 sm:px-6 md:px-0">
            Une méthode éprouvée en 4 étapes pour transformer vos idées en solutions performantes
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-20 sm:top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500/20 via-primary-500/40 to-primary-500/20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-8 px-4 sm:px-0">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="relative"
                >
                  {/* Step card */}
                  <div className="relative group">
                    {/* Icon container */}
                    <div className="relative z-10 mb-4 sm:mb-5 md:mb-6">
                      <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colorClasses[step.color as keyof typeof colorClasses]} flex items-center justify-center shadow-xl shadow-primary-500/30 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                      </div>
                      {/* Glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[step.color as keyof typeof colorClasses]} blur-xl sm:blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`} />
                    </div>

                    {/* Step number */}
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-dark-600 border-2 border-primary-500/30 flex items-center justify-center">
                      <span className="text-base sm:text-lg font-black text-primary-400">{step.number}</span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-xl sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-white group-hover:text-primary-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-secondary-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>

                  {/* Arrow connector (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-20 sm:top-24 -right-4 z-20">
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500/40" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 sm:mt-14 md:mt-16 text-center px-4 sm:px-0"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl glass-effect border border-primary-500/20">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400 flex-shrink-0" />
            <p className="text-white font-medium text-sm sm:text-base text-center">
              Chaque projet suit ce processus structuré pour garantir qualité et satisfaction
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export default Process

