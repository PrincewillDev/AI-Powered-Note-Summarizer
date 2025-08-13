import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get server configuration from environment variables
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))  # Use port 8000 for production
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")  # Disable debug for production

if __name__ == "__main__":
    print(f"Starting AI-Powered Note Summarizer API on {HOST}:{PORT} (Debug: {DEBUG})")
    uvicorn.run(
        "app.main:app", 
        host=HOST, 
        port=PORT, 
        reload=DEBUG,
        workers=1 if DEBUG else 4,  # Use multiple workers for production
        access_log=DEBUG,
        log_level="debug" if DEBUG else "info"
    )
