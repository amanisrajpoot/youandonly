import { PrismaClient } from '@prisma/client';
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
  const shoes = await prisma.category.create({ data: { name: 'Shoes' } });
  const home = await prisma.category.create({ data: { name: 'Home' } });
  const beauty = await prisma.category.create({ data: { name: 'Beauty' } });
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
        name: 'Running Sneakers',
        description: 'Comfortable sneakers for running and daily wear.',
        price: 39.99,
        imageUrl: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
        categoryId: shoes.id,
      },
      {
        name: 'Decorative Throw Pillow',
        description: 'Soft and stylish throw pillow for your home.',
        price: 19.99,
        imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=facearea&w=400&h=400',
        categoryId: home.id,
      },
      {
        name: 'Luxury Face Cream',
        description: 'Hydrating face cream for glowing skin.',
        price: 24.99,
        imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&h=400',
        categoryId: beauty.id,
      },
      {
        name: 'Men’s Chinos',
        description: 'Versatile and comfortable chinos for men.',
        price: 34.99,
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=400&h=400',
        categoryId: men.id,
      },
      {
        name: 'Women’s Blouse',
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
        name: 'Scented Candle',
        description: 'Relaxing scented candle for your home.',
        price: 12.99,
        imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=facearea&w=400&h=400',
        categoryId: home.id,
      },
      {
        name: 'Makeup Brush Set',
        description: 'Professional makeup brush set for flawless application.',
        price: 18.99,
        imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&h=400',
        categoryId: beauty.id,
      },
      {
        name: 'Women’s Sandals',
        description: 'Comfortable and stylish sandals for women.',
        price: 25.99,
        imageUrl: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
        categoryId: shoes.id,
      },
      {
        name: 'Men’s Watch',
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
        name: 'Modern Table Lamp',
        description: 'A stylish lamp to brighten up your living space.',
        price: 34.99,
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        categoryId: home.id,
      },
      {
        name: 'Men’s Leather Boots',
        description: 'Durable and fashionable boots for men.',
        price: 69.99,
        imageUrl: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
        categoryId: shoes.id,
      },
      {
        name: 'Kids Raincoat',
        description: 'Waterproof and colorful raincoat for kids.',
        price: 29.99,
        imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&h=400',
        categoryId: kids.id,
      },
      {
        name: 'Women’s Yoga Pants',
        description: 'Comfortable and flexible yoga pants for women.',
        price: 32.99,
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400',
        categoryId: women.id,
      },
      {
        name: 'Men’s Slim Fit Shirt',
        description: 'A modern slim fit shirt for men.',
        price: 27.99,
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=400&h=400',
        categoryId: men.id,
      },
      {
        name: 'Aromatic Diffuser',
        description: 'Fill your home with relaxing scents.',
        price: 21.99,
        imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=facearea&w=400&h=400',
        categoryId: home.id,
      },
      {
        name: 'Luxury Lipstick',
        description: 'Long-lasting, vibrant color for your lips.',
        price: 15.99,
        imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&h=400',
        categoryId: beauty.id,
      },
      {
        name: 'Women’s Ballet Flats',
        description: 'Classic and comfortable ballet flats.',
        price: 23.99,
        imageUrl: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
        categoryId: shoes.id,
      },
      {
        name: 'Men’s Sunglasses',
        description: 'Stylish sunglasses for sunny days.',
        price: 19.99,
        imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
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