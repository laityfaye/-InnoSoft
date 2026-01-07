import { useEffect, useRef, useState } from 'react'

interface UseHorizontalSwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number // Distance minimale pour déclencher un swipe
  enabled?: boolean // Activer/désactiver le swipe
  targetElement?: HTMLElement | null // Élément cible pour limiter le swipe à une zone spécifique
}

/**
 * Hook personnalisé pour détecter les gestes de swipe horizontal
 * Spécialement conçu pour les écrans mobiles
 */
export const useHorizontalSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  enabled = true,
  targetElement,
}: UseHorizontalSwipeOptions) => {
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const handleTouchStart = (e: TouchEvent) => {
      // Vérifier si le touch commence dans l'élément cible (si spécifié)
      if (targetElement) {
        const touch = e.touches[0]
        const touchElement = document.elementFromPoint(touch.clientX, touch.clientY)
        if (!targetElement.contains(touchElement)) {
          return
        }
      }

      const touch = e.touches[0]
      touchStartX.current = touch.clientX
      touchStartY.current = touch.clientY
      setIsSwiping(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Empêcher le scroll vertical si on détecte un mouvement horizontal significatif
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
        setIsSwiping(false)
        return
      }

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartX.current
      const deltaY = Math.abs(touch.clientY - touchStartY.current)

      // Vérifier que le mouvement horizontal est plus important que le vertical
      // et qu'il dépasse le seuil minimum
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          // Swipe vers la droite
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          // Swipe vers la gauche
          onSwipeLeft()
        }
      }

      touchStartX.current = null
      touchStartY.current = null
      setIsSwiping(false)
    }

    const element = targetElement || document.body
    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipeLeft, onSwipeRight, threshold, enabled, targetElement])

  return { isSwiping }
}

