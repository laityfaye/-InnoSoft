/**
 * Script pour générer un sitemap.xml statique
 * À exécuter après chaque build ou lors de la mise à jour du contenu
 */

const fs = require('fs')
const path = require('path')

const BASE_URL = 'https://innosft.com'
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml')

// Pages statiques principales
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/services', priority: '0.9', changefreq: 'monthly' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/portfolio', priority: '0.9', changefreq: 'weekly' },
  { url: '/products', priority: '0.8', changefreq: 'weekly' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
]

// Fonction pour générer une entrée URL
function generateUrlEntry(url, priority, changefreq, lastmod = null) {
  const lastmodDate = lastmod || new Date().toISOString().split('T')[0]
  
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`
}

// Générer le sitemap
function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  // Ajouter les pages statiques
  staticPages.forEach(page => {
    xml += generateUrlEntry(
      `${BASE_URL}${page.url}`,
      page.priority,
      page.changefreq
    )
  })
  
  // Note: Les articles de blog peuvent être ajoutés dynamiquement
  // via une API call ou en incluant un fichier de données
  
  xml += '</urlset>'
  
  // Écrire le fichier
  fs.writeFileSync(OUTPUT_FILE, xml, 'utf8')
  console.log(`✅ Sitemap généré avec succès : ${OUTPUT_FILE}`)
  console.log(`   ${staticPages.length} pages incluses`)
}

// Exécuter
try {
  generateSitemap()
} catch (error) {
  console.error('❌ Erreur lors de la génération du sitemap:', error)
  process.exit(1)
}

