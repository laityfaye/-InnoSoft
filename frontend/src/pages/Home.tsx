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

const Home = () => {
  return (
    <>
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

