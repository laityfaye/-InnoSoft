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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            Nos <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 max-w-2xl mx-auto transition-colors">
            Des solutions complètes pour tous vos besoins technologiques
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative p-10 rounded-3xl glass-effect card-hover overflow-hidden border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute -inset-4 bg-gradient-to-br ${colorClasses[service.color as keyof typeof colorClasses]} opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-700 -z-10`} />
                
                {/* Border Gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colorClasses[service.color as keyof typeof colorClasses]} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClasses[service.color as keyof typeof colorClasses]} flex items-center justify-center mb-8 shadow-2xl group-hover:shadow-[0_0_40px_-10px_rgba(244,67,54,0.5)] transition-all duration-500`}
                  >
                    <Icon className="w-10 h-10 text-white relative z-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-white [data-theme='light']:text-dark-500 tracking-tight">{service.title}</h3>
                  <p className="text-secondary-400 [data-theme='light']:text-secondary-600 mb-8 leading-relaxed text-[15px]">{service.description}</p>
                  <Link
                    to={service.path}
                    className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-semibold group/link transition-all duration-300 relative"
                  >
                    <span className="relative">
                      En savoir plus
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left" />
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
                
                {/* Bottom Accent Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`} />
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

