# Use Node.js 20 LTS
FROM node:20-alpine

# Install OpenSSL and other dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Install backend dependencies
RUN cd backend && npm install --legacy-peer-deps

# Copy Prisma schema to root and generate client
RUN cp backend/prisma/schema.prisma ./schema.prisma
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
