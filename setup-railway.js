#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚂 Setting up Railway deployment...');
console.log('================================================');

try {
  // Build frontend
  console.log('🏗️ Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  // Setup backend
  console.log('🔧 Setting up backend...');
  execSync('cd backend && npm install --legacy-peer-deps', { stdio: 'inherit' });

  // Generate Prisma client (skip if fails)
  console.log('🗄️ Setting up database...');
  try {
    execSync('cd backend && npx prisma generate', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Prisma client generation skipped (may already exist)');
  }

  // Push database schema
  try {
    execSync('cd backend && npx prisma db push', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Database push skipped');
  }

  // Seed database
  try {
    execSync('cd backend && node src/seed-sqlite.js', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Database seeding skipped');
  }

  console.log('\n✅ Railway setup completed!');
  console.log('================================================');
  console.log('📝 Ready for deployment:');
  console.log('   npm run deploy');
  console.log('');
  console.log('🌐 Test locally:');
  console.log('   npm start');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
