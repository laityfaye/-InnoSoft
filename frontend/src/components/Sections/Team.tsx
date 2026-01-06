import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Linkedin, Github, Mail, Users } from 'lucide-react'
import { teamApi } from '../../services/api'

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
  is_active: boolean
}

const Team = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeam()
  }, [])

  const loadTeam = async () => {
    try {
      setLoading(true)
      const response = await teamApi.getAll()
      setTeamMembers(response.data.data || [])
    } catch (error) {
      console.error('Error loading team:', error)
      setTeamMembers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section ref={ref} className="section-padding relative overflow-hidden w-full">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-accent-500/5" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect text-sm font-medium text-primary-300 mb-6"
          >
            <Users className="w-4 h-4" />
            <span>Notre Équipe</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            Rencontrez <span className="gradient-text">L'Équipe</span>
          </h2>
          <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600 max-w-2xl mx-auto transition-colors">
            Des experts passionnés dédiés à votre succès
          </p>
        </motion.div>

        {/* Team Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto mb-4 text-secondary-400 [data-theme='light']:text-secondary-600" />
            <p className="text-xl text-secondary-400 [data-theme='light']:text-secondary-600">
              Aucun membre de l'équipe disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-0">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden glass-effect card-hover border-primary-500/0 group-hover:border-primary-500/20 transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-60 sm:h-70 md:h-80 overflow-hidden">
                    {member.image ? (
                      <motion.img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                        <Users className="w-24 h-24 text-primary-400/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-500/90 via-dark-500/50 to-transparent" />
                    
                    {/* Social Links */}
                    {(member.linkedin || member.github || member.email) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-3"
                      >
                        {member.linkedin && (
                          <motion.a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white hover:text-primary-400 transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </motion.a>
                        )}
                        {member.github && (
                          <motion.a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white hover:text-primary-400 transition-colors"
                          >
                            <Github className="w-5 h-5" />
                          </motion.a>
                        )}
                        {member.email && (
                          <motion.a
                            href={`mailto:${member.email}`}
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white hover:text-primary-400 transition-colors"
                          >
                            <Mail className="w-5 h-5" />
                          </motion.a>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 md:p-6 text-center">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 text-white [data-theme='light']:text-dark-500 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-primary-400 mb-2 sm:mb-3 text-xs sm:text-sm font-medium">
                      {member.role}
                    </p>
                    <p className="text-secondary-400 [data-theme='light']:text-secondary-600 text-xs sm:text-sm leading-relaxed transition-colors">
                      {member.bio}
                    </p>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute -inset-4 bg-gradient-primary opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700 -z-10" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Team

