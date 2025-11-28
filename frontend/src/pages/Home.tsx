import Hero from '../components/Sections/Hero'
import ServicesPreview from '../components/Sections/ServicesPreview'
import Features from '../components/Sections/Features'
import Stats from '../components/Sections/Stats'
import Testimonials from '../components/Sections/Testimonials'
import CTA from '../components/Sections/CTA'

const Home = () => {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesPreview />
      <Features />
      <Testimonials />
      <CTA />
    </>
  )
}

export default Home

