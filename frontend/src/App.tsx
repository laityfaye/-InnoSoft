import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import ScrollToTop from './components/ScrollToTop'
import Analytics from './components/Analytics'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const AdminLogin = lazy(() => import('./pages/Admin/Login'))
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'))
const Boutiques = lazy(() => import('./pages/Boutiques'))
const BoutiqueDetail = lazy(() => import('./pages/BoutiqueDetail'))
const BoutiqueRequest = lazy(() => import('./pages/BoutiqueRequest'))
const BoutiqueLogin = lazy(() => import('./pages/Boutique/Login'))
const BoutiqueDashboard = lazy(() => import('./pages/Boutique/Dashboard'))
const BoutiqueProductDetail = lazy(() => import('./pages/BoutiqueProductDetail'))
const BoutiqueCheckout = lazy(() => import('./pages/BoutiqueCheckout'))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-500">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-secondary-400">Chargement...</p>
    </div>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Analytics />
        <Router>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes with layout */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/services" element={<Layout><Services /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
              <Route path="/blog" element={<Layout><Blog /></Layout>} />
              <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
              
              {/* Boutique UIDT routes */}
              <Route path="/boutiques" element={<Layout><Boutiques /></Layout>} />
              <Route path="/boutiques/:slugOrId" element={<Layout><BoutiqueDetail /></Layout>} />
              <Route path="/boutiques/:slugOrId/products/:productId" element={<Layout><BoutiqueProductDetail /></Layout>} />
              <Route path="/boutiques/:slugOrId/checkout" element={<Layout><BoutiqueCheckout /></Layout>} />
              <Route path="/boutique-request" element={<Layout><BoutiqueRequest /></Layout>} />
              
              {/* Admin routes without layout */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* Boutique owner routes without layout */}
              <Route path="/boutique/login" element={<BoutiqueLogin />} />
              <Route path="/boutique/dashboard" element={<BoutiqueDashboard />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

