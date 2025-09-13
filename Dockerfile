# Use Node.js 20 LTS
FROM node:20-alpine

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

# Generate Prisma client
RUN cd backend && npx prisma generate

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
