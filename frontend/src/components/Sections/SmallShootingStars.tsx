import { useEffect, useState } from 'react'

interface ShootingStar {
  id: number
  left: string
  top: string
  delay: number
  duration: number
  angle: number
}

const SmallShootingStars = () => {
  const [stars, setStars] = useState<ShootingStar[]>([])

  useEffect(() => {
    // Générer 10-15 petites étoiles filantes
    const newStars: ShootingStar[] = []
    for (let i = 0; i < 12; i++) {
      newStars.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 15,
        duration: 1.5 + Math.random() * 2, // Entre 1.5 et 3.5 secondes
        angle: -45 + (Math.random() * 20 - 10), // Angle légèrement varié autour de -45°
      })
    }
    setStars(newStars)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => {
        // Calculer la distance de déplacement basée sur l'angle
        const distance = 200
        const angleRad = (star.angle * Math.PI) / 180
        const translateX = Math.cos(angleRad) * distance
        const translateY = Math.sin(angleRad) * distance
        
        return (
          <div
            key={star.id}
            className="absolute small-shooting-star"
            style={{
              left: star.left,
              top: star.top,
              width: '50px',
              height: '1px',
              transformOrigin: '0 0',
              animation: `smallShootingStar ${star.duration}s linear ${star.delay}s infinite`,
              '--translate-x': `${translateX}vh`,
              '--translate-y': `${translateY}vh`,
              '--star-rotate': `${star.angle}deg`,
            } as React.CSSProperties & { '--translate-x': string; '--translate-y': string; '--star-rotate': string }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 [data-theme='light']:via-primary-300 [data-theme='light']:opacity-50"
              style={{
                filter: 'blur(0.5px)',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default SmallShootingStars

