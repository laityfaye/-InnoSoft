import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full border p-1 transition-all duration-300 
        [data-theme='dark']:bg-white/10 [data-theme='dark']:border-white/20 [data-theme='dark']:hover:bg-white/15
        [data-theme='light']:bg-gray-100 [data-theme='light']:border-2 [data-theme='light']:border-gray-400 
        [data-theme='light']:hover:bg-gray-200 [data-theme='light']:hover:border-primary-400
        shadow-sm [data-theme='light']:shadow-md
        focus:outline-none focus:ring-2 focus:ring-primary-500/50"
      aria-label={`Basculer vers le mode ${isDark ? 'clair' : 'sombre'}`}
    >
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg [data-theme='light']:shadow-xl"
        animate={{
          x: isDark ? 0 : 24,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-white" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-white" />
        )}
      </motion.div>
    </button>
  )
}

export default ThemeToggle

