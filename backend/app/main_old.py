from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import os
import uuid
from dotenv import load_dotenv
import groq

# Load environment variables explicitly from the .env file
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
print(f"Loading .env from: {dotenv_path}")
load_dotenv(dotenv_path=dotenv_path)

# API Configuration - Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
print(f"Loaded Groq API key: {GROQ_API_KEY[:5]}..." if GROQ_API_KEY else "No Groq API key found")

if not GROQ_API_KEY:
    print("Warning: Groq API key not found. Set GROQ_API_KEY in .env file.")
else:
    print(f"Initializing Groq client with key starting with: {GROQ_API_KEY[:5]}...")
    # We'll initialize the Groq client when needed instead of globally

# Server Configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

# CORS Configuration for production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Build origins list
origins = []

# Add development origins
if DEBUG:
    dev_origins = [
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://localhost:5175", 
        "http://127.0.0.1:5173", 
        "http://127.0.0.1:5174", 
        "http://127.0.0.1:5175",
        "http://localhost:3000"
    ]
    origins.extend(dev_origins)

# Add production frontend URL
if FRONTEND_URL and FRONTEND_URL not in origins:
    origins.append(FRONTEND_URL)

# Add configured origins
if ALLOWED_ORIGINS != "*":
    for origin in ALLOWED_ORIGINS.split(","):
        origin = origin.strip()
        if origin and origin not in origins:
            origins.append(origin)

# If no specific origins and not debug, allow all
if not origins or ALLOWED_ORIGINS == "*":
    origins = ["*"]

print(f"CORS enabled for origins: {origins}")

app = FastAPI(
    title="AI-Powered Note Summarizer API", 
    description="A FastAPI backend for AI-powered text summarization with note management",
    version="1.0.0",
    debug=DEBUG
)

# Add CORS middleware to allow frontend to communicate with API
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class SummarizeRequest(BaseModel):
    text: str

class SummarizeResponse(BaseModel):
    summary: str
    note_session_id: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Note Summarizer API", "status": "healthy", "version": "1.0.0"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint for monitoring"""
    try:
        # Test database connection
        if os.getenv("DATABASE_URL", "").startswith("postgresql://"):
            # PostgreSQL version check
            result = db.execute(text("SELECT version()"))
            db_info = result.fetchone()[0].split(',')[0]
            db_type = "PostgreSQL"
        else:
            # SQLite version check
            result = db.execute(text("SELECT sqlite_version()"))
            db_version = result.fetchone()[0]
            db_info = f"SQLite {db_version}"
            db_type = "SQLite"
        
        # Count total notes
        note_count = db.query(Note).count()
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0",
            "environment": "production" if not DEBUG else "development",
            "database": {
                "type": db_type,
                "status": "connected",
                "info": db_info,
                "total_notes": note_count
            },
            "api": {
                "groq_configured": bool(GROQ_API_KEY),
                "fallback_enabled": True
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0",
            "environment": "production" if not DEBUG else "development",
            "error": str(e),
            "database": {
                "status": "disconnected"
            }
        }

@app.post("/summarize", response_model=SummarizeResponse)
def summarize_text(request: SummarizeRequest):
    """
    Summarize text using Groq's Llama model and generate a session ID
    """
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured")
    
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text is too short to summarize")
    
    try:
        print(f"Making API request to Groq with Llama 3.1 model...")
        print(f"API Key being used: {GROQ_API_KEY[:5]}...")
        
        # Create the prompt for summarization
        summarization_prompt = f"""You are an AI assistant that summarizes text clearly and concisely.

Text to summarize:
{request.text}

Please provide a summary of the above text that captures the main points. Keep the summary concise but comprehensive."""

        print("Sending request to Groq API...")
        
        try:
            # Initialize Groq client
            client = groq.Groq(api_key=GROQ_API_KEY)
            
            # Make request to Groq API using the Llama model
            completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": summarization_prompt,
                    }
                ],
                model="llama3-8b-8192",  # Using Llama 3 8B model
                temperature=0.3,  # Lower temperature for more consistent summaries
                max_tokens=1000,  # Reasonable limit for summaries
            )
            
            print("Groq API request successful")
        except groq.RateLimitError:
            print("Groq API rate limit exceeded, using fallback summary")
            # Fallback to mock summary if rate limited
            sentences = request.text.split('.')
            if len(sentences) > 3:
                selected_sentences = [sentences[0]]
                middle_idx = len(sentences) // 2
                if middle_idx < len(sentences):
                    selected_sentences.append(sentences[middle_idx])
                for i in range(len(sentences) - 1, 0, -1):
                    if sentences[i].strip() and len(sentences[i].strip()) > 15:
                        selected_sentences.append(sentences[i])
                        break
                mock_summary = '. '.join(selected_sentences) + '.'
            else:
                mock_summary = sentences[0] + '.' if sentences else request.text
                
            # Create mock completion structure
            class MockCompletion:
                class Choice:
                    class Message:
                        def __init__(self, content):
                            self.content = content
                    def __init__(self, message):
                        self.message = message
                def __init__(self, choices):
                    self.choices = choices
            
            completion = MockCompletion([MockCompletion.Choice(MockCompletion.Choice.Message(mock_summary))])
        except groq.APIError as e:
            print(f"Groq API error: {str(e)}")
            print("Falling back to intelligent text summarization...")
            # Fallback to intelligent summary generation
            sentences = request.text.split('.')
            sentences = [s.strip() for s in sentences if s.strip()]
            
            if len(sentences) > 3:
                # Take first sentence (often contains main topic)
                selected_sentences = [sentences[0]]
                # Add middle content
                middle_idx = len(sentences) // 2
                if middle_idx < len(sentences):
                    selected_sentences.append(sentences[middle_idx])
                # Add conclusion if available
                for i in range(len(sentences) - 1, 0, -1):
                    if sentences[i].strip() and len(sentences[i].strip()) > 15:
                        selected_sentences.append(sentences[i])
                        break
                
                # Create an intelligent summary with bullet points
                summary_text = "Summary:\n\n• " + "\n\n• ".join(selected_sentences) + "\n\n[Generated using fallback summarization]"
            else:
                # For short text, provide a formatted version
                summary_text = f"Summary:\n\n• {request.text}\n\n[Note: Text was too short for detailed summarization]"
                
            # Create mock completion structure
            class MockCompletion:
                class Choice:
                    class Message:
                        def __init__(self, content):
                            self.content = content
                    def __init__(self, message):
                        self.message = message
                def __init__(self, choices):
                    self.choices = choices
            
            completion = MockCompletion([MockCompletion.Choice(MockCompletion.Choice.Message(summary_text))])
        except Exception as e:
            print(f"Unexpected error with Groq API: {str(e)}")
            print("Using fallback summarization...")
            # Fallback to intelligent summary generation
            sentences = request.text.split('.')
            sentences = [s.strip() for s in sentences if s.strip()]
            
            if len(sentences) > 3:
                selected_sentences = [sentences[0]]
                middle_idx = len(sentences) // 2
                if middle_idx < len(sentences):
                    selected_sentences.append(sentences[middle_idx])
                for i in range(len(sentences) - 1, 0, -1):
                    if sentences[i].strip() and len(sentences[i].strip()) > 15:
                        selected_sentences.append(sentences[i])
                        break
                
                summary_text = "Summary:\n\n• " + "\n\n• ".join(selected_sentences) + "\n\n[Generated using fallback summarization]"
            else:
                summary_text = f"Summary:\n\n• {request.text}\n\n[Note: Text was too short for detailed summarization]"
            
            # Create mock completion structure
            class MockCompletion:
                class Choice:
                    class Message:
                        def __init__(self, content):
                            self.content = content
                    def __init__(self, message):
                        self.message = message
                def __init__(self, choices):
                    self.choices = choices
            
            completion = MockCompletion([MockCompletion.Choice(MockCompletion.Choice.Message(summary_text))])
        
        print(f"Groq API response received")
        
        # Extract the summary from the response
        summary = completion.choices[0].message.content.strip()
        
        # Generate a unique session ID for this summarization
        note_session_id = str(uuid.uuid4())
        
        return SummarizeResponse(summary=summary, note_session_id=note_session_id)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to Groq API: {str(e)}")

@app.post("/notes", response_model=NoteResponse)
def create_note(request: SaveNoteRequest, db: Session = Depends(get_db)):
    """
    Save a new note with its summary and session ID to the database
    """
    try:
        # First check if a note with this session ID already exists
        existing_note = db.query(Note).filter(Note.note_session_id == request.note_session_id).first()
        if existing_note:
            # If it exists, return 409 Conflict
            raise HTTPException(
                status_code=409, 
                detail=f"Note with session ID {request.note_session_id} already exists. Use PUT to update."
            )
        
        # Create a new note with transaction handling
        with db.begin_nested():  # Use savepoint for this operation
            new_note = Note(
                note_session_id=request.note_session_id,
                original_text=request.original_text,
                summary=request.summary
            )
            
            db.add(new_note)
        
        # Commit the transaction to the database
        try:
            db.commit()
            db.refresh(new_note)
        except Exception as commit_error:
            db.rollback()
            print(f"Database commit error: {str(commit_error)}")
            # Wait a moment and retry once
            import time
            time.sleep(1.0)  # Longer wait time
            
            # Try again with a new transaction
            new_note = Note(
                note_session_id=request.note_session_id,
                original_text=request.original_text,
                summary=request.summary
            )
            db.add(new_note)
            db.commit()
            db.refresh(new_note)
        
        return new_note
    except Exception as e:
        if "HTTPException" not in str(e.__class__):
            db.rollback()
            print(f"Error creating note: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Database error while creating note: {str(e)}")
        raise

@app.put("/notes/{note_session_id}", response_model=NoteResponse)
def update_note(note_session_id: str, request: UpdateNoteRequest, db: Session = Depends(get_db)):
    """
    Update an existing note's summary by its session ID
    """
    try:
        # Find the note with the given session ID
        note = db.query(Note).filter(Note.note_session_id == note_session_id).first()
        if not note:
            raise HTTPException(status_code=404, detail=f"Note with session ID {note_session_id} not found")
        
        # Update the note using a savepoint transaction
        try:
            with db.begin_nested():  # Create a savepoint
                note.summary = request.summary
                # updated_at will be automatically updated due to onupdate parameter
            
            # Commit the transaction to the database
            db.commit()
            db.refresh(note)
        except Exception as commit_error:
            db.rollback()
            print(f"Database commit error during update: {str(commit_error)}")
            # Wait a moment and retry once with longer timeout
            import time
            time.sleep(1.0)  # Longer wait time
            
            # Re-fetch the note and try again with a new transaction
            try:
                note = db.query(Note).filter(Note.note_session_id == note_session_id).first()
                if note:
                    note.summary = request.summary  # Update summary again
                    db.commit()  # Commit changes
                    db.refresh(note)  # Refresh with latest data
                else:
                    raise HTTPException(status_code=404, detail=f"Note with session ID {note_session_id} not found after retry")
            except Exception as retry_error:
                db.rollback()
                print(f"Database error during update retry: {str(retry_error)}")
                raise HTTPException(status_code=500, detail="Database error while updating note after retry")
        
        return note
    except Exception as e:
        if "HTTPException" not in str(e.__class__):
            db.rollback()
            print(f"Error updating note: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Database error while updating note: {str(e)}")
        raise

@app.get("/notes", response_model=List[NoteResponse])
def get_notes(db: Session = Depends(get_db)):
    """
    Get all saved notes
    """
    try:
        notes = db.query(Note).order_by(Note.created_at.desc()).all()
        return notes
    except Exception as e:
        print(f"Error fetching notes: {str(e)}")
        db.rollback()  # Rollback transaction on error
        raise HTTPException(status_code=500, detail="Database error while fetching notes")

@app.get("/notes/{note_session_id}", response_model=NoteResponse)
def get_note_by_session_id(note_session_id: str, db: Session = Depends(get_db)):
    """
    Get a specific note by its session ID
    """
    try:
        note = db.query(Note).filter(Note.note_session_id == note_session_id).first()
        if not note:
            raise HTTPException(status_code=404, detail=f"Note with session ID {note_session_id} not found")
        
        return note
    except Exception as e:
        if "HTTPException" not in str(e.__class__):
            print(f"Error fetching note: {str(e)}")
            db.rollback()  # Rollback transaction on error
            raise HTTPException(status_code=500, detail="Database error while fetching note")
        raise
