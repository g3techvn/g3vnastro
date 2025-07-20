import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';
import { COMPANY_INFO } from '../constants';

// Google Merchant Center Product Feed
export const GET: APIRoute = async () => {
  try {
    // Fetch products data like ProductList.tsx does
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        brands(title, slug),
        product_cats(title, slug)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    if (!products || products.length === 0) {
      throw new Error('No products found');
    }

    // Generate XML feed
    const baseUrl = COMPANY_INFO.website;
    const now = new Date().toISOString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:g="http://base.google.com/ns/1.0"
     xmlns:c="http://base.google.com/cns/1.0">
  <channel>
    <title>G-3.vn Product Feed</title>
    <link>${baseUrl}</link>
    <description>Ghế công thái học, bàn nâng hạ và phụ kiện văn phòng chất lượng cao</description>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>G-3.vn Product Feed Generator</generator>
    <language>vi</language>
    <copyright>Copyright ${new Date().getFullYear()} ${COMPANY_INFO.name}</copyright>
    
    ${products.map(product => {
      // Get optimized image URL (JPEG for better Google compatibility)
      const imageUrl = product.image_url 
        ? (product.image_url.includes('g3tech-otm') 
            ? `${baseUrl}/${product.image_url.replace('.avif', '.jpg')}`
            : `${baseUrl}/g3tech-otm/products/${product.slug}/${product.image_url.split('/').pop()?.replace(/\.(jpg|jpeg|png|webp)$/i, '.jpg') || 'image.jpg'}`
          )
        : `${baseUrl}/images/no-image.jpg`;

      // Get additional gallery images (JPEG for better Google compatibility)
      const additionalImages: string[] = [];
      if (product.gallery_array && Array.isArray(product.gallery_array)) {
        product.gallery_array.forEach((galleryImg: string) => {
          if (galleryImg && galleryImg !== product.image_url) {
            let optimizedUrl = galleryImg;
            // Convert to optimized JPEG format
            if (galleryImg.startsWith('/g3tech/') && /\.(jpg|jpeg|png|webp)$/i.test(galleryImg)) {
              optimizedUrl = galleryImg.replace(/^\/g3tech\//, '/g3tech-otm/').replace(/\.(jpg|jpeg|png|webp)$/i, '.jpg');
            }
            // Make URL absolute
            if (optimizedUrl.includes('g3tech-otm')) {
              additionalImages.push(`${baseUrl}${optimizedUrl.startsWith('/') ? optimizedUrl : '/' + optimizedUrl}`);
            } else {
              additionalImages.push(`${baseUrl}/g3tech-otm/products/${product.slug}/${galleryImg.split('/').pop()?.replace(/\.(jpg|jpeg|png|webp)$/i, '.jpg') || 'image.jpg'}`);
            }
          }
        });
      }

      // Clean and format description
      const description = product.description 
        ? product.description.replace(/<[^>]*>/g, '').trim().substring(0, 5000)
        : `${product.name} - ${(product as any).brands?.title || 'G3Tech'} chất lượng cao tại G-3.vn`;

      // Get brand and category info from joined data
      const brand = (product as any).brands;
      const category = (product as any).product_cats;

      // Determine Google product category based on category
      let googleProductCategory = 'Furniture > Office Furniture';
      const categorySlug = category?.slug || '';
      
      if (categorySlug.includes('ghe')) {
        googleProductCategory = 'Furniture > Office Furniture > Office Chairs';
      } else if (categorySlug.includes('ban')) {
        googleProductCategory = 'Furniture > Office Furniture > Office Desks';
      } else if (categorySlug.includes('phu-kien')) {
        googleProductCategory = 'Office Supplies';
      }

      // Format price (Google expects price without thousand separators)
      const price = `${product.price} VND`;
      const salePrice = product.original_price && product.original_price > product.price 
        ? `${product.price} VND`
        : null;

      return `<item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.name}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${baseUrl}/san-pham/${product.slug}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      ${additionalImages.slice(0, 10).map(imgUrl => `<g:additional_image_link>${imgUrl}</g:additional_image_link>`).join('\n      ')}
      <g:availability>in stock</g:availability>
      <g:price>${price}</g:price>
      ${salePrice ? `<g:sale_price>${salePrice}</g:sale_price>` : ''}
      <g:brand><![CDATA[${brand?.title || 'G3Tech'}]]></g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${googleProductCategory}</g:google_product_category>
      <g:product_type><![CDATA[${category?.title || 'Sản phẩm văn phòng'}]]></g:product_type>
      <g:identifier_exists>false</g:identifier_exists>
      <g:adult>false</g:adult>
      <g:age_group>adult</g:age_group>
      <g:gender>unisex</g:gender>
      <g:item_group_id>${product.slug}</g:item_group_id>
      <g:shipping>
        <g:country>VN</g:country>
        <g:service>Standard</g:service>
        <g:price>0 VND</g:price>
      </g:shipping>
      <g:shipping_weight>5 kg</g:shipping_weight>
      <g:custom_label_0><![CDATA[${brand?.title || 'G3Tech'}]]></g:custom_label_0>
      <g:custom_label_1><![CDATA[${category?.title || 'Office'}]]></g:custom_label_1>
      <g:custom_label_2>Vietnam</g:custom_label_2>
      <g:custom_label_3>G-3.vn</g:custom_label_3>
      <g:custom_label_4>New</g:custom_label_4>
      <pubDate>${new Date(product.created_at).toUTCString()}</pubDate>
    </item>`;
    }).join('\n    ')}
    
  </channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Last-Modified': now,
      },
    });

  } catch (error) {
    console.error('Error generating product feed:', error);
    
    // Return empty feed on error
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>G-3.vn Product Feed - Error</title>
    <link>${COMPANY_INFO.website}</link>
    <description>Error generating product feed</description>
    <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
  </channel>
</rss>`;

    return new Response(errorXml, {
      status: 500,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  }
}; 