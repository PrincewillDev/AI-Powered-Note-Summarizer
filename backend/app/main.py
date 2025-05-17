from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from .database import get_db, Note
from sqlalchemy.orm import Session
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
    # Initialize Groq client
    try:
        groq_client = groq.Groq(api_key=GROQ_API_KEY)
        print("Groq client initialized successfully")
    except Exception as e:
        print(f"Error initializing Groq client: {str(e)}")

# Server Configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")

# Ensure we explicitly include localhost URLs for development
origins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"]

# Also include any from env if specified
if ALLOWED_ORIGINS != "*":
    for origin in ALLOWED_ORIGINS.split(","):
        if origin.strip() not in origins:
            origins.append(origin.strip())
elif ALLOWED_ORIGINS == "*":
    origins.append("*")

print(f"CORS enabled for origins: {origins}")

app = FastAPI(title="AI-Powered Note Summarizer API", debug=DEBUG)

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

class SaveNoteRequest(BaseModel):
    original_text: str
    summary: str

class NoteResponse(BaseModel):
    id: int
    original_text: str
    summary: str
    created_at: str

    class Config:
        orm_mode = True

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Note Summarizer API"}

@app.post("/summarize", response_model=SummarizeResponse)
def summarize_text(request: SummarizeRequest):
    """
    Summarize text using Groq's Llama 4 model
    """
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured")
    
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text is too short to summarize")
    
    try:
        print(f"Making API request to Groq with Llama 3.1 model...")
        print(f"API Key being used: {GROQ_API_KEY[:5]}...")
        print("Re-initializing Groq client to ensure fresh connection")
        # Re-initialize client for this request to ensure it's fresh
        groq_client = groq.Groq(api_key=GROQ_API_KEY)
        
        # Create the prompt for summarization
        summarization_prompt = f"""You are an AI assistant that summarizes text clearly and concisely.

Text to summarize:
{request.text}

Please provide a summary of the above text that captures the main points. Keep the summary concise."""

        print("Sending request to Groq API...")
        # Make request to Groq API using the Llama model
        try:
            completion = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",  # Using Llama 3.1 8B instant model which is available on Groq
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant that specializes in summarizing text."},
                    {"role": "user", "content": summarization_prompt}
                ],
                temperature=0.1,  # Low temperature for more focused summaries
                max_tokens=350,   # Limit the length of summaries
                top_p=0.9
            )
            print("Request to Groq API completed successfully")
        except Exception as e:
            print(f"Error during Groq API call: {str(e)}")
            raise
        
        print(f"Groq API response received")
        
        # Extract the summary from the response
        summary = completion.choices[0].message.content.strip()
        return SummarizeResponse(summary=summary)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to Groq API: {str(e)}")

@app.post("/save", response_model=NoteResponse)
def save_note(request: SaveNoteRequest, db: Session = Depends(get_db)):
    """
    Save the original note and its summary to the database
    """
    new_note = Note(
        original_text=request.original_text,
        summary=request.summary
    )
    
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    
    return new_note

@app.get("/notes", response_model=List[NoteResponse])
def get_notes(db: Session = Depends(get_db)):
    """
    Get all saved notes
    """
    notes = db.query(Note).all()
    return notes
