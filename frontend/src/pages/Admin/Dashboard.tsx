import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { adminApi, projectsApi, productsApi, contactMessagesApi } from '../../services/api'
import { useTheme } from '../../hooks/useTheme'
import RichTextEditor from '../../components/Admin/RichTextEditor'
import { 
  LogOut, MessageSquare, FolderKanban, CheckCircle, XCircle, 
  Edit, Trash2, Plus, Star, Eye, EyeOff, Upload, X, Image as ImageIcon, Video, ShoppingBag, Building2, Newspaper, Users, Mail, Linkedin, Github, Award, Shield, Trophy, Medal, TrendingUp, Share2, Send, MessageCircle, Menu, X as XIcon, Search, Phone, Clock, Copy, ArrowUpDown, RefreshCw
} from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  role?: string
  content: string
  rating: number
  is_approved: boolean
  created_at: string
}

interface Project {
  id: number
  title: string
  category: string
  description: string
  image?: string
  tags?: string[]
  link?: string
}

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
  order?: number
  discount_percentage?: number | null
  promotion_price?: number | null
  promotion_start_date?: string | null
  promotion_end_date?: string | null
  is_on_promotion?: boolean
}

interface Partner {
  id: number
  name: string
  logo?: string
  website?: string
  order: number
  is_active: boolean
}

interface News {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  category: string
  author?: string
  read_time: number
  is_published: boolean
  published_at?: string
  views: number
  order: number
  created_at: string
  updated_at: string
}

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  image?: string
  email?: string
  linkedin?: string
  github?: string
  twitter?: string
  website?: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Certification {
  id: number
  name: string
  description: string
  image?: string
  icon_type: string
  color: string
  issuer?: string
  issued_date?: string
  expiry_date?: string
  certificate_url?: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Award {
  id: number
  title: string
  organization: string
  year: number
  description: string
  image?: string
  icon_type: string
  color: string
  award_url?: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Video {
  id: number
  title: string
  description?: string
  video_type: string
  video_url?: string
  video_file?: string
  thumbnail?: string
  order: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

interface SocialLink {
  id: number
  platform: string
  name: string
  url: string
  icon_type: string
  color_gradient?: string
  followers?: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ChatMessage {
  id: number
  conversation_id: number
  user_id?: number
  sender_type: 'visitor' | 'admin'
  content: string
  is_read: boolean
  read_at?: string
  created_at: string
  user?: {
    id: number
    name: string
    email: string
  }
}

interface ChatConversation {
  id: number
  session_id?: string
  user_id?: number
  name?: string
  email?: string
  type: 'anonymous' | 'authenticated'
  status: 'active' | 'closed' | 'archived'
  last_message_at?: string
  created_at: string
  updated_at: string
  messages?: ChatMessage[]
  last_message?: ChatMessage
  unread_count?: number
  user?: {
    id: number
    name: string
    email: string
  }
}

interface ContactMessage {
  id: number
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  is_read: boolean
  read_at?: string
  is_replied: boolean
  replied_at?: string
  admin_reply?: string
  created_at: string
  updated_at: string
}

const Dashboard = () => {
  const { isDark } = useTheme()
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'testimonials' | 'projects' | 'products' | 'partners' | 'news' | 'team' | 'certifications' | 'awards' | 'videos' | 'socialLinks' | 'chat' | 'contactMessages'>('testimonials')
  const [showMetrics, setShowMetrics] = useState(true)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [news, setNews] = useState<News[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [awards, setAwards] = useState<Award[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [chatMessage, setChatMessage] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [selectedContactMessage, setSelectedContactMessage] = useState<ContactMessage | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [contactMessageFilter, setContactMessageFilter] = useState<'all' | 'unread' | 'replied' | 'unreplied'>('all')
  const [contactMessageSearch, setContactMessageSearch] = useState('')
  const [contactMessageSort, setContactMessageSort] = useState<'newest' | 'oldest' | 'name'>('newest')
  const [productSearch, setProductSearch] = useState('')
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all')
  const [productStockFilter, setProductStockFilter] = useState<string>('all')
  const [productSort, setProductSort] = useState<'name' | 'price' | 'stock' | 'date'>('date')
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [metrics, setMetrics] = useState({
    totalTestimonials: 0,
    pendingTestimonials: 0,
    totalProjects: 0,
    totalProducts: 0,
    totalNews: 0,
    publishedNews: 0,
    totalTeamMembers: 0,
    activeTeamMembers: 0,
    totalConversations: 0,
    unreadMessages: 0,
  })
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'web',
    description: '',
    image: '',
    tags: '',
    link: '',
  })
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'hardware',
    rating: '',
    stock: '',
    image: '',
    images: [] as string[],
    discount_percentage: '',
    promotion_start_date: '',
    promotion_end_date: '',
    is_on_promotion: false,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedProductFiles, setSelectedProductFiles] = useState<File[]>([])
  const [selectedPartnerFile, setSelectedPartnerFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewProductUrls, setPreviewProductUrls] = useState<string[]>([])
  const [previewPartnerUrl, setPreviewPartnerUrl] = useState<string | null>(null)
  const [showPartnerForm, setShowPartnerForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    website: '',
    order: '0',
    is_active: true,
  })
  const [showNewsForm, setShowNewsForm] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [newsForm, setNewsForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: 'Général',
    author: '',
    read_time: '5',
    is_published: false,
    published_at: '',
    order: '0',
  })
  const [selectedNewsFile, setSelectedNewsFile] = useState<File | null>(null)
  const [previewNewsUrl, setPreviewNewsUrl] = useState<string | null>(null)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null)
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    email: '',
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
    order: '0',
    is_active: true,
  })
  const [selectedTeamFile, setSelectedTeamFile] = useState<File | null>(null)
  const [previewTeamUrl, setPreviewTeamUrl] = useState<string | null>(null)
  const [showCertificationForm, setShowCertificationForm] = useState(false)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [certificationForm, setCertificationForm] = useState({
    name: '',
    description: '',
    image: '',
    icon_type: 'award',
    color: 'from-blue-500 to-blue-600',
    issuer: '',
    issued_date: '',
    expiry_date: '',
    certificate_url: '',
    order: '0',
    is_active: true,
  })
  const [selectedCertificationFile, setSelectedCertificationFile] = useState<File | null>(null)
  const [previewCertificationUrl, setPreviewCertificationUrl] = useState<string | null>(null)
  const [showAwardForm, setShowAwardForm] = useState(false)
  const [editingAward, setEditingAward] = useState<Award | null>(null)
  const [awardForm, setAwardForm] = useState({
    title: '',
    organization: '',
    year: new Date().getFullYear().toString(),
    description: '',
    image: '',
    icon_type: 'trophy',
    color: 'from-yellow-500 to-orange-500',
    award_url: '',
    order: '0',
    is_active: true,
  })
  const [selectedAwardFile, setSelectedAwardFile] = useState<File | null>(null)
  const [previewAwardUrl, setPreviewAwardUrl] = useState<string | null>(null)
  const [showVideoForm, setShowVideoForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    video_type: 'youtube',
    video_url: '',
    thumbnail: '',
    order: '0',
    is_active: true,
    is_featured: false,
  })
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null)
  const [selectedVideoThumbnailFile, setSelectedVideoThumbnailFile] = useState<File | null>(null)
  const [previewVideoThumbnailUrl, setPreviewVideoThumbnailUrl] = useState<string | null>(null)
  const [showSocialLinkForm, setShowSocialLinkForm] = useState(false)
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null)
  const [socialLinkForm, setSocialLinkForm] = useState({
    platform: 'facebook',
    name: '',
    url: '',
    icon_type: 'lucide',
    color_gradient: '',
    followers: '',
    order: '0',
    is_active: true,
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, authLoading, navigate])

  // Charger les métriques une seule fois au montage
  useEffect(() => {
    if (isAuthenticated) {
      // Charger toutes les données pour les compteurs de la sidebar au démarrage
      loadMetrics()
    }
  }, [isAuthenticated])

  // Charger les données de l'onglet actif lorsque l'onglet change
  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated, activeTab])

  const loadMetrics = async () => {
    try {
      // Charger toutes les données nécessaires pour les métriques et les compteurs de la sidebar
      const [
        testimonialsRes,
        projectsRes,
        productsRes,
        partnersRes,
        newsRes,
        teamRes,
        certificationsRes,
        awardsRes,
        videosRes,
        socialLinksRes,
        conversationsRes,
        contactMessagesRes
      ] = await Promise.all([
        adminApi.testimonials.getAll().catch(() => ({ data: { data: [] } })),
        projectsApi.getAll().catch(() => ({ data: { data: [] } })),
        productsApi.getAll().catch(() => ({ data: { data: [] } })),
        adminApi.partners.getAll().catch(() => ({ data: { data: [] } })),
        adminApi.news.getAll().catch(() => ({ data: { data: [] } })),
        adminApi.team.getAll().catch(() => ({ data: { data: [] } })),
        adminApi.certifications.getAll().catch(() => ({ data: { data: [] } })),
        adminApi.awards.getAll().catch(() => ({ data: { data: [] } })),
        adminApi.videos.getAll().catch(() => ({ data: { data: [] } })),
        adminApi.socialLinks.getAll().catch(() => ({ data: { data: [] } })),
        adminApi.chat.getAllConversations().catch(() => ({ data: { data: [] } })),
        contactMessagesApi.getAll().catch(() => ({ data: { data: [] } }))
      ])

      const allTestimonials = testimonialsRes.data.data || []
      const allProjects = projectsRes.data.data || []
      const allProducts = productsRes.data.data || []
      const allPartners = partnersRes.data.data || []
      const allNews = newsRes.data.data || []
      const allTeamMembers = teamRes.data.data || []
      const allCertifications = certificationsRes.data.data || []
      const allAwards = awardsRes.data.data || []
      const allVideos = videosRes.data.data || []
      const allSocialLinks = socialLinksRes.data.data || []
      const allConversations = conversationsRes.data.data || []
      const allContactMessages = contactMessagesRes.data.data || []

      const pendingTestimonials = allTestimonials.filter((t: Testimonial) => !t.is_approved).length
      const publishedNews = allNews.filter((n: News) => n.is_published).length
      const activeTeamMembers = allTeamMembers.filter((m: TeamMember) => m.is_active).length
      const unreadMessages = allConversations.reduce((sum: number, conv: any) => sum + (conv.unread_count || 0), 0)
      
      // Mettre à jour les états pour que les compteurs de la sidebar soient corrects
      setTestimonials(allTestimonials)
      setProjects(allProjects)
      setProducts(allProducts)
      setPartners(allPartners)
      setNews(allNews)
      setTeamMembers(allTeamMembers)
      setCertifications(allCertifications)
      setAwards(allAwards)
      setVideos(allVideos)
      setSocialLinks(allSocialLinks)
      setConversations(allConversations)
      setContactMessages(allContactMessages)
      
      setMetrics({
        totalTestimonials: allTestimonials.length,
        pendingTestimonials,
        totalProjects: allProjects.length,
        totalProducts: allProducts.length,
        totalNews: allNews.length,
        publishedNews,
        totalTeamMembers: allTeamMembers.length,
        activeTeamMembers,
        totalConversations: allConversations.length,
        unreadMessages,
      })
    } catch (error) {
      console.error('Error loading metrics:', error)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'testimonials') {
        const response = await adminApi.testimonials.getAll()
        setTestimonials(response.data.data || [])
      } else if (activeTab === 'projects') {
        const response = await projectsApi.getAll()
        setProjects(response.data.data || [])
      } else if (activeTab === 'products') {
        const response = await productsApi.getAll()
        setProducts(response.data.data || [])
      } else if (activeTab === 'partners') {
        const response = await adminApi.partners.getAll()
        setPartners(response.data.data || [])
      } else if (activeTab === 'news') {
        const response = await adminApi.news.getAll()
        setNews(response.data.data || [])
      } else if (activeTab === 'team') {
        const response = await adminApi.team.getAll()
        setTeamMembers(response.data.data || [])
      } else if (activeTab === 'certifications') {
        const response = await adminApi.certifications.getAll()
        setCertifications(response.data.data || [])
      } else if (activeTab === 'awards') {
        const response = await adminApi.awards.getAll()
        setAwards(response.data.data || [])
      } else if (activeTab === 'videos') {
        const response = await adminApi.videos.getAll()
        setVideos(response.data.data || [])
      } else if (activeTab === 'socialLinks') {
        const response = await adminApi.socialLinks.getAll()
        setSocialLinks(response.data.data || [])
      } else if (activeTab === 'chat') {
        const response = await adminApi.chat.getAllConversations()
        setConversations(response.data.data || [])
      } else if (activeTab === 'contactMessages') {
        const response = await contactMessagesApi.getAll()
        setContactMessages(response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const handleApproveTestimonial = async (id: number) => {
    try {
      await adminApi.testimonials.approve(id)
      loadData()
    } catch (error) {
      console.error('Error approving testimonial:', error)
    }
  }

  const handleRejectTestimonial = async (id: number) => {
    try {
      await adminApi.testimonials.reject(id)
      loadData()
    } catch (error) {
      console.error('Error rejecting testimonial:', error)
    }
  }

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return
    try {
      await adminApi.testimonials.delete(id)
      loadData()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    }
  }

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return
    try {
      await adminApi.projects.delete(id)
      loadData()
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const tags = projectForm.tags ? projectForm.tags.split(',').map(t => t.trim()).filter(t => t) : []
      
      // Créer FormData pour gérer l'upload de fichier
      const formData = new FormData()
      formData.append('title', projectForm.title)
      formData.append('category', projectForm.category)
      formData.append('description', projectForm.description)
      if (tags.length > 0) {
        formData.append('tags', JSON.stringify(tags))
      }
      if (projectForm.link) formData.append('link', projectForm.link)
      
      // Si un fichier est sélectionné, l'ajouter au FormData
      if (selectedFile) {
        formData.append('image_file', selectedFile)
      } else if (projectForm.image) {
        // Si pas de fichier mais une URL, utiliser l'URL
        formData.append('image', projectForm.image)
      }

      if (editingProject) {
        await adminApi.projects.update(editingProject.id, formData)
      } else {
        await adminApi.projects.create(formData)
      }

      setShowProjectForm(false)
      setEditingProject(null)
      setProjectForm({ title: '', category: 'web', description: '', image: '', tags: '', link: '' })
      setSelectedFile(null)
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(null)
      loadData()
    } catch (error: any) {
      console.error('Error saving project:', error)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        alert(`Erreur de validation:\n${errorMessages}`)
      } else {
        alert('Erreur lors de la sauvegarde du projet. Veuillez réessayer.')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Vérifier le type de fichier
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
      if (!validTypes.includes(file.type)) {
        alert('Type de fichier non supporté. Veuillez sélectionner une image (JPEG, PNG, GIF, WebP) ou une vidéo (MP4, WebM, MOV).')
        return
      }
      
      // Vérifier la taille (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale : 10MB.')
        return
      }

      setSelectedFile(file)
      
      // Créer une URL d'aperçu
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      // Réinitialiser le champ URL si un fichier est sélectionné
      setProjectForm({ ...projectForm, image: '' })
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectForm({
      title: project.title,
      category: project.category,
      description: project.description,
      image: project.image || '',
      tags: project.tags?.join(', ') || '',
      link: project.link || '',
    })
    setSelectedFile(null)
    setPreviewUrl(project.image || null)
    setShowProjectForm(true)
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    try {
      await adminApi.products.delete(id)
      loadData()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', productForm.name)
      formData.append('description', productForm.description)
      formData.append('price', productForm.price)
      formData.append('category', productForm.category)
      formData.append('stock', productForm.stock)
      if (productForm.rating) formData.append('rating', productForm.rating)
      
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
      
      // Upload de plusieurs images
      selectedProductFiles.forEach((file) => {
        formData.append('image_files[]', file) // Laravel recevra cela comme un tableau
      })
      
      // Images par URL
      if (productForm.images && productForm.images.length > 0) {
        productForm.images.forEach((imageUrl) => {
          if (imageUrl.trim()) {
            formData.append('images[]', imageUrl.trim())
          }
        })
      }
      
      // Rétrocompatibilité : image unique
      if (selectedProductFiles.length === 0 && productForm.images.length === 0) {
        if (productForm.image) {
        formData.append('image', productForm.image)
        }
      }

      if (editingProduct) {
        await adminApi.products.update(editingProduct.id, formData)
      } else {
        await adminApi.products.create(formData)
      }

      setShowProductForm(false)
      setEditingProduct(null)
      setProductForm({ name: '', description: '', price: '', category: 'hardware', rating: '', stock: '', image: '', images: [], discount_percentage: '', promotion_start_date: '', promotion_end_date: '', is_on_promotion: false })
      setSelectedProductFiles([])
      // Nettoyer les URLs blob
      previewProductUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
      }
      })
      setPreviewProductUrls([])
      loadData()
    } catch (error: any) {
      console.error('Error saving product:', error)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        alert(`Erreur de validation:\n${errorMessages}`)
      } else {
        alert('Erreur lors de la sauvegarde du produit. Veuillez réessayer.')
      }
    }
  }

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      alert('Certains fichiers ne sont pas supportés. Veuillez sélectionner uniquement des images (JPEG, PNG, GIF, WebP).')
        return
      }
      
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert('Certains fichiers sont trop volumineux. Taille maximale par fichier : 5MB.')
        return
      }

    const newFiles = [...selectedProductFiles, ...files]
    setSelectedProductFiles(newFiles)
    
    // Créer des aperçus pour les nouveaux fichiers
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewProductUrls([...previewProductUrls, ...newPreviewUrls])
    
    // Réinitialiser l'input
    e.target.value = ''
  }

  const handleRemoveProductFile = (index: number) => {
    const newFiles = selectedProductFiles.filter((_, i) => i !== index)
    setSelectedProductFiles(newFiles)
    
    // Nettoyer l'URL blob
    const urlToRemove = previewProductUrls[index]
    if (urlToRemove && urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove)
    }
    
    const newPreviewUrls = previewProductUrls.filter((_, i) => i !== index)
    setPreviewProductUrls(newPreviewUrls)
  }

  const handleRemoveProductImageUrl = (index: number) => {
    const newImages = productForm.images.filter((_, i) => i !== index)
    setProductForm({ ...productForm, images: newImages })
  }

  const handleAddProductImageUrl = () => {
    setProductForm({ ...productForm, images: [...productForm.images, ''] })
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    const productImages = product.images && product.images.length > 0 
      ? product.images 
      : (product.image ? [product.image] : [])
    
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      rating: product.rating?.toString() || '',
      stock: product.stock.toString(),
      image: product.image || '',
      images: productImages,
      discount_percentage: product.discount_percentage?.toString() || '',
      promotion_start_date: product.promotion_start_date ? new Date(product.promotion_start_date).toISOString().slice(0, 16) : '',
      promotion_end_date: product.promotion_end_date ? new Date(product.promotion_end_date).toISOString().slice(0, 16) : '',
      is_on_promotion: product.is_on_promotion || false,
    })
    setSelectedProductFiles([])
    setPreviewProductUrls(productImages)
    setShowProductForm(true)
  }

  const handleDeletePartner = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return
    try {
      await adminApi.partners.delete(id)
      loadData()
    } catch (error) {
      console.error('Error deleting partner:', error)
    }
  }

  const handleSubmitPartner = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', partnerForm.name)
      if (partnerForm.website) formData.append('website', partnerForm.website)
      formData.append('order', partnerForm.order)
      formData.append('is_active', partnerForm.is_active ? '1' : '0')
      
      if (selectedPartnerFile) {
        formData.append('logo', selectedPartnerFile)
      }

      if (editingPartner) {
        await adminApi.partners.update(editingPartner.id, formData)
      } else {
        await adminApi.partners.create(formData)
      }

      setShowPartnerForm(false)
      setEditingPartner(null)
      setPartnerForm({ name: '', website: '', order: '0', is_active: true })
      setSelectedPartnerFile(null)
      if (previewPartnerUrl && previewPartnerUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewPartnerUrl)
      }
      setPreviewPartnerUrl(null)
      loadData()
    } catch (error: any) {
      console.error('Error saving partner:', error)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        alert(`Erreur de validation:\n${errorMessages}`)
      } else {
        alert('Erreur lors de la sauvegarde du partenaire. Veuillez réessayer.')
      }
    }
  }

  const handlePartnerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      if (!validTypes.includes(file.type)) {
        alert('Type de fichier non supporté. Veuillez sélectionner une image (JPEG, PNG, GIF, WebP, SVG).')
        return
      }
      
      if (file.size > 2 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale : 2MB.')
        return
      }

      setSelectedPartnerFile(file)
      const url = URL.createObjectURL(file)
      setPreviewPartnerUrl(url)
    }
  }

  const handleRemovePartnerFile = () => {
    setSelectedPartnerFile(null)
    if (previewPartnerUrl) {
      URL.revokeObjectURL(previewPartnerUrl)
    }
    setPreviewPartnerUrl(null)
  }

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner)
    setPartnerForm({
      name: partner.name,
      website: partner.website || '',
      order: partner.order.toString(),
      is_active: partner.is_active,
    })
    setSelectedPartnerFile(null)
    setPreviewPartnerUrl(partner.logo || null)
    setShowPartnerForm(true)
  }

  const handleDeleteNews = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return
    try {
      await adminApi.news.delete(id)
      loadData()
    } catch (error) {
      console.error('Error deleting news:', error)
    }
  }

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', newsForm.title)
      if (newsForm.slug) formData.append('slug', newsForm.slug)
      formData.append('excerpt', newsForm.excerpt)
      formData.append('content', newsForm.content)
      formData.append('category', newsForm.category)
      if (newsForm.author) formData.append('author', newsForm.author)
      formData.append('read_time', newsForm.read_time)
      formData.append('is_published', newsForm.is_published ? '1' : '0')
      if (newsForm.published_at) formData.append('published_at', newsForm.published_at)
      formData.append('order', newsForm.order)
      
      if (selectedNewsFile) {
        formData.append('image_file', selectedNewsFile)
      } else if (newsForm.image) {
        formData.append('image', newsForm.image)
      }

      if (editingNews) {
        await adminApi.news.update(editingNews.id, formData)
      } else {
        await adminApi.news.create(formData)
      }

      setShowNewsForm(false)
      setEditingNews(null)
      setNewsForm({ 
        title: '', 
        slug: '', 
        excerpt: '', 
        content: '', 
        image: '', 
        category: 'Général', 
        author: '', 
        read_time: '5', 
        is_published: false, 
        published_at: '', 
        order: '0' 
      })
      setSelectedNewsFile(null)
      if (previewNewsUrl && previewNewsUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewNewsUrl)
      }
      setPreviewNewsUrl(null)
      loadData()
    } catch (error: any) {
      console.error('Error saving news:', error)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        alert(`Erreur de validation:\n${errorMessages}`)
      } else {
        alert('Erreur lors de la sauvegarde de l\'article. Veuillez réessayer.')
      }
    }
  }

  const handleNewsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        alert('Type de fichier non supporté. Veuillez sélectionner une image (JPEG, PNG, GIF, WebP).')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale : 5MB.')
        return
      }

      setSelectedNewsFile(file)
      const url = URL.createObjectURL(file)
      setPreviewNewsUrl(url)
      setNewsForm({ ...newsForm, image: '' })
    }
  }

  const handleRemoveNewsFile = () => {
    setSelectedNewsFile(null)
    if (previewNewsUrl) {
      URL.revokeObjectURL(previewNewsUrl)
    }
    setPreviewNewsUrl(null)
  }

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem)
    setNewsForm({
      title: newsItem.title,
      slug: newsItem.slug,
      excerpt: newsItem.excerpt,
      content: newsItem.content,
      image: newsItem.image || '',
      category: newsItem.category,
      author: newsItem.author || '',
      read_time: newsItem.read_time.toString(),
      is_published: newsItem.is_published,
      published_at: newsItem.published_at ? new Date(newsItem.published_at).toISOString().slice(0, 16) : '',
      order: newsItem.order.toString(),
    })
    setSelectedNewsFile(null)
    setPreviewNewsUrl(newsItem.image || null)
    setShowNewsForm(true)
  }

  const handleDeleteTeamMember = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre de l\'équipe ?')) return
    try {
      await adminApi.team.delete(id)
      loadData()
    } catch (error) {
      console.error('Error deleting team member:', error)
    }
  }

  const handleSubmitTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', teamForm.name)
      formData.append('role', teamForm.role)
      formData.append('bio', teamForm.bio)
      if (teamForm.email) formData.append('email', teamForm.email)
      if (teamForm.linkedin) formData.append('linkedin', teamForm.linkedin)
      if (teamForm.github) formData.append('github', teamForm.github)
      if (teamForm.twitter) formData.append('twitter', teamForm.twitter)
      if (teamForm.website) formData.append('website', teamForm.website)
      formData.append('order', teamForm.order)
      formData.append('is_active', teamForm.is_active ? '1' : '0')
      
      if (selectedTeamFile) {
        formData.append('image_file', selectedTeamFile)
      } else if (teamForm.image) {
        formData.append('image', teamForm.image)
      }

      if (editingTeamMember) {
        await adminApi.team.update(editingTeamMember.id, formData)
      } else {
        await adminApi.team.create(formData)
      }

      setShowTeamForm(false)
      setEditingTeamMember(null)
      setTeamForm({ 
        name: '', 
        role: '', 
        bio: '', 
        image: '', 
        email: '', 
        linkedin: '', 
        github: '', 
        twitter: '', 
        website: '', 
        order: '0', 
        is_active: true 
      })
      setSelectedTeamFile(null)
      if (previewTeamUrl && previewTeamUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewTeamUrl)
      }
      setPreviewTeamUrl(null)
      loadData()
    } catch (error: any) {
      console.error('Error saving team member:', error)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        alert(`Erreur de validation:\n${errorMessages}`)
      } else {
        alert('Erreur lors de la sauvegarde du membre de l\'équipe. Veuillez réessayer.')
      }
    }
  }

  const handleTeamFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        alert('Type de fichier non supporté. Veuillez sélectionner une image (JPEG, PNG, GIF, WebP).')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale : 5MB.')
        return
      }

      setSelectedTeamFile(file)
      const url = URL.createObjectURL(file)
      setPreviewTeamUrl(url)
      setTeamForm({ ...teamForm, image: '' })
    }
  }

  const handleRemoveTeamFile = () => {
    setSelectedTeamFile(null)
    if (previewTeamUrl) {
      URL.revokeObjectURL(previewTeamUrl)
    }
    setPreviewTeamUrl(null)
  }

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member)
    setTeamForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image || '',
      email: member.email || '',
      linkedin: member.linkedin || '',
      github: member.github || '',
      twitter: member.twitter || '',
      website: member.website || '',
      order: member.order.toString(),
      is_active: member.is_active,
    })
    setSelectedTeamFile(null)
    setPreviewTeamUrl(member.image || null)
    setShowTeamForm(true)
  }

  const handleDeleteCertification = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette certification ?')) return
    try {
      await adminApi.certifications.delete(id)
      loadData()
    } catch (error) {
      console.error('Error deleting certification:', error)
    }
  }

  const handleSubmitCertification = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', certificationForm.name)
      formData.append('description', certificationForm.description)
      formData.append('icon_type', certificationForm.icon_type)
      formData.append('color', certificationForm.color)
      if (certificationForm.issuer) formData.append('issuer', certificationForm.issuer)
      if (certificationForm.issued_date) formData.append('issued_date', certificationForm.issued_date)
      if (certificationForm.expiry_date) formData.append('expiry_date', certificationForm.expiry_date)
      if (certificationForm.certificate_url) formData.append('certificate_url', certificationForm.certificate_url)
      formData.append('order', certificationForm.order)
      formData.append('is_active', certificationForm.is_active ? '1' : '0')
      
      if (selectedCertificationFile) {
        formData.append('image_file', selectedCertificationFile)
      } else if (certificationForm.image) {
        formData.append('image', certificationForm.image)
      }

      if (editingCertification) {
        await adminApi.certifications.update(editingCertification.id, formData)
      } else {
        await adminApi.certifications.create(formData)
      }

      setShowCertificationForm(false)
      setEditingCertification(null)
      setCertificationForm({ 
        name: '', 
        description: '', 
        image: '', 
        icon_type: 'award', 
        color: 'from-blue-500 to-blue-600', 
        issuer: '', 
        issued_date: '', 
        expiry_date: '', 
        certificate_url: '', 
        order: '0', 
        is_active: true 
      })
      setSelectedCertificationFile(null)
      if (previewCertificationUrl && previewCertificationUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewCertificationUrl)
      }
      setPreviewCertificationUrl(null)
      loadData()
    } catch (error: any) {
      console.error('Error saving certification:', error)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        alert(`Erreur de validation:\n${errorMessages}`)
      } else {
        alert('Erreur lors de la sauvegarde de la certification. Veuillez réessayer.')
      }
    }
  }

  const handleCertificationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      if (!validTypes.includes(file.type)) {
        alert('Type de fichier non supporté. Veuillez sélectionner une image (JPEG, PNG, GIF, WebP, SVG).')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale : 5MB.')
        return
      }

      setSelectedCertificationFile(file)
      const url = URL.createObjectURL(file)
      setPreviewCertificationUrl(url)
      setCertificationForm({ ...certificationForm, image: '' })
    }
  }

  const handleRemoveCertificationFile = () => {
    setSelectedCertificationFile(null)
    if (previewCertificationUrl) {
      URL.revokeObjectURL(previewCertificationUrl)
    }
    setPreviewCertificationUrl(null)
  }

  const handleEditCertification = (certification: Certification) => {
    setEditingCertification(certification)
    setCertificationForm({
      name: certification.name,
      description: certification.description,
      image: certification.image || '',
      icon_type: certification.icon_type,
      color: certification.color,
      issuer: certification.issuer || '',
      issued_date: certification.issued_date ? certification.issued_date.split('T')[0] : '',
      expiry_date: certification.expiry_date ? certification.expiry_date.split('T')[0] : '',
      certificate_url: certification.certificate_url || '',
      order: certification.order.toString(),
      is_active: certification.is_active,
    })
    setSelectedCertificationFile(null)
    setPreviewCertificationUrl(certification.image || null)
    setShowCertificationForm(true)
  }

  const handleDeleteAward = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette récompense ?')) return
    try {
      await adminApi.awards.delete(id)
      loadData()
    } catch (error) {
      console.error('Error deleting award:', error)
    }
  }

  const handleSubmitAward = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', awardForm.title)
      formData.append('organization', awardForm.organization)
      formData.append('year', awardForm.year)
      formData.append('description', awardForm.description)
      formData.append('icon_type', awardForm.icon_type)
      formData.append('color', awardForm.color)
      if (awardForm.award_url) formData.append('award_url', awardForm.award_url)
      formData.append('order', awardForm.order)
      formData.append('is_active', awardForm.is_active ? '1' : '0')
      
      if (selectedAwardFile) {
        formData.append('image_file', selectedAwardFile)
      } else if (awardForm.image) {
        formData.append('image', awardForm.image)
      }

      if (editingAward) {
        await adminApi.awards.update(editingAward.id, formData)
      } else {
        await adminApi.awards.create(formData)
      }

      setShowAwardForm(false)
      setEditingAward(null)
      setAwardForm({ 
        title: '', 
        organization: '', 
        year: new Date().getFullYear().toString(), 
        description: '', 
        image: '', 
        icon_type: 'trophy', 
        color: 'from-yellow-500 to-orange-500', 
        award_url: '', 
        order: '0', 
        is_active: true 
      })
      setSelectedAwardFile(null)
      if (previewAwardUrl && previewAwardUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewAwardUrl)
      }
      setPreviewAwardUrl(null)
      loadData()
    } catch (error: any) {
      console.error('Error saving award:', error)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        alert(`Erreur de validation:\n${errorMessages}`)
      } else {
        alert('Erreur lors de la sauvegarde de la récompense. Veuillez réessayer.')
      }
    }
  }

  const handleAwardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      if (!validTypes.includes(file.type)) {
        alert('Type de fichier non supporté. Veuillez sélectionner une image (JPEG, PNG, GIF, WebP, SVG).')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale : 5MB.')
        return
      }

      setSelectedAwardFile(file)
      const url = URL.createObjectURL(file)
      setPreviewAwardUrl(url)
      setAwardForm({ ...awardForm, image: '' })
    }
  }

  const handleRemoveAwardFile = () => {
    setSelectedAwardFile(null)
    if (previewAwardUrl) {
      URL.revokeObjectURL(previewAwardUrl)
    }
    setPreviewAwardUrl(null)
  }

  const handleEditAward = (award: Award) => {
    setEditingAward(award)
    setAwardForm({
      title: award.title,
      organization: award.organization,
      year: award.year.toString(),
      description: award.description,
      image: award.image || '',
      icon_type: award.icon_type,
      color: award.color,
      award_url: award.award_url || '',
      order: award.order.toString(),
      is_active: award.is_active,
    })
    setSelectedAwardFile(null)
    setPreviewAwardUrl(award.image || null)
    setShowAwardForm(true)
  }

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video)
    setVideoForm({
      title: video.title,
      description: video.description || '',
      video_type: video.video_type,
      video_url: video.video_url || '',
      thumbnail: video.thumbnail || '',
      order: video.order.toString(),
      is_active: video.is_active,
      is_featured: video.is_featured,
    })
    setSelectedVideoFile(null)
    setSelectedVideoThumbnailFile(null)
    setPreviewVideoThumbnailUrl(video.thumbnail || null)
    setShowVideoForm(true)
  }

  const handleDeleteVideo = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return
    try {
      await adminApi.videos.delete(id)
      loadData()
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  }

  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', videoForm.title)
      if (videoForm.description) formData.append('description', videoForm.description)
      formData.append('video_type', videoForm.video_type)
      if (videoForm.video_url) formData.append('video_url', videoForm.video_url)
      if (videoForm.thumbnail && !selectedVideoThumbnailFile) formData.append('thumbnail', videoForm.thumbnail)
      formData.append('order', videoForm.order)
      formData.append('is_active', videoForm.is_active ? '1' : '0')
      formData.append('is_featured', videoForm.is_featured ? '1' : '0')
      
      if (selectedVideoFile) {
        formData.append('video_file', selectedVideoFile)
      }
      
      if (selectedVideoThumbnailFile) {
        formData.append('thumbnail_file', selectedVideoThumbnailFile)
      }

      if (editingVideo) {
        await adminApi.videos.update(editingVideo.id, formData)
      } else {
        await adminApi.videos.create(formData)
      }

      setShowVideoForm(false)
      setEditingVideo(null)
      setVideoForm({ 
        title: '', 
        description: '', 
        video_type: 'youtube', 
        video_url: '', 
        thumbnail: '', 
        order: '0', 
        is_active: true, 
        is_featured: false 
      })
      setSelectedVideoFile(null)
      setSelectedVideoThumbnailFile(null)
      if (previewVideoThumbnailUrl && previewVideoThumbnailUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewVideoThumbnailUrl)
      }
      setPreviewVideoThumbnailUrl(null)
      loadData()
    } catch (error: any) {
      console.error('Error saving video:', error)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        alert(`Erreur de validation:\n${errorMessages}`)
      } else {
        alert('Erreur lors de la sauvegarde de la vidéo. Veuillez réessayer.')
      }
    }
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['video/mp4', 'video/webm', 'video/quicktime']
      if (!validTypes.includes(file.type)) {
        alert('Type de fichier non supporté. Veuillez sélectionner une vidéo (MP4, WebM, QuickTime).')
        return
      }
      
      if (file.size > 100 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale : 100MB.')
        return
      }

      setSelectedVideoFile(file)
    }
  }

  const handleVideoThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        alert('Type de fichier non supporté. Veuillez sélectionner une image (JPEG, PNG, GIF, WebP).')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale : 5MB.')
        return
      }

      setSelectedVideoThumbnailFile(file)
      const url = URL.createObjectURL(file)
      setPreviewVideoThumbnailUrl(url)
      setVideoForm({ ...videoForm, thumbnail: '' })
    }
  }

  const handleRemoveVideoThumbnailFile = () => {
    setSelectedVideoThumbnailFile(null)
    if (previewVideoThumbnailUrl) {
      URL.revokeObjectURL(previewVideoThumbnailUrl)
    }
    setPreviewVideoThumbnailUrl(null)
  }

  const handleEditSocialLink = (socialLink: SocialLink) => {
    setEditingSocialLink(socialLink)
    setSocialLinkForm({
      platform: socialLink.platform,
      name: socialLink.name,
      url: socialLink.url,
      icon_type: socialLink.icon_type,
      color_gradient: socialLink.color_gradient || '',
      followers: socialLink.followers || '',
      order: socialLink.order.toString(),
      is_active: socialLink.is_active,
    })
    setShowSocialLinkForm(true)
  }

  const handleDeleteSocialLink = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lien social ?')) return
    try {
      await adminApi.socialLinks.delete(id)
      loadData()
    } catch (error) {
      console.error('Error deleting social link:', error)
    }
  }

  const handleSubmitSocialLink = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        platform: socialLinkForm.platform,
        name: socialLinkForm.name,
        url: socialLinkForm.url,
        icon_type: socialLinkForm.icon_type,
        color_gradient: socialLinkForm.color_gradient || null,
        followers: socialLinkForm.followers || null,
        order: parseInt(socialLinkForm.order),
        is_active: socialLinkForm.is_active,
      }

      if (editingSocialLink) {
        await adminApi.socialLinks.update(editingSocialLink.id, data)
      } else {
        await adminApi.socialLinks.create(data)
      }

      setShowSocialLinkForm(false)
      setEditingSocialLink(null)
      setSocialLinkForm({ 
        platform: 'facebook', 
        name: '', 
        url: '', 
        icon_type: 'lucide', 
        color_gradient: '', 
        followers: '', 
        order: '0', 
        is_active: true 
      })
      loadData()
    } catch (error: any) {
      console.error('Error saving social link:', error)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors)
          .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        alert(`Erreur de validation:\n${errorMessages}`)
      } else {
        alert('Erreur lors de la sauvegarde du lien social. Veuillez réessayer.')
      }
    }
  }

  const handleSelectConversation = async (conversation: ChatConversation) => {
    try {
      const response = await adminApi.chat.getConversation(conversation.id)
      if (response.data.success) {
        setSelectedConversation(response.data.data)
        // Marquer comme lu
        await adminApi.chat.markAsRead(conversation.id)
        // Recharger les conversations pour mettre à jour les statuts
        loadData()
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  // Filtrer les messages de contact selon les critères
  // Fonction pour formater le temps relatif
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Il y a quelques secondes'
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`
    }
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const filteredContactMessages = useMemo(() => {
    let filtered = contactMessages.filter((msg) => {
      // Filtre par statut
      if (contactMessageFilter === 'unread' && msg.is_read) return false
      if (contactMessageFilter === 'replied' && !msg.is_replied) return false
      if (contactMessageFilter === 'unreplied' && msg.is_replied) return false
      
      // Recherche
      if (contactMessageSearch.trim()) {
        const searchLower = contactMessageSearch.toLowerCase()
        return (
          msg.name.toLowerCase().includes(searchLower) ||
          msg.email.toLowerCase().includes(searchLower) ||
          (msg.subject && msg.subject.toLowerCase().includes(searchLower)) ||
          msg.message.toLowerCase().includes(searchLower) ||
          (msg.phone && msg.phone.includes(searchLower))
        )
      }
      
      return true
    })

    // Tri
    filtered = [...filtered].sort((a, b) => {
      if (contactMessageSort === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (contactMessageSort === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      } else if (contactMessageSort === 'name') {
        return a.name.localeCompare(b.name, 'fr')
      }
      return 0
    })

    return filtered
  }, [contactMessages, contactMessageFilter, contactMessageSearch, contactMessageSort])

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim() || !selectedConversation) return

    setIsSendingMessage(true)
    try {
      await adminApi.chat.replyToConversation(selectedConversation.id, chatMessage)
      setChatMessage('')
      // Recharger la conversation
      await handleSelectConversation(selectedConversation)
      // Recharger la liste des conversations
      const response = await adminApi.chat.getAllConversations()
      setConversations(response.data.data || [])
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Erreur lors de l\'envoi du message')
    } finally {
      setIsSendingMessage(false)
    }
  }

  // Polling pour les nouvelles conversations et messages
  useEffect(() => {
    if (activeTab === 'chat' && isAuthenticated) {
      let consecutiveErrors = 0
      const interval = setInterval(async () => {
        // Recharger la liste des conversations
        try {
          const response = await adminApi.chat.getAllConversations()
          setConversations(response.data.data || [])
          consecutiveErrors = 0 // Réinitialiser le compteur d'erreurs en cas de succès
          
          // Recharger la conversation sélectionnée si elle existe
          if (selectedConversation) {
            const convResponse = await adminApi.chat.getConversation(selectedConversation.id)
            if (convResponse.data.success) {
              setSelectedConversation(convResponse.data.data)
            }
          }
        } catch (error: any) {
          console.error('Error refreshing chat:', error)
          consecutiveErrors++
          
          // Si erreur 429 (Too Many Requests), arrêter le polling temporairement
          if (error.response?.status === 429 || consecutiveErrors >= 3) {
            console.warn('Too many requests or multiple errors. Polling paused.')
            clearInterval(interval)
          }
        }
      }, 30000) // Vérifier toutes les 30 secondes (au lieu de 5)

      return () => clearInterval(interval)
    }
  }, [activeTab, isAuthenticated, selectedConversation?.id])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const menuItems = [
    {
      category: 'Communication',
      items: [
        { id: 'chat', label: 'Chat', icon: MessageCircle, count: conversations.length, badge: conversations.some((c: any) => (c.unread_count || 0) > 0) },
        { id: 'contactMessages', label: 'Messages', icon: Mail, count: contactMessages.length, badge: contactMessages.filter((m: ContactMessage) => !m.is_read).length > 0 },
        { id: 'testimonials', label: 'Témoignages', icon: MessageSquare, count: testimonials.length },
      ],
    },
    {
      category: 'Contenu',
      items: [
        { id: 'news', label: 'Actualités', icon: Newspaper, count: news.length },
        { id: 'videos', label: 'Vidéos', icon: Video, count: videos.length },
      ],
    },
    {
      category: 'Projets',
      items: [
        { id: 'projects', label: 'Projets', icon: FolderKanban, count: projects.length },
        { id: 'products', label: 'Produits', icon: ShoppingBag, count: products.length },
      ],
    },
    {
      category: 'Équipe',
      items: [
        { id: 'team', label: 'Équipe', icon: Users, count: teamMembers.length },
        { id: 'partners', label: 'Partenaires', icon: Building2, count: partners.length },
      ],
    },
    {
      category: 'Récompenses',
      items: [
        { id: 'certifications', label: 'Certifications', icon: Award, count: certifications.length },
        { id: 'awards', label: 'Récompenses', icon: Trophy, count: awards.length },
      ],
    },
    {
      category: 'Réseaux',
      items: [
        { id: 'socialLinks', label: 'Réseaux sociaux', icon: Share2, count: socialLinks.length },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-dark-600 [data-theme='light']:bg-gray-50">
      {/* Navbar Admin */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-dark-700/95 [data-theme='light']:bg-white/95 backdrop-blur-xl border-b border-primary-500/20 z-50 flex items-center px-4 lg:px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg glass-effect border border-primary-500/20 hover:border-primary-500/40 transition-colors lg:hidden"
            >
              {sidebarOpen ? <XIcon className="w-5 h-5 text-white [data-theme='light']:text-dark-500" /> : <Menu className="w-5 h-5 text-white [data-theme='light']:text-dark-500" />}
            </button>
            <div>
              <h1 className="text-xl font-display font-bold text-white [data-theme='light']:text-dark-500">
                Dashboard Admin
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white [data-theme='light']:text-dark-500">
                {user?.name}
              </p>
              <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg glass-effect border border-primary-500/20 hover:border-primary-500/40 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5 text-white [data-theme='light']:text-dark-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed lg:sticky left-0 top-16 h-[calc(100vh-4rem)] bg-dark-700/95 [data-theme='light']:bg-white border-r border-primary-500/20 transition-all duration-300 overflow-hidden z-40 lg:w-64 lg:top-16`}>
          <div className="h-full overflow-y-auto p-4">

          {/* Navigation Menu */}
          <nav className="space-y-6">
            {menuItems.map((category) => (
              <div key={category.category}>
                <h3 className="text-xs font-semibold text-secondary-400 [data-theme='light']:text-secondary-600 mb-2 uppercase tracking-wider px-2">
                  {category.category}
                </h3>
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any)
                          setShowMetrics(false)
                          if (item.id === 'chat') {
                            setSelectedConversation(null)
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                          activeTab === item.id
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                            : 'text-secondary-400 [data-theme="light"]:text-secondary-600 hover:bg-primary-500/10 hover:text-primary-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                          )}
                          <span className="text-xs bg-secondary-700 [data-theme='light']:bg-secondary-200 px-2 py-0.5 rounded">
                            {item.count}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
          <div className="w-full px-4 sm:px-6 lg:px-6 py-4 flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary-500/30 scrollbar-track-transparent hover:scrollbar-thumb-primary-500/50">

          {/* Metrics Cards - Masquées quand un onglet est sélectionné */}
          {showMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl glass-effect border border-primary-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                {metrics.unreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {metrics.unreadMessages} non lus
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white [data-theme='light']:text-dark-500 mb-1">
                {metrics.totalConversations}
              </h3>
              <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                Conversations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl glass-effect border border-primary-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                {metrics.pendingTestimonials > 0 && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    {metrics.pendingTestimonials} en attente
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white [data-theme='light']:text-dark-500 mb-1">
                {metrics.totalTestimonials}
              </h3>
              <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                Témoignages
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl glass-effect border border-primary-500/20"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-2">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white [data-theme='light']:text-dark-500 mb-1">
                {metrics.publishedNews} / {metrics.totalNews}
              </h3>
              <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                Actualités publiées
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl glass-effect border border-primary-500/20"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-2">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white [data-theme='light']:text-dark-500 mb-1">
                {metrics.totalProjects}
              </h3>
              <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                Projets
              </p>
            </motion.div>
          </div>
          )}

          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white [data-theme='light']:text-dark-500 capitalize">
              {activeTab === 'testimonials' && 'Témoignages'}
              {activeTab === 'projects' && 'Projets'}
              {activeTab === 'products' && 'Produits'}
              {activeTab === 'partners' && 'Partenaires'}
              {activeTab === 'news' && 'Actualités'}
              {activeTab === 'team' && 'Équipe'}
              {activeTab === 'certifications' && 'Certifications'}
              {activeTab === 'awards' && 'Récompenses'}
              {activeTab === 'videos' && 'Vidéos'}
              {activeTab === 'socialLinks' && 'Réseaux sociaux'}
              {activeTab === 'chat' && 'Chat'}
              {activeTab === 'contactMessages' && 'Messages de Contact'}
            </h2>
          </div>

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
                Aucun témoignage pour le moment
              </div>
            ) : (
              testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-xl glass-effect"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div>
                          <p className="font-semibold text-white [data-theme='light']:text-dark-500">
                            {testimonial.name}
                          </p>
                          {testimonial.role && (
                            <p className="text-sm text-secondary-500 [data-theme='light']:text-secondary-600">
                              {testimonial.role}
                            </p>
                          )}
                        </div>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500" />
                          ))}
                        </div>
                        {testimonial.is_approved ? (
                          <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-medium flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Approuvé</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-medium flex items-center space-x-1">
                            <EyeOff className="w-3 h-3" />
                            <span>En attente</span>
                          </span>
                        )}
                      </div>
                      <p className="text-secondary-300 [data-theme='light']:text-secondary-700 italic mb-2">
                        "{testimonial.content}"
                      </p>
                      <p className="text-xs text-secondary-500 [data-theme='light']:text-secondary-600">
                        {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {!testimonial.is_approved && (
                        <button
                          onClick={() => handleApproveTestimonial(testimonial.id)}
                          className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                          title="Approuver"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {testimonial.is_approved && (
                        <button
                          onClick={() => handleRejectTestimonial(testimonial.id)}
                          className="p-2 rounded-lg bg-accent-500/20 text-accent-400 hover:bg-accent-500/30 transition-colors"
                          title="Rejeter"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                        className="p-2 rounded-lg bg-primary-700/20 text-primary-400 hover:bg-primary-700/30 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setEditingProject(null)
                  setProjectForm({ title: '', category: 'web', description: '', image: '', tags: '', link: '' })
                  setSelectedFile(null)
                  if (previewUrl && previewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewUrl)
                  }
                  setPreviewUrl(null)
                  setShowProjectForm(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter un projet</span>
              </button>
            </div>

            {showProjectForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 rounded-xl glass-effect"
              >
                <h3 className="text-xl font-bold mb-4 text-white [data-theme='light']:text-dark-500">
                  {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
                </h3>
                <form onSubmit={handleSubmitProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Titre *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Catégorie *
                      </label>
                      <select
                        required
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="web">Web</option>
                        <option value="mobile">Mobile</option>
                        <option value="design">Design</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500 resize-none"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Image / Vidéo
                    </label>
                    <div className="space-y-4">
                      {/* Upload de fichier */}
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          [data-theme='dark']:border-secondary-600 [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:hover:bg-secondary-800
                          [data-theme='light']:border-secondary-300 [data-theme='light']:bg-secondary-50 [data-theme='light']:hover:bg-secondary-100
                          transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {selectedFile ? (
                              <div className="flex items-center space-x-2 text-primary-400">
                                {selectedFile.type.startsWith('image/') ? (
                                  <ImageIcon className="w-8 h-8" />
                                ) : (
                                  <Video className="w-8 h-8" />
                                )}
                                <span className="text-sm font-medium">{selectedFile.name}</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mb-2 text-secondary-400" />
                                <p className="mb-2 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-500">
                                  Image (JPEG, PNG, GIF, WebP) ou Vidéo (MP4, WebM, MOV) - Max 10MB
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
                            onChange={handleFileChange}
                            disabled={!!selectedFile}
                          />
                        </label>
                        {selectedFile && (
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="mt-2 text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Supprimer le fichier</span>
                          </button>
                        )}
                      </div>

                      {/* Aperçu */}
                      {previewUrl && (
                        <div className="relative rounded-lg overflow-hidden border
                          [data-theme='dark']:border-secondary-700
                          [data-theme='light']:border-secondary-300">
                          {selectedFile?.type.startsWith('image/') || (!selectedFile && previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ? (
                            <img
                              src={previewUrl}
                              alt="Aperçu"
                              className="w-full h-64 object-cover"
                            />
                          ) : (
                            <video
                              src={previewUrl}
                              controls
                              className="w-full h-64 object-cover"
                            />
                          )}
                        </div>
                      )}

                      {/* Alternative : URL */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t [data-theme='dark']:border-secondary-700 [data-theme='light']:border-secondary-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 [data-theme='dark']:bg-secondary-900 [data-theme='dark']:text-secondary-400 [data-theme='light']:bg-white [data-theme='light']:text-secondary-500">
                            OU
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                          URL de l'image / vidéo
                        </label>
                        <input
                          type="url"
                          value={projectForm.image}
                          onChange={(e) => {
                            setProjectForm({ ...projectForm, image: e.target.value })
                            if (e.target.value && !selectedFile) {
                              setPreviewUrl(e.target.value)
                            }
                          }}
                          placeholder="https://example.com/image.jpg"
                          disabled={!!selectedFile}
                          className="w-full px-4 py-2 rounded-lg 
                            [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                            [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                            [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                            border focus:outline-none focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Lien du projet
                    </label>
                    <input
                      type="url"
                      value={projectForm.link}
                      onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={projectForm.tags}
                      onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                      placeholder="React, Laravel, TypeScript"
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      {editingProject ? 'Modifier' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProjectForm(false)
                        setEditingProject(null)
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
                Aucun projet pour le moment
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl glass-effect"
                  >
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold mb-2 text-white [data-theme='light']:text-dark-500">
                      {project.title}
                    </h3>
                    <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 mb-2">
                      {project.category}
                    </p>
                    <p className="text-secondary-300 [data-theme='light']:text-secondary-700 mb-4 text-sm">
                      {project.description}
                    </p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded bg-primary-500/20 text-primary-400 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="px-4 py-2 rounded-lg bg-primary-700/20 text-primary-400 hover:bg-primary-700/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              {/* Search and Filters */}
              <div className="flex-1 w-full md:w-auto">
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg 
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

                  {/* Category Filter */}
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg 
                      [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                      [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                      border focus:outline-none focus:border-primary-500"
                    style={{
                      color: isDark ? '#ffffff' : '#111827',
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      borderColor: isDark ? '#374151' : '#d1d5db',
                    }}
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="hardware">Matériel</option>
                    <option value="software">Logiciels</option>
                    <option value="accessories">Accessoires</option>
                    <option value="services">Services</option>
                  </select>

                  {/* Stock Filter */}
                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg 
                      [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                      [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                      border focus:outline-none focus:border-primary-500"
                    style={{
                      color: isDark ? '#ffffff' : '#111827',
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      borderColor: isDark ? '#374151' : '#d1d5db',
                    }}
                  >
                    <option value="all">Tous les stocks</option>
                    <option value="out">Rupture (0)</option>
                    <option value="low">Faible (≤1)</option>
                    <option value="warning">Attention (≤5)</option>
                    <option value="ok">Normal (&gt;5)</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={productSort}
                    onChange={(e) => setProductSort(e.target.value as 'name' | 'price' | 'stock' | 'date')}
                    className="px-4 py-2 rounded-lg 
                      [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                      [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                      border focus:outline-none focus:border-primary-500"
                    style={{
                      color: isDark ? '#ffffff' : '#111827',
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      borderColor: isDark ? '#374151' : '#d1d5db',
                    }}
                  >
                    <option value="date">Plus récent</option>
                    <option value="name">Nom (A-Z)</option>
                    <option value="price">Prix</option>
                    <option value="stock">Stock</option>
                  </select>
                </div>
              </div>

              {/* Add Product Button */}
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setProductForm({ name: '', description: '', price: '', category: 'hardware', rating: '', stock: '', image: '', images: [], discount_percentage: '', promotion_start_date: '', promotion_end_date: '', is_on_promotion: false })
                  setSelectedProductFiles([])
                  previewProductUrls.forEach((url) => {
                    if (url.startsWith('blob:')) {
                      URL.revokeObjectURL(url)
                  }
                  })
                  setPreviewProductUrls([])
                  setShowProductForm(true)
                }}
                className="btn-primary flex items-center space-x-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter un produit</span>
              </button>
            </div>

            {showProductForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 rounded-xl glass-effect"
              >
                <h3 className="text-xl font-bold mb-4 text-white [data-theme='light']:text-dark-500">
                  {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                </h3>
                <form onSubmit={handleSubmitProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
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
                        Catégorie *
                      </label>
                      <select
                        required
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="hardware">Matériel</option>
                        <option value="software">Logiciels</option>
                        <option value="accessories">Accessoires</option>
                        <option value="services">Services</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500 resize-none"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Prix (XOF) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
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
                        Stock *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
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
                        Note (0-5)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={productForm.rating}
                        onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
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
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Images du produit (plusieurs images possibles)
                    </label>
                    <div className="space-y-4">
                      {/* Upload de fichiers multiples */}
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          [data-theme='dark']:border-secondary-600 [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:hover:bg-secondary-800
                          [data-theme='light']:border-secondary-300 [data-theme='light']:bg-secondary-50 [data-theme='light']:hover:bg-secondary-100
                          transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-2 text-secondary-400" />
                                <p className="mb-2 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-500">
                              Images (JPEG, PNG, GIF, WebP) - Max 5MB par fichier
                                </p>
                            <p className="text-xs text-primary-400 mt-1">
                              Vous pouvez sélectionner plusieurs fichiers à la fois
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleProductFileChange}
                            multiple
                          />
                        </label>
                      </div>

                      {/* Aperçus des fichiers uploadés */}
                      {selectedProductFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700">
                            Fichiers sélectionnés ({selectedProductFiles.length})
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {selectedProductFiles.map((file, index) => (
                              <div key={index} className="relative group">
                                <div className="relative rounded-lg overflow-hidden border
                                  [data-theme='dark']:border-secondary-700
                                  [data-theme='light']:border-secondary-300">
                                  <img
                                    src={previewProductUrls[index]}
                                    alt={`Aperçu ${index + 1}`}
                                    className="w-full h-32 object-cover"
                                  />
                          <button
                            type="button"
                                    onClick={() => handleRemoveProductFile(index)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                                    <X className="w-4 h-4 text-white" />
                          </button>
                      </div>
                                <p className="text-xs text-secondary-400 mt-1 truncate" title={file.name}>
                                  {file.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Aperçus des images existantes (en mode édition) */}
                      {editingProduct && previewProductUrls.length > 0 && selectedProductFiles.length === 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700">
                            Images actuelles ({previewProductUrls.length})
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {previewProductUrls.map((url, index) => (
                              <div key={index} className="relative group">
                        <div className="relative rounded-lg overflow-hidden border
                          [data-theme='dark']:border-secondary-700
                          [data-theme='light']:border-secondary-300">
                          <img
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-32 object-cover"
                          />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t [data-theme='dark']:border-secondary-700 [data-theme='light']:border-secondary-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 [data-theme='dark']:bg-secondary-900 [data-theme='dark']:text-secondary-400 [data-theme='light']:bg-white [data-theme='light']:text-secondary-500">
                            OU
                          </span>
                        </div>
                      </div>

                      {/* URLs d'images */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700">
                            URLs d'images
                        </label>
                          <button
                            type="button"
                            onClick={handleAddProductImageUrl}
                            className="text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Ajouter une URL</span>
                          </button>
                        </div>
                        <div className="space-y-2">
                          {productForm.images.map((imageUrl, index) => (
                            <div key={index} className="flex gap-2">
                        <input
                          type="url"
                                value={imageUrl}
                          onChange={(e) => {
                                  const newImages = [...productForm.images]
                                  newImages[index] = e.target.value
                                  setProductForm({ ...productForm, images: newImages })
                          }}
                          placeholder="https://example.com/image.jpg"
                                className="flex-1 px-4 py-2 rounded-lg 
                            [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                            [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                                  border focus:outline-none focus:border-primary-500"
                          style={{
                            color: isDark ? '#ffffff' : '#111827',
                            WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            borderColor: isDark ? '#374151' : '#d1d5db',
                          }}
                        />
                              <button
                                type="button"
                                onClick={() => handleRemoveProductImageUrl(index)}
                                className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {productForm.images.length === 0 && (
                            <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-500 italic">
                              Aucune URL d'image. Cliquez sur "Ajouter une URL" pour en ajouter.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      {editingProduct ? 'Modifier' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false)
                        setEditingProduct(null)
                        setProductForm({ name: '', description: '', price: '', category: 'hardware', rating: '', stock: '', image: '', images: [], discount_percentage: '', promotion_start_date: '', promotion_end_date: '', is_on_promotion: false })
                        setSelectedProductFiles([])
                        previewProductUrls.forEach((url) => {
                          if (url.startsWith('blob:')) {
                            URL.revokeObjectURL(url)
                          }
                        })
                        setPreviewProductUrls([])
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (() => {
              // Filtrer et trier les produits
              let filteredProducts = [...products]

              // Filtre par recherche
              if (productSearch) {
                const searchLower = productSearch.toLowerCase()
                filteredProducts = filteredProducts.filter(product =>
                  product.name.toLowerCase().includes(searchLower) ||
                  product.description.toLowerCase().includes(searchLower) ||
                  product.category.toLowerCase().includes(searchLower)
                )
              }

              // Filtre par catégorie
              if (productCategoryFilter !== 'all') {
                filteredProducts = filteredProducts.filter(product =>
                  product.category === productCategoryFilter
                )
              }

              // Filtre par stock
              if (productStockFilter !== 'all') {
                filteredProducts = filteredProducts.filter(product => {
                  switch (productStockFilter) {
                    case 'out':
                      return product.stock === 0
                    case 'low':
                      return product.stock > 0 && product.stock <= 1
                    case 'warning':
                      return product.stock > 1 && product.stock <= 5
                    case 'ok':
                      return product.stock > 5
                    default:
                      return true
                  }
                })
              }

              // Trier les produits
              filteredProducts.sort((a, b) => {
                switch (productSort) {
                  case 'name':
                    return a.name.localeCompare(b.name)
                  case 'price':
                    return a.price - b.price
                  case 'stock':
                    return a.stock - b.stock
                  case 'date':
                  default:
                    return new Date(b.created_at || b.updated_at || 0).getTime() - new Date(a.created_at || a.updated_at || 0).getTime()
                }
              })

              if (products.length === 0) {
                return (
                  <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
                    Aucun produit pour le moment
                  </div>
                )
              }

              if (filteredProducts.length === 0) {
                return (
                  <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
                    Aucun produit ne correspond à vos critères de recherche
                    {(productSearch || productCategoryFilter !== 'all' || productStockFilter !== 'all') && (
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setProductSearch('')
                            setProductCategoryFilter('all')
                            setProductStockFilter('all')
                          }}
                          className="text-primary-400 hover:text-primary-300 underline"
                        >
                          Réinitialiser les filtres
                        </button>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <>
                  <div className="mb-4 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                    {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                    {productSearch || productCategoryFilter !== 'all' || productStockFilter !== 'all' ? (
                      <button
                        onClick={() => {
                          setProductSearch('')
                          setProductCategoryFilter('all')
                          setProductStockFilter('all')
                        }}
                        className="ml-2 text-primary-400 hover:text-primary-300 underline"
                      >
                        Réinitialiser les filtres
                      </button>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl glass-effect"
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold mb-2 text-white [data-theme='light']:text-dark-500">
                      {product.name}
                    </h3>
                    <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 mb-2">
                      {product.category}
                    </p>
                    <p className="text-secondary-300 [data-theme='light']:text-secondary-700 mb-2 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold gradient-text">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XOF',
                          minimumFractionDigits: 0,
                        }).format(product.price)}
                      </span>
                      {product.rating && Number(product.rating) > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                          <span className="text-sm text-secondary-400">{Number(product.rating).toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                        product.stock === 0 
                          ? 'bg-red-500/20 border border-red-500/50' 
                          : product.stock <= 1 
                          ? 'bg-yellow-500/20 border border-yellow-500/50' 
                          : product.stock <= 5 
                          ? 'bg-orange-500/20 border border-orange-500/50' 
                          : 'bg-green-500/20 border border-green-500/50'
                      }`}>
                        <span className={`text-xs font-semibold ${
                          product.stock === 0 
                            ? 'text-red-400' 
                            : product.stock <= 1 
                            ? 'text-yellow-400' 
                            : product.stock <= 5 
                            ? 'text-orange-400' 
                            : 'text-green-400'
                        }`}>
                          Stock: {product.stock}
                        </span>
                        {product.stock === 0 && (
                          <span className="text-xs text-red-400 font-bold">RUPTURE</span>
                        )}
                        {product.stock > 0 && product.stock <= 1 && (
                          <span className="text-xs text-yellow-400 font-bold">⚠️ FAIBLE</span>
                        )}
                        {product.stock > 1 && product.stock <= 5 && (
                          <span className="text-xs text-orange-400 font-bold">ATTENTION</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-4 py-2 rounded-lg bg-primary-700/20 text-primary-400 hover:bg-primary-700/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        )}

        {/* Partners Tab */}
        {activeTab === 'partners' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setEditingPartner(null)
                  setPartnerForm({ name: '', website: '', order: '0', is_active: true })
                  setSelectedPartnerFile(null)
                  if (previewPartnerUrl && previewPartnerUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewPartnerUrl)
                  }
                  setPreviewPartnerUrl(null)
                  setShowPartnerForm(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter un partenaire</span>
              </button>
            </div>

            {showPartnerForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 rounded-xl glass-effect"
              >
                <h3 className="text-xl font-bold mb-4 text-white [data-theme='light']:text-dark-500">
                  {editingPartner ? 'Modifier le partenaire' : 'Nouveau partenaire'}
                </h3>
                <form onSubmit={handleSubmitPartner} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerForm.name}
                        onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
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
                        Site web
                      </label>
                      <input
                        type="url"
                        value={partnerForm.website}
                        onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                        placeholder="https://example.com"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Ordre d'affichage
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={partnerForm.order}
                        onChange={(e) => setPartnerForm({ ...partnerForm, order: e.target.value })}
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
                        Statut
                      </label>
                      <select
                        value={partnerForm.is_active ? '1' : '0'}
                        onChange={(e) => setPartnerForm({ ...partnerForm, is_active: e.target.value === '1' })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="1">Actif</option>
                        <option value="0">Inactif</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Logo
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          [data-theme='dark']:border-secondary-600 [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:hover:bg-secondary-800
                          [data-theme='light']:border-secondary-300 [data-theme='light']:bg-secondary-50 [data-theme='light']:hover:bg-secondary-100
                          transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {selectedPartnerFile ? (
                              <div className="flex items-center space-x-2 text-primary-400">
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-sm font-medium">{selectedPartnerFile.name}</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mb-2 text-secondary-400" />
                                <p className="mb-2 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-500">
                                  Image (JPEG, PNG, GIF, WebP, SVG) - Max 2MB
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                            onChange={handlePartnerFileChange}
                            disabled={!!selectedPartnerFile}
                          />
                        </label>
                        {selectedPartnerFile && (
                          <button
                            type="button"
                            onClick={handleRemovePartnerFile}
                            className="mt-2 text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Supprimer le fichier</span>
                          </button>
                        )}
                      </div>
                      {previewPartnerUrl && (
                        <div className="relative rounded-lg overflow-hidden border
                          [data-theme='dark']:border-secondary-700
                          [data-theme='light']:border-secondary-300">
                          <img
                            src={previewPartnerUrl}
                            alt="Aperçu logo"
                            className="w-full h-32 object-contain bg-white/5 p-4"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      {editingPartner ? 'Modifier' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPartnerForm(false)
                        setEditingPartner(null)
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
                Aucun partenaire pour le moment
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl glass-effect"
                  >
                    <div className="flex items-center justify-center mb-4 h-32 bg-dark-600/30 rounded-lg">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain p-4"
                        />
                      ) : (
                        <Building2 className="w-16 h-16 text-primary-500/40" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white [data-theme='light']:text-dark-500">
                      {partner.name}
                    </h3>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-400 hover:text-primary-300 mb-2 block truncate"
                      >
                        {partner.website}
                      </a>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        partner.is_active 
                          ? 'bg-primary-500/20 text-primary-400' 
                          : 'bg-secondary-500/20 text-secondary-400'
                      }`}>
                        {partner.is_active ? 'Actif' : 'Inactif'}
                      </span>
                      <span className="text-xs text-secondary-500">
                        Ordre: {partner.order}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPartner(partner)}
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeletePartner(partner.id)}
                        className="px-4 py-2 rounded-lg bg-primary-700/20 text-primary-400 hover:bg-primary-700/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setEditingNews(null)
                  setNewsForm({ 
                    title: '', 
                    slug: '', 
                    excerpt: '', 
                    content: '', 
                    image: '', 
                    category: 'Général', 
                    author: '', 
                    read_time: '5', 
                    is_published: false, 
                    published_at: '', 
                    order: '0' 
                  })
                  setSelectedNewsFile(null)
                  if (previewNewsUrl && previewNewsUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewNewsUrl)
                  }
                  setPreviewNewsUrl(null)
                  setShowNewsForm(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter un article</span>
              </button>
      </div>

            {showNewsForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 rounded-xl glass-effect"
              >
                <h3 className="text-xl font-bold mb-4 text-white [data-theme='light']:text-dark-500">
                  {editingNews ? 'Modifier l\'article' : 'Nouvel article'}
                </h3>
                <form onSubmit={handleSubmitNews} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Titre *
                      </label>
                      <input
                        type="text"
                        required
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Slug (URL)
                      </label>
                      <input
                        type="text"
                        value={newsForm.slug}
                        onChange={(e) => setNewsForm({ ...newsForm, slug: e.target.value })}
                        placeholder="Auto-généré depuis le titre"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
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
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Résumé (Excerpt) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={newsForm.excerpt}
                      onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                      maxLength={500}
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500 resize-none"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                    <p className="text-xs text-secondary-500 mt-1">{newsForm.excerpt.length}/500</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Contenu *
                    </label>
                    <textarea
                      required
                      rows={10}
                      value={newsForm.content}
                      onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500 resize-none"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Catégorie
                      </label>
                      <input
                        type="text"
                        value={newsForm.category}
                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                        placeholder="Général"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                        Auteur
                      </label>
                      <input
                        type="text"
                        value={newsForm.author}
                        onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                        Temps de lecture (min)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={newsForm.read_time}
                        onChange={(e) => setNewsForm({ ...newsForm, read_time: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Ordre d'affichage
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newsForm.order}
                        onChange={(e) => setNewsForm({ ...newsForm, order: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                        Statut de publication
                      </label>
                      <select
                        value={newsForm.is_published ? '1' : '0'}
                        onChange={(e) => setNewsForm({ ...newsForm, is_published: e.target.value === '1' })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="0">Brouillon</option>
                        <option value="1">Publié</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Date de publication
                      </label>
                      <input
                        type="datetime-local"
                        value={newsForm.published_at}
                        onChange={(e) => setNewsForm({ ...newsForm, published_at: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                      Image de couverture
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          [data-theme='dark']:border-secondary-600 [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:hover:bg-secondary-800
                          [data-theme='light']:border-secondary-300 [data-theme='light']:bg-secondary-50 [data-theme='light']:hover:bg-secondary-100
                          transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {selectedNewsFile ? (
                              <div className="flex items-center space-x-2 text-primary-400">
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-sm font-medium">{selectedNewsFile.name}</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mb-2 text-secondary-400" />
                                <p className="mb-2 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-500">
                                  Image (JPEG, PNG, GIF, WebP) - Max 5MB
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleNewsFileChange}
                            disabled={!!selectedNewsFile}
                          />
                        </label>
                        {selectedNewsFile && (
                          <button
                            type="button"
                            onClick={handleRemoveNewsFile}
                            className="mt-2 text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Supprimer le fichier</span>
                          </button>
                        )}
                      </div>
                      {previewNewsUrl && (
                        <div className="relative rounded-lg overflow-hidden border
                          [data-theme='dark']:border-secondary-700
                          [data-theme='light']:border-secondary-300">
                          <img
                            src={previewNewsUrl}
                            alt="Aperçu"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t [data-theme='dark']:border-secondary-700 [data-theme='light']:border-secondary-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 [data-theme='dark']:bg-secondary-900 [data-theme='dark']:text-secondary-400 [data-theme='light']:bg-white [data-theme='light']:text-secondary-500">
                            OU
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                          URL de l'image
                        </label>
                        <input
                          type="url"
                          value={newsForm.image}
                          onChange={(e) => {
                            setNewsForm({ ...newsForm, image: e.target.value })
                            if (e.target.value && !selectedNewsFile) {
                              setPreviewNewsUrl(e.target.value)
                            }
                          }}
                          placeholder="https://example.com/image.jpg"
                          disabled={!!selectedNewsFile}
                          className="w-full px-4 py-2 rounded-lg 
                            [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                            [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                            [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                            border focus:outline-none focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      {editingNews ? 'Modifier' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewsForm(false)
                        setEditingNews(null)
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
                Aucun article pour le moment
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((newsItem) => (
                  <motion.div
                    key={newsItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl glass-effect"
                  >
                    {newsItem.image && (
                      <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-primary-500/20 text-primary-400">
                        {newsItem.category}
                      </span>
                      {newsItem.is_published ? (
                        <span className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-medium flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>Publié</span>
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-medium flex items-center space-x-1">
                          <EyeOff className="w-3 h-3" />
                          <span>Brouillon</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white [data-theme='light']:text-dark-500 line-clamp-2">
                      {newsItem.title}
                    </h3>
                    <p className="text-secondary-300 [data-theme='light']:text-secondary-700 mb-3 text-sm line-clamp-2">
                      {newsItem.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-secondary-500 mb-4">
                      <span>{newsItem.read_time} min de lecture</span>
                      <span>{newsItem.views} vues</span>
                    </div>
                    {newsItem.published_at && (
                      <p className="text-xs text-secondary-500 mb-4">
                        Publié le: {new Date(newsItem.published_at).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditNews(newsItem)}
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteNews(newsItem.id)}
                        className="px-4 py-2 rounded-lg bg-primary-700/20 text-primary-400 hover:bg-primary-700/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setEditingTeamMember(null)
                  setTeamForm({ 
                    name: '', 
                    role: '', 
                    bio: '', 
                    image: '', 
                    email: '', 
                    linkedin: '', 
                    github: '', 
                    twitter: '', 
                    website: '', 
                    order: '0', 
                    is_active: true 
                  })
                  setSelectedTeamFile(null)
                  if (previewTeamUrl && previewTeamUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewTeamUrl)
                  }
                  setPreviewTeamUrl(null)
                  setShowTeamForm(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter un membre</span>
              </button>
            </div>

            {showTeamForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 rounded-xl glass-effect"
              >
                <h3 className="text-xl font-bold mb-4 text-white [data-theme='light']:text-dark-500">
                  {editingTeamMember ? 'Modifier le membre' : 'Nouveau membre'}
                </h3>
                <form onSubmit={handleSubmitTeam} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={teamForm.name}
                        onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Rôle *
                      </label>
                      <input
                        type="text"
                        required
                        value={teamForm.role}
                        onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                        placeholder="CEO & Fondateur"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
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
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Biographie *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={teamForm.bio}
                      onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                      maxLength={1000}
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500 resize-none"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                    <p className="text-xs text-secondary-500 mt-1">{teamForm.bio.length}/1000</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={teamForm.email}
                        onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Site web
                      </label>
                      <input
                        type="url"
                        value={teamForm.website}
                        onChange={(e) => setTeamForm({ ...teamForm, website: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={teamForm.linkedin}
                        onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={teamForm.github}
                        onChange={(e) => setTeamForm({ ...teamForm, github: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={teamForm.twitter}
                        onChange={(e) => setTeamForm({ ...teamForm, twitter: e.target.value })}
                        placeholder="https://twitter.com/..."
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Ordre d'affichage
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={teamForm.order}
                        onChange={(e) => setTeamForm({ ...teamForm, order: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                        Statut
                      </label>
                      <select
                        value={teamForm.is_active ? '1' : '0'}
                        onChange={(e) => setTeamForm({ ...teamForm, is_active: e.target.value === '1' })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="1">Actif</option>
                        <option value="0">Inactif</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Photo
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          [data-theme='dark']:border-secondary-600 [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:hover:bg-secondary-800
                          [data-theme='light']:border-secondary-300 [data-theme='light']:bg-secondary-50 [data-theme='light']:hover:bg-secondary-100
                          transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {selectedTeamFile ? (
                              <div className="flex items-center space-x-2 text-primary-400">
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-sm font-medium">{selectedTeamFile.name}</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mb-2 text-secondary-400" />
                                <p className="mb-2 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-500">
                                  Image (JPEG, PNG, GIF, WebP) - Max 5MB
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleTeamFileChange}
                            disabled={!!selectedTeamFile}
                          />
                        </label>
                        {selectedTeamFile && (
                          <button
                            type="button"
                            onClick={handleRemoveTeamFile}
                            className="mt-2 text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Supprimer le fichier</span>
                          </button>
                        )}
                      </div>
                      {previewTeamUrl && (
                        <div className="relative rounded-lg overflow-hidden border
                          [data-theme='dark']:border-secondary-700
                          [data-theme='light']:border-secondary-300">
                          <img
                            src={previewTeamUrl}
                            alt="Aperçu"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t [data-theme='dark']:border-secondary-700 [data-theme='light']:border-secondary-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 [data-theme='dark']:bg-secondary-900 [data-theme='dark']:text-secondary-400 [data-theme='light']:bg-white [data-theme='light']:text-secondary-500">
                            OU
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                          URL de l'image
                        </label>
                        <input
                          type="url"
                          value={teamForm.image}
                          onChange={(e) => {
                            setTeamForm({ ...teamForm, image: e.target.value })
                            if (e.target.value && !selectedTeamFile) {
                              setPreviewTeamUrl(e.target.value)
                            }
                          }}
                          placeholder="https://example.com/image.jpg"
                          disabled={!!selectedTeamFile}
                          className="w-full px-4 py-2 rounded-lg 
                            [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                            [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                            [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                            border focus:outline-none focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      {editingTeamMember ? 'Modifier' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTeamForm(false)
                        setEditingTeamMember(null)
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
                Aucun membre de l'équipe pour le moment
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl glass-effect"
                  >
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white [data-theme='light']:text-dark-500">
                        {member.name}
                      </h3>
                      {member.is_active ? (
                        <span className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-medium flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>Actif</span>
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-medium flex items-center space-x-1">
                          <EyeOff className="w-3 h-3" />
                          <span>Inactif</span>
                        </span>
                      )}
                    </div>
                    <p className="text-primary-400 mb-2 text-sm font-medium">
                      {member.role}
                    </p>
                    <p className="text-secondary-300 [data-theme='light']:text-secondary-700 mb-4 text-sm">
                      {member.bio}
                    </p>
                    <div className="flex items-center space-x-2 mb-4">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-secondary-500 hover:text-primary-400 transition-colors"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary-500 hover:text-primary-400 transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary-500 hover:text-primary-400 transition-colors"
                          title="GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTeamMember(member)}
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTeamMember(member.id)}
                        className="px-4 py-2 rounded-lg bg-primary-700/20 text-primary-400 hover:bg-primary-700/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setEditingCertification(null)
                  setCertificationForm({ 
                    name: '', 
                    description: '', 
                    image: '', 
                    icon_type: 'award', 
                    color: 'from-blue-500 to-blue-600', 
                    issuer: '', 
                    issued_date: '', 
                    expiry_date: '', 
                    certificate_url: '', 
                    order: '0', 
                    is_active: true 
                  })
                  setSelectedCertificationFile(null)
                  if (previewCertificationUrl && previewCertificationUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewCertificationUrl)
                  }
                  setPreviewCertificationUrl(null)
                  setShowCertificationForm(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter une certification</span>
              </button>
            </div>

            {showCertificationForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 rounded-xl glass-effect"
              >
                <h3 className="text-xl font-bold mb-4 text-white [data-theme='light']:text-dark-500">
                  {editingCertification ? 'Modifier la certification' : 'Nouvelle certification'}
                </h3>
                <form onSubmit={handleSubmitCertification} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={certificationForm.name}
                        onChange={(e) => setCertificationForm({ ...certificationForm, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Organisme émetteur
                      </label>
                      <input
                        type="text"
                        value={certificationForm.issuer}
                        onChange={(e) => setCertificationForm({ ...certificationForm, issuer: e.target.value })}
                        placeholder="Ex: ISO, Google, Microsoft"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
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
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={certificationForm.description}
                      onChange={(e) => setCertificationForm({ ...certificationForm, description: e.target.value })}
                      maxLength={1000}
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500 resize-none"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                    <p className="text-xs text-secondary-500 mt-1">{certificationForm.description.length}/1000</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Type d'icône
                      </label>
                      <select
                        value={certificationForm.icon_type}
                        onChange={(e) => setCertificationForm({ ...certificationForm, icon_type: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="award">Award</option>
                        <option value="shield">Shield</option>
                        <option value="check-circle">Check Circle</option>
                        <option value="star">Star</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Couleur (gradient)
                      </label>
                      <input
                        type="text"
                        value={certificationForm.color}
                        onChange={(e) => setCertificationForm({ ...certificationForm, color: e.target.value })}
                        placeholder="from-blue-500 to-blue-600"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Ordre d'affichage
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={certificationForm.order}
                        onChange={(e) => setCertificationForm({ ...certificationForm, order: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Date d'obtention
                      </label>
                      <input
                        type="date"
                        value={certificationForm.issued_date}
                        onChange={(e) => setCertificationForm({ ...certificationForm, issued_date: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                        Date d'expiration
                      </label>
                      <input
                        type="date"
                        value={certificationForm.expiry_date}
                        onChange={(e) => setCertificationForm({ ...certificationForm, expiry_date: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                        Statut
                      </label>
                      <select
                        value={certificationForm.is_active ? '1' : '0'}
                        onChange={(e) => setCertificationForm({ ...certificationForm, is_active: e.target.value === '1' })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="1">Actif</option>
                        <option value="0">Inactif</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Lien vers le certificat
                    </label>
                    <input
                      type="url"
                      value={certificationForm.certificate_url}
                      onChange={(e) => setCertificationForm({ ...certificationForm, certificate_url: e.target.value })}
                      placeholder="https://example.com/certificate"
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Logo/Image
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          [data-theme='dark']:border-secondary-600 [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:hover:bg-secondary-800
                          [data-theme='light']:border-secondary-300 [data-theme='light']:bg-secondary-50 [data-theme='light']:hover:bg-secondary-100
                          transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {selectedCertificationFile ? (
                              <div className="flex items-center space-x-2 text-primary-400">
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-sm font-medium">{selectedCertificationFile.name}</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mb-2 text-secondary-400" />
                                <p className="mb-2 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-500">
                                  Image (JPEG, PNG, GIF, WebP, SVG) - Max 5MB
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                            onChange={handleCertificationFileChange}
                            disabled={!!selectedCertificationFile}
                          />
                        </label>
                        {selectedCertificationFile && (
                          <button
                            type="button"
                            onClick={handleRemoveCertificationFile}
                            className="mt-2 text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Supprimer le fichier</span>
                          </button>
                        )}
                      </div>
                      {previewCertificationUrl && (
                        <div className="relative rounded-lg overflow-hidden border
                          [data-theme='dark']:border-secondary-700
                          [data-theme='light']:border-secondary-300">
                          <img
                            src={previewCertificationUrl}
                            alt="Aperçu"
                            className="w-full h-32 object-contain bg-white/5 p-4"
                          />
                        </div>
                      )}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t [data-theme='dark']:border-secondary-700 [data-theme='light']:border-secondary-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 [data-theme='dark']:bg-secondary-900 [data-theme='dark']:text-secondary-400 [data-theme='light']:bg-white [data-theme='light']:text-secondary-500">
                            OU
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                          URL de l'image
                        </label>
                        <input
                          type="url"
                          value={certificationForm.image}
                          onChange={(e) => {
                            setCertificationForm({ ...certificationForm, image: e.target.value })
                            if (e.target.value && !selectedCertificationFile) {
                              setPreviewCertificationUrl(e.target.value)
                            }
                          }}
                          placeholder="https://example.com/image.jpg"
                          disabled={!!selectedCertificationFile}
                          className="w-full px-4 py-2 rounded-lg 
                            [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                            [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                            [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                            border focus:outline-none focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      {editingCertification ? 'Modifier' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCertificationForm(false)
                        setEditingCertification(null)
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : certifications.length === 0 ? (
              <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
                Aucune certification pour le moment
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((certification) => {
                  const getIcon = () => {
                    switch (certification.icon_type) {
                      case 'shield':
                        return Shield
                      case 'check-circle':
                        return CheckCircle
                      case 'star':
                        return Star
                      default:
                        return Award
                    }
                  }
                  const Icon = getIcon()
                  
                  return (
                    <motion.div
                      key={certification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-xl glass-effect"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${certification.color} flex items-center justify-center shadow-lg`}>
                          {certification.image ? (
                            <img src={certification.image} alt={certification.name} className="w-12 h-12 object-contain" />
                          ) : (
                            <Icon className="w-8 h-8 text-white" />
                          )}
                        </div>
                        {certification.is_active ? (
                          <span className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-medium flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>Actif</span>
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-medium flex items-center space-x-1">
                            <EyeOff className="w-3 h-3" />
                            <span>Inactif</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white [data-theme='light']:text-dark-500">
                        {certification.name}
                      </h3>
                      {certification.issuer && (
                        <p className="text-sm text-primary-400 mb-2">
                          {certification.issuer}
                        </p>
                      )}
                      <p className="text-secondary-300 [data-theme='light']:text-secondary-700 mb-4 text-sm">
                        {certification.description}
                      </p>
                      {(certification.issued_date || certification.expiry_date) && (
                        <div className="text-xs text-secondary-500 mb-4 space-y-1">
                          {certification.issued_date && (
                            <p>Obtenu le: {new Date(certification.issued_date).toLocaleDateString('fr-FR')}</p>
                          )}
                          {certification.expiry_date && (
                            <p>Expire le: {new Date(certification.expiry_date).toLocaleDateString('fr-FR')}</p>
                          )}
                        </div>
                      )}
                      {certification.certificate_url && (
                        <a
                          href={certification.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-400 hover:text-primary-300 mb-4 block"
                        >
                          Voir le certificat →
                        </a>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCertification(certification)}
                          className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCertification(certification.id)}
                          className="px-4 py-2 rounded-lg bg-primary-700/20 text-primary-400 hover:bg-primary-700/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Awards Tab */}
        {activeTab === 'awards' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setEditingAward(null)
                  setAwardForm({ 
                    title: '', 
                    organization: '', 
                    year: new Date().getFullYear().toString(), 
                    description: '', 
                    image: '', 
                    icon_type: 'trophy', 
                    color: 'from-yellow-500 to-orange-500', 
                    award_url: '', 
                    order: '0', 
                    is_active: true 
                  })
                  setSelectedAwardFile(null)
                  if (previewAwardUrl && previewAwardUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewAwardUrl)
                  }
                  setPreviewAwardUrl(null)
                  setShowAwardForm(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter une récompense</span>
              </button>
            </div>

            {showAwardForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 rounded-xl glass-effect"
              >
                <h3 className="text-xl font-bold mb-4 text-white [data-theme='light']:text-dark-500">
                  {editingAward ? 'Modifier la récompense' : 'Nouvelle récompense'}
                </h3>
                <form onSubmit={handleSubmitAward} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Titre *
                      </label>
                      <input
                        type="text"
                        required
                        value={awardForm.title}
                        onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Organisation *
                      </label>
                      <input
                        type="text"
                        required
                        value={awardForm.organization}
                        onChange={(e) => setAwardForm({ ...awardForm, organization: e.target.value })}
                        placeholder="Ex: Tech Awards Morocco"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
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
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={awardForm.description}
                      onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}
                      maxLength={1000}
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500 resize-none"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                    <p className="text-xs text-secondary-500 mt-1">{awardForm.description.length}/1000</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Année *
                      </label>
                      <input
                        type="number"
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        value={awardForm.year}
                        onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                        Type d'icône
                      </label>
                      <select
                        value={awardForm.icon_type}
                        onChange={(e) => setAwardForm({ ...awardForm, icon_type: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="trophy">Trophy</option>
                        <option value="award">Award</option>
                        <option value="medal">Medal</option>
                        <option value="star">Star</option>
                        <option value="trending-up">Trending Up</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Couleur (gradient)
                      </label>
                      <input
                        type="text"
                        value={awardForm.color}
                        onChange={(e) => setAwardForm({ ...awardForm, color: e.target.value })}
                        placeholder="from-yellow-500 to-orange-500"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Ordre d'affichage
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={awardForm.order}
                        onChange={(e) => setAwardForm({ ...awardForm, order: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                        Statut
                      </label>
                      <select
                        value={awardForm.is_active ? '1' : '0'}
                        onChange={(e) => setAwardForm({ ...awardForm, is_active: e.target.value === '1' })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="1">Actif</option>
                        <option value="0">Inactif</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Lien vers la récompense
                    </label>
                    <input
                      type="url"
                      value={awardForm.award_url}
                      onChange={(e) => setAwardForm({ ...awardForm, award_url: e.target.value })}
                      placeholder="https://example.com/award"
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Image/Logo
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          [data-theme='dark']:border-secondary-600 [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:hover:bg-secondary-800
                          [data-theme='light']:border-secondary-300 [data-theme='light']:bg-secondary-50 [data-theme='light']:hover:bg-secondary-100
                          transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {selectedAwardFile ? (
                              <div className="flex items-center space-x-2 text-primary-400">
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-sm font-medium">{selectedAwardFile.name}</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mb-2 text-secondary-400" />
                                <p className="mb-2 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-500">
                                  Image (JPEG, PNG, GIF, WebP, SVG) - Max 5MB
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                            onChange={handleAwardFileChange}
                            disabled={!!selectedAwardFile}
                          />
                        </label>
                        {selectedAwardFile && (
                          <button
                            type="button"
                            onClick={handleRemoveAwardFile}
                            className="mt-2 text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Supprimer le fichier</span>
                          </button>
                        )}
                      </div>
                      {previewAwardUrl && (
                        <div className="relative rounded-lg overflow-hidden border
                          [data-theme='dark']:border-secondary-700
                          [data-theme='light']:border-secondary-300">
                          <img
                            src={previewAwardUrl}
                            alt="Aperçu"
                            className="w-full h-32 object-contain bg-white/5 p-4"
                          />
                        </div>
                      )}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t [data-theme='dark']:border-secondary-700 [data-theme='light']:border-secondary-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 [data-theme='dark']:bg-secondary-900 [data-theme='dark']:text-secondary-400 [data-theme='light']:bg-white [data-theme='light']:text-secondary-500">
                            OU
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                          URL de l'image
                        </label>
                        <input
                          type="url"
                          value={awardForm.image}
                          onChange={(e) => {
                            setAwardForm({ ...awardForm, image: e.target.value })
                            if (e.target.value && !selectedAwardFile) {
                              setPreviewAwardUrl(e.target.value)
                            }
                          }}
                          placeholder="https://example.com/image.jpg"
                          disabled={!!selectedAwardFile}
                          className="w-full px-4 py-2 rounded-lg 
                            [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                            [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                            [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                            border focus:outline-none focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      {editingAward ? 'Modifier' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAwardForm(false)
                        setEditingAward(null)
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : awards.length === 0 ? (
              <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
                Aucune récompense pour le moment
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {awards.map((award) => {
                  const getIcon = () => {
                    switch (award.icon_type) {
                      case 'award':
                        return Award
                      case 'medal':
                        return Medal
                      case 'star':
                        return Star
                      case 'trending-up':
                        return TrendingUp
                      default:
                        return Trophy
                    }
                  }
                  const Icon = getIcon()
                  
                  return (
                    <motion.div
                      key={award.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-xl glass-effect"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${award.color} flex items-center justify-center shadow-xl`}>
                          {award.image ? (
                            <img src={award.image} alt={award.title} className="w-16 h-16 object-contain" />
                          ) : (
                            <Icon className="w-10 h-10 text-white" />
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="px-4 py-2 rounded-full glass-effect text-sm font-bold text-primary-400">
                            {award.year}
                          </span>
                          {award.is_active ? (
                            <span className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-medium flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>Actif</span>
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-medium flex items-center space-x-1">
                              <EyeOff className="w-3 h-3" />
                              <span>Inactif</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-white [data-theme='light']:text-dark-500">
                        {award.title}
                      </h3>
                      <p className="text-primary-400 mb-3 font-medium">
                        {award.organization}
                      </p>
                      <p className="text-secondary-300 [data-theme='light']:text-secondary-700 mb-4 text-sm">
                        {award.description}
                      </p>
                      {award.award_url && (
                        <a
                          href={award.award_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-400 hover:text-primary-300 mb-4 block"
                        >
                          Voir la récompense →
                        </a>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAward(award)}
                          className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAward(award.id)}
                          className="px-4 py-2 rounded-lg bg-primary-700/20 text-primary-400 hover:bg-primary-700/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setEditingVideo(null)
                  setVideoForm({ 
                    title: '', 
                    description: '', 
                    video_type: 'youtube', 
                    video_url: '', 
                    thumbnail: '', 
                    order: '0', 
                    is_active: true, 
                    is_featured: false 
                  })
                  setSelectedVideoFile(null)
                  setSelectedVideoThumbnailFile(null)
                  setPreviewVideoThumbnailUrl(null)
                  setShowVideoForm(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter une vidéo</span>
              </button>
            </div>

            {showVideoForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 rounded-xl glass-effect border border-primary-500/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white [data-theme='light']:text-dark-500">
                    {editingVideo ? 'Modifier la vidéo' : 'Nouvelle vidéo'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowVideoForm(false)
                      setEditingVideo(null)
                      setVideoForm({ 
                        title: '', 
                        description: '', 
                        video_type: 'youtube', 
                        video_url: '', 
                        thumbnail: '', 
                        order: '0', 
                        is_active: true, 
                        is_featured: false 
                      })
                      setSelectedVideoFile(null)
                      setSelectedVideoThumbnailFile(null)
                      setPreviewVideoThumbnailUrl(null)
                    }}
                    className="text-secondary-400 hover:text-white [data-theme='light']:hover:text-dark-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmitVideo} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={videoForm.title}
                      onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={videoForm.description}
                      onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Type de vidéo *
                    </label>
                    <select
                      value={videoForm.video_type}
                      onChange={(e) => setVideoForm({ ...videoForm, video_type: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    >
                      <option value="youtube">YouTube</option>
                      <option value="vimeo">Vimeo</option>
                      <option value="direct">Vidéo directe (upload)</option>
                    </select>
                  </div>
                  {videoForm.video_type !== 'direct' && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        URL ou ID {videoForm.video_type === 'youtube' ? 'YouTube' : 'Vimeo'} *
                      </label>
                      <input
                        type="text"
                        value={videoForm.video_url}
                        onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                        placeholder={videoForm.video_type === 'youtube' ? 'https://youtube.com/watch?v=... ou ID' : 'https://vimeo.com/... ou ID'}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                  )}
                  {videoForm.video_type === 'direct' && (
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Fichier vidéo (MP4, WebM, QuickTime) - Max 100MB
                      </label>
                      <div className="space-y-4">
                        <div>
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                            [data-theme='dark']:border-secondary-600 [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:hover:bg-secondary-800
                            [data-theme='light']:border-secondary-300 [data-theme='light']:bg-secondary-50 [data-theme='light']:hover:bg-secondary-100
                            transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {selectedVideoFile ? (
                                <div className="flex items-center space-x-2 text-primary-400">
                                  <Video className="w-8 h-8" />
                                  <span className="text-sm font-medium">{selectedVideoFile.name}</span>
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-10 h-10 mb-2 text-secondary-400" />
                                  <p className="mb-2 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                    <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                                  </p>
                                  <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-500">
                                    Vidéo (MP4, WebM, QuickTime) - Max 100MB
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="video/mp4,video/webm,video/quicktime"
                              onChange={handleVideoFileChange}
                              disabled={!!selectedVideoFile}
                            />
                          </label>
                          {selectedVideoFile && (
                            <button
                              type="button"
                              onClick={() => setSelectedVideoFile(null)}
                              className="mt-2 text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                            >
                              <X className="w-4 h-4" />
                              <span>Supprimer le fichier</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      Image de prévisualisation (thumbnail)
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          [data-theme='dark']:border-secondary-600 [data-theme='dark']:bg-secondary-800/50 [data-theme='dark']:hover:bg-secondary-800
                          [data-theme='light']:border-secondary-300 [data-theme='light']:bg-secondary-50 [data-theme='light']:hover:bg-secondary-100
                          transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {selectedVideoThumbnailFile ? (
                              <div className="flex items-center space-x-2 text-primary-400">
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-sm font-medium">{selectedVideoThumbnailFile.name}</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mb-2 text-secondary-400" />
                                <p className="mb-2 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                                  <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-500">
                                  Image (JPEG, PNG, GIF, WebP) - Max 5MB
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleVideoThumbnailFileChange}
                            disabled={!!selectedVideoThumbnailFile}
                          />
                        </label>
                        {selectedVideoThumbnailFile && (
                          <button
                            type="button"
                            onClick={handleRemoveVideoThumbnailFile}
                            className="mt-2 text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Supprimer le fichier</span>
                          </button>
                        )}
                      </div>
                      {previewVideoThumbnailUrl && (
                        <div className="relative rounded-lg overflow-hidden border
                          [data-theme='dark']:border-secondary-700
                          [data-theme='light']:border-secondary-300"
                          style={{ maxWidth: '300px' }}
                        >
                          <img
                            src={previewVideoThumbnailUrl}
                            alt="Preview"
                            className="w-full h-auto"
                          />
                        </div>
                      )}
                      {!selectedVideoThumbnailFile && !previewVideoThumbnailUrl && (
                        <div>
                          <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                            Ou URL de l'image
                          </label>
                          <input
                            type="url"
                            value={videoForm.thumbnail}
                            onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-2 rounded-lg 
                              [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                              [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                              [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                              border focus:outline-none focus:border-primary-500"
                            style={{
                              color: isDark ? '#ffffff' : '#111827',
                              WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                              backgroundColor: isDark ? '#1f2937' : '#ffffff',
                              borderColor: isDark ? '#374151' : '#d1d5db',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Ordre
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={videoForm.order}
                        onChange={(e) => setVideoForm({ ...videoForm, order: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                        Statut
                      </label>
                      <select
                        value={videoForm.is_active ? '1' : '0'}
                        onChange={(e) => setVideoForm({ ...videoForm, is_active: e.target.value === '1' })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="1">Actif</option>
                        <option value="0">Inactif</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Vidéo principale
                      </label>
                      <select
                        value={videoForm.is_featured ? '1' : '0'}
                        onChange={(e) => setVideoForm({ ...videoForm, is_featured: e.target.value === '1' })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="0">Non</option>
                        <option value="1">Oui</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowVideoForm(false)
                        setEditingVideo(null)
                        setVideoForm({ 
                          title: '', 
                          description: '', 
                          video_type: 'youtube', 
                          video_url: '', 
                          thumbnail: '', 
                          order: '0', 
                          is_active: true, 
                          is_featured: false 
                        })
                        setSelectedVideoFile(null)
                        setSelectedVideoThumbnailFile(null)
                        setPreviewVideoThumbnailUrl(null)
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingVideo ? 'Mettre à jour' : 'Créer'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Aucune vidéo pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl glass-effect border border-primary-500/20 hover:border-primary-500/40 transition-colors"
                  >
                    <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-secondary-800">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-12 h-12 text-secondary-500" />
                        </div>
                      )}
                      {video.is_featured && (
                        <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Principale
                        </div>
                      )}
                      {!video.is_active && (
                        <div className="absolute top-2 left-2 bg-secondary-700 text-white px-2 py-1 rounded text-xs font-medium">
                          Inactive
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white [data-theme='light']:text-dark-500 mb-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 mb-4 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-secondary-500 mb-4">
                      <span className="capitalize">{video.video_type}</span>
                      <span>Ordre: {video.order}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditVideo(video)}
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="btn-danger text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'socialLinks' && (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setEditingSocialLink(null)
                  setSocialLinkForm({ 
                    platform: 'facebook', 
                    name: '', 
                    url: '', 
                    icon_type: 'lucide', 
                    color_gradient: '', 
                    followers: '', 
                    order: '0', 
                    is_active: true 
                  })
                  setShowSocialLinkForm(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter un réseau social</span>
              </button>
            </div>

            {showSocialLinkForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 rounded-xl glass-effect border border-primary-500/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white [data-theme='light']:text-dark-500">
                    {editingSocialLink ? 'Modifier le lien social' : 'Nouveau lien social'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowSocialLinkForm(false)
                      setEditingSocialLink(null)
                      setSocialLinkForm({ 
                        platform: 'facebook', 
                        name: '', 
                        url: '', 
                        icon_type: 'lucide', 
                        color_gradient: '', 
                        followers: '', 
                        order: '0', 
                        is_active: true 
                      })
                    }}
                    className="text-secondary-400 hover:text-white [data-theme='light']:hover:text-dark-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmitSocialLink} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Plateforme *
                      </label>
                      <select
                        value={socialLinkForm.platform}
                        onChange={(e) => setSocialLinkForm({ ...socialLinkForm, platform: e.target.value })}
                        required
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="youtube">YouTube</option>
                        <option value="github">GitHub</option>
                        <option value="tiktok">TikTok</option>
                        <option value="discord">Discord</option>
                        <option value="telegram">Telegram</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Nom affiché *
                      </label>
                      <input
                        type="text"
                        value={socialLinkForm.name}
                        onChange={(e) => setSocialLinkForm({ ...socialLinkForm, name: e.target.value })}
                        required
                        placeholder="Facebook"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
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
                    <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                      URL *
                    </label>
                    <input
                      type="url"
                      value={socialLinkForm.url}
                      onChange={(e) => setSocialLinkForm({ ...socialLinkForm, url: e.target.value })}
                      required
                      placeholder="https://facebook.com/innosoft"
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                        [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Gradient de couleur (Tailwind)
                      </label>
                      <input
                        type="text"
                        value={socialLinkForm.color_gradient}
                        onChange={(e) => setSocialLinkForm({ ...socialLinkForm, color_gradient: e.target.value })}
                        placeholder="from-blue-600 to-blue-700"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Nombre d'abonnés
                      </label>
                      <input
                        type="text"
                        value={socialLinkForm.followers}
                        onChange={(e) => setSocialLinkForm({ ...socialLinkForm, followers: e.target.value })}
                        placeholder="12.5K"
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          WebkitTextFillColor: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 [data-theme='light']:text-secondary-700 mb-2">
                        Ordre
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={socialLinkForm.order}
                        onChange={(e) => setSocialLinkForm({ ...socialLinkForm, order: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
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
                        Statut
                      </label>
                      <select
                        value={socialLinkForm.is_active ? '1' : '0'}
                        onChange={(e) => setSocialLinkForm({ ...socialLinkForm, is_active: e.target.value === '1' })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-secondary-800 [data-theme='dark']:border-secondary-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-secondary-700 [data-theme='dark']:hover:border-secondary-600
                          [data-theme='light']:bg-white [data-theme='light']:border-secondary-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                          border focus:outline-none focus:border-primary-500"
                        style={{
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#d1d5db',
                        }}
                      >
                        <option value="1">Actif</option>
                        <option value="0">Inactif</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSocialLinkForm(false)
                        setEditingSocialLink(null)
                        setSocialLinkForm({ 
                          platform: 'facebook', 
                          name: '', 
                          url: '', 
                          icon_type: 'lucide', 
                          color_gradient: '', 
                          followers: '', 
                          order: '0', 
                          is_active: true 
                        })
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn-primary">
                      {editingSocialLink ? 'Mettre à jour' : 'Créer'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : socialLinks.length === 0 ? (
              <div className="text-center py-12 text-secondary-400 [data-theme='light']:text-secondary-600">
                <Share2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Aucun lien social pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialLinks.map((socialLink) => (
                  <motion.div
                    key={socialLink.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl glass-effect border border-primary-500/20 hover:border-primary-500/40 transition-colors"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      {socialLink.color_gradient ? (
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${socialLink.color_gradient} flex items-center justify-center shadow-lg`}>
                          <Share2 className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                          <Share2 className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white [data-theme='light']:text-dark-500">
                          {socialLink.name}
                        </h3>
                        <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 capitalize">
                          {socialLink.platform}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs text-secondary-500">
                        <span>URL:</span>
                        <a 
                          href={socialLink.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:text-primary-300 truncate max-w-[200px]"
                        >
                          {socialLink.url}
                        </a>
                      </div>
                      {socialLink.followers && (
                        <div className="flex items-center justify-between text-xs text-secondary-500">
                          <span>Abonnés:</span>
                          <span>{socialLink.followers}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-secondary-500">
                        <span>Ordre:</span>
                        <span>{socialLink.order}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Statut:</span>
                        <span className={socialLink.is_active ? 'text-green-400' : 'text-red-400'}>
                          {socialLink.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSocialLink(socialLink)}
                        className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSocialLink(socialLink.id)}
                        className="btn-danger text-sm py-2 flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
            {/* Liste des conversations */}
            <div className="lg:col-span-1 border-r border-primary-500/20 pr-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white [data-theme='light']:text-dark-500">
                  Conversations
                </h3>
                <button
                  onClick={() => {
                    loadData()
                    setSelectedConversation(null)
                  }}
                  className="text-secondary-400 hover:text-primary-400"
                  title="Actualiser"
                >
                  <X className="w-5 h-5 rotate-45" />
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 text-secondary-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune conversation</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv: any) => {
                    const unreadCount = conv.unread_count || 0
                    const lastMessage = conv.last_message || conv.messages?.[conv.messages.length - 1]
                    
                    return (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleSelectConversation(conv)}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          selectedConversation?.id === conv.id
                            ? 'glass-effect border-primary-500/50 border-2'
                            : 'glass-effect border-primary-500/0 border hover:border-primary-500/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-white [data-theme='light']:text-dark-500">
                                {conv.name || conv.user?.name || 'Visiteur anonyme'}
                              </h4>
                              {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 capitalize">
                              {conv.type === 'anonymous' ? 'Chat anonyme' : 'Chat avec compte'}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            conv.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            conv.status === 'closed' ? 'bg-gray-500/20 text-gray-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {conv.status}
                          </span>
                        </div>
                        {lastMessage && (
                          <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 truncate">
                            {lastMessage.content}
                          </p>
                        )}
                        {conv.last_message_at && (
                          <p className="text-xs text-secondary-500 mt-1">
                            {new Date(conv.last_message_at).toLocaleString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Zone de conversation */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header de la conversation */}
                  <div className="flex items-center justify-between p-4 border-b border-primary-500/20 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white [data-theme='light']:text-dark-500">
                        {selectedConversation.name || selectedConversation.user?.name || 'Visiteur anonyme'}
                      </h3>
                      <p className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
                        {selectedConversation.email || selectedConversation.user?.email || 'Aucun email'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="text-secondary-400 hover:text-white [data-theme='light']:hover:text-dark-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4">
                    {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                      selectedConversation.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_type === 'visitor' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                              msg.sender_type === 'visitor'
                                ? 'bg-secondary-700 text-white [data-theme="light"]:bg-secondary-200 [data-theme="light"]:text-dark-500'
                                : 'bg-primary-500 text-white'
                            }`}
                          >
                            {msg.sender_type === 'admin' && msg.user && (
                              <p className="text-xs font-semibold mb-1 opacity-70">
                                {msg.user.name}
                              </p>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-60 mt-1">
                              {new Date(msg.created_at).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-secondary-400">
                        <p>Aucun message dans cette conversation</p>
                      </div>
                    )}
                  </div>

                  {/* Formulaire de réponse */}
                  <form onSubmit={handleSendReply} className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-2 rounded-lg glass-effect border border-primary-500/20 focus:border-primary-500/50 focus:outline-none text-white [data-theme='light']:text-dark-500 placeholder:text-secondary-400"
                      style={{
                        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                      }}
                      disabled={isSendingMessage}
                    />
                    <button
                      type="submit"
                      disabled={isSendingMessage || !chatMessage.trim()}
                      className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSendingMessage ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Envoyer</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-secondary-400 opacity-50" />
                    <p className="text-secondary-400 [data-theme='light']:text-secondary-600">
                      Sélectionnez une conversation pour commencer
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Messages Tab */}
        {activeTab === 'contactMessages' && (
          <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0 overflow-hidden">
            {/* Liste des messages */}
            <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col border-r border-primary-500/20 pr-0 lg:pr-6 min-h-0">
              {/* Statistiques rapides */}
              <div className="grid grid-cols-2 gap-2 mb-3 flex-shrink-0">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 text-center">
                  <div className="text-xl font-bold text-blue-400">{contactMessages.filter(m => !m.is_read).length}</div>
                  <div className="text-xs text-secondary-400">Non lus</div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2.5 text-center">
                  <div className="text-xl font-bold text-orange-400">{contactMessages.filter(m => !m.is_replied).length}</div>
                  <div className="text-xs text-secondary-400">Non répondu</div>
                </div>
              </div>

              {/* Header avec recherche et filtres */}
              <div className="mb-3 space-y-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white [data-theme='light']:text-dark-500">
                    Messages ({contactMessages.length})
                  </h3>
                  <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      loadData()
                      setSelectedContactMessage(null)
                    }}
                      className="text-secondary-400 hover:text-primary-400 transition-colors p-1.5 hover:bg-primary-500/10 rounded-lg"
                    title="Actualiser"
                  >
                      <RefreshCw className="w-4 h-4" />
                  </button>
                  </div>
                </div>

                {/* Barre de recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    value={contactMessageSearch}
                    onChange={(e) => setContactMessageSearch(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-10 py-2 rounded-lg glass-effect border border-primary-500/20 focus:border-primary-500/50 focus:outline-none text-white [data-theme='light']:text-dark-500 placeholder:text-secondary-400 text-sm transition-all"
                    style={{
                      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                    }}
                  />
                  {contactMessageSearch && (
                    <button
                      onClick={() => setContactMessageSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setContactMessageFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      contactMessageFilter === 'all'
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-secondary-700/50 [data-theme="light"]:bg-secondary-200 text-secondary-300 [data-theme="light"]:text-secondary-700 hover:bg-primary-500/20'
                    }`}
                  >
                    Tous ({contactMessages.length})
                  </button>
                  <button
                    onClick={() => setContactMessageFilter('unread')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 whitespace-nowrap ${
                      contactMessageFilter === 'unread'
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-secondary-700/50 [data-theme="light"]:bg-secondary-200 text-secondary-300 [data-theme="light"]:text-secondary-700 hover:bg-blue-500/20'
                    }`}
                  >
                    <Mail className="w-3 h-3" />
                    <span>Non lus ({contactMessages.filter(m => !m.is_read).length})</span>
                  </button>
                  <button
                    onClick={() => setContactMessageFilter('unreplied')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 whitespace-nowrap ${
                      contactMessageFilter === 'unreplied'
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-secondary-700/50 [data-theme="light"]:bg-secondary-200 text-secondary-300 [data-theme="light"]:text-secondary-700 hover:bg-orange-500/20'
                    }`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Non répondu ({contactMessages.filter(m => !m.is_replied).length})</span>
                  </button>
                  <button
                    onClick={() => setContactMessageFilter('replied')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 whitespace-nowrap ${
                      contactMessageFilter === 'replied'
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                        : 'bg-secondary-700/50 [data-theme="light"]:bg-secondary-200 text-secondary-300 [data-theme="light"]:text-secondary-700 hover:bg-green-500/20'
                    }`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Répondu ({contactMessages.filter(m => m.is_replied).length})</span>
                  </button>
                </div>

                {/* Tri */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-secondary-400 flex-shrink-0" />
                  <select
                    value={contactMessageSort}
                    onChange={(e) => setContactMessageSort(e.target.value as 'newest' | 'oldest' | 'name')}
                    className="flex-1 bg-secondary-700/50 [data-theme='light']:bg-secondary-200 border border-primary-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white [data-theme='light']:text-dark-500 focus:border-primary-500/50 focus:outline-none"
                  >
                    <option value="newest">Plus récents</option>
                    <option value="oldest">Plus anciens</option>
                    <option value="name">Par nom</option>
                  </select>
                </div>
              </div>
              
              {/* Liste des messages filtrés */}
              <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2 scrollbar-thin scrollbar-thumb-primary-500/20 scrollbar-track-transparent">
              {loading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-secondary-400 mt-4 text-sm">Chargement...</p>
                </div>
              ) : filteredContactMessages.length === 0 ? (
                  <div className="text-center py-12 text-secondary-400">
                    <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">
                    {contactMessageSearch 
                      ? 'Aucun message trouvé' 
                      : contactMessageFilter !== 'all'
                      ? `Aucun message ${contactMessageFilter === 'unread' ? 'non lu' : contactMessageFilter === 'replied' ? 'répondu' : 'non répondu'}`
                      : 'Aucun message'}
                  </p>
                </div>
              ) : (
                  <div className="space-y-2.5 pb-2">
                    {filteredContactMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                          selectedContactMessage?.id === msg.id
                            ? 'glass-effect border-primary-500/50 border-2 shadow-lg shadow-primary-500/20'
                            : 'glass-effect border-primary-500/0 border hover:border-primary-500/20 hover:shadow-md'
                        } ${!msg.is_read ? 'bg-primary-500/10 ring-2 ring-primary-500/20' : ''}`}
                        onClick={async () => {
                          setSelectedContactMessage(msg)
                          if (!msg.is_read) {
                            await contactMessagesApi.markAsRead(msg.id)
                            loadData()
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-white [data-theme='light']:text-dark-500 text-sm truncate">
                                {msg.name}
                              </h4>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {!msg.is_read && (
                                  <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap animate-pulse">
                                    Nouveau
                                  </span>
                                )}
                                {msg.is_replied && (
                                  <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                    Répondu
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600 truncate flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{msg.email}</span>
                            </p>
                          </div>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              try {
                                await navigator.clipboard.writeText(msg.email)
                                // Vous pourriez ajouter une notification ici
                              } catch (err) {
                                console.error('Erreur lors de la copie:', err)
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-primary-500/20 rounded-lg text-secondary-400 hover:text-primary-400 flex-shrink-0"
                            title="Copier l'email"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
              </div>
            </div>

            {/* Zone de message et réponse */}
            <div className="flex-1 lg:w-2/3 xl:w-3/4 flex flex-col min-w-0 min-h-0 overflow-hidden">
              {selectedContactMessage ? (
                <div className="flex flex-col h-full min-h-0 overflow-hidden">
                  {/* Header du message - informations fixes */}
                  <div className="flex items-start justify-between p-4 border-b border-primary-500/20 bg-secondary-800/30 [data-theme='light']:bg-secondary-100/50 flex-shrink-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white [data-theme='light']:text-dark-500 truncate">
                        {selectedContactMessage.name}
                      </h3>
                        {!selectedContactMessage.is_read && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap animate-pulse">
                            Nouveau
                          </span>
                        )}
                        {selectedContactMessage.is_replied && (
                          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                            Répondu
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 group">
                          <Mail className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                          <span className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 truncate flex-1">
                        {selectedContactMessage.email}
                          </span>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              try {
                                await navigator.clipboard.writeText(selectedContactMessage.email)
                                // Notification pourrait être ajoutée ici
                              } catch (err) {
                                console.error('Erreur lors de la copie:', err)
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-primary-500/20 rounded-lg text-secondary-400 hover:text-primary-400"
                            title="Copier l'email"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                    </div>
                        {selectedContactMessage.phone && (
                          <div className="flex items-center gap-2 group">
                            <Phone className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                            <a 
                              href={`tel:${selectedContactMessage.phone}`}
                              className="text-sm text-secondary-400 [data-theme='light']:text-secondary-600 hover:text-primary-400 transition-colors truncate"
                            >
                              {selectedContactMessage.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-secondary-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatRelativeTime(selectedContactMessage.created_at)}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(selectedContactMessage.created_at).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}</span>
                        </div>
                      </div>
                      
                      {/* Source du message si présent dans le sujet */}
                      {selectedContactMessage.subject && (
                        <div className="flex items-center gap-2 text-sm mt-3 pt-3 border-t border-primary-500/10">
                          <MessageSquare className="w-4 h-4 text-primary-400 flex-shrink-0" />
                          <span className="font-medium text-secondary-300 [data-theme='light']:text-secondary-700">
                            Message depuis "{selectedContactMessage.subject}"
                          </span>
                        </div>
                      )}
                      
                      {/* Contenu du message - affiché directement après la date, entièrement visible */}
                      <div className="text-white [data-theme='light']:text-dark-500 whitespace-pre-wrap leading-relaxed text-base break-words mt-3 pt-3 border-t border-primary-500/10" 
                        style={{ 
                          wordBreak: 'break-word', 
                          overflowWrap: 'break-word', 
                          whiteSpace: 'pre-wrap',
                          maxWidth: '100%'
                        }}
                      >
                        {selectedContactMessage.message || 'Aucun message'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={async () => {
                          try {
                            if (selectedContactMessage.is_read) {
                              // Marquer comme non lu (si l'API le supporte)
                            } else {
                              await contactMessagesApi.markAsRead(selectedContactMessage.id)
                              loadData()
                              const response = await contactMessagesApi.getById(selectedContactMessage.id)
                              setSelectedContactMessage(response.data.data)
                            }
                          } catch (error) {
                            console.error('Error:', error)
                          }
                        }}
                        className="text-secondary-400 hover:text-white [data-theme='light']:hover:text-dark-500 transition-colors p-2 hover:bg-primary-500/20 rounded-lg"
                        title={selectedContactMessage.is_read ? "Marquer comme non lu" : "Marquer comme lu"}
                      >
                        {selectedContactMessage.is_read ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    <button
                      onClick={() => setSelectedContactMessage(null)}
                        className="text-secondary-400 hover:text-white [data-theme='light']:hover:text-dark-500 transition-colors p-2 hover:bg-primary-500/20 rounded-lg"
                        title="Fermer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    </div>
                  </div>

                  {/* Zone de contenu scrollable - message, réponses et formulaire */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 scrollbar-thin scrollbar-thumb-primary-500/20 scrollbar-track-transparent">
                    <div className="space-y-4">
                      {/* Zone de contenu pour les réponses */}
                      {selectedContactMessage.is_replied && selectedContactMessage.admin_reply && (
                        <div className="p-4 border-t border-primary-500/20">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-primary-500/20 rounded-xl p-4 border-l-4 border-primary-500 shadow-lg"
                          >
                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-primary-500/20">
                              <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              <span className="text-sm font-semibold text-green-400">Réponse envoyée</span>
                              </div>
                              {selectedContactMessage.replied_at && (
                                <div className="flex items-center gap-2 text-xs text-secondary-400">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{formatRelativeTime(selectedContactMessage.replied_at)}</span>
                                  <span className="mx-1">•</span>
                                  <span>{new Date(selectedContactMessage.replied_at).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}</span>
                                </div>
                              )}
                            </div>
                            <div 
                              className="text-white [data-theme='light']:text-dark-500 prose prose-invert [data-theme='light']:prose-dark max-w-none"
                              dangerouslySetInnerHTML={{ __html: selectedContactMessage.admin_reply }}
                              style={{
                                lineHeight: '1.6',
                              }}
                            />
                          </motion.div>
                        </div>
                      )}

                      {/* Formulaire de réponse */}
                      {!selectedContactMessage.is_replied && selectedContactMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-t border-primary-500/20 p-4 bg-secondary-800/30 [data-theme='light']:bg-secondary-100/50 flex-shrink-0"
                    >
                      <div className="mb-3">
                        <h4 className="text-base font-semibold text-white [data-theme='light']:text-dark-500 mb-1">
                          Répondre à {selectedContactMessage.name}
                        </h4>
                        <p className="text-xs text-secondary-400 [data-theme='light']:text-secondary-600">
                          Votre réponse sera envoyée par email à {selectedContactMessage.email}
                        </p>
                      </div>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault()
                          if (!replyMessage.trim() || isSendingReply || !selectedContactMessage) return
                          
                          setIsSendingReply(true)
                          try {
                            await contactMessagesApi.reply(selectedContactMessage.id, replyMessage)
                            setReplyMessage('')
                            loadData()
                            // Recharger le message sélectionné
                            const response = await contactMessagesApi.getById(selectedContactMessage.id)
                            setSelectedContactMessage(response.data.data)
                          } catch (error) {
                            console.error('Error sending reply:', error)
                            alert('Erreur lors de l\'envoi de la réponse')
                          } finally {
                            setIsSendingReply(false)
                          }
                        }}
                        className="flex flex-col space-y-3"
                      >
                        <div>
                          <label className="block text-sm font-medium text-white [data-theme='light']:text-dark-500 mb-1.5">
                            Votre réponse
                          </label>
                      <RichTextEditor
                        value={replyMessage}
                        onChange={setReplyMessage}
                        placeholder="Tapez votre réponse... (Utilisez les boutons pour formater le texte)"
                        disabled={isSendingReply}
                        className="w-full"
                      />
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            type="submit"
                            disabled={isSendingReply || !replyMessage.replace(/<[^>]*>/g, '').trim()}
                            className="btn-primary px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all hover:shadow-lg hover:shadow-primary-500/30 text-sm"
                          >
                        {isSendingReply ? (
                              <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Envoi en cours...</span>
                              </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Envoyer la réponse</span>
                          </>
                        )}
                      </button>
                          <p className="text-xs text-secondary-500">
                            {replyMessage.replace(/<[^>]*>/g, '').trim().length} caractère{replyMessage.replace(/<[^>]*>/g, '').trim().length > 1 ? 's' : ''}
                          </p>
                        </div>
                    </form>
                    </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-12">
                  <div className="max-w-md">
                    <Mail className="w-20 h-20 mx-auto mb-6 text-secondary-400 opacity-50" />
                    <h3 className="text-xl font-semibold text-white [data-theme='light']:text-dark-500 mb-2">
                      Aucun message sélectionné
                    </h3>
                    <p className="text-secondary-400 [data-theme='light']:text-secondary-600">
                      Sélectionnez un message dans la liste pour voir les détails et répondre
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard

