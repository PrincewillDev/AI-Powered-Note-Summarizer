import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get server configuration from environment variables
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

def run_migrations():
    """Run database migrations before starting the server"""
    try:
        from migrate import main as run_migrate
        run_migrate()
        return True
    except Exception as e:
        print(f"Migration error: {e}")
        return False

if __name__ == "__main__":
    # Run migrations first
    print("Running database migrations...")
    if not run_migrations():
        print("Failed to run migrations. Exiting.")
        exit(1)
    
    print(f"Starting server on {HOST}:{PORT} (Debug: {DEBUG})")
    uvicorn.run(
        "app.main:app", 
        host=HOST, 
        port=PORT, 
        reload=DEBUG,
        workers=1 if DEBUG else 4,
        access_log=DEBUG,
        log_level="debug" if DEBUG else "info"
    )
