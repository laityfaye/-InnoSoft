import { useEffect } from 'react'

// Remplacez par votre ID Google Analytics (format: G-XXXXXXXXXX)
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || ''

export const Analytics = () => {
  useEffect(() => {
    // Ne charger Analytics que si l'ID est défini
    if (!GA_TRACKING_ID) {
      console.warn('Google Analytics ID non configuré. Ajoutez VITE_GA_TRACKING_ID dans votre .env')
      return
    }

    // Charger Google Analytics
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}', {
        page_path: window.location.pathname,
      });
    `
    document.head.appendChild(script2)

    // Fonction pour suivre les changements de page (React Router)
    const handleRouteChange = () => {
      if (window.gtag) {
        window.gtag('config', GA_TRACKING_ID, {
          page_path: window.location.pathname,
        })
      }
    }

    // Écouter les changements de route
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return null
}

// Déclaration TypeScript pour gtag
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export default Analytics

