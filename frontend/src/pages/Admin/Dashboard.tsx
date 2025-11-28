import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { adminApi, projectsApi } from '../../services/api'
import { useTheme } from '../../hooks/useTheme'
import { 
  LogOut, MessageSquare, FolderKanban, CheckCircle, XCircle, 
  Edit, Trash2, Plus, Star, Eye, EyeOff, Upload, X, Image as ImageIcon, Video
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

const Dashboard = () => {
  const { isDark } = useTheme()
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'testimonials' | 'projects'>('testimonials')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, authLoading, navigate])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated, activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'testimonials') {
        const response = await adminApi.testimonials.getAll()
        setTestimonials(response.data.data || [])
      } else {
        const response = await projectsApi.getAll()
        setProjects(response.data.data || [])
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white [data-theme='light']:text-dark-500">
              Dashboard Admin
            </h1>
            <p className="text-gray-400 [data-theme='light']:text-gray-600">
              Bienvenue, {user?.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-white/10 [data-theme='light']:border-gray-200">
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'testimonials'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-400 [data-theme="light"]:text-gray-600 hover:text-primary-400'
            }`}
          >
            <MessageSquare className="w-5 h-5 inline mr-2" />
            Témoignages ({testimonials.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'projects'
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-400 [data-theme="light"]:text-gray-600 hover:text-primary-400'
            }`}
          >
            <FolderKanban className="w-5 h-5 inline mr-2" />
            Projets ({projects.length})
          </button>
        </div>

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12 text-gray-400 [data-theme='light']:text-gray-600">
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
                            <p className="text-sm text-gray-500 [data-theme='light']:text-gray-600">
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
                          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Approuvé</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium flex items-center space-x-1">
                            <EyeOff className="w-3 h-3" />
                            <span>En attente</span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 [data-theme='light']:text-gray-700 italic mb-2">
                        "{testimonial.content}"
                      </p>
                      <p className="text-xs text-gray-500 [data-theme='light']:text-gray-600">
                        {new Date(testimonial.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {!testimonial.is_approved && (
                        <button
                          onClick={() => handleApproveTestimonial(testimonial.id)}
                          className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          title="Approuver"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {testimonial.is_approved && (
                        <button
                          onClick={() => handleRejectTestimonial(testimonial.id)}
                          className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                          title="Rejeter"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
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
                      <label className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                        Titre *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                          [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
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
                      <label className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                        Catégorie *
                      </label>
                      <select
                        required
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg 
                          [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white
                          [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                          [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
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
                    <label className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                        [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
                        border focus:outline-none focus:border-primary-500 resize-none"
                      style={{
                        color: isDark ? '#ffffff' : '#111827',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                      Image / Vidéo
                    </label>
                    <div className="space-y-4">
                      {/* Upload de fichier */}
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          [data-theme='dark']:border-gray-600 [data-theme='dark']:bg-gray-800/50 [data-theme='dark']:hover:bg-gray-800
                          [data-theme='light']:border-gray-300 [data-theme='light']:bg-gray-50 [data-theme='light']:hover:bg-gray-100
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
                                <Upload className="w-10 h-10 mb-2 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-400 [data-theme='light']:text-gray-600">
                                  <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-gray-400 [data-theme='light']:text-gray-500">
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
                            className="mt-2 text-sm text-red-400 hover:text-red-300 flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Supprimer le fichier</span>
                          </button>
                        )}
                      </div>

                      {/* Aperçu */}
                      {previewUrl && (
                        <div className="relative rounded-lg overflow-hidden border
                          [data-theme='dark']:border-gray-700
                          [data-theme='light']:border-gray-300">
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
                          <div className="w-full border-t [data-theme='dark']:border-gray-700 [data-theme='light']:border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 [data-theme='dark']:bg-gray-900 [data-theme='dark']:text-gray-400 [data-theme='light']:bg-white [data-theme='light']:text-gray-500">
                            OU
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
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
                            [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white
                            [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                            [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
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
                    <label className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                      Lien du projet
                    </label>
                    <input
                      type="url"
                      value={projectForm.link}
                      onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                        [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
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
                    <label className="block text-sm font-medium text-gray-300 [data-theme='light']:text-gray-700 mb-2">
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={projectForm.tags}
                      onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                      placeholder="React, Laravel, TypeScript"
                      className="w-full px-4 py-2 rounded-lg 
                        [data-theme='dark']:bg-gray-800 [data-theme='dark']:border-gray-700 [data-theme='dark']:text-white
                        [data-theme='dark']:hover:bg-gray-700 [data-theme='dark']:hover:border-gray-600
                        [data-theme='light']:bg-white [data-theme='light']:border-gray-300 [data-theme='light']:text-dark-500 [data-theme='light']:border-2
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
              <div className="text-center py-12 text-gray-400 [data-theme='light']:text-gray-600">
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
                    <p className="text-sm text-gray-400 [data-theme='light']:text-gray-600 mb-2">
                      {project.category}
                    </p>
                    <p className="text-gray-300 [data-theme='light']:text-gray-700 mb-4 text-sm">
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
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
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
      </div>
    </div>
  )
}

export default Dashboard

