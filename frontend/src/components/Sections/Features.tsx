import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Zap, Shield, Rocket, Users, Target, Award } from 'lucide-react'

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: Zap,
      title: 'Performance Optimale',
      description: 'Solutions optimisées pour des performances exceptionnelles et une expérience utilisateur fluide.',
    },
    {
      icon: Shield,
      title: 'Sécurité Renforcée',
      description: 'Protection avancée de vos données avec les dernières technologies de sécurité.',
    },
    {
      icon: Rocket,
      title: 'Innovation Continue',
      description: 'Utilisation des technologies les plus récentes pour rester à la pointe de l\'innovation.',
    },
    {
      icon: Users,
      title: 'Support Dédié',
      description: 'Équipe d\'experts disponible pour vous accompagner à chaque étape de votre projet.',
    },
    {
      icon: Target,
      title: 'Solutions Sur Mesure',
      description: 'Personnalisation complète selon vos besoins spécifiques et vos objectifs business.',
    },
    {
      icon: Award,
      title: 'Qualité Premium',
      description: 'Standards de qualité élevés garantissant des résultats professionnels à la hauteur de vos attentes.',
    },
  ]

  return (
    <section ref={ref} className="section-padding bg-dark-600/30 [data-theme='light']:bg-secondary-50/50 transition-colors duration-300">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            Pourquoi Choisir <span className="gradient-text">InnoSoft</span> ?
          </h2>
          <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 max-w-2xl mx-auto transition-colors">
            Des avantages qui font la différence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-8 rounded-2xl glass-effect card-hover overflow-hidden border-primary-500/0 group-hover:border-primary-500/20 transition-all duration-500"
              >
                {/* Hover Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-primary opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700 -z-10" />
                
                <div className="relative w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                  <Icon className="w-8 h-8 text-white relative z-10" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white [data-theme='light']:text-dark-500 transition-colors tracking-tight">{feature.title}</h3>
                <p className="text-secondary-400 [data-theme='light']:text-secondary-600 leading-relaxed transition-colors text-[15px]">{feature.description}</p>
                
                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features

