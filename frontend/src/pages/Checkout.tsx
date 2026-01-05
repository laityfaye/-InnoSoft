import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, MapPin, User, CreditCard, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
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
      <div className="pt-32 pb-20 min-h-screen">
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
                  <div className="mt-6 flex gap-4">
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
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                  Finaliser votre <span className="gradient-text">commande</span>
                </h1>
                <p className="text-secondary-400 [data-theme='light']:text-secondary-600">
                  Remplissez vos informations pour finaliser votre commande
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulaire */}
                <div className="lg:col-span-2">
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="glass-effect rounded-xl p-6 space-y-6"
                  >
                    {/* Informations client */}
                    <div>
                      <h2 className="text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-4 flex items-center space-x-2">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <h2 className="text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-4 flex items-center space-x-2">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <h2 className="text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-4 flex items-center space-x-2">
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
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-effect rounded-xl p-6 sticky top-32"
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

                    <div className="border-t [data-theme='dark']:border-white/10 [data-theme='light']:border-secondary-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-white [data-theme='light']:text-dark-500">
                          Total
                        </span>
                        <span className="text-2xl font-bold gradient-text">
                          {formatPrice(getTotalPrice())}
                        </span>
                      </div>
                      <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 mt-2">
                        * Les frais de livraison seront calculés lors de la confirmation
                      </p>
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

