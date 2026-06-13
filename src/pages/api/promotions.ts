import type { APIRoute } from 'astro';

// Promotions data is not stored in local collections.
// Returns empty list until a promotions collection is added.
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    return new Response(
      JSON.stringify({ 
        promotions: [],
        total: 0,
        page,
        limit,
        hasMore: false
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', promotions: [], total: 0 }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
