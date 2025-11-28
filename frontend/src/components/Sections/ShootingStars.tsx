import { useEffect, useState } from 'react'

interface Star {
  id: number
  left: string
  delay: number
  duration: number
  size: number
  top: string
}

const ShootingStars = () => {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    // Générer 15-20 étoiles filantes
    const newStars: Star[] = []
    for (let i = 0; i < 20; i++) {
      newStars.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 50}%`,
        delay: Math.random() * 20,
        duration: 2 + Math.random() * 3, // Entre 2 et 5 secondes
        size: 1 + Math.random() * 2, // Entre 1 et 3px
      })
    }
    setStars(newStars)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute shooting-star"
          style={{
            left: star.left,
            top: star.top,
            width: `${80 + Math.random() * 150}px`,
            height: `${star.size}px`,
            animation: `shootingStar ${star.duration}s linear ${star.delay}s infinite`,
            transform: `rotate(-45deg)`,
            transformOrigin: '0 0',
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-90 [data-theme='light']:via-primary-400 [data-theme='light']:opacity-70"
            style={{
              filter: `blur(${star.size * 0.5}px)`,
              boxShadow: `0 0 ${star.size * 4}px ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            }}
          />
          <div
            className="absolute left-0 top-0 w-2 h-2 rounded-full bg-white [data-theme='light']:bg-primary-400"
            style={{
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 ${star.size * 6}px ${star.size * 3}px rgba(255, 255, 255, 1), 0 0 ${star.size * 10}px ${star.size * 5}px rgba(255, 255, 255, 0.5)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default ShootingStars

