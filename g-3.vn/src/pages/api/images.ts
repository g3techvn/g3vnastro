import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

interface ImageItem {
  name: string;
  url: string;
  alternativeUrl: string;
  size?: number;
  type?: string;
  created_at?: string;
  path: string;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const folder = (url.searchParams.get('folder') || 'products/gami/ghe-gami-core').replace(/^\/|\/$/g, '');
    const bucket = url.searchParams.get('bucket') || 'g3tech';

    const supabaseClient = supabase;
    const fullPath = folder;
    
    const { data, error } = await supabaseClient
      .storage
      .from(bucket)
      .list(fullPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({ images: [], message: 'No data returned from storage' }), 
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const files = data.filter(item => 
      !item.metadata?.mimetype?.includes('directory') && 
      item.name.includes('.')
    );

    const images: ImageItem[] = await Promise.all(
      files.map(async (file) => {
        const filePath = `${folder}/${file.name}`;
        const { data: urlData } = await supabaseClient
          .storage
          .from(bucket)
          .getPublicUrl(filePath);
        
        const directUrl = `https://static.g-3.vn/storage/v1/object/public/${bucket}/${filePath}`;
        
        return {
          name: file.name,
          url: urlData.publicUrl,
          alternativeUrl: directUrl,
          size: file.metadata?.size,
          type: file.metadata?.mimetype,
          created_at: file.created_at,
          path: filePath
        };
      })
    );

    const folders = data.filter(item =>
      !item.name.includes('.') ||
      item.metadata?.mimetype?.includes('directory')
    );

    const suggestedFolders = folders.map(f =>
      folder ? `${folder}/${f.name}` : f.name
    );

    return new Response(
      JSON.stringify({
        images,
        debug: {
          bucket,
          folder,
          raw_count: data.length,
          filtered_count: files.length,
          folders_count: folders.length,
          suggested_folders: suggestedFolders,
          image_count: images.length,
          first_image_url: images.length > 0 ? images[0].url : null,
          first_image_alt_url: images.length > 0 ? images[0].alternativeUrl : null,
          sample_url: "https://static.g-3.vn/storage/v1/object/public/g3tech/products/gami/ghe-gami-core/10_de339e361d5341ffb0074207fd417fa5_master.webp"
        }
      }), 
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
        } 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch images', 
        details: error instanceof Error ? error.message : String(error) 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 