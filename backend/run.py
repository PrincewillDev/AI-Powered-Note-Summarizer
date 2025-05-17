import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get server configuration from environment variables
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app", 
        host=HOST, 
        port=PORT, 
        reload=DEBUG
    )
