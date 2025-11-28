import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../ThemeToggle'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/services', label: 'Services' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/about', label: 'À propos' },
    { path: '/contact', label: 'Contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-effect shadow-lg'
          : '[data-theme="dark"]:bg-dark-500/80 [data-theme="light"]:bg-white backdrop-blur-md'
      }`}
    >
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Zap className="w-8 h-8 text-primary-400 group-hover:text-primary-300 transition-colors" />
              <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full group-hover:bg-primary-500/30 transition-all" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">
              InnoSoft
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-400'
                    : 'text-gray-300 [data-theme="light"]:text-gray-700 hover:text-primary-400 [data-theme="dark"]:hover:text-white [data-theme="light"]:hover:text-primary-500'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <ThemeToggle />
            <Link
              to="/contact"
              className="btn-primary text-sm px-6 py-2.5"
            >
              Démarrer un projet
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 [data-theme='light']:text-gray-700 hover:text-primary-400 [data-theme='dark']:hover:text-white [data-theme='light']:hover:text-primary-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-effect border-t [data-theme='dark']:border-white/10 [data-theme='light']:border-gray-200"
          >
            <div className="container-custom py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-400 bg-primary-500/10 [data-theme="light"]:bg-primary-500/20'
                      : 'text-gray-300 [data-theme="light"]:text-gray-700 hover:text-primary-400 [data-theme="dark"]:hover:text-white [data-theme="light"]:hover:text-primary-500 hover:bg-white/5 [data-theme="light"]:hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-300 [data-theme='light']:text-gray-700 text-sm font-medium transition-colors">Thème</span>
                <ThemeToggle />
              </div>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block btn-primary text-center mt-4"
              >
                Démarrer un projet
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header

