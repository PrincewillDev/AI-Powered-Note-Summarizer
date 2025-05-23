# 🧠 Product Specification: AI-Powered Note Summarizer (Hugging Face Edition)

## 🔹 Product Name
AI-Powered Note Summarizer

## 🔹 Description
A full-stack web application that allows users to input long-form notes and receive concise summaries generated by a Hugging Face transformer model. Users can also save these summaries to a backend database.

---

## 🔹 Goals

- Provide a clean interface to paste or write long notes.
- Use Hugging Face's `facebook/bart-large-cnn` model to summarize text.
- Save the original note and its summary to a database.
- Provide a simple, performant API to power the frontend.

---

## 🔹 Frontend (Client)

- **Framework**: React
- **Styling**: Tailwind CSS
- **Pages**:
  - `Home`: Text input for the note, summarize button, display summary.
  - `Saved Notes`: List of saved notes with summaries (optional for MVP).
- **Components**:
  - `TextArea`: For writing/pasting notes.
  - `SummarizeButton`: Triggers API call to summarize text.
  - `SummaryDisplay`: Shows returned summary.
- **API Interaction**:
  - `POST /summarize` to get summary
  - `POST /save` to store summary in DB (optional MVP)

---

## 🔹 Backend (Server)

- **Framework**: FastAPI (Python)
- **Endpoints**:
  - `POST /summarize`: Accepts raw text, returns summary
  - `POST /save`: Stores input + summary (optional)
  - `GET /notes`: Returns saved notes (optional)
- **AI Integration**:
  - Use Hugging Face Inference API for `facebook/bart-large-cnn`
  - Authorization via API token stored in `.env`

```python
# Example API usage
def summarize(text: str) -> str:
    response = requests.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        headers={"Authorization": f"Bearer {HF_API_KEY}"},
        json={"inputs": text}
    )
    return response.json()[0]["summary_text"]
