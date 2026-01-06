import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

interface Step {
  id: number
  title: string
  icon: React.ComponentType<{ className?: string }>
}

interface CheckoutStepperProps {
  currentStep: number
  steps: Step[]
}

const CheckoutStepper = ({ currentStep, steps }: CheckoutStepperProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Ligne de progression */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-secondary-700 [data-theme='light']:bg-secondary-300 -z-10">
          <motion.div
            className="h-full bg-gradient-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep
          const isCurrent = index + 1 === currentStep
          const Icon = step.icon

          return (
            <div key={step.id} className="flex flex-col items-center flex-1 relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-primary-500 border-primary-500'
                    : isCurrent
                    ? 'bg-primary-500/20 border-primary-500 ring-4 ring-primary-500/20'
                    : 'bg-secondary-800/50 border-secondary-600 [data-theme="light"]:bg-secondary-200 [data-theme="light"]:border-secondary-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Icon
                    className={`w-5 h-5 ${
                      isCurrent
                        ? 'text-primary-400'
                        : 'text-secondary-500 [data-theme="light"]:text-secondary-600'
                    }`}
                  />
                )}
              </motion.div>
              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-semibold ${
                    isCurrent || isCompleted
                      ? 'text-primary-400'
                      : 'text-secondary-500 [data-theme="light"]:text-secondary-600'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CheckoutStepper

