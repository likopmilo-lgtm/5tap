import {getSiteData} from '../../supabase-server';

export async function GET() {
  const data = await getSiteData();
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  });
}
