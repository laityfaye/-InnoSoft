import { Link } from 'react-router-dom'
import { Zap, Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const services = [
    { name: 'Développement Web', path: '/services#web' },
    { name: 'Applications Mobile', path: '/services#mobile' },
    { name: 'Infographie', path: '/services#design' },
    { name: 'Matériel Électronique', path: '/services#hardware' },
  ]

  const company = [
    { name: 'À propos', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
    { name: 'Boutique UIDT', path: '/boutiques' },
    { name: 'Ouvrir une boutique', path: '/boutique-request' },
  ]

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
  ]

  return (
    <footer className="bg-dark-600 [data-theme='light']:bg-secondary-50 border-t border-white/10 [data-theme='light']:border-secondary-200 transition-colors duration-300 w-full overflow-x-hidden">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-display font-bold gradient-text">
                InnoSoft Creation
              </span>
            </Link>
            <p className="text-secondary-400 [data-theme='light']:text-secondary-600 text-sm leading-relaxed transition-colors">
              Solutions technologiques innovantes pour accompagner votre transformation numérique.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg glass-effect hover:bg-primary-500/20 transition-all group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-secondary-400 [data-theme='light']:text-secondary-600 group-hover:text-primary-400 transition-colors" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white [data-theme='light']:text-dark-500 font-semibold mb-4 transition-colors">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white [data-theme='light']:text-dark-500 font-semibold mb-4 transition-colors">Entreprise</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-secondary-400 [data-theme='light']:text-secondary-600 hover:text-primary-400 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white [data-theme='light']:text-dark-500 font-semibold mb-4 transition-colors">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:innosoftcreation@gmail.com"
                  className="text-secondary-400 [data-theme='light']:text-secondary-600 hover:text-primary-400 transition-colors text-sm"
                >
                  innosoftcreation@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+221000000000"
                  className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
                >
                  +221 78 018 62 29
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-secondary-400 text-sm">
                  Ville verte, Thiès, Sénégal
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-500 [data-theme='light']:text-secondary-600 text-sm transition-colors">
              © {currentYear} InnoSoft Creation. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-secondary-500 [data-theme='light']:text-secondary-600 hover:text-primary-400 transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                to="/terms"
                className="text-secondary-500 [data-theme='light']:text-secondary-600 hover:text-primary-400 transition-colors"
              >
                Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

