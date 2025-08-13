# 🚀 Complete Deployment Guide

## AI-Powered Note Summarizer - Full Stack Deployment

This guide covers deploying both backend (Render) and frontend (Vercel) for the AI-Powered Note Summarizer.

## 📋 Prerequisites

- ✅ GitHub account with your code pushed
- ✅ Render account ([render.com](https://render.com))
- ✅ Vercel account ([vercel.com](https://vercel.com))
- ✅ Groq API key ([console.groq.com](https://console.groq.com/keys))

## 🔧 Architecture Overview

```
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐
│                 │ ────────────────→ │                 │
│  Frontend       │                   │  Backend        │
│  (Vercel)       │ ←──────────────── │  (Render)       │
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

## 🏗️ Step 1: Deploy Backend to Render

### 1.1 Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select your `AI-Powered-Note-Summarizer` repository
5. Configure the service:
   - **Name**: `ai-note-summarizer-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

### 1.2 Configure Environment Variables

In Render service settings → Environment, add:

```bash
# Required
GROQ_API_KEY=your_groq_api_key_here

# Server Configuration  
DEBUG=False
ENVIRONMENT=production
PYTHON_VERSION=3.12.0

# CORS (will update after frontend deployment)
ALLOWED_ORIGINS=*
```

### 1.3 Deploy Configuration

Render auto-detects:
- `requirements.txt` → Python dependencies
- Build and start commands from service settings

### 1.4 Verify Deployment

1. Wait for build to complete (usually 5-10 minutes)
2. Get your Render URL: `https://[your-service-name].onrender.com`
3. Test endpoints:
   ```bash
   curl https://[your-service-name].onrender.com/health
   ```

> **Note**: Render free tier services spin down after inactivity. First request after inactivity may take 30-60 seconds to respond.

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
VITE_API_URL=https://[your-render-service].onrender.com
```

> Replace `[your-render-service]` with your actual Render service name

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build completion
3. Get your Vercel URL: `https://[your-app].vercel.app`

## 🔗 Step 3: Connect Frontend and Backend

### 3.1 Update Backend CORS

In Render service → Environment Variables, update:

```bash
FRONTEND_URL=https://[your-vercel-app].vercel.app
ALLOWED_ORIGINS=https://[your-vercel-app].vercel.app,http://localhost:5173
```

### 3.2 Redeploy Backend

Render will automatically redeploy when you update environment variables.

## ✅ Step 4: Final Testing

### 4.1 Test Backend API

```bash
# Health check
curl https://[your-render-service].onrender.com/health

# Test summarization
curl -X POST https://[your-render-service].onrender.com/summarize \
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
| **Backend** | `https://[your-service].onrender.com` | API server |
| **Health Check** | `https://[your-service].onrender.com/health` | Service status |
| **API Docs** | `https://[your-service].onrender.com/docs` | FastAPI documentation |

## 🔧 Environment Variables Summary

### Backend (Render)
```bash
GROQ_API_KEY=gsk_...              # Your Groq API key
DEBUG=False                        # Production mode
ENVIRONMENT=production            # Environment flag
PYTHON_VERSION=3.12.0             # Python version
ALLOWED_ORIGINS=https://...       # CORS origins
FRONTEND_URL=https://...          # Frontend URL
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://[render-service].onrender.com  # Backend API URL
```

## 🚨 Troubleshooting

### Backend Issues

**Build Fails**
- Check `requirements.txt` has all dependencies
- Verify Python version compatibility (3.12+)
- Check Render build logs for specific errors

**Runtime Errors**
- Check Render service logs: Dashboard → Your Service → Logs
- Verify environment variables are set correctly
- Test Groq API key validity
- **Cold Start Delay**: Render free tier spins down after inactivity - first request may take 30-60 seconds

**CORS Errors**
- Update `ALLOWED_ORIGINS` with correct frontend URL
- Ensure no typos in URLs
- Wait for automatic redeployment after env var changes

### Frontend Issues

**Build Fails**
- Check all dependencies in `package.json`
- Verify TypeScript types are correct

**API Connection Fails**
- Verify `VITE_API_URL` is set correctly
- Check backend is deployed and healthy
- Test API directly with curl
- **Wait for cold start**: If service was inactive, first request may take time

**Environment Variables Not Working**
- Ensure variables start with `VITE_`
- Redeploy after setting variables
- Check browser console for API URL

## 📊 Monitoring & Maintenance

### Render Monitoring
- **Service Metrics**: CPU, Memory, Response times
- **Logs**: Real-time application and system logs
- **Health Checks**: Automatic service monitoring
- **Alerts**: Email notifications for service issues

### Vercel Monitoring
- **Analytics**: Page views, performance metrics
- **Function Logs**: Build and deployment logs
- **Real User Metrics**: Core Web Vitals

### Cost Optimization
- **Render**: Free tier with 750 hours/month, then $7/month for paid plan
- **Vercel**: Generous free tier for personal projects
- **Groq API**: Monitor usage and set limits

### Performance Notes
- **Render Free Tier**: Services sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep takes 30-60 seconds
- **Upgrade to Paid**: For always-on service and better performance

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
- **Tech Stack**: React + FastAPI + Groq AI + Render
- **No Authentication Required**: Perfect for quick text processing

---

**Need Help?** Check the individual deployment guides:
- [Backend Render Guide](./backend/RENDER_DEPLOYMENT.md)
- [Frontend Vercel Guide](./frontend/VERCEL_DEPLOYMENT.md)
