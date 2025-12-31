import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ShoppingCart, Search, Star, Plus, Minus, X, ShoppingBag, Check, Sparkles } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { productsApi } from '../services/api'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image?: string | null
  category: string
  rating?: number
  stock: number
}

const Products = () => {
  const { isDark } = useTheme()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const categories = ['all', 'hardware', 'software', 'accessories', 'services']

  useEffect(() => {
    loadProducts()
  }, [selectedCategory, searchTerm])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await productsApi.getAll(selectedCategory, searchTerm)
      setProducts(response.data.data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta
          if (newQuantity <= 0) {
            return null
          }
          return { ...item, quantity: newQuantity }
        }
        return item
      }).filter(Boolean) as { product: Product; quantity: number }[]
    )
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price)
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

  return (
    <div className="pt-32 pb-20 min-h-screen">
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
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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
      </section>

      {/* Products Grid */}
      <section className="container-custom">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-secondary-400 [data-theme='light']:text-secondary-600">Chargement des produits...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 text-secondary-400 mx-auto mb-4" />
            <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600">
              Aucun produit trouvé
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 hover:shadow-glow-lg transition-all group cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 rounded-xl mb-4 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(product.category)} opacity-20 flex items-center justify-center group-hover:opacity-30 transition-opacity`}>
                      <ShoppingBag className="w-20 h-20 text-white/50" />
                    </div>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-accent-500/90 text-white text-xs font-bold">
                      Bientôt épuisé
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
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
                    <span className="text-2xl font-bold gradient-text">
                      {formatPrice(product.price)}
                    </span>
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

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  <span>{product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}</span>
                </button>
              </motion.div>
            ))}
          </div>
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
                      {cart.map((item) => (
                        <motion.div
                          key={item.product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="glass-effect rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white [data-theme='light']:text-dark-500 mb-1">
                                {item.product.name}
                              </h4>
                              <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                {formatPrice(item.product.price)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                              <X className="w-4 h-4 text-secondary-400" />
                            </button>
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
                              {formatPrice(item.product.price * item.quantity)}
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
  )
}

export default Products
