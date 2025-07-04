import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const categories = await prisma.category.findMany();
  return Response.json(categories);
} 