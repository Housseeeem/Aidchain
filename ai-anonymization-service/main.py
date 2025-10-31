from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import tempfile
from pipeline import Pipeline

app = FastAPI(title="AidChain AI Anonymization Service", version="1.0.0")

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = Pipeline()

@app.get("/health")
def health():
    return {"status": "healthy", "service": "AI Anonymization Service", "version": "1.0.0"}

@app.post("/api/anonymize")
def anonymize(
    file: UploadFile = File(...),
    anonymization_type: str = Form("ner"),
    privacy_level: str = Form("high"),
    file_type: str = Form("csv")
):
    try:
        # Save uploaded file to temp
        with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as tmp:
            tmp.write(file.file.read())
            tmp_path = tmp.name
        # Run pipeline
        df, results, source_format = pipeline.analyze(tmp_path)
        # Save report
        report_path = tmp_path + "_report.json"
        pipeline.save(results, output=report_path)
        # Clean up temp file
        os.remove(tmp_path)
        return JSONResponse({
            "success": True,
            "message": "File anonymized successfully",
            "data": results,
            "report_path": report_path
        })
    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
