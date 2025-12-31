import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Target, Eye, History, Users, Award, Zap } from 'lucide-react'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const values = [
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Nous restons à la pointe de la technologie pour offrir les meilleures solutions.',
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Nous visons la perfection dans chaque projet que nous entreprenons.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Nous travaillons en étroite collaboration avec nos clients pour comprendre leurs besoins.',
    },
    {
      icon: Award,
      title: 'Qualité',
      description: 'Nous garantissons des standards de qualité élevés dans tous nos services.',
    },
  ]

  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            À Propos de <span className="gradient-text">InnoSoft</span>
          </h1>
          <p className="text-xl text-secondary-400 leading-relaxed">
            Votre partenaire de confiance pour la transformation numérique
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section ref={ref} className="container-custom mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl glass-effect"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-white">Notre Mission</h2>
            <p className="text-secondary-400 leading-relaxed text-lg">
              Fournir des solutions technologiques innovantes, accessibles et personnalisées
              pour accompagner entreprises et institutions dans leur transformation numérique.
              Nous nous engageons à offrir des services de qualité qui répondent aux besoins
              spécifiques de chaque client.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl glass-effect"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-secondary flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-white">Notre Vision</h2>
            <p className="text-secondary-400 leading-relaxed text-lg">
              Devenir un leader des Technologies de l'Information et de la Communication
              en optimisant les systèmes d'information et en renforçant la connectivité
              entre services et utilisateurs. Nous aspirons à être reconnus comme le
              partenaire de référence pour l'innovation technologique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History */}
      <section className="container-custom mb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center space-x-4 mb-8">
            <History className="w-12 h-12 text-primary-400" />
            <h2 className="text-4xl font-display font-bold text-white">Notre Histoire</h2>
          </div>
          <div className="p-8 rounded-2xl glass-effect">
            <p className="text-secondary-300 leading-relaxed text-lg mb-4">
              InnoSoft Creation a été fondée avec la vision de démocratiser l'accès aux
              technologies de pointe tout en maintenant les plus hauts standards de qualité.
              Depuis nos débuts, nous avons développé des solutions robustes et innovantes
              pour plusieurs secteurs d'activité, notamment la santé, l'éducation et le commerce.
            </p>
            <p className="text-secondary-300 leading-relaxed text-lg mb-4">
              Notre approche unique allie créativité, technologie et innovation. Nous croyons
              que chaque projet est une opportunité de créer quelque chose d'exceptionnel qui
              transforme la façon dont nos clients interagissent avec la technologie.
            </p>
            <p className="text-secondary-300 leading-relaxed text-lg">
              Aujourd'hui, InnoSoft Creation continue d'évoluer et de s'adapter aux besoins
              changeants du marché, tout en restant fidèle à nos valeurs fondamentales :
              l'excellence, l'innovation et l'engagement envers nos clients.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Nos <span className="gradient-text">Valeurs</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 rounded-xl glass-effect card-hover text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{value.title}</h3>
                <p className="text-secondary-400 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default About

