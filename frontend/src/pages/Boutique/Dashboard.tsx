import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Store, LogOut, Package, ShoppingBag, Plus, Edit, Trash2, X, 
  Eye, Lock, Key, Upload, Image as ImageIcon, DollarSign, 
  TrendingUp, CheckCircle, Clock, XCircle, AlertCircle, Save
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { boutiqueOwnerApi, boutiqueAuthApi } from '../../services/api'
import api from '../../services/api'

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

interface BoutiqueOrder {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address: string
  status: string
  total: number
  created_at: string
  items?: Array<{
    id: number
    product: BoutiqueProduct
    quantity: number
    unit_price: number
    total: number
  }>
}

const BoutiqueDashboard = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [searchParams] = useSearchParams()
  const mustChangePassword = searchParams.get('change-password') === 'true'

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products')
  const [boutique, setBoutique] = useState<Boutique | null>(null)
  const [products, setProducts] = useState<BoutiqueProduct[]>([])
  const [orders, setOrders] = useState<BoutiqueOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(mustChangePassword)
  const [editingProduct, setEditingProduct] = useState<BoutiqueProduct | null>(null)
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all')

  // Catégories prédéfinies
  const PRODUCT_CATEGORIES = [
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
    'autre',
  ]

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    customCategory: '',
    status: 'active',
    image: null as File | null,
    discount_percentage: '',
    promotion_start_date: '',
    promotion_end_date: '',
    is_on_promotion: false,
  })
  
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [showBoutiqueModal, setShowBoutiqueModal] = useState(false)
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null)

  const [boutiqueForm, setBoutiqueForm] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    logo: null as File | null,
  })

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })

  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    checkAuth()
    loadData()
  }, [])

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts()
    } else if (activeTab === 'orders') {
      loadOrders()
    }
  }, [activeTab, orderStatusFilter])

  const checkAuth = () => {
    const token = localStorage.getItem('boutique_token')
    if (!token) {
      navigate('/boutique/login')
    } else {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }

  const loadData = async () => {
    try {
      const [boutiqueResponse] = await Promise.all([
        boutiqueOwnerApi.getMyBoutique(),
      ])
      setBoutique(boutiqueResponse.data.data)
      // Initialiser le formulaire avec les données de la boutique
      const boutiqueData = boutiqueResponse.data.data
      setBoutiqueForm({
        name: boutiqueData.name || '',
        description: boutiqueData.description || '',
        email: boutiqueData.email || '',
        phone: boutiqueData.phone || '',
        address: boutiqueData.address || '',
        logo: null,
      })
      setPreviewLogoUrl(boutiqueData.logo || null)
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('boutique_token')
        navigate('/boutique/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const response = await boutiqueOwnerApi.getMyProducts()
      setProducts(response.data.data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const loadOrders = async () => {
    try {
      const status = orderStatusFilter !== 'all' ? orderStatusFilter : undefined
      const response = await boutiqueOwnerApi.getMyOrders(status)
      setOrders(response.data.data || [])
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await boutiqueAuthApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('boutique_token')
      delete api.defaults.headers.common['Authorization']
      navigate('/boutique/login')
    }
  }

  const openProductModal = (product?: BoutiqueProduct) => {
    if (product) {
      setEditingProduct(product)
      const category = product.category || ''
      const isCustomCategory = category && !PRODUCT_CATEGORIES.includes(category)
      setProductForm({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: isCustomCategory ? 'autre' : (category || ''),
        customCategory: isCustomCategory ? category : '',
        status: product.status,
        image: null,
        discount_percentage: product.discount_percentage?.toString() || '',
        promotion_start_date: product.promotion_start_date ? new Date(product.promotion_start_date).toISOString().slice(0, 16) : '',
        promotion_end_date: product.promotion_end_date ? new Date(product.promotion_end_date).toISOString().slice(0, 16) : '',
        is_on_promotion: product.is_on_promotion || false,
      })
      setShowCustomCategory(isCustomCategory)
      // Afficher l'image existante si disponible
      setPreviewImageUrl(product.image || null)
    } else {
      setEditingProduct(null)
      setProductForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        customCategory: '',
        status: 'active',
        image: null,
        discount_percentage: '',
        promotion_start_date: '',
        promotion_end_date: '',
        is_on_promotion: false,
      })
      setShowCustomCategory(false)
      setPreviewImageUrl(null)
    }
    setShowProductModal(true)
  }

  const closeProductModal = () => {
    setShowProductModal(false)
    setEditingProduct(null)
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      customCategory: '',
      status: 'active',
      image: null,
      discount_percentage: '',
      promotion_start_date: '',
      promotion_end_date: '',
      is_on_promotion: false,
    })
    setShowCustomCategory(false)
    // Nettoyer l'URL blob si nécessaire
    if (previewImageUrl && previewImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewImageUrl)
    }
    setPreviewImageUrl(null)
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation de la catégorie
    if (productForm.category === 'autre' && !productForm.customCategory.trim()) {
      alert('Veuillez saisir le nom de la catégorie personnalisée.')
      return
    }
    
    try {
      const formData = new FormData()
      formData.append('name', productForm.name)
      formData.append('description', productForm.description)
      formData.append('price', productForm.price)
      formData.append('stock', productForm.stock)
      // Utiliser la catégorie personnalisée si "autre" est sélectionné, sinon utiliser la catégorie sélectionnée
      const finalCategory = productForm.category === 'autre' && productForm.customCategory
        ? productForm.customCategory.trim()
        : productForm.category
      formData.append('category', finalCategory || '')
      formData.append('status', productForm.status)
      if (productForm.image) {
        formData.append('image_file', productForm.image)
      }
      
      // Champs de promotion
      if (productForm.discount_percentage) {
        formData.append('discount_percentage', productForm.discount_percentage)
      }
      if (productForm.promotion_start_date) {
        formData.append('promotion_start_date', productForm.promotion_start_date)
      }
      if (productForm.promotion_end_date) {
        formData.append('promotion_end_date', productForm.promotion_end_date)
      }
      formData.append('is_on_promotion', productForm.is_on_promotion ? '1' : '0')

      if (editingProduct) {
        await boutiqueOwnerApi.updateProduct(editingProduct.id, formData)
      } else {
        await boutiqueOwnerApi.createProduct(formData)
      }

      // Nettoyer l'URL blob avant de fermer
      if (previewImageUrl && previewImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewImageUrl)
      }
      closeProductModal()
      loadProducts()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Une erreur est survenue')
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    try {
      await boutiqueOwnerApi.deleteProduct(productId)
      loadProducts()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await boutiqueOwnerApi.updateOrderStatus(orderId, status)
      loadOrders()
    } catch (error) {
      alert('Erreur lors de la mise à jour du statut')
    }
  }

  const handleBoutiqueSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', boutiqueForm.name)
      formData.append('description', boutiqueForm.description)
      formData.append('email', boutiqueForm.email)
      if (boutiqueForm.phone) {
        formData.append('phone', boutiqueForm.phone)
      }
      if (boutiqueForm.address) {
        formData.append('address', boutiqueForm.address)
      }
      if (boutiqueForm.logo) {
        formData.append('logo_file', boutiqueForm.logo)
      }

      await boutiqueOwnerApi.updateMyBoutique(formData)
      
      // Nettoyer l'URL blob si nécessaire
      if (previewLogoUrl && previewLogoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewLogoUrl)
      }
      
      setShowBoutiqueModal(false)
      loadData()
      alert('Informations de la boutique mises à jour avec succès !')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour')
    }
  }

  const handleBoutiqueLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validation du type de fichier
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        alert('Type de fichier non supporté. Veuillez sélectionner une image (JPEG, PNG, GIF, WebP).')
        return
      }
      
      // Validation de la taille (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale : 5MB.')
        return
      }
      
      setBoutiqueForm({ ...boutiqueForm, logo: file })
      // Nettoyer l'ancienne URL blob si nécessaire
      if (previewLogoUrl && previewLogoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewLogoUrl)
      }
      const url = URL.createObjectURL(file)
      setPreviewLogoUrl(url)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordErrors({})

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setPasswordErrors({ new_password_confirmation: 'Les mots de passe ne correspondent pas' })
      return
    }

    if (passwordForm.new_password.length < 8) {
      setPasswordErrors({ new_password: 'Le mot de passe doit contenir au moins 8 caractères' })
      return
    }

    try {
      await boutiqueAuthApi.changePassword(
        passwordForm.current_password,
        passwordForm.new_password,
        passwordForm.new_password_confirmation
      )
      alert('Mot de passe changé avec succès !')
      setShowPasswordModal(false)
      setPasswordForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      })
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setPasswordErrors(error.response.data.errors)
      } else {
        alert(error.response?.data?.message || 'Erreur lors du changement de mot de passe')
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      confirmed: 'bg-blue-500/20 text-blue-400',
      processing: 'bg-purple-500/20 text-purple-400',
      shipped: 'bg-primary-500/20 text-primary-400',
      delivered: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
    }
    return colors[status] || 'bg-secondary-500/20 text-secondary-400'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      default:
        return <TrendingUp className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-500">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-secondary-400">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-500">
      {/* Header */}
      <header className="glass-effect border-b border-white/10 sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-700/50 [data-theme='light']:bg-secondary-200 flex items-center justify-center overflow-hidden border-2 border-white/10">
                {boutique?.logo ? (
                  <img 
                    src={boutique.logo} 
                    alt={boutique.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-6 h-6 text-white [data-theme='light']:text-secondary-600" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-display font-bold gradient-text">{boutique?.name}</h1>
                <p className="text-sm text-secondary-400">Tableau de bord</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container-custom py-6">
        <div className="flex space-x-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'products'
                ? 'text-primary-400'
                : 'text-secondary-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Produits</span>
            </div>
            {activeTab === 'products' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'orders'
                ? 'text-primary-400'
                : 'text-secondary-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Commandes</span>
            </div>
            {activeTab === 'orders' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'settings'
                ? 'text-primary-400'
                : 'text-secondary-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Paramètres</span>
            </div>
            {activeTab === 'settings' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary"
              />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom pb-12">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Mes Produits</h2>
              <button
                onClick={() => openProductModal()}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter un produit</span>
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 glass-effect rounded-2xl">
                <Package className="w-20 h-20 text-secondary-400 mx-auto mb-4" />
                <p className="text-xl text-secondary-400 mb-4">Aucun produit</p>
                <button onClick={() => openProductModal()} className="btn-primary">
                  Ajouter votre premier produit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="glass-effect rounded-2xl p-6">
                    <div className="relative w-full h-48 rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-16 h-16 text-primary-400" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-sm text-secondary-400 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold gradient-text">
                        {formatPrice(product.price)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {product.stock} en stock
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openProductModal(product)}
                        className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="btn-secondary text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Mes Commandes</h2>
              <div className="flex gap-2">
                {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      orderStatusFilter === status
                        ? 'bg-gradient-primary text-white'
                        : 'glass-effect text-secondary-400 hover:text-white'
                    }`}
                  >
                    {status === 'all' ? 'Toutes' : status}
                  </button>
                ))}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 glass-effect rounded-2xl">
                <ShoppingBag className="w-20 h-20 text-secondary-400 mx-auto mb-4" />
                <p className="text-xl text-secondary-400">Aucune commande</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="glass-effect rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          Commande #{order.order_number}
                        </h3>
                        <p className="text-sm text-secondary-400">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-secondary-400 mb-1">Client</p>
                        <p className="text-white font-medium">{order.customer_name}</p>
                        <p className="text-sm text-secondary-400">{order.customer_email}</p>
                        {order.customer_phone && (
                          <p className="text-sm text-secondary-400">{order.customer_phone}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-secondary-400 mb-1">Adresse de livraison</p>
                        <p className="text-white">{order.shipping_address}</p>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-secondary-400 mb-2">Articles:</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-white">
                                {item.product.name} x {item.quantity}
                              </span>
                              <span className="text-secondary-400">
                                {formatPrice(item.total)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <span className="text-xl font-bold text-white">
                        Total: {formatPrice(order.total)}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700
                          [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                          [data-theme='dark']:[&>option]:bg-secondary-800 [data-theme='dark']:[&>option]:text-white
                          [data-theme='dark']:border-secondary-700 [data-theme='dark']:focus:border-primary-500 [data-theme='light']:border-secondary-300 [data-theme='light']:focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="processing">En traitement</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Paramètres</h2>
            <div className="glass-effect rounded-2xl p-8">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>Changer le mot de passe</span>
                </h3>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Lock className="w-5 h-5" />
                  <span>Changer le mot de passe</span>
                </button>
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Informations de la boutique</h3>
                  <button
                    onClick={() => setShowBoutiqueModal(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary-400 mb-1">Nom</p>
                    <p className="text-white font-medium">{boutique?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-400 mb-1">Email</p>
                    <p className="text-white">{boutique?.email}</p>
                  </div>
                  {boutique?.phone && (
                    <div>
                      <p className="text-sm text-secondary-400 mb-1">Téléphone</p>
                      <p className="text-white">{boutique.phone}</p>
                    </div>
                  )}
                  {boutique?.address && (
                    <div>
                      <p className="text-sm text-secondary-400 mb-1">Adresse</p>
                      <p className="text-white">{boutique.address}</p>
                    </div>
                  )}
                  {boutique?.logo && (
                    <div>
                      <p className="text-sm text-secondary-400 mb-2">Logo</p>
                      <img 
                        src={boutique.logo} 
                        alt="Logo de la boutique" 
                        className="w-24 h-24 rounded-lg object-cover border-2 border-white/20"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProductModal}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-effect rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-white">
                    {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                  </h2>
                  <button onClick={closeProductModal} className="text-secondary-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="product-name" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Nom *</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="product-name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-lg 
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
                    </div>
                  </div>
                  <div>
                    <label htmlFor="product-description" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Description</label>
                    <div className="relative">
                      <textarea
                        id="product-description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                          [data-theme='dark']:hover:bg-secondary-700
                          [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                          border
                          focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none
                          [data-theme='dark']:border-secondary-700 [data-theme='dark']:focus:border-primary-500 [data-theme='light']:border-secondary-300 [data-theme='light']:focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="product-price" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Prix (XOF) *</label>
                      <div className="relative">
                        <input
                          type="number"
                          id="product-price"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-lg 
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
                      </div>
                    </div>
                    <div>
                      <label htmlFor="product-stock" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Stock *</label>
                      <div className="relative">
                        <input
                          type="number"
                          id="product-stock"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-lg 
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
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="product-category" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Catégorie</label>
                    <div className="space-y-3">
                      <div className="relative">
                        <select
                          id="product-category"
                          value={productForm.category}
                          onChange={(e) => {
                            const selectedCategory = e.target.value
                            setProductForm({ ...productForm, category: selectedCategory, customCategory: selectedCategory === 'autre' ? productForm.customCategory : '' })
                            setShowCustomCategory(selectedCategory === 'autre')
                          }}
                          className="w-full px-4 py-3 rounded-lg 
                            [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white
                            [data-theme='dark']:hover:bg-secondary-700
                            [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                            border appearance-none pr-10
                            focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                            [data-theme='dark']:border-secondary-700 [data-theme='dark']:focus:border-primary-500 [data-theme='light']:border-secondary-300 [data-theme='light']:focus:border-primary-500"
                          style={{
                            color: isDark ? '#ffffff' : '#111827',
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            borderColor: isDark ? '#374151' : '#d1d5db',
                          }}
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {PRODUCT_CATEGORIES.filter(cat => cat !== 'autre').map((category) => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                          <option value="autre">Autre</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {showCustomCategory && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <label htmlFor="product-custom-category" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Nom de la catégorie</label>
                          <input
                            type="text"
                            id="product-custom-category"
                            value={productForm.customCategory}
                            onChange={(e) => setProductForm({ ...productForm, customCategory: e.target.value })}
                            placeholder="Saisissez le nom de la catégorie"
                            className="w-full px-4 py-3 rounded-lg 
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
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Image</label>
                    {previewImageUrl ? (
                      <div className="space-y-3">
                        <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-white/20">
                          <img
                            src={previewImageUrl}
                            alt="Aperçu"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setProductForm({ ...productForm, image: null })
                              if (previewImageUrl.startsWith('blob:')) {
                                URL.revokeObjectURL(previewImageUrl)
                              }
                              setPreviewImageUrl(null)
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                          <div className="text-center">
                            <Upload className="w-5 h-5 text-secondary-400 mx-auto mb-1" />
                            <p className="text-xs text-secondary-400">Cliquez pour changer l'image</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                // Nettoyer l'ancienne URL blob si nécessaire
                                if (previewImageUrl && previewImageUrl.startsWith('blob:')) {
                                  URL.revokeObjectURL(previewImageUrl)
                                }
                                setProductForm({ ...productForm, image: file })
                                const url = URL.createObjectURL(file)
                                setPreviewImageUrl(url)
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                          <p className="text-sm text-secondary-400">Cliquez pour télécharger une image</p>
                          <p className="text-xs text-secondary-500 mt-1">PNG, JPG, GIF jusqu'à 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              // Validation du type de fichier
                              const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
                              if (!validTypes.includes(file.type)) {
                                alert('Type de fichier non supporté. Veuillez sélectionner une image (JPEG, PNG, GIF, WebP).')
                                return
                              }
                              
                              // Validation de la taille (5MB)
                              if (file.size > 5 * 1024 * 1024) {
                                alert('Le fichier est trop volumineux. Taille maximale : 5MB.')
                                return
                              }
                              
                              setProductForm({ ...productForm, image: file })
                              const url = URL.createObjectURL(file)
                              setPreviewImageUrl(url)
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <label htmlFor="product-status" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Statut</label>
                    <div className="relative">
                      <select
                        id="product-status"
                        value={productForm.status}
                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700
                          [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                          [data-theme='dark']:[&>option]:bg-secondary-800 [data-theme='dark']:[&>option]:text-white
                          [data-theme='dark']:border-secondary-700 [data-theme='dark']:focus:border-primary-500 [data-theme='light']:border-secondary-300 [data-theme='light']:focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Section Promotion */}
                  <div className="border-t [data-theme='dark']:border-secondary-700 [data-theme='light']:border-secondary-300 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-secondary-200 [data-theme='light']:text-secondary-800 mb-4">
                      Promotion
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="is_on_promotion"
                          checked={productForm.is_on_promotion}
                          onChange={(e) => setProductForm({ ...productForm, is_on_promotion: e.target.checked })}
                          className="w-5 h-5 rounded border-secondary-600 text-primary-500 focus:ring-primary-500"
                        />
                        <label htmlFor="is_on_promotion" className="text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700">
                          Activer la promotion
                        </label>
                      </div>
                      
                      {productForm.is_on_promotion && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                                Pourcentage de réduction (%)
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={productForm.discount_percentage}
                                onChange={(e) => setProductForm({ ...productForm, discount_percentage: e.target.value })}
                                placeholder="Ex: 20"
                                className="w-full px-4 py-2 rounded-lg 
                                  [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                                  [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                                  border focus:outline-none focus:border-primary-500"
                                style={{
                                  color: isDark ? '#ffffff' : '#111827',
                                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                  borderColor: isDark ? '#374151' : '#d1d5db',
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                                Date de début
                              </label>
                              <input
                                type="datetime-local"
                                value={productForm.promotion_start_date}
                                onChange={(e) => setProductForm({ ...productForm, promotion_start_date: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg 
                                  [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                                  [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                                  border focus:outline-none focus:border-primary-500"
                                style={{
                                  color: isDark ? '#ffffff' : '#111827',
                                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                  borderColor: isDark ? '#374151' : '#d1d5db',
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                              Date de fin
                            </label>
                            <input
                              type="datetime-local"
                              value={productForm.promotion_end_date}
                              onChange={(e) => setProductForm({ ...productForm, promotion_end_date: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg 
                                [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                                [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                                border focus:outline-none focus:border-primary-500"
                              style={{
                                color: isDark ? '#ffffff' : '#111827',
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                borderColor: isDark ? '#374151' : '#d1d5db',
                              }}
                            />
                          </div>
                          {productForm.discount_percentage && productForm.price && (
                            <div className="p-3 rounded-lg bg-primary-500/10 border border-primary-500/20">
                              <p className="text-sm text-secondary-300 [data-theme='light']:text-secondary-700">
                                <span className="font-semibold">Prix original:</span> {parseFloat(productForm.price).toLocaleString('fr-FR')} XOF
                              </p>
                              <p className="text-sm text-primary-400 font-semibold">
                                <span className="font-semibold">Prix promotionnel:</span> {Math.round(parseFloat(productForm.price) * (1 - parseFloat(productForm.discount_percentage) / 100)).toLocaleString('fr-FR')} XOF
                                <span className="ml-2 text-xs text-secondary-400">(-{productForm.discount_percentage}%)</span>
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 btn-primary flex items-center justify-center space-x-2">
                      <Save className="w-5 h-5" />
                      <span>{editingProduct ? 'Enregistrer' : 'Créer'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={closeProductModal}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !mustChangePassword && setShowPasswordModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-effect rounded-2xl p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-white flex items-center space-x-2">
                    <Key className="w-6 h-6" />
                    <span>Changer le mot de passe</span>
                  </h2>
                  {!mustChangePassword && (
                    <button onClick={() => setShowPasswordModal(false)} className="text-secondary-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </button>
                  )}
                </div>
                {mustChangePassword && (
                  <div className="mb-4 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/50 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-400">
                      Vous devez changer votre mot de passe temporaire avant de continuer.
                    </p>
                  </div>
                )}
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Mot de passe actuel *</label>
                    <div className="relative">
                      <input
                        type="password"
                        id="current-password"
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                        required
                        className={`w-full px-4 py-3 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                          [data-theme='dark']:hover:bg-secondary-700
                          [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                          border
                          focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                          ${passwordErrors.current_password ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: passwordErrors.current_password ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                        }}
                      />
                      {passwordErrors.current_password && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          {passwordErrors.current_password}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Nouveau mot de passe *</label>
                    <div className="relative">
                      <input
                        type="password"
                        id="new-password"
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        required
                        className={`w-full px-4 py-3 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                          [data-theme='dark']:hover:bg-secondary-700
                          [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                          border
                          focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                          ${passwordErrors.new_password ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: passwordErrors.new_password ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                        }}
                      />
                      {passwordErrors.new_password && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          {passwordErrors.new_password}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Confirmer le mot de passe *</label>
                    <div className="relative">
                      <input
                        type="password"
                        id="confirm-password"
                        value={passwordForm.new_password_confirmation}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                        required
                        className={`w-full px-4 py-3 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                          [data-theme='dark']:hover:bg-secondary-700
                          [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                          border
                          focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all
                          ${passwordErrors.new_password_confirmation ? 'border-red-500 focus:border-red-500' : '[data-theme="dark"]:border-secondary-700 [data-theme="dark"]:focus:border-primary-500 [data-theme="light"]:border-secondary-300 [data-theme="light"]:focus:border-primary-500'}`}
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: passwordErrors.new_password_confirmation ? '#ef4444' : (isDark ? '#374151' : '#d1d5db'),
                        }}
                      />
                      {passwordErrors.new_password_confirmation && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          {passwordErrors.new_password_confirmation}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Changer le mot de passe</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Boutique Info Modal */}
      <AnimatePresence>
        {showBoutiqueModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBoutiqueModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass-effect rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-white">
                    Modifier les informations de la boutique
                  </h2>
                  <button 
                    onClick={() => {
                      setShowBoutiqueModal(false)
                      // Restaurer les valeurs originales
                      if (boutique) {
                        setBoutiqueForm({
                          name: boutique.name || '',
                          description: boutique.description || '',
                          email: boutique.email || '',
                          phone: boutique.phone || '',
                          address: boutique.address || '',
                          logo: null,
                        })
                        setPreviewLogoUrl(boutique.logo || null)
                      }
                    }} 
                    className="text-secondary-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleBoutiqueSubmit} className="space-y-6">
                  {/* Logo */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Logo de la boutique</label>
                    {previewLogoUrl ? (
                      <div className="space-y-3">
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-white/20">
                          <img
                            src={previewLogoUrl}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setBoutiqueForm({ ...boutiqueForm, logo: null })
                              if (previewLogoUrl.startsWith('blob:')) {
                                URL.revokeObjectURL(previewLogoUrl)
                              }
                              setPreviewLogoUrl(boutique?.logo || null)
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                          <div className="text-center">
                            <Upload className="w-5 h-5 text-secondary-400 mx-auto mb-1" />
                            <p className="text-xs text-secondary-400">Cliquez pour changer le logo</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBoutiqueLogoChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                          <p className="text-sm text-secondary-400">Cliquez pour télécharger un logo</p>
                          <p className="text-xs text-secondary-500 mt-1">PNG, JPG, GIF jusqu'à 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBoutiqueLogoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Nom */}
                  <div>
                    <label htmlFor="boutique-name" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Nom de la boutique *</label>
                    <input
                      type="text"
                      id="boutique-name"
                      value={boutiqueForm.name}
                      onChange={(e) => setBoutiqueForm({ ...boutiqueForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg 
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
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="boutique-description" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Description</label>
                    <textarea
                      id="boutique-description"
                      value={boutiqueForm.description}
                      onChange={(e) => setBoutiqueForm({ ...boutiqueForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                        [data-theme='dark']:hover:bg-secondary-700
                        [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                        border
                        focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none
                        [data-theme='dark']:border-secondary-700 [data-theme='dark']:focus:border-primary-500 [data-theme='light']:border-secondary-300 [data-theme='light']:focus:border-primary-500"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="boutique-email" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Email *</label>
                    <input
                      type="email"
                      id="boutique-email"
                      value={boutiqueForm.email}
                      onChange={(e) => setBoutiqueForm({ ...boutiqueForm, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg 
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
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label htmlFor="boutique-phone" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      id="boutique-phone"
                      value={boutiqueForm.phone}
                      onChange={(e) => setBoutiqueForm({ ...boutiqueForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg 
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
                  </div>

                  {/* Adresse */}
                  <div>
                    <label htmlFor="boutique-address" className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">Adresse</label>
                    <textarea
                      id="boutique-address"
                      value={boutiqueForm.address}
                      onChange={(e) => setBoutiqueForm({ ...boutiqueForm, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:text-white [data-theme='dark']:placeholder-secondary-400
                        [data-theme='dark']:hover:bg-secondary-700
                        [data-theme='light']:bg-white [data-theme='light']:text-dark-500 [data-theme='light']:border-2 [data-theme='light']:placeholder-secondary-400
                        border
                        focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none
                        [data-theme='dark']:border-secondary-700 [data-theme='dark']:focus:border-primary-500 [data-theme='light']:border-secondary-300 [data-theme='light']:focus:border-primary-500"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 btn-primary flex items-center justify-center space-x-2">
                      <Save className="w-5 h-5" />
                      <span>Enregistrer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBoutiqueModal(false)
                        // Restaurer les valeurs originales
                        if (boutique) {
                          setBoutiqueForm({
                            name: boutique.name || '',
                            description: boutique.description || '',
                            email: boutique.email || '',
                            phone: boutique.phone || '',
                            address: boutique.address || '',
                            logo: null,
                          })
                          if (previewLogoUrl && previewLogoUrl.startsWith('blob:')) {
                            URL.revokeObjectURL(previewLogoUrl)
                          }
                          setPreviewLogoUrl(boutique.logo || null)
                        }
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BoutiqueDashboard

