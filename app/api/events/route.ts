import {hasSupabaseConfig, writeSupabase} from '../../supabase-server';

function fail(message: string, status = 400) {
  return Response.json({error: message}, {status});
}

export async function POST(request: Request) {
  try {
    if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) {
      return fail('Origine non autorisée.', 403);
    }
    if (!hasSupabaseConfig()) return Response.json({ok: true, stored: false});
    if (Number(request.headers.get('content-length') || 0) > 8000) return fail('Événement trop volumineux.', 413);
    const body = (await request.json()) as Record<string, unknown>;
    const eventName = typeof body.event === 'string' ? body.event.slice(0, 80) : 'site_event';
    const path = typeof body.path === 'string' ? body.path.slice(0, 500) : '/';
    const productId = typeof body.productId === 'string' ? body.productId.slice(0, 120) : null;
    const payload =
      body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload) ? body.payload : {};
    await writeSupabase('site_events', {
      event_name: eventName,
      page_path: path,
      product_id: productId,
      payload,
      user_agent: request.headers.get('user-agent')?.slice(0, 500) || null,
      created_at: new Date().toISOString(),
    });
    return Response.json({ok: true, stored: true});
  } catch (error) {
    console.error('event_failed', error instanceof Error ? error.message : 'Unknown');
    return Response.json({ok: true, stored: false});
  }
}
