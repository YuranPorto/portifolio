import { useEffect } from 'react'

const DOMAIN = 'https://yuranporto.com.br'

/**
 * SEO component to dynamically manage document head meta tags,
 * canonical links, open graph, twitter cards, and JSON-LD structured data.
 */
export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage = `${DOMAIN}/og-image.svg`,
  jsonLd,
  lang = 'pt-BR'
}) {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title
    }

    // 2. HTML lang attribute
    document.documentElement.lang = lang

    // Helper to update or create meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      if (!content) return
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, attrValue)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Standard Meta Tags
    if (description) {
      setMetaTag('name', 'description', description)
    }
    if (keywords) {
      setMetaTag('name', 'keywords', keywords)
    }

    // Canonical link
    const pageUrl = canonical 
      ? (canonical.startsWith('http') ? canonical : `${DOMAIN}${canonical}`)
      : window.location.href

    let linkCanonical = document.querySelector('link[rel="canonical"]')
    if (!linkCanonical) {
      linkCanonical = document.createElement('link')
      linkCanonical.setAttribute('rel', 'canonical')
      document.head.appendChild(linkCanonical)
    }
    linkCanonical.setAttribute('href', pageUrl)

    // OpenGraph Tags
    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:url', pageUrl)
    setMetaTag('property', 'og:type', ogType)
    setMetaTag('property', 'og:site_name', 'Yuran Porto | Software & Web Development')
    setMetaTag('property', 'og:image', ogImage)
    setMetaTag('property', 'og:locale', lang.startsWith('en') ? 'en_US' : 'pt_BR')

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', title)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', ogImage)

    // JSON-LD Structured Data
    const scriptId = 'dynamic-json-ld'
    let scriptTag = document.getElementById(scriptId)
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.id = scriptId
        scriptTag.type = 'application/ld+json'
        document.head.appendChild(scriptTag)
      }
      scriptTag.text = JSON.stringify(jsonLd)
    } else if (scriptTag) {
      scriptTag.remove()
    }
  }, [title, description, keywords, canonical, ogType, ogImage, jsonLd, lang])

  return null
}
