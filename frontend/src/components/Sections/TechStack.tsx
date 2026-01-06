import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const TechStack = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const technologies = {
    frontend: [
      { name: 'React', icon: '⚛️' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'Next.js', icon: '▲' },
      { name: 'Vue.js', icon: '💚' },
      { name: 'Tailwind CSS', icon: '🎨' },
    ],
    backend: [
      { name: 'Node.js', icon: '🟢' },
      { name: 'Python', icon: '🐍' },
      { name: 'PHP', icon: '🐘' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'MongoDB', icon: '🍃' },
    ],
    mobile: [
      { name: 'React Native', icon: '📱' },
      { name: 'Flutter', icon: '💙' },
      { name: 'Swift', icon: '🍎' },
      { name: 'Kotlin', icon: '🟠' },
    ],
    tools: [
      { name: 'Docker', icon: '🐳' },
      { name: 'Git', icon: '📦' },
      { name: 'AWS', icon: '☁️' },
      { name: 'Firebase', icon: '🔥' },
      { name: 'Figma', icon: '🎨' },
    ],
  }

  const categories = [
    { title: 'Frontend', items: technologies.frontend, color: 'primary' },
    { title: 'Backend', items: technologies.backend, color: 'secondary' },
    { title: 'Mobile', items: technologies.mobile, color: 'accent' },
    { title: 'Outils', items: technologies.tools, color: 'primary' },
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
            Technologies & <span className="gradient-text">Outils</span>
          </h2>
          <p className="text-xl text-secondary-400 max-w-2xl mx-auto">
            Nous utilisons les meilleures technologies du marché pour créer des solutions performantes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl glass-effect border border-primary-500/10 hover:border-primary-500/30 transition-all duration-500">
                <h3 className="text-xl font-bold mb-6 text-white group-hover:text-primary-400 transition-colors">
                  {category.title}
                </h3>
                <div className="space-y-4">
                  {category.items.map((tech, techIndex) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: categoryIndex * 0.1 + techIndex * 0.05, duration: 0.4 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-dark-600/50 hover:bg-primary-500/10 transition-colors group/item"
                    >
                      <span className="text-2xl">{tech.icon}</span>
                      <span className="text-white font-medium group-hover/item:text-primary-400 transition-colors">
                        {tech.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-secondary-400 text-sm">
            Notre stack technologique évolue constamment pour intégrer les dernières innovations
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default TechStack

