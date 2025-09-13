#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚂 Deploying You & Only to Railway...');
console.log('================================================');

try {
  // Check if Railway CLI is installed
  console.log('🔍 Checking Railway CLI...');
  try {
    execSync('railway --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 Installing Railway CLI...');
    execSync('npm install -g @railway/cli', { stdio: 'inherit' });
  }

  // Login to Railway
  console.log('🔐 Logging into Railway...');
  execSync('railway login', { stdio: 'inherit' });

  // Initialize Railway project (if not already done)
  console.log('🚀 Initializing Railway project...');
  try {
    execSync('railway init', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Project already initialized or error occurred');
  }

  // Build frontend
  console.log('🏗️ Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  // Deploy to Railway
  console.log('🚀 Deploying to Railway...');
  execSync('railway up', { stdio: 'inherit' });

  console.log('\n🎉 Railway deployment completed!');
  console.log('================================================');
  console.log('📝 Your full-stack app is now running on Railway!');
  console.log('🌐 Frontend: https://your-app.railway.app');
  console.log('🌐 Backend API: https://your-app.railway.app/api');
  console.log('');
  console.log('👤 Test Accounts:');
  console.log('   Admin: admin@example.com / admin123');
  console.log('   User:  user@example.com / password123');

} catch (error) {
  console.error('❌ Railway deployment failed:', error.message);
  console.log('\n💡 Alternative: Deploy manually:');
  console.log('   1. Go to railway.app');
  console.log('   2. Create new project');
  console.log('   3. Connect your GitHub repository');
  console.log('   4. Set environment variables');
  console.log('   5. Deploy (SQLite database will be created automatically)');
  process.exit(1);
}
