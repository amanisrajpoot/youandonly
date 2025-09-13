import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/youandonly_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('⚠️  Please update the DATABASE_URL with your actual PostgreSQL credentials');
  console.log('⚠️  Please change the JWT_SECRET to a secure random string');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
}
