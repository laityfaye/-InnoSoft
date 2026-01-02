import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Si on a un hash (ancre), on attend que la page se charge
    if (hash) {
      // Fonction pour essayer de scroller vers l'élément
      const scrollToHash = () => {
        const element = document.querySelector(hash)
        if (element) {
          // Scroll vers l'élément avec offset pour le header
          const headerOffset = 100
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
          return true
        }
        return false
      }

      // Essayer immédiatement
      if (!scrollToHash()) {
        // Si l'élément n'est pas trouvé, réessayer après un court délai
        const timeoutId = setTimeout(() => {
          scrollToHash()
        }, 150)

        return () => clearTimeout(timeoutId)
      }
    } else {
      // Scroll immédiat vers le haut de la page (plus fiable que smooth)
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default ScrollToTop

