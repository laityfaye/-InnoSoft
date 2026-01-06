import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, MapPin, User, CreditCard, CheckCircle, AlertCircle, ArrowLeft, Navigation, Package, Route } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { ordersApi } from '../services/api'
import SEO from '../components/SEO'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image?: string | null
  images?: string[] | null
  category: string
  rating?: number
  stock: number
  is_featured?: boolean
  discount_percentage?: number | null
  promotion_price?: number | null
  promotion_start_date?: string | null
  promotion_end_date?: string | null
  is_on_promotion?: boolean
}

interface CartItem {
  product: Product
  quantity: number
}

interface FieldErrors {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  shipping_address?: string
  city?: string
  payment_method?: string
}

// Coordonnées du magasin (à configurer selon votre localisation)
// Pour obtenir les coordonnées exactes :
// 1. Ouvrez Google Maps et recherchez votre adresse
// 2. Cliquez droit sur le marqueur → "Coordonnées" ou "What's here?"
// 3. Copiez la latitude et longitude
const STORE_LOCATION = {
  latitude: 14.7886, // Coordonnées de Thiès, Sénégal (à ajuster selon votre adresse exacte)
  longitude: -16.9261,
  name: 'InnoSoft Creation',
  address: '',
}

// Configuration des frais de livraison
const DELIVERY_BASE_FEE = 500 // Frais de base pour les 3 premiers km en FCFA
const DELIVERY_BASE_DISTANCE = 3 // Distance de base (3 km)
const DELIVERY_FEE_PER_KM = 167 // Frais par kilomètre supplémentaire en FCFA (500/3 ≈ 167 F/km)

// Calculer les frais de livraison selon la distance
const calculateDeliveryFee = (distance: number): number => {
  if (distance <= DELIVERY_BASE_DISTANCE) {
    // Distance ≤ 3 km : frais de base
    return DELIVERY_BASE_FEE
  } else {
    // Distance > 3 km : frais de base + (distance - 3) × 167 F
    const additionalKm = distance - DELIVERY_BASE_DISTANCE
    return DELIVERY_BASE_FEE + Math.round(additionalKm * DELIVERY_FEE_PER_KM)
  }
}

const Checkout = () => {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup')
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [deliveryFee, setDeliveryFee] = useState<number>(0)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [mapsWarning, setMapsWarning] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  // Types pour Google Maps - utiliser any car Google Maps est chargé dynamiquement
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const initMapAttemptsRef = useRef<number>(0)

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    country: 'Sénégal',
    payment_method: 'cash',
    notes: '',
  })

  // Charger le panier depuis localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('innosoft_cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        if (parsedCart.length > 0) {
          setCart(parsedCart)
        } else {
          // Si le panier est vide, rediriger vers la page produits
          navigate('/products')
        }
      } catch (error) {
        console.error('Error loading cart:', error)
        navigate('/products')
      }
    } else {
      // Si pas de panier, rediriger vers la page produits
      navigate('/products')
    }
  }, [navigate])

  // Charger Google Maps API
  useEffect(() => {
    // Réinitialiser le compteur de tentatives
    initMapAttemptsRef.current = 0
    
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap()
        return
      }

      // Vérifier si la clé API est configurée
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        console.warn('Clé API Google Maps non configurée - La carte ne sera pas affichée mais la géolocalisation fonctionnera')
        // Ne pas bloquer - permettre la géolocalisation même sans carte
        // Afficher un avertissement discret (pas une erreur)
        setMapsWarning('Google Maps n\'est pas configuré. La carte ne sera pas affichée, mais la géolocalisation fonctionne toujours.')
        return
      }

      // Vérifier si le script n'est pas déjà en cours de chargement
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        // Attendre que le script existant se charge
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkInterval)
            initMap()
          }
        }, 100)
        
        // Timeout après 10 secondes
        setTimeout(() => {
          clearInterval(checkInterval)
          if (!window.google || !window.google.maps) {
            setLocationError('Le chargement de Google Maps prend trop de temps. Veuillez réessayer.')
          }
        }, 10000)
        
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&loading=async`
      script.async = true
      script.defer = true
      script.onload = () => {
        // Attendre un peu pour s'assurer que l'API est complètement chargée
        setTimeout(() => {
          if (window.google && window.google.maps && window.google.maps.Map) {
            initMap()
          } else {
            console.error('Google Maps API non disponible après chargement')
            setLocationError('Erreur lors de l\'initialisation de Google Maps. Veuillez réessayer.')
          }
        }, 100)
      }
      script.onerror = () => {
        console.error('Erreur lors du chargement de Google Maps')
        setLocationError('Impossible de charger Google Maps. Vérifiez votre connexion internet et que la clé API est valide.')
      }
      document.head.appendChild(script)
    }

    const MAX_INIT_ATTEMPTS = 50 // Maximum 5 secondes (50 * 100ms)
    
    const initMap = () => {
      if (!mapRef.current) return
      
      initMapAttemptsRef.current++
      
      // Vérifier que Google Maps est complètement chargé
      if (!window.google || !window.google.maps || typeof window.google.maps.Map !== 'function') {
        if (initMapAttemptsRef.current < MAX_INIT_ATTEMPTS) {
          setTimeout(initMap, 100)
        } else {
          console.error('Google Maps API n\'a pas pu être chargée après plusieurs tentatives')
          setLocationError('Impossible de charger Google Maps. Vérifiez votre connexion et que la clé API est valide.')
        }
        return
      }
      
      // Réinitialiser le compteur en cas de succès
      initMapAttemptsRef.current = 0

      const storePosition = { lat: STORE_LOCATION.latitude, lng: STORE_LOCATION.longitude }

      try {
        // Initialiser la carte centrée sur le magasin
        const map = new window.google.maps.Map(mapRef.current, {
        center: storePosition,
        zoom: 13,
        styles: isDark ? [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        ] : [],
      })

      mapInstanceRef.current = map

      // Ajouter un marqueur pour le magasin
      const storeMarker = new window.google.maps.Marker({
        position: storePosition,
        map: map,
        title: STORE_LOCATION.name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        },
      })

      markersRef.current.push(storeMarker)

      // Si on a la position du client, ajouter un marqueur et tracer une ligne
      if (customerLocation) {
        const customerMarker = new window.google.maps.Marker({
          position: { lat: customerLocation.lat, lng: customerLocation.lng },
          map: map,
          title: 'Votre position',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          },
        })

        markersRef.current.push(customerMarker)

        // Tracer une ligne entre le magasin et le client
        const line = new window.google.maps.Polyline({
          path: [storePosition, { lat: customerLocation.lat, lng: customerLocation.lng }],
          geodesic: true,
          strokeColor: '#3b82f6',
          strokeOpacity: 0.6,
          strokeWeight: 3,
        })

        line.setMap(map)

        // Ajuster la vue pour voir les deux points
        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend(storePosition)
        bounds.extend({ lat: customerLocation.lat, lng: customerLocation.lng })
        map.fitBounds(bounds)
      }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte Google Maps:', error)
        setLocationError('Erreur lors de l\'initialisation de la carte. Veuillez réessayer.')
      }
    }

    if (cart.length > 0) {
      loadGoogleMaps()
    }

    return () => {
      // Nettoyer les marqueurs
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []
    }
  }, [cart.length, customerLocation, isDark])

  // Vérifier le statut de la permission de géolocalisation
  const checkGeolocationPermission = async (): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> => {
    if (!navigator.geolocation) {
      return 'unsupported'
    }

    // Vérifier si l'API Permissions est disponible
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
        return permission.state as 'granted' | 'denied' | 'prompt'
      } catch (error) {
        // L'API Permissions n'est pas supportée ou a échoué
        console.warn('Impossible de vérifier le statut de la permission:', error)
        return 'prompt' // On suppose qu'on peut demander
      }
    }

    // Si l'API Permissions n'est pas disponible, on essaie directement
    return 'prompt'
  }

  // Référence pour stocker l'ID de watchPosition (pour pouvoir l'arrêter)
  const watchPositionIdRef = useRef<number | null>(null)

  // Nettoyer watchPosition quand le composant est démonté
  useEffect(() => {
    return () => {
      if (watchPositionIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current)
        watchPositionIdRef.current = null
      }
    }
  }, [])

  // Détecter le type d'appareil
  const detectDeviceType = () => {
    const ua = navigator.userAgent.toLowerCase()
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)
    const isTablet = /ipad|android(?!.*mobile)/i.test(ua)
    const isDesktop = !isMobile && !isTablet
    
    return { isMobile, isTablet, isDesktop }
  }

  // Obtenir la position du client via géolocalisation avec watchPosition pour forcer le GPS
  const getCustomerLocation = async () => {
    console.log('🔍 Début de la récupération de la position GPS...')
    setIsLoadingLocation(true)
    setLocationError(null)

    // Détecter le type d'appareil
    const deviceType = detectDeviceType()
    console.log('📱 Type d\'appareil:', deviceType)

    // Arrêter toute surveillance précédente
    if (watchPositionIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchPositionIdRef.current)
      watchPositionIdRef.current = null
    }

    if (!navigator.geolocation) {
      console.error('❌ Géolocalisation non supportée par le navigateur')
      setLocationError('La géolocalisation n\'est pas supportée par votre navigateur. Utilisez votre adresse de livraison à la place.')
      setIsLoadingLocation(false)
      return
    }

    // Vérifier si on est sur un ordinateur de bureau (sans GPS intégré)
    if (deviceType.isDesktop) {
      console.warn('⚠️ Ordinateur de bureau détecté - Le GPS peut ne pas être disponible')
      setLocationError('Vous êtes sur un ordinateur de bureau. Les ordinateurs n\'ont généralement pas de GPS intégré. Pour une position précise, veuillez utiliser votre adresse de livraison ci-dessous.')
      setIsLoadingLocation(false)
      
      // Proposer automatiquement d'utiliser l'adresse
      if (formData.shipping_address && formData.city) {
        setTimeout(() => {
          if (window.confirm('Les ordinateurs de bureau n\'ont généralement pas de GPS. Voulez-vous utiliser votre adresse de livraison pour obtenir une position précise ?')) {
            geocodeAddress()
          }
        }, 1000)
      } else {
        setTimeout(() => {
          setLocationError('Les ordinateurs de bureau n\'ont généralement pas de GPS. Remplissez votre adresse de livraison ci-dessous, puis cliquez sur "Utiliser mon adresse" pour une position précise.')
        }, 1000)
      }
      return
    }

    console.log('✅ Géolocalisation supportée, vérification des permissions...')

    // Vérifier le statut de la permission avant de demander
    try {
      const permissionStatus = await checkGeolocationPermission()
      console.log('📋 Statut de la permission:', permissionStatus)
      
      if (permissionStatus === 'denied') {
        console.warn('⚠️ Permission refusée')
        setLocationError('La géolocalisation est désactivée. Veuillez l\'activer dans les paramètres de votre navigateur ou utilisez votre adresse de livraison.')
        setIsLoadingLocation(false)
        
        // Si l'adresse est remplie, proposer automatiquement de l'utiliser
        if (formData.shipping_address && formData.city) {
          setTimeout(() => {
            if (window.confirm('La géolocalisation est désactivée. Voulez-vous utiliser votre adresse de livraison à la place ?')) {
              geocodeAddress()
            }
          }, 500)
        }
        return
      }
    } catch (error) {
      // Si la vérification de permission échoue, continuer quand même (le navigateur demandera)
      console.warn('⚠️ Impossible de vérifier le statut de la permission, continuation...', error)
    }

    console.log('🌐 Démarrage de la surveillance GPS (watchPosition)...')
    console.log('⏳ Attente du verrouillage GPS (cela peut prendre 10-30 secondes)...')
    console.log('💡 Assurez-vous que le GPS est activé sur votre appareil et que vous êtes à l\'extérieur ou près d\'une fenêtre')

    // Options optimisées pour mobile (équilibre entre précision et vitesse)
    const geolocationOptions: PositionOptions = {
      enableHighAccuracy: true, // Utiliser le GPS si disponible
      timeout: 30000, // 30 secondes de timeout (réduit pour être plus rapide)
      maximumAge: 5000 // Accepter une position récente (5 secondes) pour être plus rapide
    }
    
    console.log('⚙️ Options de géolocalisation:', geolocationOptions)

    // Variables pour suivre les tentatives et la meilleure position
    let bestPosition: GeolocationPosition | null = null
    let bestAccuracy = Infinity
    let attempts = 0
    const maxAttempts = 20 // Maximum 20 mises à jour (environ 30-60 secondes)
    const targetAccuracy = 200 // Objectif : précision de 200 mètres ou moins (plus rapide)
    const maxAcceptableAccuracy = 500 // Maximum acceptable : 500 mètres (plus rapide)

    // Timeout global pour arrêter après 45 secondes maximum (réduit de 2 minutes)
    const globalTimeout = setTimeout(() => {
      if (watchPositionIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current)
        watchPositionIdRef.current = null
      }
      
      if (bestPosition && bestAccuracy <= maxAcceptableAccuracy) {
        // Utiliser la meilleure position obtenue
        console.log(`✅ Utilisation de la meilleure position obtenue (précision: ${bestAccuracy.toFixed(0)} m)`)
        const lat = bestPosition.coords.latitude
        const lng = bestPosition.coords.longitude
        setCustomerLocation({ lat, lng })
        const distance = calculateDistance(lat, lng)
        console.log('📏 Distance calculée:', distance, 'km')
        setIsLoadingLocation(false)
      } else {
        console.warn('⚠️ Timeout: GPS non verrouillé après 2 minutes')
        setIsLoadingLocation(false)
        
        if (bestPosition) {
          // Proposer d'utiliser la meilleure position même si elle n'est pas parfaite
          const lat = bestPosition.coords.latitude
          const lng = bestPosition.coords.longitude
          const accuracy = bestPosition.coords.accuracy
          
          if (accuracy <= 5000) {
            // Position acceptable (moins de 5 km)
            setLocationError(`Position GPS obtenue avec une précision de ${(accuracy / 1000).toFixed(1)} km. Le GPS n'a pas pu se verrouiller complètement. Vous pouvez utiliser cette position ou votre adresse pour plus de précision.`)
            setCustomerLocation({ lat, lng })
            const distance = calculateDistance(lat, lng)
            console.log('📏 Distance calculée:', distance, 'km')
          } else {
            // Position trop imprécise - probablement un ordinateur de bureau sans GPS
            const deviceType = detectDeviceType()
            let errorMsg = ''
            
            if (deviceType.isDesktop) {
              errorMsg = `Les ordinateurs de bureau n'ont généralement pas de GPS intégré. La position obtenue (${(accuracy / 1000).toFixed(1)} km) est basée sur votre adresse IP et n'est pas précise. Utilisez votre adresse de livraison pour une position exacte.`
            } else {
              errorMsg = `Le GPS n'a pas pu se verrouiller. Position obtenue très imprécise (${(accuracy / 1000).toFixed(1)} km - probablement basée sur l'adresse IP). Vérifiez que le GPS est activé sur votre appareil et que vous êtes à l'extérieur. Sinon, utilisez votre adresse de livraison.`
            }
            
            setLocationError(errorMsg)
            setCustomerLocation(null)
            
            if (formData.shipping_address && formData.city) {
              setTimeout(() => {
                const confirmMsg = deviceType.isDesktop 
                  ? 'Les ordinateurs de bureau n\'ont pas de GPS. Voulez-vous utiliser votre adresse de livraison pour obtenir une position exacte ?'
                  : 'Le GPS n\'a pas pu se verrouiller. Voulez-vous utiliser votre adresse de livraison pour obtenir une position exacte ?'
                
                if (window.confirm(confirmMsg)) {
                  geocodeAddress()
                }
              }, 1000)
            }
          }
        } else {
          setLocationError('Le GPS n\'a pas pu se verrouiller dans les temps. Vérifiez que le GPS est activé sur votre appareil et que vous êtes à l\'extérieur ou près d\'une fenêtre. Sinon, utilisez votre adresse de livraison.')
          setCustomerLocation(null)
          
          if (formData.shipping_address && formData.city) {
            setTimeout(() => {
              if (window.confirm('Le GPS n\'a pas pu se verrouiller. Voulez-vous utiliser votre adresse de livraison pour obtenir une position exacte ?')) {
                geocodeAddress()
              }
            }, 1000)
          }
        }
      }
    }, 45000) // 45 secondes maximum (optimisé pour mobile)

    // Utiliser watchPosition pour surveiller les mises à jour de position
    // Cela permet d'attendre que le GPS se verrouille et améliore sa précision
    watchPositionIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        attempts++
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const accuracy = position.coords.accuracy
        
        console.log(`📍 Mise à jour GPS #${attempts}:`, {
          lat,
          lng,
          accuracy: `${accuracy.toFixed(0)} mètres`,
          timestamp: new Date(position.timestamp).toLocaleString('fr-FR')
        })

        // Garder la meilleure position
        if (accuracy < bestAccuracy) {
          bestAccuracy = accuracy
          bestPosition = position
          console.log(`✨ Nouvelle meilleure position (précision: ${bestAccuracy.toFixed(0)} m)`)
        }

        // Si la précision est excellente (< 200m), utiliser immédiatement
        if (accuracy <= targetAccuracy) {
          console.log(`✅ GPS verrouillé avec précision excellente (${accuracy.toFixed(0)} m) !`)
          
          // Arrêter la surveillance
          if (watchPositionIdRef.current !== null && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchPositionIdRef.current)
            watchPositionIdRef.current = null
          }
          clearTimeout(globalTimeout)
          
          setCustomerLocation({ lat, lng })
          const distance = calculateDistance(lat, lng)
          console.log('📏 Distance calculée:', distance, 'km')
          setIsLoadingLocation(false)
          return
        }

        // Si la précision est acceptable (< 500m) et qu'on a fait au moins 2 tentatives, utiliser rapidement
        if (accuracy <= maxAcceptableAccuracy && attempts >= 2) {
          console.log(`✅ GPS verrouillé avec précision acceptable (${accuracy.toFixed(0)} m) après ${attempts} tentatives`)
          
          // Arrêter la surveillance
          if (watchPositionIdRef.current !== null && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchPositionIdRef.current)
            watchPositionIdRef.current = null
          }
          clearTimeout(globalTimeout)
          
          setCustomerLocation({ lat, lng })
          const distance = calculateDistance(lat, lng)
          console.log('📏 Distance calculée:', distance, 'km')
          setIsLoadingLocation(false)
          return
        }

        // Si la précision est raisonnable (< 1km) après 5 tentatives, utiliser
        if (accuracy <= 1000 && attempts >= 5) {
          console.log(`✅ GPS verrouillé avec précision raisonnable (${accuracy.toFixed(0)} m) après ${attempts} tentatives`)
          
          // Arrêter la surveillance
          if (watchPositionIdRef.current !== null && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchPositionIdRef.current)
            watchPositionIdRef.current = null
          }
          clearTimeout(globalTimeout)
          
          setCustomerLocation({ lat, lng })
          const distance = calculateDistance(lat, lng)
          console.log('📏 Distance calculée:', distance, 'km')
          setIsLoadingLocation(false)
          return
        }

        // Si la précision est très faible (> 5000m), probablement un ordinateur de bureau sans GPS
        if (accuracy > 5000 && attempts >= 3) {
          console.warn(`⚠️ Précision très faible (${(accuracy / 1000).toFixed(1)} km) après ${attempts} tentatives. Probablement un ordinateur de bureau sans GPS.`)
          
          // Arrêter la surveillance
          if (watchPositionIdRef.current !== null && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchPositionIdRef.current)
            watchPositionIdRef.current = null
          }
          clearTimeout(globalTimeout)
          
          const deviceType = detectDeviceType()
          let errorMsg = ''
          
          if (deviceType.isDesktop) {
            errorMsg = `Les ordinateurs de bureau n'ont généralement pas de GPS intégré. La position obtenue (${(accuracy / 1000).toFixed(1)} km) est basée sur votre adresse IP et n'est pas précise. Pour une position exacte, utilisez votre adresse de livraison ci-dessous.`
          } else {
            errorMsg = `Le GPS n'a pas pu se verrouiller. Position obtenue très imprécise (${(accuracy / 1000).toFixed(1)} km - probablement basée sur l'adresse IP). Vérifiez que le GPS est activé sur votre appareil et que vous êtes à l'extérieur. Sinon, utilisez votre adresse de livraison.`
          }
          
          setLocationError(errorMsg)
          setCustomerLocation(null)
          setIsLoadingLocation(false)
          
          if (formData.shipping_address && formData.city) {
            setTimeout(() => {
              const confirmMsg = deviceType.isDesktop 
                ? 'Les ordinateurs de bureau n\'ont pas de GPS. Voulez-vous utiliser votre adresse de livraison pour obtenir une position exacte ?'
                : 'Le GPS n\'a pas pu se verrouiller. Voulez-vous utiliser votre adresse de livraison pour obtenir une position exacte ?'
              
              if (window.confirm(confirmMsg)) {
                geocodeAddress()
              }
            }, 1000)
          }
          return
        }

        // Si on a atteint le maximum de tentatives, utiliser la meilleure position
        if (attempts >= maxAttempts) {
          console.log(`⏹️ Maximum de tentatives atteint (${maxAttempts}). Utilisation de la meilleure position.`)
          
          // Arrêter la surveillance
          if (watchPositionIdRef.current !== null && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchPositionIdRef.current)
            watchPositionIdRef.current = null
          }
          clearTimeout(globalTimeout)
          
          if (bestPosition && bestAccuracy <= maxAcceptableAccuracy) {
            const bestLat = bestPosition.coords.latitude
            const bestLng = bestPosition.coords.longitude
            setCustomerLocation({ lat: bestLat, lng: bestLng })
            const distance = calculateDistance(bestLat, bestLng)
            console.log(`📏 Distance calculée avec la meilleure position (précision: ${bestAccuracy.toFixed(0)} m):`, distance, 'km')
            setIsLoadingLocation(false)
          } else {
            // Position trop imprécise
            const deviceType = detectDeviceType()
            let errorMsg = ''
            
            if (deviceType.isDesktop) {
              errorMsg = `Les ordinateurs de bureau n'ont généralement pas de GPS intégré. La meilleure position obtenue (${(bestAccuracy / 1000).toFixed(1)} km) est basée sur votre adresse IP et n'est pas précise. Utilisez votre adresse de livraison pour une position exacte.`
            } else {
              errorMsg = `Le GPS n'a pas pu se verrouiller avec une précision acceptable. Meilleure précision obtenue: ${(bestAccuracy / 1000).toFixed(1)} km. Utilisez votre adresse de livraison pour une position précise.`
            }
            
            setLocationError(errorMsg)
            setCustomerLocation(null)
            setIsLoadingLocation(false)
            
            if (formData.shipping_address && formData.city) {
              setTimeout(() => {
                const confirmMsg = deviceType.isDesktop 
                  ? 'Les ordinateurs de bureau n\'ont pas de GPS. Voulez-vous utiliser votre adresse de livraison pour obtenir une position exacte ?'
                  : 'Le GPS n\'a pas pu se verrouiller avec une précision acceptable. Voulez-vous utiliser votre adresse de livraison pour obtenir une position exacte ?'
                
                if (window.confirm(confirmMsg)) {
                  geocodeAddress()
                }
              }, 1000)
            }
          }
        }
      },
      (error) => {
        console.error('❌ Erreur de géolocalisation:', error)
        console.error('Code d\'erreur:', error.code)
        console.error('Message d\'erreur:', error.message)
        
        // Arrêter la surveillance en cas d'erreur
        if (watchPositionIdRef.current !== null && navigator.geolocation) {
          navigator.geolocation.clearWatch(watchPositionIdRef.current)
          watchPositionIdRef.current = null
        }
        clearTimeout(globalTimeout)
        
        let errorMessage = 'Impossible d\'obtenir votre position. '
        
        // Utiliser les constantes de GeolocationPositionError
        const PERMISSION_DENIED = 1
        const POSITION_UNAVAILABLE = 2
        const TIMEOUT = 3
        
        switch (error.code) {
          case PERMISSION_DENIED:
            console.error('❌ Permission refusée par l\'utilisateur')
            errorMessage = 'La géolocalisation est désactivée ou vous avez refusé l\'accès. Veuillez l\'activer dans les paramètres de votre navigateur.'
            
            // Vérifier à nouveau le statut de la permission
            checkGeolocationPermission().then(status => {
              if (status === 'denied') {
                setLocationError('La géolocalisation est désactivée. Activez-la dans les paramètres de votre navigateur ou utilisez votre adresse de livraison.')
              }
            })
            break
          case POSITION_UNAVAILABLE:
            errorMessage += 'Votre position n\'est pas disponible. Vérifiez que votre GPS est activé et que vous êtes à l\'extérieur ou près d\'une fenêtre.'
            break
          case TIMEOUT:
            errorMessage += 'La demande de position a expiré. Le GPS prend du temps à se verrouiller. Réessayez ou utilisez votre adresse de livraison.'
            break
          default:
            errorMessage += `Une erreur inconnue s'est produite (code: ${error.code}).`
            break
        }
        setLocationError(errorMessage)
        setIsLoadingLocation(false)
        
        // Si permission refusée, proposer d'utiliser l'adresse
        if (error.code === PERMISSION_DENIED) {
          // Essayer d'utiliser l'adresse de livraison si elle est remplie
          if (formData.shipping_address && formData.city) {
            geocodeAddress()
          }
        }
      },
      geolocationOptions
    )
  }

  // Géocoder l'adresse de livraison pour obtenir les coordonnées
  const geocodeAddress = async () => {
    if (!formData.shipping_address || !formData.city) {
      setLocationError('Veuillez remplir votre adresse de livraison pour calculer la distance.')
      return
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey || !window.google || !window.google.maps) {
      setLocationError('Google Maps n\'est pas configuré. Pour utiliser cette fonctionnalité, veuillez configurer la clé API Google Maps. En attendant, vous pouvez autoriser la géolocalisation pour calculer la distance.')
      setIsLoadingLocation(false)
      return
    }

    setIsLoadingLocation(true)
    setLocationError(null)

    try {
      const geocoder = new window.google.maps.Geocoder()
      const address = `${formData.shipping_address}, ${formData.city}, ${formData.country || 'Sénégal'}`

      geocoder.geocode({ address }, (results, status) => {
        setIsLoadingLocation(false)
        
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location
          const lat = location.lat()
          const lng = location.lng()
          setCustomerLocation({ lat, lng })
          calculateDistance(lat, lng)
        } else {
          setLocationError(`Impossible de trouver l'adresse "${address}". Veuillez vérifier votre adresse ou autoriser la géolocalisation.`)
        }
      })
    } catch (err) {
      console.error('Erreur de géocodage:', err)
      setLocationError('Erreur lors du géocodage de l\'adresse. Veuillez réessayer.')
      setIsLoadingLocation(false)
    }
  }

  // Calculer la distance entre deux points GPS (formule de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number = STORE_LOCATION.latitude, lon2: number = STORE_LOCATION.longitude): number => {
    const R = 6371 // Rayon de la Terre en kilomètres
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return Math.round(distance * 100) / 100 // Arrondir à 2 décimales
  }

  // Mettre à jour la distance et les frais de livraison
  useEffect(() => {
    if (customerLocation) {
      const dist = calculateDistance(customerLocation.lat, customerLocation.lng)
      setDistance(dist)
      if (deliveryType === 'delivery') {
        setDeliveryFee(calculateDeliveryFee(dist))
      } else {
        setDeliveryFee(0)
      }
    } else {
      setDistance(null)
      setDeliveryFee(0)
    }
  }, [customerLocation, deliveryType])

  // Recharger la carte quand le type de livraison change
  useEffect(() => {
    if (mapInstanceRef.current && customerLocation) {
      const storePosition = { lat: STORE_LOCATION.latitude, lng: STORE_LOCATION.longitude }
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(storePosition)
      bounds.extend({ lat: customerLocation.lat, lng: customerLocation.lng })
      mapInstanceRef.current.fitBounds(bounds)
    }
  }, [deliveryType, customerLocation])

  // Fonction pour vérifier si une promotion est active
  const isPromotionActive = (product: Product): boolean => {
    if (!product.is_on_promotion) return false
    
    const now = new Date()
    const startDate = product.promotion_start_date ? new Date(product.promotion_start_date) : null
    const endDate = product.promotion_end_date ? new Date(product.promotion_end_date) : null
    
    if (startDate && now < startDate) return false
    if (endDate && now > endDate) return false
    
    return true
  }

  // Fonction pour obtenir le prix actuel
  const getCurrentPrice = (product: Product): number => {
    if (isPromotionActive(product) && product.promotion_price) {
      return product.promotion_price
    }
    return product.price
  }

  // Calculer le total
  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => {
      const itemPrice = getCurrentPrice(item.product)
      return total + itemPrice * item.quantity
    }, 0)
    return subtotal + deliveryFee
  }

  // Calculer le sous-total (sans frais de livraison)
  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = getCurrentPrice(item.product)
      return total + itemPrice * item.quantity
    }, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'customer_name':
        if (!value.trim()) return 'Le nom est requis'
        if (value.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères'
        return undefined
      case 'customer_email':
        if (!value.trim()) return 'L\'email est requis'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Veuillez entrer un email valide'
        return undefined
      case 'customer_phone':
        if (!value.trim()) return 'Le numéro de téléphone est requis'
        if (!/^[\d\s\-\+\(\)]+$/.test(value)) return 'Format de téléphone invalide'
        return undefined
      case 'shipping_address':
        if (!value.trim()) return 'L\'adresse de livraison est requise'
        if (value.trim().length < 10) return 'L\'adresse doit contenir au moins 10 caractères'
        return undefined
      case 'city':
        if (!value.trim()) return 'La ville est requise'
        return undefined
      case 'payment_method':
        if (!value) return 'Veuillez sélectionner un mode de paiement'
        return undefined
      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    if (touched[name]) {
      const fieldError = validateField(name, value)
      setFieldErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }))
    }
    
    if (error) setError(null)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const fieldError = validateField(name, value)
    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Marquer tous les champs comme touchés
    const allTouched = {
      customer_name: true,
      customer_email: true,
      customer_phone: true,
      shipping_address: true,
      city: true,
      payment_method: true,
    }
    setTouched(allTouched)

    // Valider tous les champs
    const errors: FieldErrors = {}
    Object.keys(allTouched).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) errors[key as keyof FieldErrors] = error
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setLoading(false)
      const firstErrorField = document.querySelector('[name]') as HTMLElement
      if (firstErrorField) {
        firstErrorField.focus()
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    try {
      // Vérifier que les quantités ne dépassent pas le stock disponible
      for (const item of cart) {
        if (item.quantity > item.product.stock) {
          setError(`Stock insuffisant pour "${item.product.name}". Stock disponible: ${item.product.stock}, Quantité demandée: ${item.quantity}`)
          setLoading(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }
      }

      // Préparer les items pour la commande
      const items = cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }))

      const response = await ordersApi.create({
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim(),
        customer_phone: formData.customer_phone.trim(),
        shipping_address: formData.shipping_address.trim(),
        city: formData.city.trim(),
        country: formData.country,
        payment_method: formData.payment_method,
        delivery_type: deliveryType,
        customer_latitude: customerLocation?.lat,
        customer_longitude: customerLocation?.lng,
        notes: formData.notes.trim() || undefined,
        items,
      })

      if (response.data.success) {
        setIsSubmitted(true)
        setOrderNumber(response.data.data.order_number)
        
        // Vider le panier
        localStorage.removeItem('innosoft_cart')
        setCart([])
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Une erreur est survenue lors de la création de la commande.'
      setError(errorMessage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !isSubmitted) {
    return null // En attente du chargement ou redirection
  }

  return (
    <>
      <SEO
        title="Finaliser votre commande - InnoSoft Creation"
        description="Finalisez votre commande en remplissant vos informations de livraison et de paiement."
        url="/checkout"
      />
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-20 min-h-screen">
        <div className="container-custom">
          {/* Success Message */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 glass-effect rounded-xl p-6 border-2 border-primary-500"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-primary-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-2">
                    Commande confirmée !
                  </h2>
                  <p className="text-secondary-400 [data-theme='light']:text-secondary-600 mb-2">
                    Votre commande a été créée avec succès.
                  </p>
                  {orderNumber && (
                    <p className="text-lg font-semibold text-primary-400">
                      Numéro de commande : <span className="font-mono">{orderNumber}</span>
                    </p>
                  )}
                  <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 mt-4">
                    Vous recevrez un email de confirmation à l'adresse {formData.customer_email}
                  </p>
                  <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button
                      onClick={() => navigate('/products')}
                      className="btn-primary"
                    >
                      Continuer les achats
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="btn-secondary"
                    >
                      Retour à l'accueil
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && !isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 glass-effect rounded-xl p-6 border-2 border-accent-500 bg-accent-500/10"
            >
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-accent-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white [data-theme='light']:text-dark-500 mb-1">
                    Erreur
                  </h3>
                  <p className="text-secondary-400 [data-theme='light']:text-secondary-600">
                    {error}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {!isSubmitted && (
            <>
              {/* Header */}
              <div className="mb-8">
                <button
                  onClick={() => navigate('/products')}
                  className="flex items-center space-x-2 text-secondary-400 [data-theme='light']:text-secondary-600 hover:text-primary-400 transition-colors mb-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour aux produits</span>
                </button>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
                  Finaliser votre <span className="gradient-text">commande</span>
                </h1>
                <p className="text-secondary-400 [data-theme='light']:text-secondary-600">
                  Remplissez vos informations pour finaliser votre commande
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {/* Formulaire */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="glass-effect rounded-xl p-6 space-y-6"
                  >
                    {/* Informations client */}
                    <div>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-3 md:mb-4 flex items-center space-x-2">
                        <User className="w-6 h-6 text-primary-400" />
                        <span>Informations client</span>
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-2">
                            Nom complet *
                          </label>
                          <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 rounded-xl border transition-all ${
                              fieldErrors.customer_name
                                ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                                : '[data-theme="dark"]:bg-secondary-800/50 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                            }`}
                            placeholder="Votre nom complet"
                            style={{
                              color: isDark ? '#ffffff' : '#111827',
                              WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                              backgroundColor: isDark ? '#1f2937' : '#ffffff',
                              borderColor: fieldErrors.customer_name ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                            }}
                          />
                          {fieldErrors.customer_name && (
                            <p className="mt-1 text-sm text-accent-500">{fieldErrors.customer_name}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              name="customer_email"
                              value={formData.customer_email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                                fieldErrors.customer_email
                                  ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                                  : '[data-theme="dark"]:bg-secondary-800/50 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                              }`}
                              placeholder="votre@email.com"
                              style={{
                                color: isDark ? '#ffffff' : '#111827',
                                WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                borderColor: fieldErrors.customer_email ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                              }}
                            />
                            {fieldErrors.customer_email && (
                              <p className="mt-1 text-sm text-accent-500">{fieldErrors.customer_email}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-2">
                              Téléphone *
                            </label>
                            <input
                              type="tel"
                              name="customer_phone"
                              value={formData.customer_phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                                fieldErrors.customer_phone
                                  ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                                  : '[data-theme="dark"]:bg-secondary-800/50 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                              }`}
                              placeholder="+221 XX XXX XX XX"
                              style={{
                                color: isDark ? '#ffffff' : '#111827',
                                WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                borderColor: fieldErrors.customer_phone ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                              }}
                            />
                            {fieldErrors.customer_phone && (
                              <p className="mt-1 text-sm text-accent-500">{fieldErrors.customer_phone}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Adresse de livraison */}
                    <div>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-3 md:mb-4 flex items-center space-x-2">
                        <MapPin className="w-6 h-6 text-primary-400" />
                        <span>Adresse de livraison</span>
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-2">
                            Adresse complète *
                          </label>
                          <textarea
                            name="shipping_address"
                            value={formData.shipping_address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={3}
                            className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                              fieldErrors.shipping_address
                                ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                                : '[data-theme="dark"]:bg-secondary-800/50 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                            }`}
                            placeholder="Rue, quartier, numéro..."
                            style={{
                              color: isDark ? '#ffffff' : '#111827',
                              WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                              backgroundColor: isDark ? '#1f2937' : '#ffffff',
                              borderColor: fieldErrors.shipping_address ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                            }}
                          />
                          {fieldErrors.shipping_address && (
                            <p className="mt-1 text-sm text-accent-500">{fieldErrors.shipping_address}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-2">
                              Ville *
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                                fieldErrors.city
                                  ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                                  : '[data-theme="dark"]:bg-secondary-800/50 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                              }`}
                              placeholder="Thiès"
                              style={{
                                color: isDark ? '#ffffff' : '#111827',
                                WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                borderColor: fieldErrors.city ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                              }}
                            />
                            {fieldErrors.city && (
                              <p className="mt-1 text-sm text-accent-500">{fieldErrors.city}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-2">
                              Pays
                            </label>
                            <input
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                              placeholder="Sénégal"
                              style={{
                                color: isDark ? '#ffffff' : '#111827',
                                WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                borderColor: isDark ? '#374151' : '#d1d5db',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mode de paiement */}
                    <div>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-3 md:mb-4 flex items-center space-x-2">
                        <CreditCard className="w-6 h-6 text-primary-400" />
                        <span>Mode de paiement</span>
                      </h2>
                      <div>
                        <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-2">
                          Sélectionnez un mode de paiement *
                        </label>
                        <select
                          name="payment_method"
                          value={formData.payment_method}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 rounded-xl border transition-all ${
                            fieldErrors.payment_method
                              ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                              : '[data-theme="dark"]:bg-secondary-800/50 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                          }`}
                          style={{
                            color: isDark ? '#ffffff' : '#111827',
                            WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            borderColor: fieldErrors.payment_method ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                          }}
                        >
                          <option value="cash">Espèces</option>
                          <option value="mobile_money">Mobile Money</option>
                          <option value="bank_transfer">Virement bancaire</option>
                        </select>
                        {fieldErrors.payment_method && (
                          <p className="mt-1 text-sm text-accent-500">{fieldErrors.payment_method}</p>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-2">
                        Notes (optionnel)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                        placeholder="Instructions spéciales, commentaires..."
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>

                    {/* Section Localisation et Livraison */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-effect rounded-xl p-4 md:p-6"
                    >
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-3 md:mb-4 flex items-center space-x-2">
                        <MapPin className="w-6 h-6 text-primary-400" />
                        <span>Localisation et mode de livraison</span>
                      </h2>

                      {/* Carte Google Maps */}
                      <div className="mb-6">
                        <div ref={mapRef} className="w-full h-64 rounded-lg overflow-hidden border [data-theme='dark']:border-secondary-700 [data-theme='light']:border-secondary-300 relative">
                          {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
                            <div className="absolute inset-0 flex items-center justify-center bg-secondary-800/50 [data-theme='light']:bg-secondary-100/50">
                              <div className="text-center p-4">
                                <MapPin className="w-12 h-12 text-secondary-400 mx-auto mb-2" />
                                <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  Carte non disponible
                                </p>
                                <p className="text-xs text-secondary-500 mt-1">
                                  La géolocalisation fonctionne toujours
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Avertissement Google Maps (non bloquant) */}
                        {mapsWarning && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-3 p-3 rounded-lg bg-secondary-500/10 border border-secondary-500/30"
                          >
                            <div className="flex items-start justify-between space-x-2">
                              <div className="flex items-start space-x-2 flex-1">
                                <MapPin className="w-4 h-4 text-secondary-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 flex-1">
                                  {mapsWarning}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setMapsWarning(null)}
                                className="text-secondary-500 hover:text-secondary-400 transition-colors flex-shrink-0"
                                aria-label="Fermer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Erreurs de localisation */}
                        {locationError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-4 rounded-lg bg-accent-500/10 border border-accent-500/30"
                          >
                            <div className="flex items-start space-x-2 mb-3">
                              <AlertCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-accent-500 flex-1">{locationError}</p>
                            </div>
                            
                      {(locationError.includes('refusé') || locationError.includes('imprécise') || locationError.includes('désactivée')) && (
                        <div className="mt-3 pt-3 border-t border-accent-500/20">
                          {(locationError.includes('refusé') || locationError.includes('désactivée')) && (
                            <>
                              <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 mb-2">
                                <strong className="text-accent-400">🔧 Comment activer la géolocalisation :</strong>
                              </p>
                              <ul className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 space-y-1 ml-4 list-disc mb-3">
                                <li><strong>Chrome/Edge :</strong> Cliquez sur l'icône de cadenas 🔒 dans la barre d'adresse → Autoriser la localisation</li>
                                <li><strong>Firefox :</strong> Cliquez sur l'icône de cadenas → Autorisations → Localisation → Autoriser</li>
                                <li><strong>Safari :</strong> Safari → Préférences → Confidentialité → Services de localisation → Autoriser</li>
                                <li><strong>Mobile :</strong> Paramètres de l'appareil → Localisation → Activez pour ce navigateur</li>
                              </ul>
                              <p className="text-xs text-primary-400 mb-3 font-semibold">
                                💡 Après avoir activé, cliquez sur "Réessayer" ci-dessous
                              </p>
                            </>
                          )}
                          
                          {locationError.includes('imprécise') && (
                            <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 mb-3">
                              <strong className="text-accent-400">💡 Solution recommandée :</strong> Utilisez votre adresse de livraison pour obtenir une position précise. Remplissez votre adresse ci-dessus, puis cliquez sur "Utiliser mon adresse".
                            </p>
                          )}
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(locationError.includes('refusé') || locationError.includes('désactivée')) && (
                              <button
                                type="button"
                                onClick={getCustomerLocation}
                                className="text-xs px-3 py-1.5 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 border border-primary-500/30 transition-colors font-semibold"
                              >
                                🔄 Réessayer après activation
                              </button>
                            )}
                            {formData.shipping_address && formData.city && (
                              <button
                                type="button"
                                onClick={geocodeAddress}
                                disabled={isLoadingLocation}
                                className="text-xs px-3 py-1.5 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 border border-primary-500/30 transition-colors disabled:opacity-50 font-semibold"
                              >
                                ✓ Utiliser mon adresse de livraison
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                          </motion.div>
                        )}

                        <div className="mt-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 md:gap-4">
                          <button
                            type="button"
                            onClick={getCustomerLocation}
                            disabled={isLoadingLocation}
                            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoadingLocation ? (
                              <>
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                <span>Chargement...</span>
                              </>
                            ) : (
                              <>
                                <Navigation className="w-4 h-4" />
                                <span>Obtenir ma position</span>
                              </>
                            )}
                          </button>
                          
                          {!customerLocation && formData.shipping_address && formData.city && (
                            <button
                              type="button"
                              onClick={geocodeAddress}
                              disabled={isLoadingLocation}
                              className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              <MapPin className="w-4 h-4" />
                              <span>Utiliser mon adresse</span>
                            </button>
                          )}
                          
                          {customerLocation && distance !== null && (
                            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/30">
                              <MapPin className="w-4 h-4 text-primary-400" />
                              <span className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                Distance: <strong className="text-primary-400 font-semibold">{distance} km</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Options de livraison */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-3">
                          Choisissez votre mode de livraison *
                        </label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          {/* Option Retrait sur place */}
                          <button
                            type="button"
                            onClick={() => setDeliveryType('pickup')}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              deliveryType === 'pickup'
                                ? 'border-primary-500 bg-primary-500/10'
                                : '[data-theme="dark"]:border-secondary-700 [data-theme="light"]:border-secondary-300 hover:border-primary-400'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                deliveryType === 'pickup'
                                  ? 'border-primary-500 bg-primary-500'
                                  : '[data-theme="dark"]:border-secondary-600 [data-theme="light"]:border-secondary-400'
                              }`}>
                                {deliveryType === 'pickup' && (
                                  <div className="w-3 h-3 rounded-full bg-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <MapPin className="w-5 h-5 text-primary-400" />
                                  <h3 className="font-semibold text-white [data-theme='light']:text-dark-500">
                                    Retrait sur place
                                  </h3>
                                </div>
                                <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  Récupérez votre commande directement au magasin
                                </p>
                                <p className="text-xs text-primary-400 mt-1 font-semibold">
                                  Gratuit
                                </p>
                              </div>
                            </div>
                          </button>
                          
                          {/* Bouton Itinéraire - affiché quand retrait sur place est sélectionné */}
                          {deliveryType === 'pickup' && (
                            <div className="mt-4 col-span-1 sm:col-span-2">
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${STORE_LOCATION.latitude},${STORE_LOCATION.longitude}${customerLocation ? `&origin=${customerLocation.lat},${customerLocation.lng}` : ''}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
                              >
                                <Route className="w-5 h-5" />
                                <span>Voir l'itinéraire vers le magasin</span>
                              </a>
                              <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 mt-2">
                                {customerLocation 
                                  ? 'Itinéraire depuis votre position actuelle'
                                  : 'Itinéraire vers le magasin (obtenez votre position pour un itinéraire personnalisé)'
                                }
                              </p>
                            </div>
                          )}

                          {/* Option Livraison */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!customerLocation) {
                                setLocationError('Veuillez d\'abord obtenir votre position pour calculer les frais de livraison.')
                                return
                              }
                              setDeliveryType('delivery')
                            }}
                            disabled={!customerLocation}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              deliveryType === 'delivery'
                                ? 'border-primary-500 bg-primary-500/10'
                                : '[data-theme="dark"]:border-secondary-700 [data-theme="light"]:border-secondary-300 hover:border-primary-400'
                            } ${!customerLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                deliveryType === 'delivery'
                                  ? 'border-primary-500 bg-primary-500'
                                  : '[data-theme="dark"]:border-secondary-600 [data-theme="light"]:border-secondary-400'
                              }`}>
                                {deliveryType === 'delivery' && (
                                  <div className="w-3 h-3 rounded-full bg-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Package className="w-5 h-5 text-primary-400" />
                                  <h3 className="font-semibold text-white [data-theme='light']:text-dark-500">
                                    Livraison à domicile
                                  </h3>
                                </div>
                                <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  Livraison à votre adresse
                                </p>
                                {customerLocation && distance !== null ? (
                                  <div className="text-xs text-primary-400 mt-1 font-semibold">
                                    <div>{formatPrice(deliveryFee)}</div>
                                    <div className="text-xs mt-0.5 opacity-80">
                                      {distance <= DELIVERY_BASE_DISTANCE 
                                        ? `(${distance} km - tarif de base)`
                                        : `(${DELIVERY_BASE_DISTANCE} km à ${DELIVERY_BASE_FEE} F + ${(distance - DELIVERY_BASE_DISTANCE).toFixed(1)} km × ${DELIVERY_FEE_PER_KM} F/km)`
                                      }
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-xs text-accent-500 mt-1">
                                    Obtenez votre position pour voir les frais
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Bouton de soumission */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Traitement en cours...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Confirmer la commande</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                </div>

                {/* Récapitulatif */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-effect rounded-xl p-4 md:p-6 sticky top-20 lg:top-32 mb-6 lg:mb-0"
                  >
                    <h2 className="text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-6 flex items-center space-x-2">
                      <ShoppingCart className="w-6 h-6 text-primary-400" />
                      <span>Récapitulatif</span>
                    </h2>

                    <div className="space-y-4 mb-6">
                      {cart.map((item) => {
                        const productImage = (item.product.images && item.product.images.length > 0)
                          ? item.product.images[0]
                          : item.product.image

                        return (
                          <div key={item.product.id} className="flex items-start space-x-3 pb-4 border-b [data-theme='dark']:border-white/10 [data-theme='light']:border-secondary-200">
                            {productImage && (
                              <img
                                src={productImage}
                                alt={item.product.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white [data-theme='light']:text-dark-500 text-sm line-clamp-2">
                                {item.product.name}
                              </h4>
                              <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 mt-1">
                                Qté: {item.quantity} × {formatPrice(getCurrentPrice(item.product))}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-white [data-theme='light']:text-dark-500">
                                {formatPrice(getCurrentPrice(item.product) * item.quantity)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="border-t [data-theme='dark']:border-white/10 [data-theme='light']:border-secondary-200 pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                          Sous-total
                        </span>
                        <span className="text-sm font-semibold text-white [data-theme='light']:text-dark-500">
                          {formatPrice(getSubtotal())}
                        </span>
                      </div>
                      
                      {deliveryType === 'delivery' && deliveryFee > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                            Frais de livraison
                            {distance !== null && (
                              <span className="block text-xs mt-0.5">
                                {distance !== null && (
                                  <span className="block text-xs mt-0.5">
                                    {distance <= DELIVERY_BASE_DISTANCE 
                                      ? `(${distance} km - tarif de base)`
                                      : `(${DELIVERY_BASE_DISTANCE} km à ${DELIVERY_BASE_FEE} F + ${(distance - DELIVERY_BASE_DISTANCE).toFixed(1)} km × ${DELIVERY_FEE_PER_KM} F/km)`
                                    }
                                  </span>
                                )}
                              </span>
                            )}
                          </span>
                          <span className="text-sm font-semibold text-primary-400">
                            {formatPrice(deliveryFee)}
                          </span>
                        </div>
                      )}
                      
                      {deliveryType === 'pickup' && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                            Retrait sur place
                          </span>
                          <span className="text-sm font-semibold text-primary-400">
                            Gratuit
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t [data-theme='dark']:border-white/10 [data-theme='light']:border-secondary-200">
                        <span className="text-lg font-semibold text-white [data-theme='light']:text-dark-500">
                          Total
                        </span>
                        <span className="text-2xl font-bold gradient-text">
                          {formatPrice(getTotalPrice())}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Checkout

