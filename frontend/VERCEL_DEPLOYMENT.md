# Vercel Frontend Deployment Guide

## AI-Powered Note Summarizer - Frontend Deployment

This guide will help you deploy the React frontend to Vercel.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Backend Deployed**: Deploy your backend to Railway first

### Deployment Steps

#### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your `AI-Powered-Note-Summarizer` repository
4. Select the `frontend` folder as the root directory

#### 2. Configure Build Settings

Vercel should auto-detect your Vite React app, but verify these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### 3. Set Environment Variables

In your Vercel project settings, add environment variables:

```bash
VITE_API_URL=https://your-railway-app.up.railway.app
```

> Replace `your-railway-app.up.railway.app` with your actual Railway backend URL

#### 4. Deploy Configuration

The `vercel.json` file is already configured with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 5. Deploy Process

1. Click "Deploy" in Vercel
2. Vercel will automatically build and deploy your app
3. You'll get a URL like: `https://your-app.vercel.app`
4. The app will be live at this URL

#### 6. Update Backend CORS

After deployment, update your Railway backend environment variables:

```bash
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173,*
```

### Testing Your Deployment

1. Visit your Vercel URL
2. Enter some text in the textarea
3. Click "Summarize Notes"
4. Verify the AI summarization works

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-railway-app.up.railway.app` |

### Troubleshooting

#### Build Issues
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check for TypeScript errors

#### API Connection Issues
- Verify `VITE_API_URL` environment variable
- Check backend CORS settings
- Test backend API directly

#### Deployment Issues
- Check Vercel build logs
- Verify environment variables are set
- Test build locally with `npm run build`

### Features

✅ **React + TypeScript** - Modern frontend stack  
✅ **Tailwind CSS** - Beautiful, responsive design  
✅ **Vite** - Fast build tool and dev server  
✅ **Real-time API Integration** - Connects to Railway backend  
✅ **Error Handling** - User-friendly error messages  
✅ **Loading States** - Professional UX with loading indicators  
✅ **Responsive Design** - Works on all devices  

### Performance Optimization

Vercel automatically provides:
- **Global CDN**: Fast content delivery worldwide
- **Automatic Optimization**: Image and asset optimization
- **Edge Functions**: Server-side rendering at the edge
- **Analytics**: Built-in performance monitoring

### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records as instructed
5. Update backend CORS with new domain

### Monitoring

Vercel provides:
- **Real-time Analytics**: Page views, performance metrics
- **Function Logs**: Server-side function execution
- **Build Logs**: Deployment and build information
- **Error Tracking**: Runtime error monitoring

---

## Complete Deployment Checklist

### Backend (Railway)
- [ ] Deploy backend to Railway
- [ ] Set `GROQ_API_KEY` environment variable
- [ ] Test API endpoints work
- [ ] Note the Railway app URL

### Frontend (Vercel)
- [ ] Deploy frontend to Vercel
- [ ] Set `VITE_API_URL` to Railway backend URL
- [ ] Test frontend connects to backend
- [ ] Update backend CORS with Vercel URL

### Final Testing
- [ ] Test summarization functionality
- [ ] Verify error handling works
- [ ] Test on mobile devices
- [ ] Check loading states

Your full-stack application is now live! 🚀

### URLs After Deployment
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-railway-app.up.railway.app`
- **API Docs**: `https://your-railway-app.up.railway.app/docs` (FastAPI auto-docs)
