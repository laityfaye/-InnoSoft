import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, MapPin, User, CreditCard, CheckCircle, AlertCircle, ArrowLeft, FileText } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { boutiquesApi } from '../services/api'
import SEO from '../components/SEO'
import CheckoutStepper from '../components/Checkout/CheckoutStepper'

interface BoutiqueProduct {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  image?: string
  category?: string
  status: string
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

interface FieldErrors {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  shipping_address?: string
  city?: string
  payment_method?: string
}

interface FormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  city: string
  country: string
  payment_method: string
  notes: string
}

const BoutiqueCheckout = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [boutique, setBoutique] = useState<Boutique | null>(null)
  const [cart, setCart] = useState<{ product: BoutiqueProduct; quantity: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const cartKey = boutique ? `boutique_${boutique.id}_cart` : 'boutique_cart'

  useEffect(() => {
    if (slugOrId) {
      loadBoutique()
      loadCart()
    }
  }, [slugOrId])

  const loadBoutique = async () => {
    if (!slugOrId) return
    try {
      const isNumeric = /^\d+$/.test(slugOrId)
      const response = isNumeric
        ? await boutiquesApi.getById(Number(slugOrId))
        : await boutiquesApi.getBySlug(slugOrId)
      setBoutique(response.data.data)
    } catch (error) {
      console.error('Error loading boutique:', error)
      navigate('/boutiques')
    }
  }

  const loadCart = () => {
    if (!boutique?.id) return
    const savedCart = localStorage.getItem(cartKey)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        if (parsedCart.length > 0) {
          setCart(parsedCart)
        } else {
          navigate(`/boutiques/${boutique.slug || boutique.id}`)
        }
      } catch (error) {
        console.error('Error loading cart:', error)
        navigate(`/boutiques/${boutique?.slug || boutique?.id}`)
      }
    } else {
      navigate(`/boutiques/${boutique?.slug || boutique?.id}`)
    }
  }

  useEffect(() => {
    if (boutique?.id) {
      loadCart()
    }
  }, [boutique?.id, cartKey])

  const [formData, setFormData] = useState<FormData>(() => {
    const savedInfo = localStorage.getItem('boutique_customer_info')
    if (savedInfo) {
      try {
        return { ...JSON.parse(savedInfo), payment_method: 'cash', notes: '', country: 'Sénégal' }
      } catch (e) {
        console.error('Error loading customer info:', e)
      }
    }
    return {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      shipping_address: '',
      city: '',
      country: 'Sénégal',
      payment_method: 'cash',
      notes: '',
    }
  })

  const steps = [
    { id: 1, title: 'Informations', icon: User },
    { id: 2, title: 'Adresse', icon: MapPin },
    { id: 3, title: 'Paiement', icon: CreditCard },
    { id: 4, title: 'Récapitulatif', icon: FileText },
  ]

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

  const validateStep = (step: number): boolean => {
    const errors: FieldErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.customer_name.trim()) errors.customer_name = 'Le nom est requis'
        if (!formData.customer_email.trim()) errors.customer_email = 'L\'email est requis'
        if (!formData.customer_phone.trim()) errors.customer_phone = 'Le téléphone est requis'
        break
      case 2:
        if (!formData.shipping_address.trim()) errors.shipping_address = 'L\'adresse est requise'
        if (!formData.city.trim()) errors.city = 'La ville est requise'
        break
      case 3:
        if (!formData.payment_method) errors.payment_method = 'Le mode de paiement est requis'
        break
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      const firstErrorField = document.querySelector('[name]') as HTMLElement
      if (firstErrorField) {
        firstErrorField.focus()
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getTotalPrice = () => {
    return getSubtotal()
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (currentStep === steps.length && !showConfirmModal) {
      let allValid = true
      for (let i = 1; i <= steps.length - 1; i++) {
        if (!validateStep(i)) {
          allValid = false
          setCurrentStep(i)
          break
        }
      }
      
      if (allValid) {
        setShowConfirmModal(true)
        return
      }
    }
    
    if (showConfirmModal) {
      setShowConfirmModal(false)
    }
    
    if (!boutique) return
    
    setLoading(true)
    setError(null)

    const allTouched = {
      customer_name: true,
      customer_email: true,
      customer_phone: true,
      shipping_address: true,
      city: true,
      payment_method: true,
    }
    setTouched(allTouched)

    const errors: FieldErrors = {}
    Object.keys(allTouched).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData])
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
      for (const item of cart) {
        if (item.quantity > item.product.stock) {
          setError(`Stock insuffisant pour "${item.product.name}". Stock disponible: ${item.product.stock}, Quantité demandée: ${item.quantity}`)
          setLoading(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }
      }

      const items = cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }))

      const response = await boutiquesApi.createOrder(boutique.id, {
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
        
        const customerInfo = {
          customer_name: formData.customer_name.trim(),
          customer_email: formData.customer_email.trim(),
          customer_phone: formData.customer_phone.trim(),
          shipping_address: formData.shipping_address.trim(),
          city: formData.city.trim(),
          country: formData.country,
        }
        localStorage.setItem('boutique_customer_info', JSON.stringify(customerInfo))
        
        localStorage.removeItem(cartKey)
        setCart([])
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

  if (!boutique) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-secondary-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (cart.length === 0 && !isSubmitted) {
    return null
  }

  return (
    <>
      <SEO
        title={`Finaliser votre commande - ${boutique.name}`}
        description={`Finalisez votre commande pour ${boutique.name}`}
        url={`/boutiques/${boutique.slug || boutique.id}/checkout`}
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
                      onClick={() => navigate(`/boutiques/${boutique.slug || boutique.id}`)}
                      className="btn-primary"
                    >
                      Continuer les achats
                    </button>
                    <button
                      onClick={() => navigate('/boutiques')}
                      className="btn-secondary"
                    >
                      Retour aux boutiques
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
                  onClick={() => navigate(`/boutiques/${boutique.slug || boutique.id}`)}
                  className="flex items-center space-x-2 text-secondary-400 [data-theme='light']:text-secondary-600 hover:text-primary-400 transition-colors mb-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour à la boutique</span>
                </button>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
                  Finaliser votre <span className="gradient-text">commande</span>
                </h1>
                <p className="text-secondary-400 [data-theme='light']:text-secondary-600 mb-6">
                  Remplissez vos informations pour finaliser votre commande
                </p>
                
                {/* Stepper */}
                <CheckoutStepper currentStep={currentStep} steps={steps} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-start">
                {/* Formulaire */}
                <div className="lg:col-span-2 order-1">
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="glass-effect rounded-xl p-6 space-y-6"
                  >
                    <AnimatePresence mode="wait">
                      {/* Étape 1: Informations client */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h2 className="text-xl sm:text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-4 flex items-center space-x-2">
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
                                className={`w-full px-4 py-3 rounded-lg border transition-all ${
                                  fieldErrors.customer_name
                                    ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                                    : '[data-theme="dark"]:bg-secondary-800 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                                    fieldErrors.customer_email
                                      ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                                      : '[data-theme="dark"]:bg-secondary-800 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
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
                                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                                    fieldErrors.customer_phone
                                      ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                                      : '[data-theme="dark"]:bg-secondary-800 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
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
                        </motion.div>
                      )}

                      {/* Étape 2: Adresse de livraison */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h2 className="text-xl sm:text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-4 flex items-center space-x-2">
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
                                className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                                  fieldErrors.shipping_address
                                    ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                                    : '[data-theme="dark"]:bg-secondary-800 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                                }`}
                                placeholder="Commencez à taper votre adresse..."
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                                    fieldErrors.city
                                      ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                                      : '[data-theme="dark"]:bg-secondary-800 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
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
                                  className="w-full px-4 py-3 rounded-lg border [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
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
                        </motion.div>
                      )}

                      {/* Étape 3: Mode de paiement */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h2 className="text-xl sm:text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-4 flex items-center space-x-2">
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
                              className={`w-full px-4 py-3 rounded-lg border transition-all ${
                                fieldErrors.payment_method
                                  ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20'
                                  : '[data-theme="dark"]:bg-secondary-800 [data-theme="dark"]:border-secondary-700 [data-theme="dark"]:text-white [data-theme="light"]:bg-white [data-theme="light"]:border-secondary-300 [data-theme="light"]:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                              }`}
                              style={{
                                color: isDark ? '#ffffff' : '#111827',
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

                          <div className="mt-6">
                            <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-2">
                              Notes (optionnel)
                            </label>
                            <textarea
                              name="notes"
                              value={formData.notes}
                              onChange={handleChange}
                              rows={4}
                              className="w-full px-4 py-3 rounded-lg border [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                              placeholder="Notes spéciales pour votre commande..."
                              style={{
                                color: isDark ? '#ffffff' : '#111827',
                                WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                borderColor: isDark ? '#374151' : '#d1d5db',
                              }}
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Étape 4: Récapitulatif */}
                      {currentStep === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h2 className="text-xl sm:text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-4 flex items-center space-x-2">
                            <FileText className="w-6 h-6 text-primary-400" />
                            <span>Récapitulatif</span>
                          </h2>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white [data-theme='light']:text-dark-500 mb-3">Produits</h3>
                              <div className="space-y-3">
                                {cart.map((item) => (
                                  <div key={item.product.id} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary-800/50 [data-theme='light']:bg-secondary-100/50">
                                    {item.product.image && (
                                      <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <p className="font-semibold text-white [data-theme='light']:text-dark-500 text-sm">
                                        {item.product.name}
                                      </p>
                                      <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600">
                                        Qté: {item.quantity} × {formatPrice(item.product.price)}
                                      </p>
                                    </div>
                                    <p className="font-bold text-white [data-theme='light']:text-dark-500">
                                      {formatPrice(item.product.price * item.quantity)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-lg font-semibold text-white [data-theme='light']:text-dark-500 mb-2">Livraison</h3>
                                <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  {formData.shipping_address}<br />
                                  {formData.city}, {formData.country}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white [data-theme='light']:text-dark-500 mb-2">Paiement</h3>
                                <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  {formData.payment_method === 'cash' && 'Espèces'}
                                  {formData.payment_method === 'mobile_money' && 'Mobile Money'}
                                  {formData.payment_method === 'bank_transfer' && 'Virement bancaire'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="border-t-2 [data-theme='dark']:border-primary-500/30 [data-theme='light']:border-primary-500/20 pt-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-secondary-400 [data-theme='light']:text-secondary-600">Sous-total</span>
                                <span className="text-white [data-theme='light']:text-dark-500 font-semibold">{formatPrice(getSubtotal())}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t [data-theme='dark']:border-white/10 [data-theme='light']:border-secondary-200">
                                <span className="text-xl font-bold text-white [data-theme='light']:text-dark-500">Total</span>
                                <span className="text-2xl font-black gradient-text">{formatPrice(getTotalPrice())}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t [data-theme='dark']:border-white/10 [data-theme='light']:border-secondary-200">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="btn-secondary flex-1"
                        >
                          Précédent
                        </button>
                      )}
                      {currentStep < steps.length ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="btn-primary flex-1"
                        >
                          Suivant
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Traitement...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              <span>Confirmer et commander</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.form>
                </div>

                {/* Résumé de la commande */}
                <div className="lg:col-span-1 order-2 lg:sticky lg:top-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-effect rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-white [data-theme='light']:text-dark-500 mb-4">Résumé</h3>
                    <div className="space-y-3 mb-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <p className="text-white [data-theme='light']:text-dark-500 font-medium">
                              {item.product.name}
                            </p>
                            <p className="text-secondary-400 [data-theme='light']:text-secondary-600">
                              {item.quantity} × {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <p className="font-bold text-white [data-theme='light']:text-dark-500">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t [data-theme='dark']:border-white/10 [data-theme='light']:border-secondary-200 pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">Sous-total</span>
                        <span className="text-white [data-theme='light']:text-dark-500 font-semibold">{formatPrice(getSubtotal())}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-white [data-theme='light']:text-dark-500">Total</span>
                        <span className="text-xl font-black gradient-text">{formatPrice(getTotalPrice())}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de confirmation */}
      <AnimatePresence>
        {showConfirmModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                className="glass-effect rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-display font-bold text-white [data-theme='light']:text-dark-500 mb-4">
                  Confirmer la commande
                </h3>
                <p className="text-secondary-400 [data-theme='light']:text-secondary-600 mb-6">
                  Êtes-vous sûr de vouloir confirmer cette commande ?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmModal(false)
                      handleSubmit()
                    }}
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Traitement...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Confirmer et commander</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default BoutiqueCheckout

