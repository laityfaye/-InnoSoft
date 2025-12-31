import { useEffect, useState } from 'react'

interface Star {
  id: number
  left: string
  top: string
  size: number
  opacity: number
  delay: number
}

const BackgroundStars = () => {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    // Générer beaucoup d'étoiles pour créer un effet d'univers
    const newStars: Star[] = []
    for (let i = 0; i < 300; i++) {
      newStars.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 0.5 + Math.random() * 2.5, // Entre 0.5 et 3px
        opacity: 0.2 + Math.random() * 0.8, // Entre 0.2 et 1
        delay: Math.random() * 3, // Délai pour l'animation
      })
    }
    setStars(newStars)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white [data-theme='light']:bg-primary-500"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px ${star.size}px rgba(255, 255, 255, 0.5)`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default BackgroundStars

