import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Search, Star, Plus, Minus, X, ShoppingBag, Check, Sparkles, ArrowUpDown, Filter, Eye } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useDebounce } from '../hooks/useDebounce'
import { productsApi } from '../services/api'
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

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc' | 'stock-desc'

const Products = () => {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500) // Debounce de 500ms
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [minRating, setMinRating] = useState<number>(0)
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['all', 'hardware', 'software', 'accessories', 'services']

  // Charger le panier au montage (une seule fois)
  useEffect(() => {
    const savedCart = localStorage.getItem('innosoft_cart')
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
  }, []) // Seulement au montage initial - ne jamais réexécuter

  // Recharger le panier quand on revient sur la page
  useEffect(() => {
    if (location.pathname === '/products') {
      // Délai pour s'assurer que ProductDetail a bien sauvegardé dans localStorage
      const timeoutId = setTimeout(() => {
        const savedCart = localStorage.getItem('innosoft_cart')
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart)
            // Toujours charger depuis localStorage (source de vérité absolue)
            if (parsedCart.length > 0) {
              setCart(parsedCart)
            }
            // Si parsedCart est vide, ne rien faire (ne pas vider le panier actuel)
          } catch (error) {
            console.error('Error loading cart on route change:', error)
          }
        }
        // Si localStorage est vide, ne rien faire (ne pas toucher au panier actuel)
      }, 500) // Délai suffisant pour garantir que ProductDetail a sauvegardé et que localStorage est écrit
      return () => clearTimeout(timeoutId)
    }
  }, [location.pathname])

  // Sauvegarder le panier dans localStorage à chaque modification
  // MAIS seulement si le panier a des items (ne jamais écraser avec un panier vide)
  useEffect(() => {
    // Ne sauvegarder QUE si le panier a des items
    // Ne jamais sauvegarder un panier vide (protection contre la perte de données)
    if (cart.length > 0) {
      localStorage.setItem('innosoft_cart', JSON.stringify(cart))
    } else {
      // Si le panier est vide, vérifier localStorage et restaurer si nécessaire
      // Cela protège contre les cas où l'état se vide par erreur
      const savedCart = localStorage.getItem('innosoft_cart')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          if (parsedCart.length > 0) {
            // Restaurer depuis localStorage si on a des items sauvegardés
            setCart(parsedCart)
          }
        } catch (error) {
          // Ignorer les erreurs de parsing
        }
      }
    }
  }, [cart])

  // Écouter les changements dans localStorage (pour synchronisation entre onglets/pages)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'innosoft_cart') {
        // Délai pour s'assurer que le changement est bien sauvegardé
        setTimeout(() => {
          const savedCart = localStorage.getItem('innosoft_cart')
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

    // Écouter les événements personnalisés (changements depuis la même page/onglet)
    const handleCartUpdate = () => {
      // Délai pour s'assurer que localStorage est à jour
      setTimeout(() => {
        const savedCart = localStorage.getItem('innosoft_cart')
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart)
            // Toujours mettre à jour depuis localStorage (source de vérité)
            setCart(parsedCart)
          } catch (error) {
            console.error('Error loading cart from cartUpdated event:', error)
          }
        }
      }, 150) // Délai plus long pour s'assurer que localStorage est bien écrit
    }

    // Écouter les événements de storage (changements depuis d'autres onglets)
    window.addEventListener('storage', handleStorageChange)
    
    // Écouter les événements personnalisés pour la synchronisation dans le même onglet
    window.addEventListener('cartUpdated', handleCartUpdate)

    // Recharger le panier quand la page redevient visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          const savedCart = localStorage.getItem('innosoft_cart')
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
  }, []) // Pas de dépendance sur cart pour éviter les boucles

  useEffect(() => {
    loadProducts()
    setCurrentPage(1) // Reset à la page 1 lors d'un changement de filtre
  }, [selectedCategory, debouncedSearchTerm]) // Utiliser debouncedSearchTerm au lieu de searchTerm

  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await productsApi.getAll(selectedCategory, debouncedSearchTerm)
      setProducts(response.data.data || [])
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([]) // S'assurer que products est un tableau vide en cas d'erreur
    } finally {
      setLoading(false)
    }
  }

  // Calculer les prix min et max pour le slider
  const priceBounds = useMemo(() => {
    if (products.length === 0) return [0, 1000000]
    const prices = products.map(p => p.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    // S'assurer que les valeurs sont valides
    return [Math.max(0, Math.floor(min)), Math.ceil(max)]
  }, [products])

  // Initialiser priceRange avec les bounds quand les produits sont chargés
  useEffect(() => {
    if (products.length > 0 && priceRange[1] === 1000000 && priceBounds[1] !== 1000000) {
      setPriceRange([priceBounds[0], priceBounds[1]] as [number, number])
    }
  }, [products.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fonction pour normaliser le texte (insensible à la casse et aux accents)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
  }

  // Filtrer et trier les produits
  const filteredAndSortedProducts = useMemo(() => {
    const normalizedSearch = debouncedSearchTerm ? normalizeText(debouncedSearchTerm) : ''
    
    let filtered = products.filter((product) => {
      const matchesSearch = !normalizedSearch || 
        normalizeText(product.name).includes(normalizedSearch) ||
        normalizeText(product.description).includes(normalizedSearch)
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesRating = !product.rating || product.rating >= minRating
      const matchesStock = !inStockOnly || product.stock > 0
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock
    })

    // Trier les produits
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
      case 'rating-desc':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'stock-desc':
        filtered.sort((a, b) => b.stock - a.stock)
        break
      default:
        // Par défaut : produits mis en avant en premier, puis par order
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1
          if (!a.is_featured && b.is_featured) return 1
          return 0
        })
    }

    return filtered
  }, [products, debouncedSearchTerm, selectedCategory, sortBy, priceRange, minRating, inStockOnly])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedProducts, currentPage, itemsPerPage])

  // Scroll to top lors du changement de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation() // Empêcher la navigation si on clique sur le bouton
    if (product.stock === 0) return
    
    const existingItem = cart.find((item) => item.product.id === product.id)
    let newCart: { product: Product; quantity: number }[]
    
    if (existingItem) {
      // Vérifier que la nouvelle quantité ne dépasse pas le stock
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
    localStorage.setItem('innosoft_cart', JSON.stringify(newCart))
    
    // Déclencher un événement personnalisé pour synchroniser les autres composants
    window.dispatchEvent(new CustomEvent('cartUpdated'))
    
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`)
  }

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter((item) => item.product.id !== productId)
    setCart(newCart)
    localStorage.setItem('innosoft_cart', JSON.stringify(newCart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const updateQuantity = (productId: number, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta
        if (newQuantity <= 0) {
          return null
        }
        // Vérifier que la nouvelle quantité ne dépasse pas le stock
        if (newQuantity > item.product.stock) {
          alert(`Stock insuffisant. Il ne reste que ${item.product.stock} unité${item.product.stock > 1 ? 's' : ''} disponible${item.product.stock > 1 ? 's' : ''}.`)
          return item // Garder la quantité actuelle
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(Boolean) as { product: Product; quantity: number }[]
    
    setCart(newCart)
    localStorage.setItem('innosoft_cart', JSON.stringify(newCart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const getTotalPrice = () => {
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

  // Fonction pour obtenir le prix actuel (promotionnel si en promotion)
  const getCurrentPrice = (product: Product): number => {
    if (isPromotionActive(product) && product.promotion_price) {
      return product.promotion_price
    }
    return product.price
  }

  // Fonction pour formater les dates de promotion
  const formatPromotionDates = (product: Product): string | null => {
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

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      all: 'Tous',
      hardware: 'Matériel',
      software: 'Logiciels',
      accessories: 'Accessoires',
      services: 'Services',
    }
    return labels[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      hardware: 'from-primary-500 to-primary-600',
      software: 'from-primary-600 to-primary-700',
      accessories: 'from-primary-400 to-primary-500',
      services: 'from-secondary-600 to-secondary-700',
    }
    return colors[category] || 'from-secondary-500 to-secondary-600'
  }

  // Générer les données structurées Schema.org
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catalogue de produits InnoSoft Creation',
    description: 'Découvrez notre catalogue de produits : matériel électronique, accessoires informatiques et solutions technologiques professionnelles',
    itemListElement: filteredAndSortedProducts.slice(0, 20).map((product, index) => ({
      '@type': 'Product',
      position: index + 1,
      name: product.name,
      description: product.description,
      image: product.image || undefined,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'XOF',
        availability: product.stock > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        url: `https://innosft.com/products/${product.id}`
      },
      aggregateRating: product.rating ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        bestRating: 5,
        worstRating: 1
      } : undefined,
      category: product.category
    }))
  }

  return (
    <>
      <SEO
        title="Nos Produits - Matériel et Solutions InnoSoft Creation"
        description="Découvrez notre catalogue de produits : matériel électronique, accessoires informatiques et solutions technologiques professionnelles disponibles chez InnoSoft Creation."
        url="/products"
        structuredData={structuredData}
      />
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="container-custom mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Nos <span className="gradient-text">Produits</span>
          </h1>
          <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 leading-relaxed">
            Découvrez notre sélection de matériel informatique, logiciels et services professionnels
          </p>
        </motion.div>
      </section>

      {/* Search and Filter Section */}
      <section ref={ref} className="container-custom mb-8">
        <div className="flex flex-col gap-4 mb-6">
          {/* Top Row: Search, Sort, Filters, Cart */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl 
                  [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                  [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                  border focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                style={{
                  color: isDark ? '#ffffff' : '#111827',
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#374151' : '#d1d5db',
                }}
              />
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-3 rounded-xl 
                  [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                  [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                  border focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none pr-10"
                style={{
                  color: isDark ? '#ffffff' : '#111827',
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  borderColor: isDark ? '#374151' : '#d1d5db',
                }}
              >
                <option value="default">Trier par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name-asc">Nom A-Z</option>
                <option value="name-desc">Nom Z-A</option>
                <option value="rating-desc">Meilleures notes</option>
                <option value="stock-desc">Stock disponible</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
            </div>

            {/* Filters Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all ${
                showFilters
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'glass-effect text-secondary-300 [data-theme="light"]:text-secondary-700 hover:text-primary-400'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden md:inline">Filtres</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold flex items-center space-x-2 hover:shadow-glow transition-all transform hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">Panier</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-primary text-white shadow-glow scale-105'
                    : 'glass-effect text-secondary-300 [data-theme="light"]:text-secondary-700 hover:text-primary-400 hover:scale-105'
                }`}
              >
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-effect rounded-xl p-6 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                  {/* Min Rating */}
                  <div>
                    <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-2">
                      Note minimale : {minRating > 0 ? `${minRating}+ ⭐` : 'Toutes'}
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.5}
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full"
                    />
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
                    setMinRating(0)
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
        {loading ? (
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
                  {/* Featured Badge */}
                  {product.is_featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-primary text-white text-xs font-bold z-10">
                      ⭐ Mis en avant
                    </div>
                  )}
                  {/* Promotion Badge */}
                  {isPromotionActive(product) && (
                    <div className={`absolute top-3 ${product.is_featured ? 'right-3' : 'left-3'} px-3 py-1 rounded-full bg-accent-500 text-white text-xs font-bold z-10 shadow-lg`}>
                      🔥 Promotion
                    </div>
                  )}
                {/* Product Image */}
                <div className="relative w-full h-48 rounded-xl mb-4 overflow-hidden">
                  {(() => {
                    // Utiliser la première image du tableau images si disponible, sinon image
                    const displayImage = (product.images && product.images.length > 0) 
                      ? product.images[0] 
                      : product.image
                    
                    return displayImage ? (
                      <img
                        src={displayImage}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback si l'image ne charge pas
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br ${getCategoryColor(product.category)} opacity-20 flex items-center justify-center"><svg class="w-20 h-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div>`
                          }
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(product.category)} opacity-20 flex items-center justify-center group-hover:opacity-30 transition-opacity`}>
                        <ShoppingBag className="w-20 h-20 text-white/50" />
                      </div>
                    )
                  })()}
                  
                  {/* Badge nombre d'images si plusieurs */}
                  {product.images && product.images.length > 1 && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-bold flex items-center space-x-1">
                      <span>📷</span>
                      <span>{product.images.length}</span>
                    </div>
                  )}
                    {product.stock > 0 && product.stock <= 5 && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-accent-500/90 text-white text-xs font-bold z-10">
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
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-display font-bold text-white [data-theme='light']:text-dark-500 flex-1 group-hover:text-primary-400 transition-colors">
                      {product.name}
                    </h3>
                    {product.rating && Number(product.rating) > 0 && (
                      <div className="flex items-center space-x-1 ml-2">
                        <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                        <span className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 font-medium">
                          {Number(product.rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                  </p>
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
                      onClick={() => handleProductClick(product.id)}
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
                  className="px-4 py-2 rounded-xl glass-effect text-white [data-theme='light']:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
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
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
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
                  className="px-4 py-2 rounded-xl glass-effect text-white [data-theme='light']:text-dark-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </section>

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
                      {cart.map((item) => {
                        // Obtenir l'image du produit (première image du tableau ou image unique)
                        const productImage = (item.product.images && item.product.images.length > 0)
                          ? item.product.images[0]
                          : item.product.image;
                        
                        return (
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
                              {productImage ? (
                                <img
                                  src={productImage}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    const parent = target.parentElement
                                    if (parent) {
                                      parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br ${getCategoryColor(item.product.category)} opacity-20 flex items-center justify-center"><svg class="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div>`
                                    }
                                  }}
                                />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(item.product.category)} opacity-20 flex items-center justify-center`}>
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
                        );
                      })}
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
                          navigate('/checkout')
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

export default Products
