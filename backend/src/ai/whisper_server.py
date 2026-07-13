from fastapi import FastAPI, UploadFile, File, Form
from faster_whisper import WhisperModel
import tempfile
import os
import dotenv

dotenv.load_dotenv()

app = FastAPI()

print("Loading Whisper model...")

model = WhisperModel(
    os.environ.get("WHISPER_MODEL_PATH", "large-v3"),
    device="cuda",
    compute_type="float16"
)

print("Whisper model loaded.")

@app.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    language: str = Form("en")
):
    suffix = os.path.splitext(audio.filename)[1] or ".wav"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
        temp.write(await audio.read())
        temp_path = temp.name

    try:
        segments, info = model.transcribe(
            temp_path,
            language=language,
            task="transcribe",
            beam_size=1
        )

        text = " ".join(segment.text for segment in segments).strip()

        return {
            "text": text,
            "language": info.language
        }

    finally:
        os.remove(temp_path)