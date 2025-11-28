import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { Code, Smartphone, Palette, Server, ArrowRight } from 'lucide-react'

const ServicesPreview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const services = [
    {
      icon: Code,
      title: 'Développement Web',
      description: 'Solutions web modernes, performantes et scalables pour votre entreprise.',
      color: 'primary',
      path: '/services#web',
    },
    {
      icon: Smartphone,
      title: 'Applications Mobile',
      description: 'Applications iOS et Android natives et cross-platform de qualité professionnelle.',
      color: 'secondary',
      path: '/services#mobile',
    },
    {
      icon: Palette,
      title: 'Infographie & Design',
      description: 'Création visuelle 2D/3D, branding et supports de communication impactants.',
      color: 'accent',
      path: '/services#design',
    },
    {
      icon: Server,
      title: 'Matériel & Infrastructure',
      description: 'Vente et configuration de matériel électronique professionnel et serveurs.',
      color: 'primary',
      path: '/services#hardware',
    },
  ]

  const colorClasses = {
    primary: 'from-primary-500 to-primary-400',
    secondary: 'from-secondary-500 to-secondary-400',
    accent: 'from-accent-500 to-accent-400',
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
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Nos <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-gray-400 [data-theme='light']:text-gray-600 max-w-2xl mx-auto transition-colors">
            Des solutions complètes pour tous vos besoins technologiques
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl glass-effect card-hover overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[service.color as keyof typeof colorClasses]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorClasses[service.color as keyof typeof colorClasses]} flex items-center justify-center mb-6 shadow-glow`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">{service.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                  <Link
                    to={service.path}
                    className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-medium group/link transition-colors"
                  >
                    <span>En savoir plus</span>
                    <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/services" className="btn-secondary">
            Voir tous les services
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesPreview

