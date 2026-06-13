import type { APIRoute } from 'astro';
import { getAllProducts } from '../lib/collections';

export const GET: APIRoute = async () => {
  try {
    const products = await getAllProducts();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${products.map(product => {
  const lastmod = product.updated_at || product.created_at;
  return `  <url>
    <loc>https://g-3.vn/san-pham/${product.slug}</loc>
    <lastmod>${new Date(lastmod ?? Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating products sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
};