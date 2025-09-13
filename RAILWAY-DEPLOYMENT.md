# 🚂 Railway Deployment Guide

## 🎯 **One-Command Deployment**

```bash
npm run deploy
```

## 🚀 **What Happens During Deployment**

1. **Installs Railway CLI** (if not already installed)
2. **Logs into Railway** (opens browser for authentication)
3. **Initializes Railway project** (if first time)
4. **Builds frontend** (React app)
5. **Deploys everything** (frontend + backend + database)

## 📋 **Prerequisites**

- **GitHub Account**: Your code must be in a GitHub repository
- **Railway Account**: Sign up at [railway.app](https://railway.app)
- **Node.js**: Version 18+ (Railway will handle this)

## 🔧 **Environment Variables**

Railway will automatically set these, but you can customize:

### **Required Variables**
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### **Optional Variables**
```
VITE_API_URL=https://your-app.railway.app/api
VITE_GEMINI_API_KEY=your-gemini-api-key
```

## 🌐 **After Deployment**

### **Your App Will Be Available At:**
- **Frontend**: `https://your-app.railway.app`
- **Backend API**: `https://your-app.railway.app/api`
- **Health Check**: `https://your-app.railway.app/api/health`

### **Test Accounts**
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / password123

## 🗄️ **Database**

- **Type**: SQLite (file-based)
- **Location**: `/app/dev.db` (inside Railway container)
- **Persistence**: Data persists between deployments
- **Backup**: Railway handles automatic backups

## 🔄 **Updates & Redeployment**

### **Automatic Updates**
- Push to your main branch
- Railway automatically redeploys

### **Manual Updates**
```bash
npm run deploy
```

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **Build Fails**
   ```bash
   # Test locally first
   npm run build
   ```

2. **Database Issues**
   ```bash
   # Check if database is created
   # Railway will create it automatically
   ```

3. **Environment Variables**
   - Check Railway dashboard
   - Ensure all required variables are set

### **Logs & Debugging**
- View logs in Railway dashboard
- Check deployment status
- Monitor resource usage

## 💰 **Pricing**

- **Free Tier**: $5 credit monthly
- **Hobby Plan**: $5/month
- **Pro Plan**: $20/month

## 🎉 **Success!**

Once deployed, your full-stack e-commerce app will be live with:
- ✅ Frontend (React + Vite)
- ✅ Backend (Express.js + Node.js)
- ✅ Database (SQLite)
- ✅ Authentication (JWT)
- ✅ Payment Processing (Stripe)
- ✅ Admin Dashboard
- ✅ Order Management

## 🆘 **Need Help?**

1. Check Railway documentation
2. View deployment logs
3. Test locally with `npm run dev`
4. Verify environment variables
