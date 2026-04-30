from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uuid
import shutil
import json
from backend.services.ai_service import generate_editing_plan
from backend.services.video_service import process_video

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use absolute paths for directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Mount static files to serve videos
app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

@app.get("/")
async def root():
    return {"message": "AI Video Editor Backend API", "upload_dir": UPLOAD_DIR}

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    if not file.content_type.startswith("video/") and not file.filename.endswith(('.mp4', '.mov', '.avi')):
        raise HTTPException(status_code=400, detail=f"Invalid file type {file.content_type}. Please upload a video.")

    file_extension = os.path.splitext(file.filename)[1]
    file_id = str(uuid.uuid4())
    filename = f"{file_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": filename, "file_id": file_id}

@app.post("/process")
async def process_video_endpoint(
    filename: str = Body(...),
    prompt: str = Body(...),
    feature_controls: dict = Body(...),
    mode: str = Body(...)
):
    input_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(input_path):
        raise HTTPException(status_code=404, detail=f"Video file not found at {input_path}")

    try:
        # 1. Generate editing plan using AI
        plan = await generate_editing_plan(prompt, feature_controls, mode)

        # 2. Process video based on plan
        output_filename = f"edited_{filename}"
        output_path = os.path.join(OUTPUT_DIR, output_filename)

        processed_path = process_video(input_path, output_path, plan)

        return {
            "status": "success",
            "plan": plan,
            "output_video_url": f"/outputs/{output_filename}",
            "filename": output_filename
        }
    except Exception as e:
        print(f"Error in process_video_endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
