import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Sparkles } from 'lucide-react'

const CTA = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect text-sm font-medium text-primary-300 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Prêt à transformer votre entreprise ?</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Commencez Votre Projet
            <span className="block gradient-text">Aujourd'hui</span>
          </h2>

          <p className="text-xl text-gray-300 [data-theme='light']:text-gray-600 mb-10 max-w-2xl mx-auto transition-colors">
            Discutons de vos besoins et découvrons comment nous pouvons vous aider
            à atteindre vos objectifs numériques.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="btn-primary group flex items-center space-x-2"
            >
              <span>Contactez-nous</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/portfolio"
              className="btn-secondary"
            >
              Voir nos réalisations
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA

