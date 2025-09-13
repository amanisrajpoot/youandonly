# 🚀 You & Only - Complete Setup Guide

This guide will help you set up the complete You & Only fashion ecommerce platform.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v13 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

### Optional (Recommended)
- **pgAdmin** - PostgreSQL administration tool
- **VS Code** - Code editor with extensions

## 🗄️ Database Setup

### Step 1: Install PostgreSQL

1. Download and install PostgreSQL from the official website
2. During installation, remember the password you set for the `postgres` user
3. Make sure PostgreSQL service is running

### Step 2: Create Database

Open a terminal/command prompt and run:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE youandonly_db;

# Exit psql
\q
```

### Step 3: Verify Database

```bash
# List all databases to confirm creation
psql -U postgres -c "\l"
```

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

The `.env` file has been created with default values. Update it with your actual database credentials:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/youandonly_db"

# JWT - Change to a secure random string
JWT_SECRET="your-super-secret-jwt-key-here-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

### Step 5: Set Up Database Schema

```bash
npx prisma db push
```

### Step 6: Seed Database with Sample Data

```bash
node src/seed.js
```

### Step 7: Start Backend Server

```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Step 8: Test Backend

Open a new terminal and test the health endpoint:

```bash
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing

# Or using curl
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🎨 Frontend Setup

### Step 1: Navigate to Root Directory

```bash
cd ..
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### Step 4: Start Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🧪 Testing the Complete Setup

### 1. Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# Get categories
curl http://localhost:5000/api/categories
```

### 2. Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 3. Test User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
- Ensure PostgreSQL is running
- Check if the port 5432 is correct
- Verify the database name and credentials in `.env`

#### 2. Prisma Client Error

**Error**: `PrismaClient is not defined`

**Solution**:
```bash
npx prisma generate
```

#### 3. Database Schema Error

**Error**: `The database schema is not in sync`

**Solution**:
```bash
npx prisma db push
```

#### 4. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
- Change the PORT in `.env` file
- Or kill the process using port 5000

#### 5. Frontend Can't Connect to Backend

**Error**: CORS or connection issues

**Solution**:
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env.local`
- Verify CORS settings in backend

### Database Management

#### View Database in Prisma Studio

```bash
cd backend
npx prisma studio
```

This opens a web interface at `http://localhost:5555` to view and edit your data.

#### Reset Database

```bash
cd backend
npx prisma db push --force-reset
node src/seed.js
```

## 📊 Project Structure

```
youandonly/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Main server file
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── package.json
│   └── .env               # Backend environment
├── components/             # Frontend components
├── services/              # Frontend services
├── package.json           # Frontend dependencies
└── .env.local            # Frontend environment
```

## 🚀 Next Steps

Once everything is running:

1. **Test the complete flow**: Register → Login → Browse products → Add to cart → Checkout
2. **Explore the API**: Use the endpoints to understand the data structure
3. **Customize**: Modify products, categories, and styling
4. **Deploy**: Follow deployment guides for production

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Product Endpoints
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:slug` - Get single product
- `GET /api/products/:slug/related` - Get related products

### Category Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get single category

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Add address

### Order Endpoints
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order

## 🆘 Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure all services are running
4. Check the console logs for error messages
5. Verify environment variables are set correctly

## 🎉 Success!

If everything is working, you should see:
- Backend API running on `http://localhost:5000`
- Frontend app running on `http://localhost:5173`
- Database populated with sample products
- All API endpoints responding correctly

You're now ready to continue with Phase 2 development!
