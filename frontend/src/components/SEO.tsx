import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  author?: string
  // Meta tags pour les articles
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  // Données structurées
  structuredData?: object
}

const SEO = ({
  title = 'InnoSoft Creation - Solutions Technologiques Innovantes',
  description = 'InnoSoft Creation propose des solutions technologiques complètes : développement web, applications mobiles, design graphique, matériel électronique et infrastructures cloud. Transformez vos idées en réalité numérique.',
  keywords = 'développement web, applications mobiles, design graphique, matériel électronique, cloud, Sénégal, Thiès, technologies, innovation, solutions digitales',
  image = '/logo.png',
  url = 'https://innosft.com',
  type = 'website',
  author = 'InnoSoft Creation',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  structuredData
}: SEOProps) => {
  const fullTitle = title.includes('InnoSoft') ? title : `${title} | InnoSoft Creation`
  const fullUrl = url.startsWith('http') ? url : `https://innosft.com${url}`
  const fullImage = image.startsWith('http') ? image : `https://innosft.com${image}`
  const baseUrl = 'https://innosft.com'

  // Données structurées par défaut (Organization)
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'InnoSoft Creation',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Solutions technologiques innovantes pour votre transformation numérique',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SN',
      addressLocality: 'Thiès',
      addressRegion: 'Thiès'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'French'
    },
    sameAs: [
      // Les réseaux sociaux peuvent être ajoutés ici
    ]
  }

  // Données structurées pour les articles
  const articleStructuredData = type === 'article' && publishedTime ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: fullTitle,
    description: description,
    image: fullImage,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Organization',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'InnoSoft Creation',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl
    },
    articleSection: section,
    keywords: tags.length > 0 ? tags.join(', ') : keywords
  } : null

  // Utiliser les données structurées personnalisées ou les données par défaut
  const finalStructuredData = structuredData || (articleStructuredData || defaultStructuredData)

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="InnoSoft Creation" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Open Graph pour les articles */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@innosoft" />

      {/* Additional */}
      <meta name="theme-color" content="#0066FF" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="InnoSoft Creation" />
      
      {/* Preconnect pour améliorer les performances */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Données structurées JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  )
}

export default SEO

