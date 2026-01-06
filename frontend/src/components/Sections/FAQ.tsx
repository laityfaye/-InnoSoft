import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { ChevronDown } from 'lucide-react'

const FAQ = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Quels sont vos délais de livraison ?',
      answer: 'Les délais varient selon la complexité du projet. Pour un site web simple, comptez 2-4 semaines. Pour une application complète, 2-6 mois. Nous établissons un calendrier détaillé dès le début du projet et vous tenons informés à chaque étape.',
    },
    {
      question: 'Proposez-vous un support après la livraison ?',
      answer: 'Oui, nous offrons différents niveaux de support : maintenance corrective, évolutive, formation et accompagnement. Nous adaptons notre offre selon vos besoins pour garantir la pérennité de votre solution.',
    },
    {
      question: 'Quels sont vos tarifs ?',
      answer: 'Nos tarifs sont personnalisés selon la complexité et l\'envergure de votre projet. Nous proposons des devis détaillés gratuits après analyse de vos besoins. Contactez-nous pour discuter de votre projet et obtenir une estimation précise.',
    },
    {
      question: 'Travaillez-vous avec des entreprises internationales ?',
      answer: 'Oui, nous travaillons avec des clients du monde entier. Nous maîtrisons plusieurs langues et nous adaptons aux fuseaux horaires. La communication se fait principalement par visioconférence et outils collaboratifs.',
    },
    {
      question: 'Quelles technologies utilisez-vous ?',
      answer: 'Nous utilisons les technologies les plus modernes et performantes : React, Node.js, Python, React Native, et bien d\'autres. Nous choisissons toujours la meilleure stack technologique adaptée à votre projet spécifique.',
    },
    {
      question: 'Proposez-vous des formations ?',
      answer: 'Oui, nous offrons des formations personnalisées pour vous permettre de gérer et maintenir votre solution en toute autonomie. Nous formons vos équipes sur les outils et processus que nous mettons en place.',
    },
  ]

  return (
    <section ref={ref} className="section-padding bg-dark-600/30 w-full">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight">
            Questions <span className="gradient-text">Fréquentes</span>
          </h2>
          <p className="text-xl text-secondary-400 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions les plus courantes
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="overflow-hidden rounded-xl glass-effect border border-primary-500/10 hover:border-primary-500/30 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 group"
              >
                <span className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors flex-1">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-primary-400 group-hover:text-primary-300 transition-colors" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-secondary-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-secondary-400 mb-4">
            Vous avez d'autres questions ?
          </p>
          <a href="/contact" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors inline-flex items-center gap-2">
            Contactez-nous
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ

