/**
 * Script pour générer un sitemap.xml statique avec articles de blog
 * À exécuter après chaque build ou lors de la mise à jour du contenu
 * 
 * Usage: node scripts/generate-sitemap.js
 * Ou: npm run generate-sitemap
 * 
 * Variables d'environnement optionnelles:
 * - BASE_URL: URL de base du site (défaut: https://innosft.com)
 * - API_URL: URL de l'API backend (défaut: https://api.innosft.com/api)
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = process.env.BASE_URL || 'https://innosft.com'
const API_URL = process.env.API_URL || 'https://api.innosft.com/api' // Ajustez selon votre configuration
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

// Fonction pour récupérer les articles depuis l'API
function fetchNewsArticles() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}/news`)
    const client = url.protocol === 'https:' ? https : http
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }

    const req = client.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          const articles = response.data || []
          // Filtrer uniquement les articles publiés
          const publishedArticles = articles.filter(article => 
            article.is_published === true || article.is_published === 1
          )
          resolve(publishedArticles)
        } catch (error) {
          console.warn('⚠️  Impossible de récupérer les articles depuis l\'API, utilisation du sitemap sans articles')
          console.warn('   Erreur:', error.message)
          resolve([])
        }
      })
    })

    req.on('error', (error) => {
      console.warn('⚠️  Erreur lors de la récupération des articles:', error.message)
      console.warn('   Le sitemap sera généré sans les articles de blog')
      resolve([])
    })

    req.setTimeout(5000, () => {
      req.destroy()
      console.warn('⚠️  Timeout lors de la récupération des articles')
      resolve([])
    })

    req.end()
  })
}

// Générer le sitemap
async function generateSitemap() {
  console.log('🔄 Génération du sitemap...')
  
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
  
  // Récupérer et ajouter les articles de blog
  try {
    const articles = await fetchNewsArticles()
    
    if (articles.length > 0) {
      console.log(`📰 ${articles.length} article(s) de blog trouvé(s)`)
      
      articles.forEach(article => {
        if (article.slug) {
          const lastmod = article.updated_at 
            ? new Date(article.updated_at).toISOString().split('T')[0]
            : article.published_at
            ? new Date(article.published_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
          
          xml += generateUrlEntry(
            `${BASE_URL}/blog/${article.slug}`,
            '0.8',
            'monthly',
            lastmod
          )
        }
      })
    } else {
      console.log('📰 Aucun article de blog publié trouvé')
    }
  } catch (error) {
    console.warn('⚠️  Erreur lors de la récupération des articles:', error.message)
  }
  
  xml += '</urlset>'
  
  // Écrire le fichier
  fs.writeFileSync(OUTPUT_FILE, xml, 'utf8')
  
  const totalPages = staticPages.length + (await fetchNewsArticles()).length
  console.log(`✅ Sitemap généré avec succès : ${OUTPUT_FILE}`)
  console.log(`   ${staticPages.length} pages statiques`)
  console.log(`   ${totalPages - staticPages.length} articles de blog`)
  console.log(`   Total: ${totalPages} URLs`)
}

// Exécuter
(async () => {
  try {
    await generateSitemap()
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error)
    process.exit(1)
  }
})()

