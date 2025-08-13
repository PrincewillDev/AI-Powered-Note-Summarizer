# 🚀 Backend Deployment to Railway - Complete Setup Guide

## Quick Start Steps

### 1. Prerequisites Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Verify installation
railway --version
```

### 2. Deploy Backend

#### Option A: Using the Deployment Script (Recommended)
```bash
cd backend
./deploy-railway.sh
```

#### Option B: Manual Deployment
```bash
cd backend
railway login
railway init
railway up
```

### 3. Add PostgreSQL Database
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project
3. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
4. Railway automatically sets `DATABASE_URL` environment variable

### 4. Configure Environment Variables

In Railway Dashboard → Your Service → **Variables** tab, add:

```env
GROQ_API_KEY=your_actual_groq_api_key_here
DEBUG=False
FRONTEND_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

**Important Notes:**
- `DATABASE_URL` is auto-set by PostgreSQL addon
- Get Groq API key from: https://console.groq.com/keys
- Update `FRONTEND_URL` after deploying frontend to Vercel

### 5. Verify Deployment

Test your deployed backend:
```bash
# Test health endpoint
curl https://your-app.railway.app/health

# Test API endpoint
curl -X POST https://your-app.railway.app/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Test text for summarization"}'
```

## Railway Configuration Files Included

✅ **`Procfile`** - Defines startup command using Gunicorn  
✅ **`railway.json`** - Railway-specific configuration  
✅ **`requirements.txt`** - Updated with PostgreSQL support  
✅ **`migrate.py`** - Database migration script  
✅ **`.env.production`** - Production environment template  

## Production Features Added

### Database Support
- ✅ PostgreSQL support for production
- ✅ SQLite fallback for development
- ✅ Automatic URL format conversion (postgres:// → postgresql://)
- ✅ Production-optimized connection pooling

### Security & Performance
- ✅ Production CORS configuration
- ✅ Health check endpoint (`/health`)
- ✅ Gunicorn WSGI server with multiple workers
- ✅ Environment-based debug settings
- ✅ Proper error handling and logging

### Monitoring & Debugging
- ✅ Health check endpoint for monitoring
- ✅ Structured logging
- ✅ Version tracking in API responses
- ✅ Database migration verification

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```
   Error: No Python version specified
   ```
   **Solution**: Railway auto-detects Python. Ensure `requirements.txt` exists.

2. **Database Connection Errors**
   ```
   Error: database "railway" does not exist
   ```
   **Solution**: Ensure PostgreSQL addon is added and `DATABASE_URL` is set.

3. **CORS Errors**
   ```
   Access-Control-Allow-Origin error
   ```
   **Solution**: Update `ALLOWED_ORIGINS` and `FRONTEND_URL` environment variables.

4. **Groq API Errors**
   ```
   Invalid API Key error
   ```
   **Solution**: Verify `GROQ_API_KEY` in Railway environment variables.

### Debug Steps
1. Check Railway deployment logs
2. Verify all environment variables are set
3. Test database connectivity using `/health` endpoint
4. Check CORS configuration matches frontend domain

## Production Checklist

Before going live, ensure:

- [ ] **PostgreSQL database** added and connected
- [ ] **Environment variables** configured:
  - [ ] `GROQ_API_KEY` (from console.groq.com)
  - [ ] `FRONTEND_URL` (your Vercel URL)
  - [ ] `ALLOWED_ORIGINS` (production domains)
  - [ ] `DEBUG=False`
- [ ] **API endpoints tested** and responding correctly
- [ ] **Database migrations** completed successfully
- [ ] **CORS configuration** allows frontend domain
- [ ] **Health check** endpoint accessible

## Expected Railway URLs

After deployment, you'll have:
- **API Base URL**: `https://your-app-name.railway.app`
- **Health Check**: `https://your-app-name.railway.app/health`
- **Swagger Docs**: `https://your-app-name.railway.app/docs`

## Next Steps

After successful backend deployment:

1. ✅ **Backend deployed to Railway**
2. ⏭️ **Deploy frontend to Vercel** 
3. ⏭️ **Update frontend API URL** to point to Railway
4. ⏭️ **Update backend CORS settings** with Vercel URL
5. ⏭️ **Test full integration**

---

## 🎯 Ready for Production!

Your backend is now production-ready with:
- 🐘 PostgreSQL database
- 🚀 Railway hosting
- 🤖 AI summarization with fallback
- 🔐 Production security settings
- 📊 Health monitoring
- 🌐 CORS configuration for frontend integration
