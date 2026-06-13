import { defineCollection, z } from 'astro:content';

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  content: z.string().optional(),
  price: z.number(),
  original_price: z.number().optional().nullable(),
  image_url: z.string().optional().nullable(),
  image_square_url: z.string().optional().nullable(),
  gallery_url: z.string().optional().nullable(),
  gallery_array: z.array(z.string()).optional().default([]),
  video_url: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  sold_count: z.number().optional().default(0),
  brand_id: z.number().optional().nullable(),
  pd_cat_id: z.number().optional().nullable(),
  stock_status: z.string().optional().nullable(),
  status: z.string().optional().default('active'),
  tinh_nang: z.array(z.string()).optional().default([]),
  loi_ich: z.array(z.string()).optional().default([]),
  huong_dan: z.array(z.string()).optional().default([]),
  thong_so_ky_thuat: z.array(z.object({
    title: z.string(),
    value: z.string(),
  })).optional().default([]),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  // Optimized image metadata (added by build script)
  _optimized_image: z.array(z.object({
    path: z.string(),
    width: z.number(),
    size: z.number(),
  })).optional().default([]),
  _optimized_gallery: z.array(z.array(z.object({
    path: z.string(),
    width: z.number(),
    size: z.number(),
  }))).optional().default([]),
});

const brandSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
});

const categorySchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  image_square_url: z.string().optional().nullable(),
});

export const collections = {
  products: defineCollection({ type: 'data', schema: productSchema }),
  brands: defineCollection({ type: 'data', schema: brandSchema }),
  categories: defineCollection({ type: 'data', schema: categorySchema }),
};
