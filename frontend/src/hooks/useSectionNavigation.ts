import { useEffect, useState, useRef, useCallback } from 'react'

interface UseSectionNavigationOptions {
  sections: string[] // IDs des sections dans l'ordre
  threshold?: number // Distance minimale pour déclencher un swipe
  enabled?: boolean // Activer/désactiver la navigation
  onSectionChange?: (index: number, direction: 'left' | 'right') => void // Callback lors du changement de section
}

/**
 * Hook pour gérer la navigation entre sections via swipe horizontal
 * Détecte automatiquement la section visible et permet la navigation bidirectionnelle
 */
export const useSectionNavigation = ({
  sections,
  threshold = 80,
  enabled = true,
  onSectionChange,
}: UseSectionNavigationOptions) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isSwipingRef = useRef(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const transitionDirectionRef = useRef<'left' | 'right'>('left')

  // Fonction pour naviguer vers une section avec transition animée
  const scrollToSection = useCallback((sectionId: string) => {
    // Empêcher le scroll pendant la transition
    setIsTransitioning(true)
    
    // Désactiver le scroll-behavior smooth temporairement
    const htmlElement = document.documentElement
    const originalScrollBehavior = htmlElement.style.scrollBehavior
    htmlElement.style.scrollBehavior = 'auto'
    
    // Masquer le scroll pendant la transition
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Calculer la position cible AVANT de masquer
    let targetElement: HTMLElement | null = null
    let targetPosition = 0
    
    if (sectionId === 'hero') {
      targetElement = document.getElementById('hero')
      targetPosition = 0
    } else {
      targetElement = document.getElementById(sectionId)
      if (targetElement) {
        const offset = 80 // Hauteur du header approximative
        const elementPosition = targetElement.getBoundingClientRect().top
        targetPosition = elementPosition + window.pageYOffset - offset
      }
    }

    // Masquer immédiatement le contenu avec l'overlay, puis faire le scroll instantané
    // Attendre que l'overlay soit complètement visible (animation d'entrée de 0.15s)
    setTimeout(() => {
      // Utiliser scrollIntoView si l'élément existe, sinon utiliser scrollTo
      if (targetElement && sectionId !== 'hero') {
        // Scroll instantané avec scrollIntoView
        targetElement.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        })
        // Ajuster pour le header
        window.scrollBy({
          top: -80,
          behavior: 'auto',
        })
      } else {
        // Pour le hero, scroll direct vers le haut
        window.scrollTo({
          top: 0,
          behavior: 'auto',
        })
      }
      
      // Forcer le scroll instantané en utilisant scrollTop directement (fallback)
      if (sectionId === 'hero') {
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      } else {
        document.documentElement.scrollTop = targetPosition
        document.body.scrollTop = targetPosition
      }
      
      // Réactiver le scroll après l'animation de sortie (0.6s)
      setTimeout(() => {
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        htmlElement.style.scrollBehavior = originalScrollBehavior
        setIsTransitioning(false)
      }, 600)
    }, 200) // Délai pour s'assurer que l'overlay est complètement visible (0.15s animation + marge)
  }, [])

  // Détecter quelle section est actuellement visible
  const detectCurrentSection = useCallback(() => {
    const viewportMiddle = window.innerHeight / 2
    let currentIndex = 0
    let maxVisibility = 0
    let minDistance = Infinity

    // Vérifier d'abord si on est dans le Hero (en haut de la page)
    const scrollY = window.pageYOffset || window.scrollY
    if (scrollY < 100) {
      // Si on est proche du haut, on est probablement dans le Hero
      const heroElement = document.getElementById('hero')
      if (heroElement) {
        const heroRect = heroElement.getBoundingClientRect()
        const heroVisibleHeight = Math.min(heroRect.bottom, window.innerHeight) - Math.max(heroRect.top, 0)
        const heroVisibility = heroVisibleHeight / Math.max(heroRect.height, 1)
        
        if (heroVisibility > 0.2) {
          return 0 // Hero est l'index 0
        }
      }
    }

    // Sinon, chercher parmi les autres sections
    sections.forEach((sectionId, index) => {
      // Ignorer le Hero dans cette boucle (déjà vérifié)
      if (sectionId === 'hero') return
      
      const element = document.getElementById(sectionId)
      if (element) {
        const rect = element.getBoundingClientRect()
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
        const visibility = visibleHeight / Math.max(rect.height, 1)
        const sectionCenter = rect.top + rect.height / 2
        const distanceFromCenter = Math.abs(sectionCenter - viewportMiddle)

        // Si la section est visible (au moins 20% visible)
        if (visibility > 0.2) {
          // Prioriser la section la plus visible et la plus proche du centre
          if (visibility > maxVisibility || (visibility === maxVisibility && distanceFromCenter < minDistance)) {
            maxVisibility = visibility
            minDistance = distanceFromCenter
            currentIndex = index
          }
        }
      }
    })

    return currentIndex
  }, [sections])

  // Mettre à jour l'index de la section actuelle lors du scroll
  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      const detectedIndex = detectCurrentSection()
      setCurrentSectionIndex(detectedIndex)
    }

    // Détecter immédiatement
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [enabled, detectCurrentSection])

  // Gérer le swipe vers la gauche (section suivante)
  const handleSwipeLeft = useCallback(() => {
    if (isSwipingRef.current || isTransitioning) return
    if (currentSectionIndex < sections.length - 1) {
      isSwipingRef.current = true
      transitionDirectionRef.current = 'left'
      const nextIndex = currentSectionIndex + 1
      const sectionId = sections[nextIndex]
      
      // Appeler le callback AVANT la transition pour que l'overlay apparaisse immédiatement
      if (onSectionChange) {
        onSectionChange(nextIndex, 'left')
      }
      
      // Petit délai pour s'assurer que l'overlay est rendu avant le scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToSection(sectionId)
        })
      })
      
      setCurrentSectionIndex(nextIndex)
      
      setTimeout(() => {
        isSwipingRef.current = false
      }, 800)
    }
  }, [currentSectionIndex, sections, scrollToSection, isTransitioning, onSectionChange])

  // Gérer le swipe vers la droite (section précédente)
  const handleSwipeRight = useCallback(() => {
    if (isSwipingRef.current || isTransitioning) return
    if (currentSectionIndex > 0) {
      isSwipingRef.current = true
      transitionDirectionRef.current = 'right'
      const prevIndex = currentSectionIndex - 1
      const sectionId = sections[prevIndex]
      
      // Appeler le callback AVANT la transition pour que l'overlay apparaisse immédiatement
      if (onSectionChange) {
        onSectionChange(prevIndex, 'right')
      }
      
      // Petit délai pour s'assurer que l'overlay est rendu avant le scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToSection(sectionId)
        })
      })
      
      setCurrentSectionIndex(prevIndex)
      
      setTimeout(() => {
        isSwipingRef.current = false
      }, 800)
    }
  }, [currentSectionIndex, sections, scrollToSection, isTransitioning, onSectionChange])

  // Gérer les événements tactiles
  useEffect(() => {
    if (!enabled) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartX.current = touch.clientX
      touchStartY.current = touch.clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current !== null && touchStartY.current !== null) {
        const touch = e.touches[0]
        const deltaX = Math.abs(touch.clientX - touchStartX.current)
        const deltaY = Math.abs(touch.clientY - touchStartY.current)

        // Si le mouvement horizontal est plus important que le vertical, empêcher le scroll
        if (deltaX > deltaY && deltaX > 10) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) {
        return
      }

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartX.current
      const deltaY = Math.abs(touch.clientY - touchStartY.current)

      // Vérifier que le mouvement horizontal est plus important que le vertical
      // et qu'il dépasse le seuil minimum
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > threshold) {
        if (deltaX < 0) {
          // Swipe vers la gauche = section suivante
          handleSwipeLeft()
        } else if (deltaX > 0) {
          // Swipe vers la droite = section précédente
          handleSwipeRight()
        }
      }

      touchStartX.current = null
      touchStartY.current = null
    }

    const element = document.body
    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, threshold, handleSwipeLeft, handleSwipeRight])

  return {
    currentSectionIndex,
    scrollToSection,
    isTransitioning,
    transitionDirection: transitionDirectionRef.current,
  }
}

