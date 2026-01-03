import Hero from '../components/Sections/Hero'
import ServicesPreview from '../components/Sections/ServicesPreview'
import Features from '../components/Sections/Features'
import Stats from '../components/Sections/Stats'
import Testimonials from '../components/Sections/Testimonials'
import CTA from '../components/Sections/CTA'
import Portfolio from '../components/Sections/Portfolio'
import Process from '../components/Sections/Process'
import TechStack from '../components/Sections/TechStack'
import Partners from '../components/Sections/Partners'
import FAQ from '../components/Sections/FAQ'
import Newsletter from '../components/Sections/Newsletter'
import BlogPreview from '../components/Sections/BlogPreview'
import Team from '../components/Sections/Team'
import Certifications from '../components/Sections/Certifications'
import SocialMedia from '../components/Sections/SocialMedia'
import Awards from '../components/Sections/Awards'
import VideoSection from '../components/Sections/VideoSection'
import QuickContact from '../components/Sections/QuickContact'
import SEO from '../components/SEO'

const Home = () => {
  // Données structurées LocalBusiness pour améliorer le SEO local
  const localBusinessStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://innosft.com/#organization',
    name: 'InnoSoft Creation',
    image: 'https://innosft.com/logo.png',
    url: 'https://innosft.com',
    telephone: '+221-XX-XXX-XXXX', // À remplacer par le vrai numéro
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '', // À remplir avec l'adresse complète
      addressLocality: 'Thiès',
      addressRegion: 'Thiès',
      postalCode: '',
      addressCountry: 'SN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '', // À remplir avec les coordonnées GPS
      longitude: ''
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      opens: '09:00',
      closes: '18:00'
    },
    sameAs: [
      // Ajouter les liens vers les réseaux sociaux
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '10'
    }
  }

  return (
    <>
      <SEO
        title="InnoSoft Creation - Solutions Technologiques Innovantes"
        description="InnoSoft Creation propose des solutions technologiques complètes : développement web, applications mobiles, design graphique, matériel électronique et infrastructures cloud. Transformez vos idées en réalité numérique."
        url="/"
        structuredData={localBusinessStructuredData}
      />
      <Hero />
      <Stats />
      <ServicesPreview />
      <TechStack />
      <Portfolio />
      <Process />
      <Features />
      <Team />
      <Certifications />
      <Awards />
      <Partners />
      <VideoSection />
      <BlogPreview />
      <Testimonials />
      <FAQ />
      <QuickContact />
      <SocialMedia />
      <Newsletter />
      <CTA />
    </>
  )
}

export default Home

