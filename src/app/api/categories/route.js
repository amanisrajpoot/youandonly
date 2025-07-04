// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function GET() {
  // Fetch categories from Supabase
  const { data: categories, error } = await supabase.from('categories').select('*');
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(categories), { status: 200 });
} 