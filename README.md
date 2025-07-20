# Mental Health Wellness Chatbot
## Project Description

This is a multi-modal mental health support chat-bot developed as a understanding online companion for people affected by a mental issue in the state of emotional impairment. The chat-bot is user-friendly and designed with an emphasis on privacy, simplicity, and conversational design, as well as to offer empathetic responses and identify crisis language, walk the users toward mental wellness activities and assessment stages, plan solutions, take action, and follow up.

## Key Features and **Chatbot Conversational State Flow**

- **AI-Generated Empathetic Responses**: Generates compassionate and intelligent replies using Google Gemini (gemini-2.0-flash-lite-001 model).
- **Voice Support**: Enables both text-to-speech (TTS) and speech-to-text (STT) so users can speak to the bot and listen to responses.
- **Emotional Phase Navigation:** Dynamically switches between four emotional support phases that are: Assessment, Solution Planning, Action Suggestion, Follow-up.
- **Crisis Detection**: Identifies potential emotional distress or crisis keywords in the conversation and responds with appropriate prompts.
- **Light & Dark Theme Toggle**: Supports switching between light and dark modes with a toggle.
- **Responsive Design**: Built with Tailwind CSS to ensure it looks great across devices (mobile, tablet, desktop).

## Architecture Overview:

### **Frontend: (React + TypeScript + TailwindCSS)**

- **Primary entry point**: `App.tsx`
- **Voice**: Text-to-speech and speech recognition using Eleven labs
- **API Integration**: Communicates with the FastAPI backend via a `POST` request to `/chat`

### **Backend: (Python + FastAPI + Google Gemini API)**

- **Primary entry point**: `main.py`
- **Endpoints**: `/chat` - Accepts a user message (via JSON), forwards it to the Gemini API (model: `gemini-2.0-flash-lite-001`), and returns the AI-generated response
- **CORS Enabled**: To allow frontend hosted on different domains (like Cloud Run) interact securely
- **Deployment**: Deployed using Docker on Google Cloud Run for both frontend and backend

### Overall application flow:

```
User → React UI → fetch('API route that calls FastAPI') → FastAPI request → Gemini API → FastAPI response → React UI → User
```

1. The user inputs a message as a text or voice.
2. It is sent to the backend via the `/chat` endpoint.
3. The backend processes is using Google’s Gemini 2.0 model.
4. The response is returned and displayed with an optional voice output.

## Technologies Used:

| Category | Stack |
| --- | --- |
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | FastAPI, Pydantic, CORS Middleware |
| AI Integration | Google Gemini (Generative AI) API |
| Cloud Hosting | Google Cloud Run |
| Voice Support | Eleven Labs |
| Version Control | GitHub |
