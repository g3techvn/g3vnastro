import type { APIRoute } from 'astro';
import { readdir } from 'fs/promises';
import { join } from 'path';

export const GET: APIRoute = async ({ url }) => {
  const folder = url.searchParams.get('folder');

  if (!folder) {
    return new Response(JSON.stringify({ error: 'Missing folder param' }), { status: 400 });
  }

  try {
    // Serve from public/g3tech/ directory
    const publicDir = join(process.cwd(), 'public', 'g3tech', folder);
    const files = await readdir(publicDir);

    const images = files
      .filter(name => /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(name))
      .map(name => ({
        name,
        url: `/g3tech/${folder}/${name}`,
        path: `${folder}/${name}`,
      }));

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    // Folder not found or not accessible — return empty list
    return new Response(JSON.stringify({ images: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
