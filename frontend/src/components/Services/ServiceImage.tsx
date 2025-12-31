interface ServiceImageProps {
  serviceId: string
  className?: string
}

const ServiceImage = ({ serviceId, className = '' }: ServiceImageProps) => {
  const renderImage = () => {
    switch (serviceId) {
      case 'web':
        return (
          <svg viewBox="0 0 800 600" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background gradient */}
            <rect width="800" height="600" fill="url(#webGradient)" />
            <defs>
              <linearGradient id="webGradient" x1="0" y1="0" x2="800" y2="600">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="#1a0000" />
              </linearGradient>
              <linearGradient id="webRed" x1="0" y1="0" x2="400" y2="300">
                <stop offset="0%" stopColor="#F44336" />
                <stop offset="100%" stopColor="#D32F2F" />
              </linearGradient>
            </defs>
            
            {/* Browser window */}
            <rect x="150" y="100" width="500" height="350" rx="8" fill="rgba(244, 67, 54, 0.1)" stroke="url(#webRed)" strokeWidth="2" />
            
            {/* Browser header */}
            <rect x="150" y="100" width="500" height="40" rx="8" fill="url(#webRed)" opacity="0.3" />
            <circle cx="170" cy="120" r="5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="190" cy="120" r="5" fill="#FFFFFF" opacity="0.6" />
            <circle cx="210" cy="120" r="5" fill="#FFFFFF" opacity="0.4" />
            
            {/* Code lines */}
            <rect x="180" y="180" width="200" height="4" rx="2" fill="url(#webRed)" opacity="0.8" />
            <rect x="180" y="200" width="280" height="4" rx="2" fill="url(#webRed)" opacity="0.6" />
            <rect x="180" y="220" width="240" height="4" rx="2" fill="url(#webRed)" opacity="0.8" />
            <rect x="200" y="240" width="180" height="4" rx="2" fill="url(#webRed)" opacity="0.5" />
            <rect x="180" y="260" width="300" height="4" rx="2" fill="url(#webRed)" opacity="0.7" />
            
            {/* Web elements */}
            <circle cx="500" cy="220" r="40" fill="url(#webRed)" opacity="0.2" />
            <circle cx="520" cy="280" r="30" fill="url(#webRed)" opacity="0.15" />
            <rect x="460" y="320" width="80" height="60" rx="4" fill="url(#webRed)" opacity="0.2" />
            
            {/* Glow effects */}
            <circle cx="400" cy="300" r="100" fill="url(#webRed)" opacity="0.1" />
          </svg>
        )
      
      case 'mobile':
        return (
          <svg viewBox="0 0 800 600" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="600" fill="url(#mobileGradient)" />
            <defs>
              <linearGradient id="mobileGradient" x1="0" y1="0" x2="800" y2="600">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="#1a0000" />
              </linearGradient>
              <linearGradient id="mobileRed" x1="0" y1="0" x2="200" y2="400">
                <stop offset="0%" stopColor="#F44336" />
                <stop offset="100%" stopColor="#D32F2F" />
              </linearGradient>
            </defs>
            
            {/* Phone frame */}
            <rect x="300" y="80" width="200" height="440" rx="30" fill="rgba(244, 67, 54, 0.1)" stroke="url(#mobileRed)" strokeWidth="3" />
            <rect x="310" y="140" width="180" height="320" rx="20" fill="rgba(244, 67, 54, 0.15)" />
            
            {/* Notch */}
            <rect x="370" y="80" width="60" height="20" rx="10" fill="url(#mobileRed)" opacity="0.5" />
            
            {/* App icons grid */}
            <rect x="330" y="160" width="50" height="50" rx="12" fill="url(#mobileRed)" opacity="0.4" />
            <rect x="400" y="160" width="50" height="50" rx="12" fill="url(#mobileRed)" opacity="0.5" />
            <rect x="470" y="160" width="50" height="50" rx="12" fill="url(#mobileRed)" opacity="0.3" />
            
            <rect x="330" y="230" width="50" height="50" rx="12" fill="url(#mobileRed)" opacity="0.5" />
            <rect x="400" y="230" width="50" height="50" rx="12" fill="url(#mobileRed)" opacity="0.4" />
            <rect x="470" y="230" width="50" height="50" rx="12" fill="url(#mobileRed)" opacity="0.6" />
            
            <rect x="330" y="300" width="50" height="50" rx="12" fill="url(#mobileRed)" opacity="0.3" />
            <rect x="400" y="300" width="50" height="50" rx="12" fill="url(#mobileRed)" opacity="0.5" />
            <rect x="470" y="300" width="50" height="50" rx="12" fill="url(#mobileRed)" opacity="0.4" />
            
            {/* Home indicator */}
            <rect x="370" y="500" width="60" height="4" rx="2" fill="url(#mobileRed)" opacity="0.6" />
            
            {/* Glow */}
            <circle cx="400" cy="300" r="120" fill="url(#mobileRed)" opacity="0.08" />
          </svg>
        )
      
      case 'design':
        return (
          <svg viewBox="0 0 800 600" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="600" fill="url(#designGradient)" />
            <defs>
              <linearGradient id="designGradient" x1="0" y1="0" x2="800" y2="600">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="#1a0000" />
              </linearGradient>
              <linearGradient id="designRed" x1="0" y1="0" x2="400" y2="300">
                <stop offset="0%" stopColor="#FF5252" />
                <stop offset="100%" stopColor="#F44336" />
              </linearGradient>
            </defs>
            
            {/* Color palette circles */}
            <circle cx="200" cy="200" r="60" fill="url(#designRed)" opacity="0.4" />
            <circle cx="280" cy="180" r="50" fill="url(#designRed)" opacity="0.3" />
            <circle cx="240" cy="280" r="45" fill="url(#designRed)" opacity="0.35" />
            
            {/* Geometric shapes */}
            <rect x="450" y="150" width="120" height="120" rx="20" transform="rotate(45 510 210)" fill="url(#designRed)" opacity="0.3" stroke="url(#designRed)" strokeWidth="2" />
            <polygon points="500,320 580,250 620,330" fill="url(#designRed)" opacity="0.25" stroke="url(#designRed)" strokeWidth="2" />
            
            {/* Brush strokes */}
            <path d="M150 400 Q200 350 250 400 T350 400" stroke="url(#designRed)" strokeWidth="8" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M400 450 Q450 400 500 450 T600 450" stroke="url(#designRed)" strokeWidth="6" fill="none" opacity="0.4" strokeLinecap="round" />
            
            {/* Design elements */}
            <rect x="520" y="380" width="100" height="100" rx="10" fill="url(#designRed)" opacity="0.2" />
            <circle cx="570" cy="430" r="30" fill="url(#designRed)" opacity="0.3" />
            
            {/* Glow */}
            <circle cx="400" cy="300" r="150" fill="url(#designRed)" opacity="0.1" />
          </svg>
        )
      
      case 'hardware':
        return (
          <svg viewBox="0 0 800 600" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="600" fill="url(#hardwareGradient)" />
            <defs>
              <linearGradient id="hardwareGradient" x1="0" y1="0" x2="800" y2="600">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="#1a0000" />
              </linearGradient>
              <linearGradient id="hardwareRed" x1="0" y1="0" x2="400" y2="300">
                <stop offset="0%" stopColor="#F44336" />
                <stop offset="100%" stopColor="#C62828" />
              </linearGradient>
            </defs>
            
            {/* Server rack */}
            <rect x="300" y="120" width="200" height="360" rx="8" fill="rgba(244, 67, 54, 0.1)" stroke="url(#hardwareRed)" strokeWidth="2" />
            
            {/* Server units */}
            <rect x="320" y="150" width="160" height="40" rx="4" fill="url(#hardwareRed)" opacity="0.3" />
            <rect x="330" y="158" width="30" height="24" rx="2" fill="url(#hardwareRed)" opacity="0.6" />
            <rect x="370" y="158" width="30" height="24" rx="2" fill="url(#hardwareRed)" opacity="0.6" />
            <rect x="410" y="158" width="30" height="24" rx="2" fill="url(#hardwareRed)" opacity="0.6" />
            
            <rect x="320" y="210" width="160" height="40" rx="4" fill="url(#hardwareRed)" opacity="0.25" />
            <rect x="330" y="218" width="30" height="24" rx="2" fill="url(#hardwareRed)" opacity="0.5" />
            <rect x="370" y="218" width="30" height="24" rx="2" fill="url(#hardwareRed)" opacity="0.5" />
            
            <rect x="320" y="270" width="160" height="40" rx="4" fill="url(#hardwareRed)" opacity="0.3" />
            <rect x="330" y="278" width="30" height="24" rx="2" fill="url(#hardwareRed)" opacity="0.6" />
            <rect x="370" y="278" width="30" height="24" rx="2" fill="url(#hardwareRed)" opacity="0.6" />
            
            {/* CPU */}
            <rect x="180" y="250" width="80" height="80" rx="8" fill="url(#hardwareRed)" opacity="0.2" stroke="url(#hardwareRed)" strokeWidth="2" />
            <rect x="190" y="260" width="60" height="60" rx="4" fill="url(#hardwareRed)" opacity="0.3" />
            
            {/* Network elements */}
            <circle cx="540" cy="280" r="40" fill="url(#hardwareRed)" opacity="0.2" stroke="url(#hardwareRed)" strokeWidth="2" />
            <circle cx="540" cy="280" r="20" fill="url(#hardwareRed)" opacity="0.4" />
            
            {/* Glow */}
            <circle cx="400" cy="300" r="120" fill="url(#hardwareRed)" opacity="0.1" />
          </svg>
        )
      
      case 'cloud':
        return (
          <svg viewBox="0 0 800 600" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="600" fill="url(#cloudGradient)" />
            <defs>
              <linearGradient id="cloudGradient" x1="0" y1="0" x2="800" y2="600">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="#1a0000" />
              </linearGradient>
              <linearGradient id="cloudRed" x1="0" y1="0" x2="400" y2="300">
                <stop offset="0%" stopColor="#F44336" />
                <stop offset="100%" stopColor="#E53935" />
              </linearGradient>
            </defs>
            
            {/* Cloud shapes */}
            <ellipse cx="350" cy="200" rx="80" ry="60" fill="url(#cloudRed)" opacity="0.3" />
            <ellipse cx="380" cy="220" rx="70" ry="50" fill="url(#cloudRed)" opacity="0.35" />
            <ellipse cx="320" cy="240" rx="90" ry="55" fill="url(#cloudRed)" opacity="0.25" />
            
            <ellipse cx="550" cy="280" rx="70" ry="50" fill="url(#cloudRed)" opacity="0.3" />
            <ellipse cx="580" cy="300" rx="60" ry="45" fill="url(#cloudRed)" opacity="0.35" />
            <ellipse cx="520" cy="320" rx="80" ry="50" fill="url(#cloudRed)" opacity="0.25" />
            
            <ellipse cx="200" cy="350" rx="60" ry="45" fill="url(#cloudRed)" opacity="0.3" />
            <ellipse cx="230" cy="370" rx="50" ry="40" fill="url(#cloudRed)" opacity="0.35" />
            <ellipse cx="170" cy="390" rx="70" ry="45" fill="url(#cloudRed)" opacity="0.25" />
            
            {/* Connection lines */}
            <line x1="350" y1="240" x2="550" y2="320" stroke="url(#cloudRed)" strokeWidth="2" opacity="0.3" />
            <line x1="550" y1="320" x2="230" y2="390" stroke="url(#cloudRed)" strokeWidth="2" opacity="0.3" />
            <line x1="230" y1="390" x2="350" y2="240" stroke="url(#cloudRed)" strokeWidth="2" opacity="0.3" />
            
            {/* Data nodes */}
            <circle cx="350" cy="240" r="8" fill="url(#cloudRed)" opacity="0.6" />
            <circle cx="550" cy="320" r="8" fill="url(#cloudRed)" opacity="0.6" />
            <circle cx="230" cy="390" r="8" fill="url(#cloudRed)" opacity="0.6" />
            
            {/* Glow */}
            <circle cx="400" cy="300" r="180" fill="url(#cloudRed)" opacity="0.08" />
          </svg>
        )
      
      case 'integration':
        return (
          <svg viewBox="0 0 800 600" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="600" fill="url(#integrationGradient)" />
            <defs>
              <linearGradient id="integrationGradient" x1="0" y1="0" x2="800" y2="600">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="#1a0000" />
              </linearGradient>
              <linearGradient id="integrationRed" x1="0" y1="0" x2="400" y2="300">
                <stop offset="0%" stopColor="#FF5252" />
                <stop offset="100%" stopColor="#F44336" />
              </linearGradient>
            </defs>
            
            {/* Connected boxes */}
            <rect x="150" y="180" width="120" height="100" rx="8" fill="url(#integrationRed)" opacity="0.2" stroke="url(#integrationRed)" strokeWidth="2" />
            <rect x="160" y="190" width="100" height="80" rx="4" fill="url(#integrationRed)" opacity="0.15" />
            
            <rect x="530" y="180" width="120" height="100" rx="8" fill="url(#integrationRed)" opacity="0.2" stroke="url(#integrationRed)" strokeWidth="2" />
            <rect x="540" y="190" width="100" height="80" rx="4" fill="url(#integrationRed)" opacity="0.15" />
            
            <rect x="340" y="320" width="120" height="100" rx="8" fill="url(#integrationRed)" opacity="0.2" stroke="url(#integrationRed)" strokeWidth="2" />
            <rect x="350" y="330" width="100" height="80" rx="4" fill="url(#integrationRed)" opacity="0.15" />
            
            {/* Connection arrows */}
            <path d="M270 230 L430 230" stroke="url(#integrationRed)" strokeWidth="3" opacity="0.5" markerEnd="url(#arrowhead)" />
            <path d="M430 230 L400 320" stroke="url(#integrationRed)" strokeWidth="3" opacity="0.5" markerEnd="url(#arrowhead)" />
            <path d="M270 230 L400 320" stroke="url(#integrationRed)" strokeWidth="3" opacity="0.5" markerEnd="url(#arrowhead)" />
            
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="url(#integrationRed)" opacity="0.5" />
              </marker>
            </defs>
            
            {/* Data flow */}
            <circle cx="270" cy="230" r="6" fill="url(#integrationRed)" opacity="0.7" />
            <circle cx="430" cy="230" r="6" fill="url(#integrationRed)" opacity="0.7" />
            <circle cx="400" cy="370" r="6" fill="url(#integrationRed)" opacity="0.7" />
            
            {/* Glow */}
            <circle cx="400" cy="300" r="150" fill="url(#integrationRed)" opacity="0.1" />
          </svg>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {renderImage()}
      {/* Additional overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
    </div>
  )
}

export default ServiceImage

