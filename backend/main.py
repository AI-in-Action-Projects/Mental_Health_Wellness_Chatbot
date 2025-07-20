import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# Load the .env file from the same folder (backend)
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv(dotenv_path=env_path)

# Get the API key
api_key = os.getenv("GEMINI_API_KEY")

# Testing if the key is loaded properly
if not api_key:
    raise Exception("Gemini API key not found! Make sure your .env file is configured correctly.")

# Configure Gemini
genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.0-flash-lite-001")  # Change to your model

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatInput(BaseModel):
    message: str

@app.post("/chat")
async def chat(data: ChatInput):
    try:
        response = model.generate_content(data.message)
        return {"response": response.text}
    except Exception as e:
        return {"error": str(e)}