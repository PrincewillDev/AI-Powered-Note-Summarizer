import os
import sys
from dotenv import load_dotenv
import groq

# Load environment variables from .env file
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
print(f"Loading .env from: {dotenv_path}")
load_dotenv(dotenv_path=dotenv_path)

# Get the Groq API key
groq_api_key = os.getenv("GROQ_API_KEY")

if not groq_api_key:
    print("Error: GROQ_API_KEY not found in .env file")
    print("Please make sure to add your Groq API key to the .env file")
    sys.exit(1)

print(f"Found Groq API key: {groq_api_key[:5]}...")

try:
    # Initialize the Groq client
    client = groq.Groq(api_key=groq_api_key)
    
    # Test connection with a simple request
    test_text = "Hello, this is a test message to verify Groq API connectivity."
    
    print("Making API request to Groq with Llama 4 model...")
    
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",  # Using Llama 3.1 8B instant model which is available on Groq
        messages=[
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": "Respond with 'Connection successful!' if you can read this message."}
        ],
        temperature=0.1,
        max_tokens=50
    )
    
    print("\nAPI Response:")
    print(f"Status: Success")
    print(f"Model used: {completion.model}")
    print(f"Response: {completion.choices[0].message.content}")
    print("\nGroq API connection test completed successfully!")
    
except Exception as e:
    print(f"\nError: Failed to connect to Groq API: {str(e)}")
    print("Please check your API key and internet connection")
    sys.exit(1)
