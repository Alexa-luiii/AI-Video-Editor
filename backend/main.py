from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uuid
import shutil
import json
import edge_tts
import asyncio
import google.generativeai as genai
from typing import List, Optional

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
TTS_DIR = os.path.join(OUTPUT_DIR, "tts")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(TTS_DIR, exist_ok=True)

app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

@app.get("/")
async def root():
    return {"message": "ClipMind AI Video Editor Backend API"}

# Mock Whisper / Gemini integration for MVP
@app.post("/api/analyze")
async def analyze_video(filename: str = Body(...), prompt: str = Body(...)):
    # In a real app, this would use genai and whisper
    return {
        "has_speech": True,
        "decisions": [
            { "id": "1", "icon": "ti-subtitles", "label": "Synced bold captions for speech", "status": "pending" },
            { "id": "2", "icon": "ti-wave-sine", "label": "Dynamic glitch transitions", "status": "pending" },
            { "id": "3", "icon": "ti-headphones", "label": "Energetic electronic background music", "status": "pending" },
            { "id": "4", "icon": "ti-wand", "label": "Subtle vignette and film grain", "status": "pending" },
            { "id": "5", "icon": "ti-crop", "label": "9:16 Format for TikTok/Reels", "status": "pending" },
        ]
    }

@app.post("/api/tts")
async def generate_tts(text: str = Body(...), voice: str = Body(...)):
    voice_map = {
        "Alex": "en-US-ChristopherNeural",
        "Aria": "en-US-AriaNeural"
    }

    selected_voice = voice_map.get(voice, "en-US-ChristopherNeural")
    filename = f"tts_{uuid.uuid4()}.mp3"
    filepath = os.path.join(TTS_DIR, filename)

    try:
        communicate = edge_tts.Communicate(text, selected_voice)
        await communicate.save(filepath)
        return {"url": f"/outputs/tts/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
