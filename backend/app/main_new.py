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
    description="A FastAPI backend for AI-powered text summarization",
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
    return {
        "message": "Welcome to the AI-Powered Note Summarizer API", 
        "status": "healthy", 
        "version": "1.0.0",
        "description": "AI-powered text summarization service"
    }

@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "environment": "production" if not DEBUG else "development",
        "features": {
            "summarization": True,
            "groq_configured": bool(GROQ_API_KEY),
            "fallback_enabled": True
        }
    }

@app.post("/summarize", response_model=SummarizeResponse)
def summarize_text(request: SummarizeRequest):
    """
    Summarize text using Groq's Llama model and generate a session ID
    """
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text is too short to summarize")
    
    try:
        print(f"Making API request to Groq with Llama 3.1 model...")
        if GROQ_API_KEY:
            print(f"API Key being used: {GROQ_API_KEY[:5]}...")
        
        # Create the prompt for summarization
        summarization_prompt = f"""You are an AI assistant that summarizes text clearly and concisely.

Text to summarize:
{request.text}

Please provide a summary of the above text that captures the main points. Keep the summary concise but comprehensive."""

        print("Sending request to Groq API...")
        
        try:
            if GROQ_API_KEY:
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
            else:
                raise Exception("No Groq API key configured")
                
        except groq.RateLimitError:
            print("Groq API rate limit exceeded, using fallback summary")
            # Fallback to intelligent summary
            completion = create_fallback_summary(request.text)
        except groq.APIError as e:
            print(f"Groq API error: {str(e)}")
            print("Falling back to intelligent text summarization...")
            # Fallback to intelligent summary generation
            completion = create_fallback_summary(request.text)
        except Exception as e:
            print(f"Unexpected error with Groq API: {str(e)}")
            print("Using fallback summarization...")
            # Fallback to intelligent summary generation
            completion = create_fallback_summary(request.text)
        
        print(f"Groq API response received")
        
        # Extract the summary from the response
        summary = completion.choices[0].message.content.strip()
        
        # Generate a unique session ID for this summarization
        note_session_id = str(uuid.uuid4())
        
        return SummarizeResponse(summary=summary, note_session_id=note_session_id)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during summarization: {str(e)}")

def create_fallback_summary(text: str):
    """Create an intelligent fallback summary when Groq API is unavailable"""
    sentences = text.split('.')
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
        summary_text = "Summary:\n\n• " + "\n\n• ".join(selected_sentences) + "\n\n[Generated using intelligent fallback summarization]"
    else:
        # For short text, provide a formatted version
        summary_text = f"Summary:\n\n• {text}\n\n[Note: Text was too short for detailed summarization]"
    
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
    
    return MockCompletion([MockCompletion.Choice(MockCompletion.Choice.Message(summary_text))])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
