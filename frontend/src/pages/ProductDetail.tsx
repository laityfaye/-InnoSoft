import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Share2, Check, ShoppingBag, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { productsApi } from '../services/api'
import SEO from '../components/SEO'
import { useTheme } from '../hooks/useTheme'

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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    loadProduct()
    loadCart()
  }, [id])

  // Charger le panier depuis localStorage
  const loadCart = () => {
    const savedCart = localStorage.getItem('innosoft_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
  }

  // Écouter les changements du panier dans localStorage (pour synchronisation entre pages)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'innosoft_cart') {
        loadCart()
      }
    }

    // Écouter les événements personnalisés (changements depuis la même page/onglet)
    const handleCartUpdate = () => {
      loadCart()
    }

    // Écouter les événements de storage (changements depuis d'autres onglets)
    window.addEventListener('storage', handleStorageChange)
    
    // Écouter les événements personnalisés pour la synchronisation dans le même onglet
    window.addEventListener('cartUpdated', handleCartUpdate)

    // Recharger le panier quand la page redevient visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadCart()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleCartUpdate)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, []) // Pas de dépendance sur cart pour éviter les boucles

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await productsApi.getById(Number(id))
      const foundProduct = response.data.data

      if (!foundProduct) {
        setError('Produit non trouvé')
        return
      }

      setProduct(foundProduct)
      setSelectedImageIndex(0)

      // Charger les produits liés (même catégorie)
      const allProductsResponse = await productsApi.getAll()
      const allProducts = allProductsResponse.data.data || []
      const related = allProducts
        .filter((item: Product) => 
          item.category === foundProduct.category && 
          item.id !== foundProduct.id
        )
        .slice(0, 4)
      setRelatedProducts(related)
    } catch (error: any) {
      console.error('Error loading product:', error)
      if (error.response?.status === 404) {
        setError('Produit non trouvé')
      } else {
        setError('Erreur lors du chargement du produit')
      }
    } finally {
      setLoading(false)
    }
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

  const addToCart = () => {
    if (!product || product.stock === 0) return

    const existingItem = cart.find((item) => item.product.id === product.id)
    let newCart: { product: Product; quantity: number }[]
    
    if (existingItem) {
      // Vérifier que la nouvelle quantité totale ne dépasse pas le stock
      const newTotalQuantity = existingItem.quantity + quantity
      if (newTotalQuantity > product.stock) {
        alert(`Stock insuffisant. Il ne reste que ${product.stock} unité${product.stock > 1 ? 's' : ''} disponible${product.stock > 1 ? 's' : ''}. Vous avez déjà ${existingItem.quantity} dans votre panier.`)
        return
      }
      newCart = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: newTotalQuantity }
          : item
      )
    } else {
      // Vérifier que la quantité demandée ne dépasse pas le stock
      if (quantity > product.stock) {
        alert(`Stock insuffisant. Il ne reste que ${product.stock} unité${product.stock > 1 ? 's' : ''} disponible${product.stock > 1 ? 's' : ''}.`)
        return
      }
      newCart = [...cart, { product, quantity }]
    }

    setCart(newCart)
    // Sauvegarder dans localStorage de manière synchrone et immédiate
    localStorage.setItem('innosoft_cart', JSON.stringify(newCart))
    
    // Forcer l'écriture synchrone (certains navigateurs peuvent différer l'écriture)
    // En accédant à nouveau à localStorage, on force l'écriture
    const verify = localStorage.getItem('innosoft_cart')
    if (!verify) {
      // Si l'écriture a échoué, réessayer
      localStorage.setItem('innosoft_cart', JSON.stringify(newCart))
    }
    
    // Attendre un peu pour s'assurer que localStorage est bien écrit avant de déclencher l'événement
    setTimeout(() => {
      // Déclencher un événement personnalisé pour synchroniser les autres composants
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    }, 100) // Délai plus long pour garantir l'écriture
    
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter((item) => item.product.id !== productId)
    setCart(newCart)
    localStorage.setItem('innosoft_cart', JSON.stringify(newCart))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    }, 50)
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
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    }, 50)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const itemPrice = getCurrentPrice(item.product)
      return total + itemPrice * item.quantity
    }, 0)
  }

  const shareProduct = async () => {
    if (!product) return

    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copier le lien dans le presse-papier
        await navigator.clipboard.writeText(window.location.href)
        alert('Lien copié dans le presse-papier !')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  // Obtenir toutes les images du produit
  const productImages = product 
    ? (product.images && product.images.length > 0 
        ? product.images 
        : (product.image ? [product.image] : []))
    : []
  
  const currentImage = productImages[selectedImageIndex] || null

  // Navigation dans la galerie
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  // Données structurées Schema.org pour le produit
  const structuredData = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: productImages.length > 0 ? productImages : (product.image || undefined),
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
      worstRating: 1,
      reviewCount: 1
    } : undefined,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'InnoSoft Creation'
    }
  } : null

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-secondary-400 [data-theme='light']:text-secondary-600">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-secondary-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white [data-theme='light']:text-dark-500 mb-2">
            {error || 'Produit non trouvé'}
          </h1>
          <button
            onClick={() => {
              // S'assurer que le panier est bien sauvegardé avant de naviguer
              if (cart.length > 0) {
                localStorage.setItem('innosoft_cart', JSON.stringify(cart))
                const verify = localStorage.getItem('innosoft_cart')
                if (!verify || verify === '[]') {
                  localStorage.setItem('innosoft_cart', JSON.stringify(cart))
                }
              }
              navigate('/products')
            }}
            className="mt-4 btn-primary"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${product.name} - InnoSoft Creation`}
        description={product.description}
        image={currentImage || product.image || undefined}
        url={`/products/${product.id}`}
        structuredData={structuredData || undefined}
      />
      <div className="min-h-screen pt-32 pb-20">
        <div className="container-custom max-w-7xl">
          {/* Header with Back Button and Cart */}
          <div className="flex items-center justify-between mb-8">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => {
                // S'assurer que le panier est bien sauvegardé avant de naviguer
                if (cart.length > 0) {
                  localStorage.setItem('innosoft_cart', JSON.stringify(cart))
                  // Forcer l'écriture
                  const verify = localStorage.getItem('innosoft_cart')
                  if (!verify) {
                    localStorage.setItem('innosoft_cart', JSON.stringify(cart))
                  }
                }
                // Petit délai pour garantir l'écriture avant navigation
                setTimeout(() => {
                  navigate('/products')
                }, 50)
              }}
              className="inline-flex items-center space-x-2 text-secondary-400 [data-theme='light']:text-secondary-600 hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour aux produits</span>
            </motion.button>

            {/* Cart Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
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
            </motion.button>
          </div>

          {/* Product Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image with Navigation */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden glass-effect group">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(product.category)} opacity-20 flex items-center justify-center`}>
                    <ShoppingBag className="w-32 h-32 text-white/50" />
                  </div>
                )}
                
                {/* Navigation Arrows (si plusieurs images) */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full glass-effect flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                      aria-label="Image précédente"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full glass-effect flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                      aria-label="Image suivante"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full glass-effect text-white text-sm font-medium">
                      {selectedImageIndex + 1} / {productImages.length}
                    </div>
                  </>
                )}

                {product.is_featured && (
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-primary text-white text-sm font-bold z-10">
                    ⭐ Mis en avant
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <span className="text-white font-bold text-2xl">Rupture de stock</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-primary-500 scale-105 ring-2 ring-primary-500/50'
                          : 'border-transparent hover:border-primary-300 opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`Voir l'image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - Miniature ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Category Badge */}
              <div>
                <span className="inline-flex items-center px-4 py-2 rounded-full glass-effect text-sm font-medium text-primary-400">
                  {getCategoryLabel(product.category)}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white [data-theme='light']:text-dark-500">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && product.rating > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(product.rating || 0)
                            ? 'text-accent-500 fill-accent-500'
                            : 'text-secondary-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-white [data-theme='light']:text-dark-500">
                    {Number(product.rating).toFixed(1)}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex flex-col space-y-2">
                {isPromotionActive(product) && product.promotion_price ? (
                  <>
                    <div className="flex items-baseline space-x-4">
                      <span className="text-5xl font-bold gradient-text">
                        {formatPrice(product.promotion_price)}
                      </span>
                      {product.discount_percentage && (
                        <span className="px-3 py-1 rounded-full bg-accent-500/20 text-accent-400 font-bold text-lg">
                          -{product.discount_percentage}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl text-secondary-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-accent-400 font-semibold">
                        Économisez {formatPrice(product.price - product.promotion_price)}
                      </span>
                    </div>
                    {formatPromotionDates(product) && (
                      <div className="mt-2 p-3 rounded-lg bg-accent-500/10 border border-accent-500/20">
                        <div className="flex items-center space-x-2">
                          <span className="text-accent-400">⏰</span>
                          <span className="text-sm text-accent-400 font-medium">
                            Promotion valable du {new Date(product.promotion_start_date!).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })} au {new Date(product.promotion_end_date!).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-5xl font-bold gradient-text">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-4">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  product.stock > 10
                    ? 'bg-primary-500/20 text-primary-400'
                    : product.stock > 0
                    ? 'bg-accent-500/20 text-accent-400'
                    : 'bg-primary-700/20 text-primary-600'
                }`}>
                  {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                </span>
              </div>

              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-secondary-300 [data-theme='light']:text-secondary-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector and Add to Cart */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-white [data-theme='light']:text-dark-500">
                    Quantité :
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      <Minus className="w-5 h-5 text-white [data-theme='light']:text-dark-500" />
                    </button>
                    <span className="text-xl font-semibold text-white [data-theme='light']:text-dark-500 w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5 text-white [data-theme='light']:text-dark-500" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={addToCart}
                    disabled={product.stock === 0}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}</span>
                  </button>
                  <button
                    onClick={shareProduct}
                    className="px-6 py-3 rounded-xl glass-effect text-white [data-theme='light']:text-dark-500 hover:bg-white/10 transition-colors"
                    aria-label="Partager le produit"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-8">
                Produits similaires
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/products/${relatedProduct.id}`)}
                    className="glass-effect rounded-2xl p-4 hover:shadow-glow-lg transition-all cursor-pointer group"
                  >
                    <div className="relative w-full h-40 rounded-xl mb-3 overflow-hidden">
                      {relatedProduct.image ? (
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(relatedProduct.category)} opacity-20 flex items-center justify-center`}>
                          <ShoppingBag className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-white [data-theme='light']:text-dark-500 mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    {isPromotionActive(relatedProduct) && relatedProduct.promotion_price ? (
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold gradient-text">
                            {formatPrice(relatedProduct.promotion_price)}
                          </span>
                          {relatedProduct.discount_percentage && (
                            <span className="text-xs px-2 py-1 rounded-full bg-accent-500/20 text-accent-400 font-semibold">
                              -{relatedProduct.discount_percentage}%
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-secondary-500 line-through">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        {formatPromotionDates(relatedProduct) && (
                          <span className="text-xs text-accent-400 font-medium">
                            ⏰ {formatPromotionDates(relatedProduct)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-2xl font-bold gradient-text">
                        {formatPrice(relatedProduct.price)}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

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
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-4 h-4 text-white [data-theme='light']:text-dark-500" />
                              </button>
                            </div>
                            <span className="font-bold gradient-text">
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
                      <button className="w-full btn-primary flex items-center justify-center space-x-2">
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
            {quantity} produit{quantity > 1 ? 's' : ''} ajouté{quantity > 1 ? 's' : ''} au panier !
          </span>
        </motion.div>
      )}
    </>
  )
}

export default ProductDetail

