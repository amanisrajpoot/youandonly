const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('Cleared existing products and categories.');

  // Create categories
  const women = await prisma.category.create({ data: { name: 'Women' } });
  const men = await prisma.category.create({ data: { name: 'Men' } });
  const kids = await prisma.category.create({ data: { name: 'Kids' } });
  const accessories = await prisma.category.create({ data: { name: 'Accessories' } });
  console.log('Created categories.');

  // Create products
  const result = await prisma.product.createMany({
    data: [
      {
        name: 'Floral Summer Dress',
        description: 'Lightweight, floral print dress perfect for summer.',
        price: 29.99,
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400',
        categoryId: women.id,
      },
      {
        name: 'Classic Denim Jacket',
        description: 'Timeless denim jacket for all seasons.',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=400&h=400',
        categoryId: men.id,
      },
      {
        name: 'Kids Graphic T-Shirt',
        description: 'Fun and colorful t-shirt for kids.',
        price: 14.99,
        imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400',
        categoryId: kids.id,
      },
      {
        name: 'Leather Handbag',
        description: 'Elegant leather handbag for all occasions.',
        price: 59.99,
        imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
        categoryId: accessories.id,
      },
      {
        name: 'Mens Chinos',
        description: 'Versatile and comfortable chinos for men.',
        price: 34.99,
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=400&h=400',
        categoryId: men.id,
      },
      {
        name: 'Womens Blouse',
        description: 'Chic blouse for work or casual outings.',
        price: 27.99,
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400',
        categoryId: women.id,
      },
      {
        name: 'Kids Sneakers',
        description: 'Durable sneakers for active kids.',
        price: 22.99,
        imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400',
        categoryId: kids.id,
      },
      {
        name: 'Mens Watch',
        description: 'Classic analog watch for men.',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
        categoryId: accessories.id,
      },
      {
        name: 'Kids Backpack',
        description: 'Colorful and sturdy backpack for kids.',
        price: 17.99,
        imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400',
        categoryId: kids.id,
      },
      {
        name: 'Elegant Pearl Necklace',
        description: 'A timeless pearl necklace for special occasions.',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
        categoryId: accessories.id,
      },
      {
        name: 'Mens Slim Fit Shirt',
        description: 'A modern slim fit shirt for men.',
        price: 27.99,
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=400&h=400',
        categoryId: men.id,
      },
      {
        name: 'Womens Yoga Pants',
        description: 'Comfortable and flexible yoga pants for women.',
        price: 32.99,
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400',
        categoryId: women.id,
      },
      {
        name: 'Luxury Lipstick',
        description: 'Long-lasting, vibrant color for your lips.',
        price: 15.99,
        imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&h=400',
        categoryId: accessories.id,
      },
    ],
  });
  console.log('Created products:', result);
}

main()
  .catch((e) => {
    console.error('SEED ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 