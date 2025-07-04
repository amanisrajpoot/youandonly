import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
  if (!product) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
  return Response.json(product);
} 