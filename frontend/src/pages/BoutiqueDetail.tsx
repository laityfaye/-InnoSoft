import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Store, MapPin, Phone, Mail, ShoppingBag, Plus, Minus, X, Search, ShoppingCart, Check, Filter, Eye, ArrowUpDown, Sparkles, Info, ChevronDown, ChevronUp, Laptop, Headphones, Smartphone, Tablet, Cable, Battery, Package, Tag } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useDebounce } from '../hooks/useDebounce'
import { boutiquesApi } from '../services/api'
import SEO from '../components/SEO'

interface BoutiqueProduct {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  image?: string
  category?: string
  status: string
  is_featured?: boolean
  discount_percentage?: number | null
  promotion_price?: number | null
  promotion_start_date?: string | null
  promotion_end_date?: string | null
  is_on_promotion?: boolean
}

interface Boutique {
  id: number
  name: string
  slug: string
  description?: string
  email: string
  phone?: string
  address?: string
  logo?: string
  status: string
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'stock-desc'

const BoutiqueDetail = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark } = useTheme()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [boutique, setBoutique] = useState<Boutique | null>(null)
  const [products, setProducts] = useState<BoutiqueProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [cart, setCart] = useState<{ product: BoutiqueProduct; quantity: number }[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showContactsMobile, setShowContactsMobile] = useState(false)

  const cartKey = boutique ? `boutique_${boutique.id}_cart` : 'boutique_cart'

  // Charger le panier au montage
  useEffect(() => {
    if (boutique?.id) {
      const savedCart = localStorage.getItem(cartKey)
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          if (parsedCart.length > 0) {
            setCart(parsedCart)
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
        }
      }
    }
  }, [boutique?.id, cartKey])

  // Recharger le panier quand on revient sur la page
  useEffect(() => {
    if (location.pathname.includes('/boutiques/') && boutique?.id) {
      const timeoutId = setTimeout(() => {
        const savedCart = localStorage.getItem(cartKey)
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart)
            if (parsedCart.length > 0) {
              setCart(parsedCart)
            }
          } catch (error) {
            console.error('Error loading cart on route change:', error)
          }
        }
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [location.pathname, boutique?.id, cartKey])

  // Sauvegarder le panier dans localStorage
  useEffect(() => {
    if (boutique?.id && cart.length > 0) {
      localStorage.setItem(cartKey, JSON.stringify(cart))
    }
  }, [cart, boutique?.id, cartKey])

  // Écouter les changements dans localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === cartKey && boutique?.id) {
        setTimeout(() => {
          const savedCart = localStorage.getItem(cartKey)
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart)
              setCart(parsedCart)
            } catch (error) {
              console.error('Error loading cart from storage event:', error)
            }
          }
        }, 50)
      }
    }

    const handleCartUpdate = () => {
      if (boutique?.id) {
        setTimeout(() => {
          const savedCart = localStorage.getItem(cartKey)
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart)
              setCart(parsedCart)
            } catch (error) {
              console.error('Error loading cart from cartUpdated event:', error)
            }
          }
        }, 150)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cartUpdated', handleCartUpdate)

    const handleVisibilityChange = () => {
      if (!document.hidden && boutique?.id) {
        setTimeout(() => {
          const savedCart = localStorage.getItem(cartKey)
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart)
              setCart(parsedCart)
            } catch (error) {
              console.error('Error loading cart on visibility change:', error)
            }
          }
        }, 100)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleCartUpdate)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [boutique?.id, cartKey])

  useEffect(() => {
    if (slugOrId) {
      loadBoutique()
    }
  }, [slugOrId])

  useEffect(() => {
    if (boutique?.id) {
      loadProducts()
      setCurrentPage(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boutique?.id, debouncedSearchTerm, selectedCategory])

  const loadBoutique = async () => {
    if (!slugOrId) return
    setLoading(true)
    try {
      const isNumeric = /^\d+$/.test(slugOrId)
      const response = isNumeric
        ? await boutiquesApi.getById(Number(slugOrId))
        : await boutiquesApi.getBySlug(slugOrId)
      setBoutique(response.data.data)
    } catch (error) {
      console.error('Error loading boutique:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    if (!boutique?.id) return
    setProductsLoading(true)
    try {
      const category = selectedCategory !== 'all' ? selectedCategory : undefined
      const response = await boutiquesApi.getProducts(boutique.id, category, debouncedSearchTerm || undefined)
      if (response.data.success) {
        setProducts(response.data.data || [])
      } else {
        console.error('Error loading products:', response.data.message)
        setProducts([])
      }
    } catch (error: any) {
      console.error('Error loading products:', error)
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  // Calculer les prix min et max
  const priceBounds = useMemo(() => {
    if (products.length === 0) return [0, 10000000]
    const prices = products.map(p => p.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return [Math.max(0, Math.floor(min)), Math.ceil(max)]
  }, [products])

  useEffect(() => {
    if (products.length > 0 && priceRange[1] === 10000000 && priceBounds[1] !== 10000000) {
      setPriceRange([priceBounds[0], priceBounds[1]] as [number, number])
    }
  }, [products.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  // Filtrer et trier les produits
  const filteredAndSortedProducts = useMemo(() => {
    const normalizedSearch = debouncedSearchTerm ? normalizeText(debouncedSearchTerm) : ''
    
    let filtered = products.filter((product) => {
      const matchesSearch = !normalizedSearch || 
        normalizeText(product.name).includes(normalizedSearch) ||
        (product.description && normalizeText(product.description).includes(normalizedSearch))
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesStock = !inStockOnly || product.stock > 0
      
      return matchesSearch && matchesCategory && matchesPrice && matchesStock
    })

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'stock-desc':
        filtered.sort((a, b) => b.stock - a.stock)
        break
      default:
        break
    }

    return filtered
  }, [products, debouncedSearchTerm, selectedCategory, sortBy, priceRange, inStockOnly])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedProducts, currentPage, itemsPerPage])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Fonction pour vérifier si une promotion est active
  const isPromotionActive = (product: BoutiqueProduct): boolean => {
    if (!product.is_on_promotion) return false
    
    const now = new Date()
    const startDate = product.promotion_start_date ? new Date(product.promotion_start_date) : null
    const endDate = product.promotion_end_date ? new Date(product.promotion_end_date) : null
    
    if (startDate && now < startDate) return false
    if (endDate && now > endDate) return false
    
    return true
  }

  // Fonction pour obtenir le prix actuel (promotionnel si en promotion)
  const getCurrentPrice = (product: BoutiqueProduct): number => {
    if (isPromotionActive(product) && product.promotion_price) {
      return product.promotion_price
    }
    return product.price
  }

  // Fonction pour formater les dates de promotion
  const formatPromotionDates = (product: BoutiqueProduct): string | null => {
    if (!product.promotion_start_date || !product.promotion_end_date) {
      return null
    }
    
    const startDate = new Date(product.promotion_start_date)
    const endDate = new Date(product.promotion_end_date)
    
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  const addToCart = (product: BoutiqueProduct, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (product.stock === 0) return
    
    const existingItem = cart.find((item) => item.product.id === product.id)
    let newCart: { product: BoutiqueProduct; quantity: number }[]
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1
      if (newQuantity > product.stock) {
        alert(`Stock insuffisant. Il ne reste que ${product.stock} unité${product.stock > 1 ? 's' : ''} disponible${product.stock > 1 ? 's' : ''}.`)
        return
      }
      newCart = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      )
    } else {
      newCart = [...cart, { product, quantity: 1 }]
    }
    
    setCart(newCart)
    localStorage.setItem(cartKey, JSON.stringify(newCart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
    
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleProductClick = (productId: number) => {
    navigate(`/boutiques/${boutique?.slug || boutique?.id}/products/${productId}`)
  }

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter((item) => item.product.id !== productId)
    setCart(newCart)
    localStorage.setItem(cartKey, JSON.stringify(newCart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const updateQuantity = (productId: number, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta
        if (newQuantity <= 0) {
          return null
        }
        if (newQuantity > item.product.stock) {
          alert(`Stock insuffisant. Il ne reste que ${item.product.stock} unité${item.product.stock > 1 ? 's' : ''} disponible${item.product.stock > 1 ? 's' : ''}.`)
          return item
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(Boolean) as { product: BoutiqueProduct; quantity: number }[]
    
    setCart(newCart)
    localStorage.setItem(cartKey, JSON.stringify(newCart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + getCurrentPrice(item.product) * item.quantity, 0)
  }

  const handleCheckout = () => {
    if (!boutique || cart.length === 0) return
    const orderData = {
      boutique_id: boutique.id,
      items: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))
    }
    localStorage.setItem(`boutique_${boutique.id}_order`, JSON.stringify(orderData))
    navigate(`/boutiques/${boutique.slug || boutique.id}/checkout`)
  }

  // Catégories prédéfinies (les mêmes que dans le dashboard)
  const PREDEFINED_CATEGORIES = [
    'ordinateur',
    'casque',
    'airpod',
    'ecouteur',
    'telephone',
    'tablette',
    'accessoire',
    'cable',
    'chargeur',
    'housse',
  ]

  const categories = useMemo(() => {
    // Récupérer les catégories des produits
    const productCategories = new Set(
      products
        .map(p => p.category)
        .filter(Boolean)
        .filter(cat => {
          // Filtrer les catégories de test ou non valides
          const invalidCategories = ['asdfg', 'test', 'test1', 'test2', 'aaa', 'zzz']
          return !invalidCategories.includes(cat?.toLowerCase() || '')
        })
    )

    // Combiner les catégories prédéfinies avec les catégories personnalisées des produits
    const allCategories = new Set([
      ...PREDEFINED_CATEGORIES,
      ...Array.from(productCategories).filter(cat => !PREDEFINED_CATEGORIES.includes(cat.toLowerCase()))
    ])

    // Trier : catégories prédéfinies en premier (dans l'ordre de PREDEFINED_CATEGORIES), puis les autres
    const sortedCategories = Array.from(allCategories).sort((a, b) => {
      const aLower = a.toLowerCase()
      const bLower = b.toLowerCase()
      const aIsPredefined = PREDEFINED_CATEGORIES.includes(aLower)
      const bIsPredefined = PREDEFINED_CATEGORIES.includes(bLower)
      
      // Si les deux sont prédéfinies, respecter l'ordre de PREDEFINED_CATEGORIES
      if (aIsPredefined && bIsPredefined) {
        return PREDEFINED_CATEGORIES.indexOf(aLower) - PREDEFINED_CATEGORIES.indexOf(bLower)
      }
      
      // Les catégories prédéfinies en premier
      if (aIsPredefined && !bIsPredefined) return -1
      if (!aIsPredefined && bIsPredefined) return 1
      
      // Sinon, tri alphabétique
      return a.localeCompare(b)
    })
    
    return ['all', ...sortedCategories]
  }, [products])

  const getCategoryLabel = (category: string) => {
    if (category === 'all') return 'Tous'
    // Formater les catégories prédéfinies avec majuscule
    const lowerCategory = category.toLowerCase()
    if (PREDEFINED_CATEGORIES.includes(lowerCategory)) {
      return category.charAt(0).toUpperCase() + category.slice(1)
    }
    return category || 'Autre'
  }

  // Obtenir l'icône pour chaque catégorie
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase()
    switch (lowerCategory) {
      case 'ordinateur':
        return <Laptop className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      case 'casque':
      case 'ecouteur':
      case 'airpod':
        return <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      case 'telephone':
        return <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      case 'tablette':
        return <Tablet className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      case 'cable':
      case 'chargeur':
        return <Cable className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      case 'accessoire':
      case 'housse':
        return <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      case 'all':
        return <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      default:
        return <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
    }
  }

  // Compter les produits par catégorie
  const getCategoryCount = (category: string) => {
    if (category === 'all') return products.length
    return products.filter(p => p.category === category).length
  }

  if (loading && !boutique) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-secondary-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!boutique) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Store className="w-20 h-20 text-secondary-400 mx-auto mb-4" />
          <p className="text-xl text-secondary-400">Boutique non trouvée</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${boutique.name} - Boutique UIDT`}
        description={boutique.description || `Découvrez les produits de ${boutique.name} sur Boutique UIDT`}
        url={`/boutiques/${boutique.slug || boutique.id}`}
      />
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-20 min-h-screen">
        {/* Boutique Header - Compact Design */}
        <section className="container-custom mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-500/10 via-primary-600/5 to-secondary-800/50 [data-theme='light']:from-primary-500/5 [data-theme='light']:via-primary-600/5 [data-theme='light']:to-white border border-primary-500/20 [data-theme='light']:border-primary-500/10 shadow-xl shadow-primary-500/10"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10 sm:opacity-20">
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary-600/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>
            
            <div className="relative p-3 sm:p-4 md:p-6 lg:p-8">
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 items-center md:items-start">
                {/* Logo Container - Compact Mobile */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative flex-shrink-0"
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-primary-500/20 to-primary-600/20 border-2 border-primary-500/30 [data-theme='light']:border-primary-500/20 shadow-lg shadow-primary-500/20 group">
                    {boutique.logo ? (
                      <img 
                        src={boutique.logo} 
                        alt={boutique.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 text-primary-400" />
                      </div>
                    )}
                  </div>
                  {/* Badge overlay - Hidden on mobile */}
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30 border-2 border-dark-500 [data-theme='light']:border-white">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                </motion.div>

                {/* Content Section */}
                <div className="flex-1 text-center md:text-left space-y-2 sm:space-y-3 w-full">
                  {/* Title Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="space-y-1.5 sm:space-y-2"
                  >
                    <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent md:via-transparent md:to-primary-500/50" />
                      <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-primary-500/20 text-primary-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider border border-primary-500/30">
                        Boutique UIDT
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary-500/50 to-transparent md:hidden" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                      <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600">
                        {boutique.name}
                      </span>
                    </h1>
                    {boutique.description && (
                      <p className="text-sm sm:text-base md:text-lg text-secondary-300 [data-theme='light']:text-secondary-700 leading-relaxed max-w-3xl mx-auto md:mx-0 line-clamp-2">
                        {boutique.description}
                      </p>
                    )}
                  </motion.div>

                  {/* Contact Information Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-3 sm:mt-4"
                  >
                    {/* Bouton pour afficher/masquer les contacts sur mobile */}
                    {(boutique.phone || boutique.email) && (
                      <button
                        onClick={() => setShowContactsMobile(!showContactsMobile)}
                        className="sm:hidden w-full flex items-center justify-between glass-effect rounded-lg p-2.5 hover:shadow-glow transition-all border border-primary-500/10 hover:border-primary-500/30 mb-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center">
                            <Info className="w-3.5 h-3.5 text-primary-400" />
                          </div>
                          <span className="text-[11px] font-semibold text-primary-400 uppercase tracking-wider">
                            Voir les contacts
                          </span>
                        </div>
                        {showContactsMobile ? (
                          <ChevronUp className="w-4 h-4 text-primary-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-primary-400" />
                        )}
                      </button>
                    )}

                    {/* Contact Information Cards - Desktop (toujours visible) */}
                    <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {boutique.address && (
                        <div className="group glass-effect rounded-lg p-2.5 sm:p-3 hover:shadow-glow transition-all border border-primary-500/10 hover:border-primary-500/30 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] sm:text-xs font-semibold text-primary-400 uppercase tracking-wider mb-0.5">
                                Adresse
                              </p>
                              <p className="text-[11px] sm:text-xs text-white [data-theme='light']:text-dark-500 font-medium break-words line-clamp-2">
                                {boutique.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {boutique.phone && (
                        <div className="group glass-effect rounded-lg p-2.5 sm:p-3 hover:shadow-glow transition-all border border-primary-500/10 hover:border-primary-500/30 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] sm:text-xs font-semibold text-primary-400 uppercase tracking-wider mb-0.5">
                                Téléphone
                              </p>
                              <a 
                                href={`tel:${boutique.phone}`}
                                className="text-[11px] sm:text-xs text-white [data-theme='light']:text-dark-500 font-medium hover:text-primary-400 transition-colors block"
                              >
                                {boutique.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                      {boutique.email && (
                        <div className="group glass-effect rounded-lg p-2.5 sm:p-3 hover:shadow-glow transition-all border border-primary-500/10 hover:border-primary-500/30 cursor-pointer sm:col-span-2 lg:col-span-1">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] sm:text-xs font-semibold text-primary-400 uppercase tracking-wider mb-0.5">
                                Email
                              </p>
                              <a 
                                href={`mailto:${boutique.email}`}
                                className="text-[11px] sm:text-xs text-white [data-theme='light']:text-dark-500 font-medium hover:text-primary-400 transition-colors block break-words"
                              >
                                {boutique.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Adresse - Toujours visible sur mobile */}
                    {boutique.address && (
                      <div className="sm:hidden mb-2">
                        <div className="group glass-effect rounded-lg p-2.5 hover:shadow-glow transition-all border border-primary-500/10 hover:border-primary-500/30 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                              <MapPin className="w-3.5 h-3.5 text-primary-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-semibold text-primary-400 uppercase tracking-wider mb-0.5">
                                Adresse
                              </p>
                              <p className="text-[11px] text-white [data-theme='light']:text-dark-500 font-medium break-words line-clamp-2">
                                {boutique.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Téléphone et Email - Affichage conditionnel sur mobile */}
                    <AnimatePresence>
                      {showContactsMobile && (boutique.phone || boutique.email) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-1 gap-2 sm:hidden"
                        >
                          {boutique.phone && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="group glass-effect rounded-lg p-2.5 hover:shadow-glow transition-all border border-primary-500/10 hover:border-primary-500/30 cursor-pointer"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                                  <Phone className="w-3.5 h-3.5 text-primary-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold text-primary-400 uppercase tracking-wider mb-0.5">
                                    Téléphone
                                  </p>
                                  <a 
                                    href={`tel:${boutique.phone}`}
                                    className="text-[11px] text-white [data-theme='light']:text-dark-500 font-medium hover:text-primary-400 transition-colors block"
                                  >
                                    {boutique.phone}
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          {boutique.email && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2, delay: 0.1 }}
                              className="group glass-effect rounded-lg p-2.5 hover:shadow-glow transition-all border border-primary-500/10 hover:border-primary-500/30 cursor-pointer"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                                  <Mail className="w-3.5 h-3.5 text-primary-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold text-primary-400 uppercase tracking-wider mb-0.5">
                                    Email
                                  </p>
                                  <a 
                                    href={`mailto:${boutique.email}`}
                                    className="text-[11px] text-white [data-theme='light']:text-dark-500 font-medium hover:text-primary-400 transition-colors block break-words"
                                  >
                                    {boutique.email}
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Search and Filter Section */}
        <section ref={ref} className="container-custom mb-8">
          <div className="flex flex-col gap-4 mb-6">
            {/* Top Row: Search, Sort, Filters, Cart - All on same line */}
            <div className="flex flex-row gap-2 sm:gap-3 md:gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative min-w-0">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base
                    [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                    [data-theme='dark']:hover:bg-secondary-700
                    [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                    border
                    focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                    [data-theme='dark']:border-secondary-700 [data-theme='dark']:focus:border-primary-500 [data-theme='light']:border-secondary-300 [data-theme='light']:focus:border-primary-500"
                  style={{
                    color: isDark ? '#ffffff' : '#111827',
                    WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: isDark ? '#374151' : '#d1d5db',
                  }}
                />
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm md:text-base
                    [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white
                    [data-theme='dark']:hover:bg-secondary-700
                    [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                    border focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none pr-6 sm:pr-8 md:pr-10
                    [data-theme='dark']:border-secondary-700 [data-theme='dark']:focus:border-primary-500 [data-theme='light']:border-secondary-300 [data-theme='light']:focus:border-primary-500"
                  style={{
                    color: isDark ? '#ffffff' : '#111827',
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: isDark ? '#374151' : '#d1d5db',
                  }}
                >
                  <option value="default">Trier</option>
                  <option value="price-asc">Prix ↑</option>
                  <option value="price-desc">Prix ↓</option>
                  <option value="name-asc">Nom A-Z</option>
                  <option value="name-desc">Nom Z-A</option>
                  <option value="stock-desc">Stock</option>
                </select>
                <ArrowUpDown className="absolute right-1.5 sm:right-2 md:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-secondary-400 pointer-events-none" />
              </div>

              {/* Filters Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium flex items-center justify-center space-x-1 sm:space-x-2 transition-all flex-shrink-0 ${
                  showFilters
                    ? 'bg-gradient-primary text-white shadow-glow'
                    : 'glass-effect text-secondary-300 [data-theme="light"]:text-secondary-700 hover:text-primary-400'
                }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Filtres</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg bg-gradient-primary text-white font-semibold flex items-center justify-center space-x-1 sm:space-x-2 hover:shadow-glow transition-all transform hover:scale-105 flex-shrink-0"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden lg:inline">Panier</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 md:-top-2 md:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-accent-500 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold animate-pulse">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Category Filter Section - Enhanced */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary-400" />
                  <h3 className="text-lg font-semibold text-white [data-theme='light']:text-dark-500">
                    Filtrer par catégorie
                  </h3>
                </div>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Réinitialiser</span>
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 sm:-mx-0 px-2 sm:px-0">
                {categories.map((category) => {
                  const count = getCategoryCount(category)
                  const isSelected = selectedCategory === category
                  
                  return (
                    <motion.button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        setCurrentPage(1) // Reset à la page 1 lors d'un changement de catégorie
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium whitespace-nowrap transition-all relative group flex-shrink-0 ${
                        isSelected
                          ? 'bg-gradient-primary text-white shadow-lg shadow-primary-500/50 scale-105'
                          : 'glass-effect text-secondary-300 [data-theme="light"]:text-secondary-700 hover:text-primary-400 hover:bg-primary-500/10 border border-primary-500/10 hover:border-primary-500/30'
                      }`}
                    >
                      {/* Effet de brillance sur le bouton sélectionné */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                          }}
                        />
                      )}
                      
                      {/* Icône de catégorie */}
                      <span className={`flex items-center justify-center flex-shrink-0 transition-transform relative z-10 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {getCategoryIcon(category)}
                      </span>
                      
                      {/* Label */}
                      <span className="text-[10px] sm:text-xs flex-shrink-0 relative z-10">
                        {getCategoryLabel(category)}
                      </span>
                      
                      {/* Compteur de produits */}
                      {count > 0 && (
                        <span className={`px-1 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold flex-shrink-0 relative z-10 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-primary-500/20 text-primary-400'
                        }`}>
                          {count}
                        </span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-effect rounded-lg p-6 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-2">
                        Gamme de prix : {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="range"
                          min={priceBounds[0]}
                          max={priceBounds[1]}
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="flex-1"
                        />
                        <input
                          type="range"
                          min={priceBounds[0]}
                          max={priceBounds[1]}
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* In Stock Only */}
                    <div className="flex items-center">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="w-5 h-5 rounded text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-white [data-theme='light']:text-dark-500">
                          En stock uniquement
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <button
                    onClick={() => {
                      setPriceRange([priceBounds[0], priceBounds[1]])
                      setInStockOnly(false)
                    }}
                    className="mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Count */}
            <div className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
              {filteredAndSortedProducts.length} produit{filteredAndSortedProducts.length > 1 ? 's' : ''} trouvé{filteredAndSortedProducts.length > 1 ? 's' : ''}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="container-custom">
          {productsLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-secondary-400 [data-theme='light']:text-secondary-600">Chargement des produits...</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-secondary-400 mx-auto mb-4" />
              <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 mb-2">
                Aucun produit trouvé
              </p>
              <p className="text-sm text-secondary-500 [data-theme='light']:text-secondary-500">
                Essayez de modifier vos critères de recherche ou vos filtres
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: (index % itemsPerPage) * 0.05 }}
                    className="glass-effect rounded-2xl p-6 hover:shadow-glow-lg transition-all group cursor-pointer relative"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-48 rounded-xl mb-4 overflow-hidden">
                      {/* Featured Badge */}
                      {product.is_featured && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-gradient-primary text-white text-[10px] sm:text-xs font-bold z-20 shadow-lg">
                          ⭐ Mis en avant
                        </div>
                      )}
                      {/* Promotion Badge */}
                      {isPromotionActive(product) && (
                        <div className={`absolute ${product.is_featured ? 'top-12 right-2 sm:top-14 sm:right-3' : 'top-2 right-2 sm:top-3 sm:right-3'} px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-accent-500 text-white text-[10px] sm:text-xs font-bold z-20 shadow-lg`}>
                          🔥 Promotion
                        </div>
                      )}
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center"><svg class="w-20 h-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div>`
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center group-hover:opacity-30 transition-opacity">
                          <ShoppingBag className="w-20 h-20 text-white/50" />
                        </div>
                      )}
                      
                      {product.stock > 0 && product.stock <= 5 && (
                        <div className={`absolute ${!product.is_featured && !isPromotionActive(product) ? 'top-2 right-2 sm:top-3 sm:right-3' : 'bottom-2 right-2 sm:bottom-3 sm:right-3'} px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-accent-500/90 text-white text-[10px] sm:text-xs font-bold z-20 shadow-lg`}>
                          Bientôt épuisé
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                          <span className="text-white font-bold text-lg">Rupture de stock</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-display font-bold text-white [data-theme='light']:text-dark-500 flex-1 group-hover:text-primary-400 transition-colors mb-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          {isPromotionActive(product) && product.promotion_price ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold gradient-text">
                                  {formatPrice(product.promotion_price)}
                                </span>
                                {product.discount_percentage && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-accent-500/20 text-accent-400 font-semibold">
                                    -{product.discount_percentage}%
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-secondary-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                              {formatPromotionDates(product) && (
                                <span className="text-xs text-accent-400 mt-1 font-medium">
                                  ⏰ {formatPromotionDates(product)}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-2xl font-bold gradient-text">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          product.stock > 10 
                            ? 'bg-primary-500/20 text-primary-400' 
                            : product.stock > 0 
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'bg-primary-700/20 text-primary-600'
                        }`}>
                          {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProductClick(product.id)
                        }}
                        className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Voir</span>
                      </button>
                      <button
                        onClick={(e) => addToCart(product, e)}
                        disabled={product.stock === 0}
                        className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">{product.stock === 0 ? 'Indisponible' : 'Panier'}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg glass-effect text-white [data-theme='light']:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Précédent
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-gradient-primary text-white shadow-glow'
                              : 'glass-effect text-secondary-300 [data-theme="light"]:text-secondary-700 hover:text-primary-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg glass-effect text-white [data-theme='light']:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Floating Cart Icon Button */}
        {cart.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50 w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-primary text-white shadow-2xl flex items-center justify-center hover:shadow-glow transition-all"
            aria-label="Ouvrir le panier"
          >
            <ShoppingCart className="w-6 h-6 lg:w-8 lg:h-8" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 lg:w-7 lg:h-7 bg-accent-500 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold animate-pulse border-2 border-dark-500 [data-theme='light']:border-white"
            >
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </motion.span>
          </motion.button>
        )}

        {/* Cart Sidebar */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 h-full w-full md:w-96 glass-effect z-50 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500">
                      Panier
                    </h2>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-6 h-6 text-secondary-400" />
                    </button>
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                      <p className="text-secondary-400 [data-theme='light']:text-secondary-600">
                        Votre panier est vide
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                          <motion.div
                            key={item.product.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-effect rounded-lg p-4"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              {/* Product Image */}
                              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border
                                [data-theme='dark']:border-secondary-700
                                [data-theme='light']:border-secondary-300">
                                {item.product.image ? (
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                      const parent = target.parentElement
                                      if (parent) {
                                        parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center"><svg class="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div>`
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                                    <ShoppingBag className="w-10 h-10 text-white/50" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="font-semibold text-white [data-theme='light']:text-dark-500 text-sm line-clamp-2 flex-1">
                                    {item.product.name}
                                  </h4>
                                  <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0 ml-2"
                                    aria-label="Supprimer du panier"
                                  >
                                    <X className="w-4 h-4 text-secondary-400" />
                                  </button>
                                </div>
                                <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 mb-2">
                                  {formatPrice(getCurrentPrice(item.product))} / unité
                                  {isPromotionActive(item.product) && item.product.price !== getCurrentPrice(item.product) && (
                                    <span className="ml-2 text-xs line-through opacity-60">
                                      {formatPrice(item.product.price)}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => updateQuantity(item.product.id, -1)}
                                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                  <Minus className="w-4 h-4 text-white [data-theme='light']:text-dark-500" />
                                </button>
                                <span className="text-white [data-theme='light']:text-dark-500 font-semibold w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, 1)}
                                  disabled={item.quantity >= item.product.stock}
                                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="w-4 h-4 text-white [data-theme='light']:text-dark-500" />
                                </button>
                              </div>
                              <span className="font-bold gradient-text text-lg">
                                {formatPrice(getCurrentPrice(item.product) * item.quantity)}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="border-t [data-theme='dark']:border-white/10 [data-theme='light']:border-secondary-200 pt-4 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-semibold text-white [data-theme='light']:text-dark-500">
                            Total
                          </span>
                          <span className="text-2xl font-bold gradient-text">
                            {formatPrice(getTotalPrice())}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            setIsCartOpen(false)
                            handleCheckout()
                          }}
                          className="w-full btn-primary flex items-center justify-center space-x-2"
                        >
                          <Check className="w-5 h-5" />
                          <span>Passer la commande</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-8 left-1/2 z-50 glass-effect rounded-xl px-6 py-4 flex items-center space-x-3 shadow-glow"
            >
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="text-white [data-theme='light']:text-dark-500 font-medium">
                Produit ajouté au panier !
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default BoutiqueDetail
