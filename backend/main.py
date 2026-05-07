from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uuid
import shutil
import json
import edge_tts
import asyncio
from typing import List, Optional, Dict
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, AudioFileClip, ColorClip
from moviepy.video.fx.all import crop, resize, fadein, fadeout
import moviepy.video.fx.all as vfx

app = FastAPI()

# Configure CORS - Restrict to local frontend for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
TTS_DIR = os.path.join(OUTPUT_DIR, "tts")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TTS_DIR, exist_ok=True)

app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

SYSTEM_PROMPT = """You are an advanced AI Video Editing Agent.

Your job is to generate a COMPLETE, PROFESSIONAL, PRODUCTION-READY video editing plan.

You must behave like a full video editor (similar to CapCut-level capability) but controlled by:

1. User Prompt (highest priority)
2. Video Understanding (speech + visuals)
3. User Feature Controls (Apply / Skip / No Idea)
4. Editing Best Practices

--------------------------------------------------

🎯 GOAL:
Return a FULL editing plan covering ALL editing features.

NOT suggestions — FINAL decisions.

--------------------------------------------------

🧠 STEP 1: ANALYZE VIDEO

- Detect speech / silence
- Identify speaker tone (funny, emotional, serious)
- Detect scenes, objects, actions
- Identify video type:
  (demo, reel, vlog, tutorial, ad, proposal, etc.)

--------------------------------------------------

📝 STEP 2: UNDERSTAND USER PROMPT

Extract:
- Tone (funny, emotional, professional)
- Purpose (client demo, viral reel, proposal, branding)
- Platform (TikTok, YouTube, Instagram)

User prompt ALWAYS overrides defaults.

--------------------------------------------------

🎛️ STEP 3: FEATURE CONTROL LOGIC

For EACH feature below:

- APPLY → MUST include
- SKIP → MUST NOT include
- NO IDEA → AI decides best

--------------------------------------------------

🎬 STEP 4: FULL EDITING FEATURES (MANDATORY)

You MUST process ALL of these:

-----------------------
📁 BASIC EDITING
-----------------------
- Upload video (assumed input)
- Timeline structure
- Trim / Split scenes
- Crop framing
- Merge clips (if needed)
- Delete unnecessary sections

-----------------------
📝 TEXT & CAPTIONS
-----------------------
- Auto subtitles from speech
- Manual text overlays (based on prompt)
- Font styles (bold / normal)
- Text colors (based on tone)
- Positioning (center, top, bottom)

-----------------------
🎤 VOICE SYSTEM
-----------------------
- If speech exists → generate captions
- If silent → generate voiceover

Voice types:
- Male AI
- Female AI
- User uploaded voice (priority if provided)

- Sync voice with visuals
- Adjust voice volume

-----------------------
🎵 AUDIO SYSTEM
-----------------------
- Background music selection (based on tone)
- Volume balancing (voice > music priority)
- Fade in / fade out

-----------------------
🎨 VISUAL SYSTEM
-----------------------
- Filters (based on mood)
- Color grading
- Brightness / contrast adjustments

-----------------------
⚡ EFFECTS SYSTEM
-----------------------
- Zoom in / zoom out
- Transitions between cuts
- Animations (text + scene)
- Speed control (slow / fast sections)

-----------------------
📱 FORMAT SYSTEM
-----------------------
Auto decide or follow prompt:

- 9:16 → TikTok / Reels
- 16:9 → YouTube
- 1:1 → Instagram

--------------------------------------------------

🤖 STEP 5: SMART DECISION ENGINE (CORE USP)

For EVERY feature above:

Respect user selection:

- APPLY → force include
- SKIP → completely remove
- NO IDEA → decide using:
   - video content
   - prompt intent
   - professional editing logic

--------------------------------------------------

🧠 STEP 6: MODES (VERY IMPORTANT)

Support 3 modes:

1. AUTO MODE:
   - Full AI editing
   - No user intervention

2. ASSIST MODE:
   - AI suggests plan
   - User can modify

3. MANUAL MODE:
   - Minimal AI
   - Only basic automation

--------------------------------------------------

🎬 STEP 7: FINAL OUTPUT (STRICT JSON)

Return structured plan:

{
  "video_type": "",
  "tone": "",
  "target_platform": "",
  "mode": "auto/assist/manual",

  "basic_editing": {
    "cuts": [],
    "trim_sections": [],
    "crop": "",
    "merge": false
  },

  "captions": {
    "enabled": true,
    "style": "",
    "color": "",
    "position": ""
  },

  "text_overlays": [
    {
      "text": "",
      "timing": "",
      "style": "",
      "position": ""
    }
  ],

  "voiceover": {
    "type": "male/female/user/none",
    "script": "",
    "volume": ""
  },

  "audio": {
    "background_music": "",
    "volume": "",
    "fade": "in/out/none"
  },

  "visual": {
    "filters": "",
    "color_grading": "",
    "brightness": "",
    "contrast": ""
  },

  "effects": {
    "zoom": "",
    "transitions": [],
    "animations": [],
    "speed": ""
  },

  "format": {
    "aspect_ratio": ""
  },

  "extra_notes": ""
}
"""

@app.get("/")
async def root():
    return {"message": "ClipMind AI Video Editor Backend API"}

@app.post("/api/upload")
async def upload_video(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": filename}

@app.post("/api/analyze")
async def analyze_video(
    filename: str = Body(...),
    prompt: str = Body(...),
    controls: Dict[str, str] = Body(...),
    mode: str = Body(...)
):
    # In a production app, we'd call an LLM with SYSTEM_PROMPT + video analysis
    # For MVP, we return a structured plan that follows the logic

    plan = {
        "video_type": "tutorial",
        "tone": "professional",
        "target_platform": "TikTok" if controls.get("9:16 (TikTok)") == "apply" else "YouTube",
        "mode": mode,
        "basic_editing": {
            "cuts": [0, 5, 10],
            "trim_sections": [[2, 4]],
            "crop": "center",
            "merge": False
        },
        "captions": {
            "enabled": True if controls.get("Auto captions") != "skip" else False,
            "style": "bold",
            "color": "yellow",
            "position": "bottom"
        },
        "text_overlays": [
            {"text": "AI Video Editor", "timing": [1, 3], "style": "heading", "position": "top"}
        ],
        "voiceover": {
            "type": "male" if controls.get("AI Voice Male") == "apply" else "none",
            "script": "Welcome to our AI video editor tutorial.",
            "volume": "1.0"
        },
        "audio": {
            "background_music": "lofi-beat.mp3",
            "volume": "0.2",
            "fade": "in/out"
        },
        "visual": {
            "filters": "vibrant",
            "color_grading": "warm",
            "brightness": "1.1",
            "contrast": "1.0"
        },
        "effects": {
            "zoom": "1.2",
            "transitions": ["fade"],
            "animations": ["slide-in"],
            "speed": "1.0"
        },
        "format": {
            "aspect_ratio": "9:16" if controls.get("9:16 (TikTok)") == "apply" else "16:9"
        },
        "extra_notes": "Optimized for social media engagement."
    }

    # Return both the plan and the preview decisions for the UI
    return {
        "plan": plan,
        "decisions": [
            { "id": "1", "icon": "ti-subtitles", "label": "Synced bold captions for speech", "status": "pending" },
            { "id": "2", "icon": "ti-wave-sine", "label": "Dynamic glitch transitions", "status": "pending" },
            { "id": "3", "icon": "ti-headphones", "label": "Energetic electronic background music", "status": "pending" },
            { "id": "4", "icon": "ti-wand", "label": "Subtle vignette and film grain", "status": "pending" },
            { "id": "5", "icon": "ti-crop", "label": "9:16 Format for TikTok/Reels", "status": "pending" },
        ]
    }

@app.post("/api/process")
async def process_video(filename: str = Body(...), plan: Dict = Body(...)):
    input_path = os.path.join(UPLOAD_DIR, filename)
    output_filename = f"edited_{filename}"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    if not os.path.exists(input_path):
        raise HTTPException(status_code=404, detail="Video file not found")

    try:
        video = VideoFileClip(input_path)

        # Apply Trim
        if plan.get("basic_editing", {}).get("trim_sections"):
            sections = plan["basic_editing"]["trim_sections"]
            # Simplified: just take first section for demo
            if sections:
                video = video.subclip(sections[0][0], min(sections[0][1], video.duration))

        # Apply Format
        ratio = plan.get("format", {}).get("aspect_ratio", "16:9")
        if ratio == "9:16":
            w, h = video.size
            target_w = h * 9 / 16
            video = crop(video, x_center=w/2, y_center=h/2, width=target_w, height=h)

        # Add Text Overlay (Simple implementation)
        clips = [video]
        if plan.get("text_overlays"):
            for text_data in plan["text_overlays"]:
                txt = TextClip(
                    text_data["text"],
                    fontsize=70,
                    color='white',
                    font='Arial-Bold',
                    bg_color='black'
                ).set_start(text_data["timing"][0]).set_duration(text_data["timing"][1] - text_data["timing"][0]).set_position(text_data["position"])
                clips.append(txt)

        final_video = CompositeVideoClip(clips)

        # Final export
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")

        return {"url": f"/outputs/{output_filename}"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

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
