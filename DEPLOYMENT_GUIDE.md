# 🚀 Complete Deployment Guide

## AI-Powered Note Summarizer - Full Stack Deployment

This guide covers deploying both backend (Railway) and frontend (Vercel) for the AI-Powered Note Summarizer.

## 📋 Prerequisites

- ✅ GitHub account with your code pushed
- ✅ Railway account ([railway.app](https://railway.app))
- ✅ Vercel account ([vercel.com](https://vercel.com))
- ✅ Groq API key ([console.groq.com](https://console.groq.com/keys))

## 🔧 Architecture Overview

```
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐
│                 │ ────────────────→ │                 │
│  Frontend       │                   │  Backend        │
│  (Vercel)       │ ←──────────────── │  (Railway)      │
│  React + Vite   │    JSON API       │  FastAPI        │
└─────────────────┘                   └─────────────────┘
                                              │
                                              │ API Calls
                                              ▼
                                       ┌─────────────────┐
                                       │   Groq API      │
                                       │   (Llama 3.1)   │
                                       └─────────────────┘
```

## 🏗️ Step 1: Deploy Backend to Railway

### 1.1 Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `AI-Powered-Note-Summarizer` repository
4. Choose "Deploy Now"

### 1.2 Configure Environment Variables

In Railway project settings → Variables, add:

```bash
# Required
GROQ_API_KEY=your_groq_api_key_here

# Server Configuration  
DEBUG=False
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=production

# CORS (will update after frontend deployment)
ALLOWED_ORIGINS=*
```

### 1.3 Deploy Configuration

Railway auto-detects these files:
- `Procfile` → Start command
- `requirements.txt` → Python dependencies
- `railway.json` → Deploy configuration

### 1.4 Verify Deployment

1. Wait for build to complete
2. Get your Railway URL: `https://[your-app].up.railway.app`
3. Test endpoints:
   ```bash
   curl https://[your-app].up.railway.app/health
   ```

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project" → Import from GitHub
3. Select your repository
4. Set root directory to `frontend`

### 2.2 Configure Build Settings

Vercel should auto-detect, but verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.3 Set Environment Variables

In Vercel project settings → Environment Variables:

```bash
VITE_API_URL=https://[your-railway-app].up.railway.app
```

> Replace `[your-railway-app]` with your actual Railway URL

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build completion
3. Get your Vercel URL: `https://[your-app].vercel.app`

## 🔗 Step 3: Connect Frontend and Backend

### 3.1 Update Backend CORS

In Railway → Environment Variables, update:

```bash
FRONTEND_URL=https://[your-vercel-app].vercel.app
ALLOWED_ORIGINS=https://[your-vercel-app].vercel.app,http://localhost:5173
```

### 3.2 Redeploy Backend

Railway will automatically redeploy with new environment variables.

## ✅ Step 4: Final Testing

### 4.1 Test Backend API

```bash
# Health check
curl https://[your-railway-app].up.railway.app/health

# Test summarization
curl -X POST https://[your-railway-app].up.railway.app/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test note to summarize. It should work properly with the AI service."}'
```

### 4.2 Test Frontend

1. Visit `https://[your-vercel-app].vercel.app`
2. Enter text in the textarea
3. Click "Summarize Notes"
4. Verify AI summary appears

### 4.3 End-to-End Test

- ✅ Frontend loads correctly
- ✅ Text input works
- ✅ API connection successful
- ✅ AI summarization works
- ✅ Error handling works
- ✅ Mobile responsive

## 🎯 Production URLs

After successful deployment:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://[your-app].vercel.app` | User interface |
| **Backend** | `https://[your-app].up.railway.app` | API server |
| **Health Check** | `https://[your-app].up.railway.app/health` | Service status |
| **API Docs** | `https://[your-app].up.railway.app/docs` | FastAPI documentation |

## 🔧 Environment Variables Summary

### Backend (Railway)
```bash
GROQ_API_KEY=gsk_...              # Your Groq API key
DEBUG=False                        # Production mode
HOST=0.0.0.0                      # Listen on all interfaces
PORT=8000                         # Server port
ENVIRONMENT=production            # Environment flag
ALLOWED_ORIGINS=https://...       # CORS origins
FRONTEND_URL=https://...          # Frontend URL
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://[railway-url]  # Backend API URL
```

## 🚨 Troubleshooting

### Backend Issues

**Build Fails**
- Check `requirements.txt` has all dependencies
- Verify Python version compatibility (3.12+)

**Runtime Errors**
- Check Railway logs: Project → Deployments → View Logs
- Verify environment variables are set
- Test Groq API key validity

**CORS Errors**
- Update `ALLOWED_ORIGINS` with correct frontend URL
- Ensure no typos in URLs

### Frontend Issues

**Build Fails**
- Check all dependencies in `package.json`
- Verify TypeScript types are correct

**API Connection Fails**
- Verify `VITE_API_URL` is set correctly
- Check backend is deployed and healthy
- Test API directly with curl

**Environment Variables Not Working**
- Ensure variables start with `VITE_`
- Redeploy after setting variables
- Check browser console for API URL

## 📊 Monitoring & Maintenance

### Railway Monitoring
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Alerts**: Set up notifications for issues

### Vercel Monitoring
- **Analytics**: Page views, performance
- **Function Logs**: Build and deployment logs
- **Real User Metrics**: Core Web Vitals

### Cost Optimization
- **Railway**: $5 free tier, pay-as-you-use
- **Vercel**: Generous free tier for personal projects
- **Groq API**: Monitor usage and set limits

## 🔒 Security Considerations

- ✅ API key stored securely in environment variables
- ✅ CORS configured for specific origins
- ✅ HTTPS enforced on all connections
- ✅ No sensitive data in client-side code
- ✅ Rate limiting through Groq API

## 🚀 Your App is Live!

Congratulations! Your AI-Powered Note Summarizer is now deployed and ready for users.

### Share Your App
- **Frontend**: `https://[your-app].vercel.app`
- **Features**: AI-powered text summarization
- **Tech Stack**: React + FastAPI + Groq AI
- **No Authentication Required**: Perfect for quick text processing

---

**Need Help?** Check the individual deployment guides:
- [Backend Railway Guide](./backend/DEPLOYMENT_SIMPLE.md)
- [Frontend Vercel Guide](./frontend/VERCEL_DEPLOYMENT.md)
