# Railway Backend Deployment Guide (Simplified)

## AI-Powered Note Summarizer - Backend Deployment

This guide will help you deploy the simplified AI-powered note summarizer backend to Railway.

### Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push your code to GitHub
3. **Groq API Key**: Get your API key from [Groq Console](https://console.groq.com/keys)

### Deployment Steps

#### 1. Connect Repository to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `AI-Powered-Note-Summarizer` repository
5. Select the backend folder or configure the root directory

#### 2. Configure Environment Variables

In your Railway project dashboard, go to **Variables** and add:

```bash
GROQ_API_KEY=your_groq_api_key_here
DEBUG=False
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=production
ALLOWED_ORIGINS=*
```

#### 3. Deploy Configuration

Railway will automatically detect the `railway.json` and `Procfile` files:

- **Build**: Uses Nixpacks (automatic Python detection)
- **Start Command**: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

#### 4. Deployment Process

1. Railway will automatically build and deploy your application
2. You'll get a public URL like: `https://your-app-name.up.railway.app`
3. The API will be available at: `https://your-app-name.up.railway.app`

#### 5. Test Your Deployment

Test the API endpoints:

```bash
# Health check
curl https://your-app-name.up.railway.app/health

# Summarization
curl -X POST https://your-app-name.up.railway.app/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Your long text to summarize here..."}'
```

### API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /summarize` - Text summarization

### Features

✅ **AI-Powered Summarization** - Groq Llama 3.1 integration  
✅ **Fallback System** - Intelligent backup when API is unavailable  
✅ **Production Ready** - Gunicorn with multiple workers  
✅ **CORS Enabled** - Cross-origin requests supported  
✅ **Health Monitoring** - Built-in health check endpoint  
✅ **No Database** - Simplified stateless service  

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your Groq API key (required) | None |
| `DEBUG` | Debug mode | False |
| `HOST` | Server host | 0.0.0.0 |
| `PORT` | Server port | 8000 |
| `ALLOWED_ORIGINS` | CORS allowed origins | * |

### Troubleshooting

#### Build Issues
- Check that `requirements.txt` includes all dependencies
- Verify Python version compatibility (3.12+)

#### Runtime Issues
- Check Railway logs for error details
- Verify environment variables are set correctly
- Test Groq API key validity

#### CORS Issues
- Update `ALLOWED_ORIGINS` to include your frontend domain
- Check that frontend is using correct backend URL

### Monitoring

Railway provides built-in monitoring:
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Deployments**: Build and deployment history

### Cost Optimization

Railway offers:
- **Free Tier**: $5/month worth of usage
- **Pay-as-you-use**: Scales with actual usage
- **Sleep Mode**: Automatically sleeps inactive services

---

## Next Steps

After deploying the backend:

1. Note your Railway app URL
2. Update your frontend to use the production backend URL
3. Deploy your frontend to Vercel
4. Update CORS settings with your frontend domain

Your backend is now ready for production! 🚀
