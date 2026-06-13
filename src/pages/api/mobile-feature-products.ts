import type { APIRoute } from 'astro';
import { getAllProducts, getAllBrands } from '../../lib/collections';

export const GET: APIRoute = async () => {
  try {
    const allProducts = await getAllProducts();
    const brands = await getAllBrands();

    const products = allProducts.slice(0, 100).map(p => {
      // Get optimized image if available
      const optimizedImages = (p as any)._optimized_image || [];
      const thumbnailImage = optimizedImages.length > 0 
        ? optimizedImages.find((img: any) => img.width === 200) || optimizedImages[0]
        : null;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        original_price: p.original_price ?? null,
        image_url: p.image_url ?? null,
        optimized_image_url: thumbnailImage?.path ?? null,
        rating: p.rating ?? null,
        sold_count: p.sold_count ?? 0,
        brand_id: p.brand_id ?? null,
      };
    });

    const transformedBrands = brands.map(b => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
    }));

    return new Response(
      JSON.stringify({ products, brands: transformedBrands }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
