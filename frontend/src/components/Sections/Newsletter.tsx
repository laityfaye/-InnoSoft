import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Send, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const Newsletter = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simuler l'envoi (à remplacer par un appel API réel)
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 5000)
    }, 1000)
  }

  return (
    <section ref={ref} className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-8 shadow-xl"
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            Restez <span className="gradient-text">Informé</span>
          </h2>
          <p className="text-xl text-white/70 [data-theme='light']:text-secondary-600 mb-10 max-w-2xl mx-auto transition-colors">
            Recevez nos dernières actualités, conseils et offres exclusives directement dans votre boîte mail.
          </p>

          {/* Newsletter Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  required
                  className="w-full px-6 py-4 pr-12 rounded-xl glass-effect border border-primary-500/20 focus:border-primary-500/50 focus:outline-none text-white [data-theme='light']:text-dark-500 placeholder:text-secondary-400 [data-theme='light']:placeholder:text-secondary-500 transition-all duration-300"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 [data-theme='light']:text-secondary-500" />
              </div>
              <motion.button
                type="submit"
                disabled={isLoading || isSubscribed}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-8 py-4 flex items-center justify-center space-x-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribed ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Abonné !</span>
                  </>
                ) : isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>S'abonner</span>
                  </>
                )}
              </motion.button>
            </div>

            {isSubscribed && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-green-400 text-sm"
              >
                Merci pour votre abonnement ! Vous recevrez bientôt nos actualités.
              </motion.p>
            )}

            <p className="mt-6 text-sm text-secondary-400 [data-theme='light']:text-secondary-600">
              En vous abonnant, vous acceptez notre politique de confidentialité. 
              Vous pouvez vous désabonner à tout moment.
            </p>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter

