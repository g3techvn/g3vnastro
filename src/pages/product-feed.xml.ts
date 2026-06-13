import type { APIRoute } from 'astro';
import { getAllProducts } from '../lib/collections';
import { COMPANY_INFO } from '../constants';

// Google Merchant Center Product Feed
export const GET: APIRoute = async () => {
  try {
    const rawProducts = await getAllProducts();

    // Filter products that are suitable for the feed
    let products = rawProducts.filter(product => {
      if (!product.name || !product.slug || !product.id) return false;
      const price = product.price || 0;
      if (price < 1000) return false;
      return true;
    });

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
    
    ${(products || []).map(product => {
      // Skip products without essential data
      if (!product.name || !product.slug || !product.id) {
        console.warn(`Skipping product ${product.id || 'unknown'}: missing essential data`);
        return '';
      }

      // Skip products that are explicitly inactive
      if (product.status === 'inactive' || product.status === 'draft') {
        return '';
      }

      // Ensure price is valid (set minimum price if needed)
      const productPrice = Math.max(product.price || 0, 1000); // Minimum 1000 VND
      if (productPrice <= 0) {
        console.warn(`Skipping product ${product.id}: invalid price`);
        return '';
      }

      // Get optimized image URL (JPEG for better Google compatibility)
      let imageUrl = `${baseUrl}/images/no-image.jpg`; // Default fallback

      if (product.image_url) {
        if (product.image_url.startsWith('http')) {
          // External URL - use as is but ensure HTTPS
          imageUrl = product.image_url.replace('http://', 'https://');
        } else if (product.image_url.includes('g3tech-otm')) {
          // Already optimized path
          imageUrl = `${baseUrl}${product.image_url.startsWith('/') ? '' : '/'}${product.image_url.replace('.avif', '.jpg')}`;
        } else {
          // Convert to optimized path
          const filename = product.image_url.split('/').pop()?.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '.jpg') || 'image.jpg';
          imageUrl = `${baseUrl}/g3tech-otm/products/${product.slug}/${filename}`;
        }
      }

      // Get additional gallery images (JPEG for better Google compatibility)
      const additionalImages: string[] = [];
      if (product.gallery_array && Array.isArray(product.gallery_array)) {
        product.gallery_array.forEach((galleryImg: string) => {
          if (galleryImg && galleryImg !== product.image_url && additionalImages.length < 10) {
            let optimizedUrl = '';

            if (galleryImg.startsWith('http')) {
              // External URL - use as is but ensure HTTPS
              optimizedUrl = galleryImg.replace('http://', 'https://');
            } else if (galleryImg.includes('g3tech-otm')) {
              // Already optimized path
              optimizedUrl = `${baseUrl}${galleryImg.startsWith('/') ? '' : '/'}${galleryImg.replace('.avif', '.jpg')}`;
            } else {
              // Convert to optimized path
              const filename = galleryImg.split('/').pop()?.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '.jpg') || 'image.jpg';
              optimizedUrl = `${baseUrl}/g3tech-otm/products/${product.slug}/${filename}`;
            }

            if (optimizedUrl) {
              additionalImages.push(optimizedUrl);
            }
          }
        });
      }

      // Clean and format description (Google requires min 10 chars, max 5000)
      let description = '';
      if (product.description) {
        description = product.description
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim()
          .substring(0, 5000);
      }

      // Fallback description if empty or too short
      if (!description || description.length < 10) {
        const brandTitle = product.brands?.title || 'G3Tech';
        const categoryTitle = product.product_cats?.title || 'sản phẩm văn phòng';
        description = `${product.name} - ${brandTitle} chất lượng cao. ${categoryTitle} chính hãng với bảo hành đầy đủ. Giao hàng nhanh toàn quốc tại G-3.vn.`;
      }

      // Get brand and category info from joined data or use defaults
      const brand = product.brands || { title: 'G3Tech', slug: 'g3tech' };
      const category = product.product_cats || { title: 'Sản phẩm văn phòng', slug: 'san-pham-van-phong' };

      // Determine Google product category based on category (more specific mapping)
      let googleProductCategory = 'Furniture > Office Furniture';
      const categorySlug = category?.slug || '';
      const productName = product.name.toLowerCase();

      if (categorySlug.includes('ghe') || productName.includes('ghế')) {
        if (productName.includes('gaming') || productName.includes('game')) {
          googleProductCategory = 'Furniture > Chairs > Gaming Chairs';
        } else if (productName.includes('công thái học') || productName.includes('ergonomic')) {
          googleProductCategory = 'Furniture > Office Furniture > Office Chairs';
        } else {
          googleProductCategory = 'Furniture > Office Furniture > Office Chairs';
        }
      } else if (categorySlug.includes('ban') || productName.includes('bàn')) {
        if (productName.includes('nâng hạ') || productName.includes('standing')) {
          googleProductCategory = 'Furniture > Office Furniture > Standing Desks';
        } else {
          googleProductCategory = 'Furniture > Office Furniture > Office Desks';
        }
      } else if (categorySlug.includes('phu-kien') || categorySlug.includes('accessory')) {
        googleProductCategory = 'Office Supplies';
      } else if (categorySlug.includes('tu') || productName.includes('tủ')) {
        googleProductCategory = 'Furniture > Office Furniture > Office Storage';
      } else if (categorySlug.includes('den') || productName.includes('đèn')) {
        googleProductCategory = 'Lighting > Lamps > Desk Lamps';
      }

      // Determine availability - Default to in_stock for better Google Merchant performance
      let availability = 'in_stock';

      // Only set out_of_stock for explicitly marked products
      if (product.stock_status === 'out_of_stock' || product.status === 'inactive' || product.status === 'draft') {
        availability = 'out_of_stock';
      }

      // FORCE ALL PRODUCTS TO BE IN STOCK (uncomment if needed)
      // availability = 'in_stock';

      // Debug logging for availability issues
      if (availability !== 'in_stock') {
        console.log(`Product ${product.id} (${product.name}): availability=${availability}`);
      }

      const currentPrice = productPrice;
      const originalPrice = Math.max(0, product.original_price || 0);

      const hasDiscount = originalPrice > 0 && originalPrice > currentPrice;
      const regularPrice = hasDiscount ? `${originalPrice.toFixed(0)} VND` : `${currentPrice.toFixed(0)} VND`;
      const salePrice = hasDiscount ? `${currentPrice.toFixed(0)} VND` : null;

      // Generate unique ID for Google (required)
      const productId = `${product.id}_${product.slug}`.replace(/[^a-zA-Z0-9_-]/g, '');

      // Ensure title is not too long (max 150 chars for Google)
      const title = product.name.length > 150 ? product.name.substring(0, 147) + '...' : product.name;

      return `<item>
      <g:id>${productId}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${baseUrl}/san-pham/${product.slug}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      ${additionalImages.map(imgUrl => `<g:additional_image_link>${imgUrl}</g:additional_image_link>`).join('\n      ')}
      <g:availability>${availability}</g:availability>
      <g:price>${regularPrice}</g:price>
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
      <g:custom_label_4>${availability === 'in_stock' ? 'In Stock' : 'Limited'}</g:custom_label_4>
      <g:mpn>${productId}</g:mpn>
      <g:mobile_link>${baseUrl}/san-pham/${product.slug}</g:mobile_link>
      <g:warranty>12 months</g:warranty>      
      <g:return_policy_label>30 days return</g:return_policy_label>
      <pubDate>${new Date(product.created_at || Date.now()).toUTCString()}</pubDate>
    </item>`;
    }).filter(item => {
      const isValid = item.trim() !== '';
      if (!isValid) {
        console.log('Filtered out empty product item');
      }
      return isValid;
    }).join('\n    ')}
    
  </channel>
</rss>`;

    const productCount = (products || []).length;
    const validProductCount = xml.split('<item>').length - 1;

    console.log(`Generated feed with ${validProductCount} valid products out of ${productCount} total products`);

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
        'Last-Modified': now,
        'X-Robots-Tag': 'noindex',
        'X-Product-Count': productCount.toString(),
        'X-Valid-Product-Count': validProductCount.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating product feed:', error);

    // Return valid empty feed on error (don't return 500 status as it may cause Google to stop crawling)
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:g="http://base.google.com/ns/1.0"
     xmlns:c="http://base.google.com/cns/1.0">
  <channel>
    <title>G-3.vn Product Feed</title>
    <link>${COMPANY_INFO.website}</link>
    <description>Ghế công thái học, bàn nâng hạ và phụ kiện văn phòng chất lượng cao</description>
    <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
    <generator>G-3.vn Product Feed Generator</generator>
    <language>vi</language>
    <copyright>Copyright ${new Date().getFullYear()} ${COMPANY_INFO.name}</copyright>
    <!-- No products available at this time -->
  </channel>
</rss>`;

    return new Response(errorXml, {
      status: 200, // Return 200 to avoid Google stopping crawls
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Shorter cache on error (5 minutes)
        'X-Robots-Tag': 'noindex',
      },
    });
  }
}; 