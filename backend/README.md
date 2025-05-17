# AI-Powered Note Summarizer Backend

This is the FastAPI backend for the AI-Powered Note Summarizer application. It provides API endpoints for summarizing text using Hugging Face's `facebook/bart-large-cnn` model and storing notes in a SQLite database.

## Setup Instructions

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install the requirements:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file and add your Hugging Face API key:
   ```
   HF_API_KEY=your_hugging_face_api_key_here
   ```
   You can get an API key from https://huggingface.co/settings/tokens

5. Run the application:
   ```bash
   python run.py
   ```

6. The API will be available at http://localhost:8000

## API Endpoints

- `GET /`: Welcome message
- `POST /summarize`: Summarize text
  - Request body: `{ "text": "Your long text to summarize" }`
  - Response: `{ "summary": "Summarized text" }`
- `POST /save`: Save a note and its summary
  - Request body: `{ "original_text": "Original text", "summary": "Summarized text" }`
  - Response: Note object with ID and timestamp
- `GET /notes`: Get all saved notes
  - Response: Array of note objects

## API Documentation

FastAPI automatically generates interactive API documentation. Once the server is running, you can access:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
