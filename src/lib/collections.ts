/**
 * Helper functions for Astro Content Collections
 * Replaces all Supabase data fetching with local JSON data
 */
import { getCollection, type CollectionEntry } from 'astro:content';

type ProductData = CollectionEntry<'products'>['data'] & {
  brands?: { title: string; slug: string };
  product_cats?: { title: string; slug: string };
};

type BrandData = CollectionEntry<'brands'>['data'];
type CategoryData = CollectionEntry<'categories'>['data'];

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductEntry = ProductData;
export type BrandEntry = BrandData;
export type CategoryEntry = CategoryData;

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getAllProducts() {
  const entries = await getCollection('products');
  return entries
    .map((e: CollectionEntry<'products'>) => ({
      ...e.data,
      // Attach derived helpers
      brands: getBrandInfoById(e.data.brand_id),
      product_cats: getCategoryInfoById(e.data.pd_cat_id),
    }))
    .sort((a: ProductData, b: ProductData) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
}

export async function getProductBySlug(slug: string) {
  const products = await getAllProducts();
  return products.find((p: ProductData) => p.slug === slug) ?? null;
}

export async function getProductsByBrandId(brandId: number) {
  const products = await getAllProducts();
  return products
    .filter((p: ProductData) => p.brand_id === brandId)
    .sort((a: ProductData, b: ProductData) => (a.name ?? '').localeCompare(b.name ?? '', 'vi'));
}

export async function getProductsByCategoryId(categoryId: number) {
  const products = await getAllProducts();
  return products
    .filter((p: ProductData) => p.pd_cat_id === categoryId)
    .sort((a: ProductData, b: ProductData) => (a.name ?? '').localeCompare(b.name ?? '', 'vi'));
}

export async function getRelatedProductsLocal(
  currentProduct: { id: number; pd_cat_id?: number | null; brand_id?: number | null },
  limit = 6
) {
  const products = await getAllProducts();
  const related = products
    .filter((p: ProductData) =>
      p.id !== currentProduct.id &&
      (p.pd_cat_id === currentProduct.pd_cat_id || p.brand_id === currentProduct.brand_id)
    )
    .slice(0, limit);

  // Fill remaining slots with any products
  if (related.length < limit) {
    const others = products
      .filter((p: ProductData) => p.id !== currentProduct.id && !related.find((r: ProductData) => r.id === p.id))
      .slice(0, limit - related.length);
    return [...related, ...others];
  }
  return related;
}

export async function getFeaturedProductsByIds(ids: number[]) {
  const products = await getAllProducts();
  return ids
    .map((id: number) => products.find((p: ProductData) => p.id === id))
    .filter((p): p is Exclude<typeof p, undefined> => p !== undefined);
}

// ─── Brands ───────────────────────────────────────────────────────────────────

// Static lookup maps – built once lazily
let _brandMap: Map<number, { id: number; title: string; slug: string; image_url?: string | null; description?: string | null }> | null = null;
let _categoryMap: Map<number, { id: number; title: string; slug: string; image_url?: string | null; image_square_url?: string | null; description?: string | null }> | null = null;

export async function getAllBrands() {
  const entries = await getCollection('brands');
  return entries.map((e: CollectionEntry<'brands'>) => e.data);
}

export async function getBrandBySlug(slug: string) {
  const brands = await getAllBrands();
  return brands.find((b: BrandData) => b.slug === slug) ?? null;
}

export async function getAllCategories() {
  const entries = await getCollection('categories');
  return entries.map((e: CollectionEntry<'categories'>) => e.data);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getAllCategories();
  return categories.find((c: CategoryData) => c.slug === slug) ?? null;
}

// Synchronous helpers for inline use (returns undefined if not cached yet)
// These are populated after the first getAllProducts() call via pre-build
function getBrandInfoById(brandId?: number | null) {
  if (!brandId) return undefined;
  // Map known ids
  const knownBrands: Record<number, { title: string; slug: string }> = {
    1: { title: 'Gami', slug: 'gami' },
    2: { title: 'Sihoo', slug: 'sihoo' },
    3: { title: 'G3', slug: 'g3' },
  };
  return knownBrands[brandId];
}

function getCategoryInfoById(catId?: number | null) {
  if (!catId) return undefined;
  const knownCats: Record<number, { title: string; slug: string }> = {
    1: { title: 'Ghế công thái học', slug: 'ghe-cong-thai-hoc' },
    2: { title: 'Bàn nâng hạ', slug: 'ban-nang-ha' },
    3: { title: 'Phụ kiện', slug: 'phu-kien' },
  };
  return knownCats[catId];
}

// ─── Stats helpers ────────────────────────────────────────────────────────────

export async function getCategoriesWithProductCount() {
  const [categories, products] = await Promise.all([getAllCategories(), getAllProducts()]);
  return categories.map((cat: CategoryData) => ({
    ...cat,
    product_count: products.filter((p: ProductData) => p.pd_cat_id === cat.id).length,
  }));
}

export async function getBrandsWithProducts() {
  const [brands, products] = await Promise.all([getAllBrands(), getAllProducts()]);
  return brands.map((brand: BrandData) => ({
    ...brand,
    product_count: products.filter((p: ProductData) => p.brand_id === brand.id).length,
  }));
}
