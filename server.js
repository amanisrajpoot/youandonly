import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Initialize Prisma client (will be set after generation)
let prisma;

// Route imports will be done after Prisma is initialized
let authRoutes, userRoutes, productRoutes, orderRoutes, categoryRoutes, paymentRoutes, reviewRoutes;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app.railway.app'] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: prisma ? 'connected' : 'disconnected'
  });
});

// Database check middleware
app.use('/api', (req, res, next) => {
  if (!prisma && req.path !== '/health') {
    return res.status(503).json({
      success: false,
      message: 'Database not available. Please try again later.'
    });
  }
  next();
});

// API routes will be set up after Prisma is initialized

// Serve static files from dist directory (frontend build)
app.use(express.static(path.join(__dirname, 'dist')));

// Debug route to check if files exist
app.get('/debug', async (req, res) => {
  try {
    const fs = await import('fs');
    const distPath = path.join(__dirname, 'dist');
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    
    res.json({
      distExists: fs.existsSync(distPath),
      indexExists: fs.existsSync(indexPath),
      distContents: fs.existsSync(distPath) ? fs.readdirSync(distPath) : 'dist not found',
      currentDir: __dirname,
      port: PORT
    });
  } catch (error) {
    res.json({
      error: error.message,
      currentDir: __dirname,
      port: PORT
    });
  }
});

// Test route to see HTML content
app.get('/test-html', async (req, res) => {
  try {
    const fs = await import('fs');
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      const htmlContent = fs.readFileSync(indexPath, 'utf8');
      res.send(htmlContent);
    } else {
      res.send('index.html not found');
    }
  } catch (error) {
    res.send('Error: ' + error.message);
  }
});

// Serve frontend for all non-API routes
app.get('*', async (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }
  
  console.log(`Serving frontend for path: ${req.path}`);
  
  try {
    const fs = await import('fs');
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('Serving index.html');
      res.sendFile(indexPath);
    } else {
      console.log('index.html not found');
      res.status(404).send('Frontend not found. Please check if the build completed successfully.');
    }
  } catch (error) {
    console.error('Error serving frontend:', error);
    res.status(500).send('Error serving frontend: ' + error.message);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Setup database first
    console.log('🗄️ Setting up database...');
    const { execSync } = await import('child_process');
    
    try {
      // Copy Prisma schema to root for generation
      execSync('cp backend/prisma/schema.prisma ./schema.prisma', { stdio: 'pipe' });
      execSync('npx prisma generate', { stdio: 'pipe' });
      execSync('cd backend && npx prisma db push', { stdio: 'pipe' });
      execSync('cd backend && node src/seed-sqlite.js', { stdio: 'pipe' });
      console.log('✅ Database setup completed');
    } catch (error) {
      console.log('⚠️ Database setup skipped (may already exist)');
    }

    // Now initialize Prisma client
    try {
      const { PrismaClient } = await import('@prisma/client');
      prisma = new PrismaClient();
      
      // Connect to database
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('⚠️ Starting server without database (API will be limited)');
      prisma = null;
    }

    // Import and set up routes after Prisma is initialized
    try {
      authRoutes = (await import('./backend/src/routes/auth.js')).default;
      userRoutes = (await import('./backend/src/routes/users.js')).default;
      productRoutes = (await import('./backend/src/routes/products.js')).default;
      orderRoutes = (await import('./backend/src/routes/orders.js')).default;
      categoryRoutes = (await import('./backend/src/routes/categories.js')).default;
      paymentRoutes = (await import('./backend/src/routes/payments.js')).default;
      reviewRoutes = (await import('./backend/src/routes/reviews.js')).default;

      // Set up API routes
      app.use('/api/auth', authRoutes);
      app.use('/api/users', userRoutes);
      app.use('/api/products', productRoutes);
      app.use('/api/orders', orderRoutes);
      app.use('/api/categories', categoryRoutes);
      app.use('/api/payments', paymentRoutes);
      app.use('/api/reviews', reviewRoutes);
      
      console.log('✅ API routes loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load API routes:', error.message);
      console.log('⚠️ Starting server without API routes');
    }

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend: http://localhost:${PORT}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { prisma };
export default app;
