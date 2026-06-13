import type { APIRoute } from 'astro';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

interface ImageItem {
  name: string;
  url: string;
  alternativeUrl: string;
  size?: number;
  type?: string;
  path: string;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const folder = (url.searchParams.get('folder') || 'products/gami/ghe-gami-core').replace(/^\/|\/$/g, '');

    const publicDir = join(process.cwd(), 'public', 'g3tech', folder);

    let files: string[] = [];
    try {
      files = await readdir(publicDir);
    } catch {
      return new Response(
        JSON.stringify({ images: [], debug: { folder, image_count: 0 } }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const imageFiles = files.filter(name => /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(name));

    const images: ImageItem[] = await Promise.all(
      imageFiles.map(async (name) => {
        const filePath = `${folder}/${name}`;
        const absPath = join(publicDir, name);
        let size: number | undefined;
        try {
          const s = await stat(absPath);
          size = s.size;
        } catch { /* ignore */ }

        const publicUrl = `/g3tech/${filePath}`;
        return {
          name,
          url: publicUrl,
          alternativeUrl: publicUrl,
          size,
          path: filePath,
        };
      })
    );

    return new Response(
      JSON.stringify({
        images,
        debug: {
          folder,
          image_count: images.length,
          first_image_url: images.length > 0 ? images[0].url : null,
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch images', details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
