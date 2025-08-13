# AI-Powered Note Summarizer Setup Guide

This application consists of a FastAPI backend that uses AI to summarize text and a React frontend for the user interface.

## Architecture Overview

- **Backend**: FastAPI server with SQLite database and Groq AI integration
- **Frontend**: React + TypeScript + Tailwind CSS application
- **Database**: SQLite for storing notes and summaries

## Prerequisites

- Python 3.8+
- Node.js 16+ and npm
- Git

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   - The `.env` file is already configured with default settings
   - To use the full Groq API functionality, update the `GROQ_API_KEY` in `.env`
   - Get your API key from: https://console.groq.com/keys

5. **Start the backend server:**
   ```bash
   python run.py
   ```

   The backend will be available at: http://localhost:8000

## Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the application:**
   ```bash
   npm run build
   ```

4. **Start the frontend server:**
   ```bash
   cd dist
   python3 -m http.server 5175
   ```

   The frontend will be available at: http://localhost:5175

## Alternative Frontend Development Mode

For active development with hot reloading:

```bash
cd frontend
npm run dev
```

Note: You may encounter file watcher limits on Linux. If so, use the production build method above.

## Using the Application

1. **Access the application:**
   - Open http://localhost:5175 in your web browser

2. **Summarize text:**
   - Paste or type your text in the input area
   - Click "Summarize with AI"
   - The AI will generate a summary using either Groq API or intelligent fallback

3. **Save notes:**
   - After generating a summary, click the "Save Note" button
   - Saved notes will be stored in the SQLite database

4. **View saved notes:**
   - Click "Saved Notes" in the header navigation
   - Click on any note to reload it

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /` - Welcome message
- `POST /summarize` - Summarize text input
- `POST /notes` - Save a note with summary
- `GET /notes` - Get all saved notes
- `GET /notes/{note_session_id}` - Get specific note
- `PUT /notes/{note_session_id}` - Update note summary

## Database

The application uses SQLite with the following schema:

```sql
CREATE TABLE notes (
    id INTEGER PRIMARY KEY,
    note_session_id VARCHAR(36) UNIQUE NOT NULL,
    original_text TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Backend Issues

1. **"Groq API error"**: The fallback summarization will work even with invalid API keys
2. **Database locked**: Restart the backend server
3. **Port 8000 in use**: Change the PORT in `.env` file

### Frontend Issues

1. **CORS errors**: Ensure backend is running and CORS is configured properly
2. **Network errors**: Verify both servers are running on correct ports
3. **File watcher errors**: Use the production build method instead of dev mode

## Testing the API

Use curl to test the backend directly:

```bash
# Test summarization
curl -X POST http://localhost:8000/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text to summarize here"}'

# Test saving a note
curl -X POST http://localhost:8000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "original_text": "Original text",
    "summary": "Summary text", 
    "note_session_id": "unique-session-id"
  }'

# Get all notes
curl http://localhost:8000/notes
```

## Features

✅ **AI Text Summarization** - Uses Groq API with intelligent fallback  
✅ **Note Management** - Save, retrieve, and manage summaries  
✅ **Responsive UI** - Modern React interface with Tailwind CSS  
✅ **Database Persistence** - SQLite storage for notes  
✅ **Copy/Share/Download** - Multiple ways to export summaries  
✅ **Error Handling** - Graceful handling of API failures  
✅ **CORS Support** - Proper cross-origin configuration  

## Future Enhancements

- User authentication and personal note organization
- Note categories and tags
- Export to multiple formats (PDF, Word, etc.)
- Real-time collaborative note editing
- Integration with cloud storage providers
- Advanced AI models and summarization options

---

**Status**: ✅ Fully functional and connected
- Backend server running on http://localhost:8000
- Frontend server running on http://localhost:5175
- Database initialized and working
- AI summarization with fallback functionality
- All CRUD operations for notes working
