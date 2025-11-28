import { useState, useEffect } from 'react'

export const useTheme = () => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme')
    setIsDark(theme === 'dark')
    
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme')
      setIsDark(currentTheme === 'dark')
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    return () => observer.disconnect()
  }, [])

  return { isDark }
}

