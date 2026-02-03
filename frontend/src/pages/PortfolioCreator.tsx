import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, LayoutGrid, Sparkles } from 'lucide-react'
import SEO from '../components/SEO'

const PortfolioCreator = () => {
  return (
    <>
      <SEO
        title="Portfolio - Créer votre portfolio en ligne gratuitement | InnoSoft"
        description="Créez votre portfolio professionnel en ligne gratuitement. Portfolio développeur, portfolio designer, portfolio créatif. Outil de création de portfolio en ligne par InnoSoft."
        keywords="portfolio, créer portfolio, portfolio en ligne, portfolio professionnel, portfolio développeur, portfolio designer, portfolio créatif, portfolio gratuit, portfolio web"
        url="https://innosft.com/p/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Portfolio InnoSoft - Créateur de portfolio en ligne',
          url: 'https://innosft.com/p/',
          description: 'Créez votre portfolio professionnel en ligne gratuitement. Outil de création de portfolio pour développeurs, designers et créatifs.',
          applicationCategory: 'DesignApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'XOF'
          },
          publisher: {
            '@type': 'Organization',
            name: 'InnoSoft Creation',
            url: 'https://innosft.com'
          }
        }}
      />
      <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-20">
        <section className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 mb-8 shadow-lg shadow-primary-500/30"
            >
              <LayoutGrid className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
              Créez votre <span className="gradient-text">Portfolio</span> en ligne
            </h1>
            
            <p className="text-xl sm:text-2xl text-secondary-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              Portfolio professionnel, portfolio développeur, portfolio designer. 
              Présentez vos réalisations avec un portfolio en ligne moderne et gratuit.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#creer"
                className="btn-primary group flex items-center justify-center space-x-2 text-base md:text-lg px-8 md:px-10 py-4 md:py-5 font-semibold"
              >
                <Sparkles className="w-5 h-5" />
                <span>Créer mon portfolio gratuitement</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/portfolio"
                className="btn-secondary px-8 md:px-10 py-4 md:py-5 font-semibold"
              >
                Voir notre portfolio
              </Link>
            </motion.div>

            <motion.div
              id="creer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 p-6 rounded-2xl glass-effect border border-primary-500/20"
            >
              <h2 className="text-lg font-semibold text-white [data-theme='light']:text-dark-500 mb-4">
                Pourquoi créer un portfolio ?
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 text-left">
                <div>
                  <h3 className="font-medium text-primary-400 mb-1">Développeurs</h3>
                  <p className="text-sm text-secondary-400">Portfolio développeur pour présenter vos projets web et applications</p>
                </div>
                <div>
                  <h3 className="font-medium text-primary-400 mb-1">Designers</h3>
                  <p className="text-sm text-secondary-400">Portfolio designer pour exposer vos créations graphiques</p>
                </div>
                <div>
                  <h3 className="font-medium text-primary-400 mb-1">Créatifs</h3>
                  <p className="text-sm text-secondary-400">Portfolio créatif pour valoriser votre travail</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  )
}

export default PortfolioCreator
