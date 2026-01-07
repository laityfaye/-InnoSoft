import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionTransitionProps {
  children: ReactNode
  direction: 'left' | 'right'
  isActive: boolean
}

/**
 * Composant de transition pour créer un effet de "pages d'un livre"
 * lors de la navigation entre sections
 */
export const SectionTransition = ({ children, direction, isActive }: SectionTransitionProps) => {
  const variants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <AnimatePresence mode="wait" custom={direction}>
      {isActive && (
        <motion.div
          key="section-content"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: 'tween',
            ease: [0.4, 0, 0.2, 1],
            duration: 0.6,
          }}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

