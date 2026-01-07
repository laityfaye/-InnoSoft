import { ReactNode, Children } from 'react'

interface HorizontalScrollSectionsProps {
  children: ReactNode
}

/**
 * Composant wrapper qui permet un défilement horizontal sur mobile
 * et un défilement vertical normal sur desktop
 */
const HorizontalScrollSections = ({ children }: HorizontalScrollSectionsProps) => {
  const childrenArray = Children.toArray(children).filter(child => child !== null && child !== undefined)
  
  // Si aucun enfant valide, ne rien afficher
  if (childrenArray.length === 0) {
    return null
  }
  
  return (
    <>
      {/* Sur mobile : défilement horizontal avec snap */}
      <div className="md:hidden horizontal-scroll-mobile scrollbar-hide">
        <div className="horizontal-scroll-inner">
          {childrenArray.map((child, index) => (
            <div key={index} className="horizontal-scroll-section">
              {child}
            </div>
          ))}
        </div>
      </div>
      
      {/* Sur desktop : affichage vertical normal */}
      <div className="hidden md:block">
        {children}
      </div>
    </>
  )
}

export default HorizontalScrollSections

