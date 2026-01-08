import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as SimpleIcons from 'simple-icons'

// Fonction helper pour convertir un slug en nom d'icône simple-icons
const slugToIconName = (slug: string): string => {
  // Convertir nextdotjs -> Nextdotjs, vuedotjs -> Vuedotjs, etc.
  // Remplacer "dot" par "Dot" et mettre la première lettre en majuscule
  return slug
    .replace(/dot/g, 'Dot')
    .charAt(0)
    .toUpperCase() + slug.replace(/dot/g, 'Dot').slice(1)
}

// Fonction helper pour obtenir l'icône Simple Icons
const getIcon = (slug: string) => {
  try {
    const iconName = `si${slugToIconName(slug)}`
    return (SimpleIcons as any)[iconName] || null
  } catch {
    return null
  }
}

// Composant pour afficher le logo SVG
const TechIcon = ({ iconName, name }: { iconName: string; name: string }) => {
  const icon = getIcon(iconName)
  
  if (!icon) {
    // Fallback si l'icône n'est pas trouvée
    return (
      <div className="w-6 h-6 rounded bg-primary-500/20 flex items-center justify-center">
        <span className="text-xs text-primary-400 font-bold">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  // Remplacer le SVG pour ajouter les attributs nécessaires
  const svgContent = icon.svg
    .replace('<svg', `<svg width="24" height="24"`)
    .replace(/fill="[^"]*"/g, `fill="#${icon.hex}"`)
    .replace(/<svg([^>]*)>/, `<svg$1 fill="#${icon.hex}">`)

  return (
    <div 
      className="w-6 h-6 flex items-center justify-center flex-shrink-0 [&_svg]:w-full [&_svg]:h-full"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}

const TechStack = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const technologies = {
    frontend: [
      { name: 'React', iconKey: 'react' },
      { name: 'TypeScript', iconKey: 'typescript' },
      { name: 'Next.js', iconKey: 'nextdotjs' },
      { name: 'Vue.js', iconKey: 'vuedotjs' },
      { name: 'Tailwind CSS', iconKey: 'tailwindcss' },
    ],
    backend: [
      { name: 'Node.js', iconKey: 'nodedotjs' },
      { name: 'Python', iconKey: 'python' },
      { name: 'PHP', iconKey: 'php' },
      { name: 'PostgreSQL', iconKey: 'postgresql' },
      { name: 'MongoDB', iconKey: 'mongodb' },
    ],
    mobile: [
      { name: 'React Native', iconKey: 'react' },
      { name: 'Flutter', iconKey: 'flutter' },
      { name: 'Swift', iconKey: 'swift' },
      { name: 'Kotlin', iconKey: 'kotlin' },
    ],
    tools: [
      { name: 'Docker', iconKey: 'docker' },
      { name: 'Git', iconKey: 'git' },
      { name: 'AWS', iconKey: 'amazonaws' },
      { name: 'Firebase', iconKey: 'firebase' },
      { name: 'Figma', iconKey: 'figma' },
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
                      <TechIcon iconName={tech.iconKey} name={tech.name} />
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

