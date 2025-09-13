# You & Only - Backend API

Backend API for the You & Only fashion ecommerce platform built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **Authentication**: JWT-based user authentication and authorization
- **User Management**: User registration, login, profile management
- **Product Management**: CRUD operations for products, categories, and variants
- **Order Management**: Order creation and tracking
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Password hashing, input validation, CORS protection
- **API Documentation**: RESTful API endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: bcryptjs, helmet, cors

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/youandonly_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with sample data
node src/seed.js
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Add address

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:slug` - Get single product
- `GET /api/products/:slug/related` - Get related products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get single category

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order

## 🗄️ Database Schema

The database includes the following main entities:

- **Users**: User accounts and profiles
- **Addresses**: User shipping and billing addresses
- **Categories**: Product categories
- **Products**: Product information
- **ProductVariants**: Product size/color variants
- **ProductImages**: Product images
- **Orders**: Customer orders
- **OrderItems**: Order line items
- **Reviews**: Product reviews
- **WishlistItems**: User wishlist

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio
```

### Database Management

```bash
# Reset database and reseed
npm run db:push
node src/seed.js

# Open Prisma Studio (database GUI)
npm run db:studio
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Rate limiting (to be implemented)

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 🚀 Deployment

### Production Build

```bash
npm start
```

### Environment Variables

Make sure to set all required environment variables in your production environment.

### Database

Ensure your PostgreSQL database is properly configured and accessible.

## 📊 Health Check

The API includes a health check endpoint:

```
GET /api/health
```

Returns server status and environment information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
