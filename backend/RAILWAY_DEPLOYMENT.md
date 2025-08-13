# Railway Deployment Guide for AI Note Summarizer Backend

## Quick Deployment Steps

### 1. **Prepare Your Railway Account**
- Sign up at [railway.app](https://railway.app)
- Connect your GitHub account

### 2. **Deploy to Railway**

#### Option A: Deploy from GitHub (Recommended)
1. Push your code to GitHub
2. In Railway dashboard, click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your AI-Powered-Note-Summarizer repository
5. Select the `backend` folder as the root directory

#### Option B: Deploy using Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project in backend directory
cd backend
railway init

# Deploy
railway up
```

### 3. **Add PostgreSQL Database**
1. In your Railway project dashboard
2. Click "New" → "Database" → "Add PostgreSQL"
3. Railway will automatically set the `DATABASE_URL` environment variable

### 4. **Configure Environment Variables**
In Railway dashboard, go to your service → Variables tab and add:

```env
GROQ_API_KEY=your_actual_groq_api_key_here
DEBUG=False
FRONTEND_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
```

**Important Notes:**
- `DATABASE_URL` is automatically set by Railway's PostgreSQL addon
- Update `FRONTEND_URL` after deploying your frontend to Vercel
- The `GROQ_API_KEY` is required for AI summarization to work properly

### 5. **Deploy Settings**
Railway should automatically detect:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

If not detected, you can set them manually in the Settings → Deploy tab.

### 6. **Verify Deployment**
1. Once deployed, Railway will provide a URL like: `https://your-app.railway.app`
2. Test the API endpoints:
   - `GET https://your-app.railway.app/` - Should return welcome message
   - `POST https://your-app.railway.app/summarize` - Test summarization
   - `GET https://your-app.railway.app/notes` - Test database connection

### 7. **Custom Domain (Optional)**
1. In Railway dashboard → Settings → Networking
2. Add your custom domain
3. Update CORS settings accordingly

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL addon is added to your project
- Check that `DATABASE_URL` is set in environment variables
- Verify database tables are created (check deployment logs)

### CORS Errors
- Make sure `FRONTEND_URL` and `ALLOWED_ORIGINS` are set correctly
- Include both your Vercel URL and any custom domains

### Build Failures
- Check that all dependencies in `requirements.txt` are compatible
- Ensure Python version compatibility (Railway uses Python 3.9+)
- Review build logs in Railway dashboard

### API Key Issues
- Verify `GROQ_API_KEY` is set correctly
- The app includes fallback summarization if Groq API fails
- Check API key validity at [console.groq.com](https://console.groq.com)

## Production Checklist

- [ ] PostgreSQL database added and connected
- [ ] All environment variables configured
- [ ] CORS settings updated for your frontend domain
- [ ] API endpoints tested and working
- [ ] Database migrations completed successfully
- [ ] Monitoring and logging configured

## Railway URLs to Update in Frontend

After successful deployment, you'll have a Railway URL like:
`https://your-app-name.railway.app`

**Remember to:**
1. Update your frontend's API base URL to point to this Railway URL
2. Update the `FRONTEND_URL` environment variable with your Vercel URL
3. Test the full integration between frontend and backend

## Cost Estimation

Railway pricing (as of 2024):
- **Hobby Plan**: $5/month per service (includes PostgreSQL)
- **Pro Plan**: Pay-per-usage with generous free tier

Expected monthly cost for this application: ~$5-10 (depending on usage)
