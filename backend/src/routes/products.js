import express from 'express';
import { prisma } from '../server.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      isActive: true,
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } }
        ]
      }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
      ...(featured === 'true' && { isFeatured: true })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          images: {
            select: { id: true, url: true, alt: true, isPrimary: true, order: true },
            orderBy: { order: 'asc' }
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              attributes: true
            }
          },
          _count: {
            select: { reviews: true }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get single product by slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        images: {
          select: { id: true, url: true, alt: true, isPrimary: true, order: true },
          orderBy: { order: 'asc' }
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            attributes: true
          }
        },
        reviews: {
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get related products
router.get('/:slug/related', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 4 } = req.query;

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { categoryId: true, tags: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        isActive: true,
        OR: [
          { categoryId: product.categoryId },
          { tags: { hasSome: product.tags } }
        ]
      },
      include: {
        images: {
          where: { isPrimary: true },
          select: { url: true, alt: true }
        }
      },
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { products: relatedProducts }
    });

  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get related products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
