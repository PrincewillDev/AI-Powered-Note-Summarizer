# 🚀 Render Deployment Guide

## AI Note Summarizer Backend - Render Deployment

This guide covers deploying the FastAPI backend to Render.

## 📋 Prerequisites

- ✅ GitHub repository with your backend code
- ✅ Render account ([render.com](https://render.com))
- ✅ Groq API key ([console.groq.com](https://console.groq.com/keys))

## 🏗️ Step-by-Step Deployment

### Step 1: Create Render Web Service

1. **Go to Render Dashboard**
   - Visit [https://dashboard.render.com](https://dashboard.render.com)
   - Sign in with your GitHub account

2. **Create New Service**
   - Click "New" → "Web Service"
   - Click "Connect a repository" if needed
   - Select your `AI-Powered-Note-Summarizer` repository

3. **Configure Service Settings**
   ```
   Name: ai-note-summarizer-backend
   Region: Oregon (US West) or closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
   ```

4. **Instance Type**
   - Free Tier: Free (limited resources, spins down after inactivity)
   - Paid: Starter ($7/month) for always-on service

### Step 2: Environment Variables

Add these environment variables in Render service settings:

```bash
# Required - Get from https://console.groq.com/keys
GROQ_API_KEY=gsk_your_groq_api_key_here

# Application Settings
DEBUG=False
ENVIRONMENT=production
PYTHON_VERSION=3.12.0

# CORS - Update after frontend deployment
ALLOWED_ORIGINS=*
```

### Step 3: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies from `requirements.txt`
   - Build the application
   - Start the service

3. **Build Process** (typically takes 5-10 minutes):
   ```
   ==> Cloning from https://github.com/your-username/AI-Powered-Note-Summarizer...
   ==> Using Python version 3.12.0
   ==> Running build command 'pip install -r requirements.txt'...
   ==> Starting service with 'gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT'...
   ```

### Step 4: Get Your Service URL

Your service will be available at:
```
https://[your-service-name].onrender.com
```

### Step 5: Test Deployment

```bash
# Health check
curl https://your-service-name.onrender.com/health

# Test API documentation
curl https://your-service-name.onrender.com/docs

# Test summarization
curl -X POST https://your-service-name.onrender.com/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test note to summarize with Groq AI."}'
```

## 🔧 Configuration Details

### Required Files (Already in your repo)

1. **requirements.txt** - Python dependencies
   ```txt
   fastapi==0.109.1
   uvicorn==0.27.0
   gunicorn==21.2.0
   groq==0.4.1
   python-dotenv==1.0.0
   # ... other dependencies
   ```

2. **Procfile** (Optional, using service settings instead)
   ```
   web: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
   ```

### Environment Variables Details

| Variable | Value | Description |
|----------|--------|-------------|
| `GROQ_API_KEY` | `gsk_...` | Your Groq API key for AI processing |
| `DEBUG` | `False` | Disable debug mode in production |
| `ENVIRONMENT` | `production` | Environment identifier |
| `PYTHON_VERSION` | `3.12.0` | Python version specification |
| `ALLOWED_ORIGINS` | URLs | CORS allowed origins |

## 🔗 Connect with Frontend

After frontend deployment, update environment variables:

```bash
# Update these in Render dashboard
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

Render will automatically redeploy when you update environment variables.

## 🚨 Important Notes

### Free Tier Limitations
- ✅ 750 hours/month free compute
- ⚠️ Service spins down after 15 minutes of inactivity
- ⚠️ Cold start delay of 30-60 seconds after inactivity
- ⚠️ Limited CPU and memory

### Paid Tier Benefits
- ✅ Always-on service (no cold starts)
- ✅ Better performance and resources
- ✅ Custom domains
- ✅ Priority support

## 🔧 Troubleshooting

### Build Fails
```bash
# Check these common issues:
1. requirements.txt missing dependencies
2. Python version compatibility
3. Build command errors
```

**Solutions:**
- Check Render build logs in dashboard
- Verify all dependencies are in requirements.txt
- Ensure Python 3.12 compatibility

### Runtime Errors
```bash
# Check application logs in Render dashboard
1. Service → Logs tab
2. Look for Python/FastAPI errors
3. Check environment variables
```

**Common Issues:**
- Missing `GROQ_API_KEY`
- Invalid API key
- CORS configuration errors

### API Connection Issues
```bash
# Test service health
curl https://your-service.onrender.com/health

# Check if service is sleeping
# First request after inactivity takes 30-60 seconds
```

### CORS Errors
```bash
# Update allowed origins
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
```

## 📊 Monitoring

### Service Logs
- **Access**: Render Dashboard → Your Service → Logs
- **Real-time**: Live log streaming
- **Filtering**: Error, warning, info levels

### Metrics
- **CPU Usage**: Monitor resource consumption
- **Memory Usage**: Track memory allocation
- **Response Times**: API performance metrics
- **Error Rates**: Monitor failed requests

### Health Monitoring
Render automatically monitors your service health:
- HTTP health checks every 30 seconds
- Automatic restart on failures
- Email notifications for outages

## 🚀 Production Optimization

### Performance Tips
1. **Use Paid Tier** for always-on service
2. **Optimize Workers** - 4 Gunicorn workers for better concurrency
3. **Monitor Logs** - Check for performance bottlenecks
4. **Cache Responses** - Consider caching for repeated requests

### Security Best Practices
1. **Environment Variables** - Never commit API keys to code
2. **CORS Configuration** - Restrict to specific origins
3. **HTTPS Only** - Render provides automatic SSL
4. **Regular Updates** - Keep dependencies updated

## ✅ Deployment Checklist

- [ ] Render account created and connected to GitHub
- [ ] Repository selected and configured
- [ ] Environment variables added (especially `GROQ_API_KEY`)
- [ ] Service deployed and build completed
- [ ] Health endpoint responding: `/health`
- [ ] API docs accessible: `/docs`
- [ ] Summarization endpoint working: `/summarize`
- [ ] CORS configured for frontend domain
- [ ] Service URL documented for frontend configuration

## 🎯 Next Steps

After successful deployment:

1. **Update Frontend**: Configure `VITE_API_URL` in Vercel
2. **Update CORS**: Set `ALLOWED_ORIGINS` to your frontend URL
3. **Test Integration**: Full end-to-end testing
4. **Monitor Performance**: Check logs and metrics
5. **Consider Upgrade**: Evaluate paid tier for production use

---

**Your backend is now live at**: `https://[your-service-name].onrender.com`

**API Documentation**: `https://[your-service-name].onrender.com/docs`
