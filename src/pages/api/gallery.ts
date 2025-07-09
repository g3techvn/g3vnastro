import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  const folder = url.searchParams.get('folder');
  const bucket = 'g3tech';

  if (!folder) {
    return new Response(JSON.stringify({ error: 'Missing folder param' }), { status: 400 });
  }

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const images = await Promise.all(
    (data || [])
      .filter(item => !item.metadata?.mimetype?.includes('directory') && item.name.includes('.'))
      .map(async (file) => {
        const filePath = `${folder}/${file.name}`;
        const { data: urlData } = await supabase
          .storage
          .from(bucket)
          .getPublicUrl(filePath);
        return {
          name: file.name,
          url: urlData.publicUrl,
          path: filePath
        };
      })
  );

  return new Response(JSON.stringify({ images }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}; 