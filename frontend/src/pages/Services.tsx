import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { Code, Smartphone, Palette, Server, Cloud, Database, Globe, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import ServiceImage from '../components/Services/ServiceImage'
import SEO from '../components/SEO'

const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  })
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  })
  const [isMounted, setIsMounted] = useState(false)

  // S'assurer que le contenu s'affiche même si inView n'est pas encore true
  // Cela évite le problème de page noire si useInView ne se déclenche pas immédiatement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const services = [
    {
      id: 'web',
      icon: Code,
      title: 'Développement Web',
      description: 'Création de sites web et applications web modernes, performantes et sécurisées.',
      features: [
        'Sites web responsive et modernes',
        'Applications web complexes (SPA, PWA)',
        'E-commerce et plateformes de vente',
        'Intégration API et systèmes tiers',
        'Optimisation SEO et performance',
      ],
      color: 'primary',
    },
    {
      id: 'mobile',
      icon: Smartphone,
      title: 'Applications Mobile',
      description: 'Développement d\'applications mobiles natives et cross-platform de qualité professionnelle.',
      features: [
        'Applications iOS et Android natives',
        'Solutions cross-platform (React Native, Flutter)',
        'Applications hybrides et PWA',
        'Intégration de services cloud',
        'Publication sur les stores',
      ],
      color: 'secondary',
    },
    {
      id: 'design',
      icon: Palette,
      title: 'Infographie & Communication Visuelle',
      description: 'Création visuelle impactante pour renforcer votre identité de marque.',
      features: [
        'Design 2D et 3D',
        'Identité visuelle et branding',
        'Supports de communication',
        'Animations et vidéos',
        'UI/UX Design',
      ],
      color: 'accent',
    },
    {
      id: 'hardware',
      icon: Server,
      title: 'Matériel Électronique',
      description: 'Vente et configuration de matériel informatique professionnel et serveurs.',
      features: [
        'Ordinateurs et serveurs',
        'Équipements réseau',
        'Accessoires et périphériques',
        'Configuration et installation',
        'Maintenance et support',
      ],
      color: 'primary',
    },
    {
      id: 'cloud',
      icon: Cloud,
      title: 'Solutions Cloud',
      description: 'Migration et gestion de vos infrastructures dans le cloud.',
      features: [
        'Migration vers le cloud',
        'Architecture cloud scalable',
        'DevOps et CI/CD',
        'Monitoring et sécurité',
        'Optimisation des coûts',
      ],
      color: 'secondary',
    },
    {
      id: 'integration',
      icon: Database,
      title: 'Intégration Système',
      description: 'Connexion et synchronisation de vos différents systèmes d\'information.',
      features: [
        'Intégration API',
        'Synchronisation de données',
        'Automatisation de processus',
        'Connecteurs personnalisés',
        'Migration de données',
      ],
      color: 'accent',
    },
  ]

  const colorClasses = {
    primary: 'from-primary-500 to-primary-400',
    secondary: 'from-secondary-500 to-secondary-400',
    accent: 'from-accent-500 to-accent-400',
  }

  return (
    <>
      <SEO
        title="Nos Services - Solutions Technologiques Complètes"
        description="Découvrez nos services : développement web, applications mobiles, design graphique, matériel électronique, solutions cloud et intégration système. Des solutions sur mesure pour votre entreprise."
        url="/services"
      />
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-20">
      {/* Hero Section */}
      <section ref={heroRef} className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={(heroInView || isMounted) ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Nos <span className="gradient-text">Services</span>
          </h1>
          <p className="text-xl text-secondary-400 leading-relaxed">
            Des solutions technologiques complètes pour tous vos besoins numériques
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section ref={ref} className="container-custom">
        <div className="space-y-24">
          {services.map((service, index) => {
            const Icon = service.icon
            const isEven = index % 2 === 0

            return (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={(inView || isMounted) ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                <div className="flex-1">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClasses[service.color as keyof typeof colorClasses]} flex items-center justify-center mb-6 shadow-glow`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-display font-bold mb-4 text-white">
                    {service.title}
                  </h2>
                  <p className="text-xl text-secondary-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-3">
                        <Zap className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                        <span className="text-secondary-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.div 
                  className="flex-1 relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: isEven ? 50 : -50 }}
                    animate={(inView || isMounted) ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.9, x: isEven ? 50 : -50 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="aspect-video rounded-3xl overflow-hidden relative shadow-2xl"
                  >
                    <ServiceImage serviceId={service.id} className="w-full h-full" />
                    {/* Overlay gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[service.color as keyof typeof colorClasses]} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                    {/* Border glow on hover */}
                    <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary-500/40 transition-all duration-500 shadow-[0_0_40px_rgba(244,67,54,0.3)]`} />
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom mt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={(inView || isMounted) ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8 }}
          className="text-center p-12 rounded-3xl glass-effect"
        >
          <h3 className="text-3xl font-display font-bold mb-4">
            Prêt à Démarrer Votre Projet ?
          </h3>
          <p className="text-secondary-400 mb-8 text-lg">
            Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center space-x-2">
            <span>Nous contacter</span>
            <Globe className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
    </>
  )
}

export default Services

