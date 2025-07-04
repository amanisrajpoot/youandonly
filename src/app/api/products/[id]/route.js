import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function GET(request, { params }) {
  const { id } = params;
  // Fetch product by id from Supabase
  const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(product), { status: 200 });
} 