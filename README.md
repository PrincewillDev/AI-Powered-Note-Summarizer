# 🤖 AI-Powered Note Summarizer

A modern, full-stack web application that transforms lengthy text into concise, actionable summaries using advanced AI technology.

## ✨ Features

- 🤖 **AI-Powered Summarization** - Leverages Groq's Llama 3.1 model for intelligent text processing
- ⚡ **Lightning Fast** - Optimized performance with intelligent fallback systems
- 🎨 **Beautiful UI** - Modern, responsive design built with React and Tailwind CSS
- 🔒 **Secure & Simple** - No authentication required, no data persistence
- 🌐 **Production Ready** - Deployed on Railway (backend) and Vercel (frontend)
- 📱 **Mobile Friendly** - Works perfectly on all devices

## 🏗️ Architecture

```
┌─────────────────┐    HTTPS/JSON     ┌─────────────────┐
│                 │ ────────────────→ │                 │
│  Frontend       │                   │  Backend        │
│  React + Vite   │ ←──────────────── │  FastAPI        │
│  (Vercel)       │                   │  (Railway)      │
└─────────────────┘                   └─────────────────┘
                                              │
                                              │ API Calls
                                              ▼
                                       ┌─────────────────┐
                                       │   Groq API      │
                                       │   Llama 3.1     │
                                       └─────────────────┘
```

## 🚀 Quick Start

### Option 1: Use the Live App
Visit the deployed application: **[Live Demo](https://your-app.vercel.app)** *(Update after deployment)*

### Option 2: Run Locally

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run the server
python run_simple.py
```

#### Frontend Setup
```bash
cd frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your backend URL

# Run the development server
npm run dev
```

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for APIs
- **Python 3.12+** - Latest Python features
- **Groq API** - Advanced AI language model integration
- **Uvicorn** - Lightning-fast ASGI server
- **Railway** - Cloud deployment platform

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend tooling
- **Vercel** - Frontend deployment platform

### AI Integration
- **Groq Llama 3.1** - Advanced language model for summarization
- **Intelligent Fallback** - Backup summarization when API is unavailable
- **Error Handling** - Graceful degradation and user feedback

## 📁 Project Structure

```
AI-Powered-Note-Summarizer/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # FastAPI application
│   │   └── __init__.py
│   ├── requirements.txt       # Python dependencies
│   ├── Procfile              # Railway deployment
│   ├── railway.json          # Railway configuration
│   ├── run_simple.py         # Local development server
│   └── .env.example          # Environment variables template
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── App.tsx           # Main React component
│   │   ├── main.tsx          # Application entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Node.js dependencies
│   ├── vercel.json           # Vercel configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── vite.config.ts        # Vite configuration
│   └── .env.example          # Environment variables template
├── DEPLOYMENT_GUIDE.md       # Complete deployment instructions
└── README.md                 # This file
```

## 🔧 API Endpoints

### Backend API (`/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Welcome message and API info |
| `GET` | `/health` | Health check and system status |
| `POST` | `/summarize` | AI-powered text summarization |

### Example API Usage

```bash
# Health check
curl https://your-api.railway.app/health

# Summarize text
curl -X POST https://your-api.railway.app/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your long text content here..."
  }'
```

## 🚀 Deployment

### Quick Deploy

1. **Fork this repository**
2. **Deploy backend to Railway**:
   - Connect GitHub repository
   - Set `GROQ_API_KEY` environment variable
   - Auto-deploy from `backend/` folder

3. **Deploy frontend to Vercel**:
   - Connect GitHub repository
   - Set `VITE_API_URL` to your Railway URL
   - Auto-deploy from `frontend/` folder

### Detailed Instructions
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete step-by-step instructions.

## 🔑 Environment Variables

### Backend (Railway)
```bash
GROQ_API_KEY=your_groq_api_key_here   # Required: Get from groq.com
DEBUG=False                           # Production mode
HOST=0.0.0.0                         # Listen on all interfaces  
PORT=8000                            # Server port
ALLOWED_ORIGINS=*                    # CORS origins
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://your-backend-url  # Your Railway backend URL
```

## 🤝 Contributing

Contributions are welcome! Please see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for development setup instructions.

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Made with ❤️ using React, FastAPI, and AI**

[Live Demo](https://your-app.vercel.app) • [Documentation](./DEPLOYMENT_GUIDE.md) • [Report Bug](https://github.com/PrincewillDev/AI-Powered-Note-Summarizer/issues)

</div>