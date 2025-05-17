import os
import requests
from dotenv import load_dotenv

# Load environment variables directly
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
print(f"Loading .env from: {dotenv_path}")
load_dotenv(dotenv_path=dotenv_path)

# Get API key
HF_API_KEY = os.getenv("HF_API_KEY")
print(f"Loaded API key: {HF_API_KEY[:10]}..." if HF_API_KEY else "No API key found")

# Sample text to summarize
test_text = "The Moon is a barren, rocky world without air and water. It has poor conditions for life of any sort to exist."

# Make API request
print("Making API request to Hugging Face...")
response = requests.post(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    headers={
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    },
    json={"inputs": test_text},
    timeout=30
)

# Print response details
print(f"Response status code: {response.status_code}")
print(f"Response headers: {response.headers}")
print(f"Response content: {response.text}")

# If successful, print summary
if response.status_code == 200:
    summary = response.json()[0]["summary_text"]
    print(f"\nSummary: {summary}")
else:
    print("\nFailed to get summary")
