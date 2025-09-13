import { PrismaClient } from '@prisma/client';
import { hashPassword } from './utils/auth.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'tops' },
      update: {},
      create: {
        name: 'Tops',
        slug: 'tops',
        description: 'Shirts, blouses, and other upper body garments',
        image: 'https://picsum.photos/seed/tops-category/400/300'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'bottoms' },
      update: {},
      create: {
        name: 'Bottoms',
        slug: 'bottoms',
        description: 'Pants, skirts, and other lower body garments',
        image: 'https://picsum.photos/seed/bottoms-category/400/300'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'shoes' },
      update: {},
      create: {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Footwear for every occasion',
        image: 'https://picsum.photos/seed/shoes-category/400/300'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Jewelry, bags, and other accessories',
        image: 'https://picsum.photos/seed/accessories-category/400/300'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'outerwear' },
      update: {},
      create: {
        name: 'Outerwear',
        slug: 'outerwear',
        description: 'Jackets, coats, and outer layers',
        image: 'https://picsum.photos/seed/outerwear-category/400/300'
      }
    })
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminPassword = await hashPassword('admin123');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  });
  console.log('✅ Created admin user');

  // Create regular user
  console.log('👤 Creating regular user...');
  const userPassword = await hashPassword('password123');
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER'
    }
  });
  console.log('✅ Created regular user');

  // Create products
  console.log('👕 Creating products...');
  const products = [
    {
      name: "White Linen Shirt",
      slug: "white-linen-shirt",
      description: "A timeless, breathable linen shirt, perfect for warm days and effortless style.",
      price: 79.99,
      comparePrice: 99.99,
      sku: "WLS001",
      categorySlug: "tops",
      isFeatured: true,
      weight: 0.3,
      dimensions: '{"length": 28, "width": 22, "height": 1}',
      tags: "linen,white,shirt,casual,summer",
      images: [
        { url: "https://picsum.photos/seed/white-linen-shirt/400/600", alt: "White Linen Shirt", isPrimary: true, order: 0 }
      ],
      variants: [
        { name: "Small", sku: "WLS001-S", price: 79.99, stock: 50, attributes: '{"size": "S", "color": "White"}' },
        { name: "Medium", sku: "WLS001-M", price: 79.99, stock: 50, attributes: '{"size": "M", "color": "White"}' },
        { name: "Large", sku: "WLS001-L", price: 79.99, stock: 50, attributes: '{"size": "L", "color": "White"}' }
      ]
    },
    {
      name: "Black Graphic Tee",
      slug: "black-graphic-tee",
      description: "A soft, 100% cotton tee with a bold, retro-futuristic graphic print.",
      price: 39.99,
      sku: "BGT001",
      categorySlug: "tops",
      isFeatured: true,
      weight: 0.2,
      dimensions: '{"length": 26, "width": 20, "height": 1}',
      tags: "cotton,black,tee,graphic,streetwear",
      images: [
        { url: "https://picsum.photos/seed/black-graphic-tee/400/600", alt: "Black Graphic Tee", isPrimary: true, order: 0 }
      ],
      variants: [
        { name: "Small", sku: "BGT001-S", price: 39.99, stock: 100, attributes: '{"size": "S", "color": "Black"}' },
        { name: "Medium", sku: "BGT001-M", price: 39.99, stock: 100, attributes: '{"size": "M", "color": "Black"}' },
        { name: "Large", sku: "BGT001-L", price: 39.99, stock: 100, attributes: '{"size": "L", "color": "Black"}' }
      ]
    },
    {
      name: "Slim-fit Black Jeans",
      slug: "slim-fit-black-jeans",
      description: "Classic five-pocket slim-fit jeans in a stretch denim fabric.",
      price: 119.99,
      sku: "SFBJ001",
      categorySlug: "bottoms",
      isFeatured: true,
      weight: 0.6,
      dimensions: '{"length": 32, "width": 16, "height": 1}',
      tags: "denim,black,jeans,slim-fit,casual",
      images: [
        { url: "https://picsum.photos/seed/slim-fit-black-jeans/400/600", alt: "Slim-fit Black Jeans", isPrimary: true, order: 0 }
      ],
      variants: [
        { name: "30x32", sku: "SFBJ001-3032", price: 119.99, stock: 75, attributes: '{"waist": "30", "length": "32", "color": "Black"}' },
        { name: "32x32", sku: "SFBJ001-3232", price: 119.99, stock: 75, attributes: '{"waist": "32", "length": "32", "color": "Black"}' },
        { name: "34x32", sku: "SFBJ001-3432", price: 119.99, stock: 75, attributes: '{"waist": "34", "length": "32", "color": "Black"}' }
      ]
    },
    {
      name: "Classic White Sneakers",
      slug: "classic-white-sneakers",
      description: "Minimalist low-top sneakers crafted from premium leather.",
      price: 129.99,
      sku: "CWS001",
      categorySlug: "shoes",
      isFeatured: true,
      weight: 0.8,
      dimensions: '{"length": 30, "width": 12, "height": 8}',
      tags: "leather,white,sneakers,minimalist,casual",
      images: [
        { url: "https://picsum.photos/seed/classic-white-sneakers/400/600", alt: "Classic White Sneakers", isPrimary: true, order: 0 }
      ],
      variants: [
        { name: "US 8", sku: "CWS001-8", price: 129.99, stock: 40, attributes: '{"size": "US 8", "color": "White"}' },
        { name: "US 9", sku: "CWS001-9", price: 129.99, stock: 40, attributes: '{"size": "US 9", "color": "White"}' },
        { name: "US 10", sku: "CWS001-10", price: 129.99, stock: 40, attributes: '{"size": "US 10", "color": "White"}' }
      ]
    }
  ];

  for (const productData of products) {
    const category = categories.find(c => c.slug === productData.categorySlug);
    
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        comparePrice: productData.comparePrice,
        sku: productData.sku,
        categoryId: category.id,
        isFeatured: productData.isFeatured,
        weight: productData.weight,
        dimensions: productData.dimensions,
        tags: productData.tags,
        images: {
          create: productData.images
        },
        variants: {
          create: productData.variants
        }
      }
    });
    
    console.log(`✅ Created product: ${product.name}`);
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
