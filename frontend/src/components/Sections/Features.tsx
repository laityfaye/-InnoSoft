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
    <section ref={ref} className="section-padding bg-dark-600/30 [data-theme='light']:bg-gray-50/50 transition-colors duration-300">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Pourquoi Choisir <span className="gradient-text">InnoSoft</span> ?
          </h2>
          <p className="text-xl text-gray-400 [data-theme='light']:text-gray-600 max-w-2xl mx-auto transition-colors">
            Des avantages qui font la différence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl glass-effect card-hover"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white [data-theme='light']:text-dark-500 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 [data-theme='light']:text-gray-600 leading-relaxed transition-colors">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features

