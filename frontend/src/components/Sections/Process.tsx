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
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            Notre <span className="gradient-text">Processus</span>
          </h2>
          <p className="text-xl text-secondary-400 max-w-2xl mx-auto">
            Une méthode éprouvée en 4 étapes pour transformer vos idées en solutions performantes
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500/20 via-primary-500/40 to-primary-500/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <div className="relative z-10 mb-6">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClasses[step.color as keyof typeof colorClasses]} flex items-center justify-center shadow-xl shadow-primary-500/30 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      {/* Glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[step.color as keyof typeof colorClasses]} blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`} />
                    </div>

                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-dark-600 border-2 border-primary-500/30 flex items-center justify-center">
                      <span className="text-lg font-black text-primary-400">{step.number}</span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-secondary-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>

                  {/* Arrow connector (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-24 -right-4 z-20">
                      <ArrowRight className="w-6 h-6 text-primary-500/40" />
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
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl glass-effect border border-primary-500/20">
            <CheckCircle className="w-6 h-6 text-primary-400" />
            <p className="text-white font-medium">
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

