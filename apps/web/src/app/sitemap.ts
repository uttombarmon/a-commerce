import { MetadataRoute } from 'next'
import { RELATED_PRODUCTS } from '@/lib/mock-products'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://acommerce.com'
  
  // Static pages
  const staticPages = [
    '',
    '/search',
    '/wishlists',
    '/cart',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic product pages
  const productPages = RELATED_PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...productPages]
}
