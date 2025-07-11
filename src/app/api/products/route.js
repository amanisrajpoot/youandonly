import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function GET() {
  // Fetch products with joined category info from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*,category:category_id(*)');
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(products), { status: 200 });
} 