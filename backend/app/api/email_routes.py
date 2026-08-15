from fastapi import APIRouter, HTTPException, UploadFile, File
from app.schemas.email import EmailInputPaste
from app.schemas.analysis import AnalysisResponse
from app.services.analysis_service import run_email_analysis

router = APIRouter(prefix="/analyze", tags=["Email Analysis"])

@router.post("/email", response_model=AnalysisResponse)
def analyze_email_paste(payload: EmailInputPaste):
    if not payload.raw_email.strip():
        raise HTTPException(status_code=400, detail="Raw email content cannot be empty.")
    try:
        return run_email_analysis(payload.raw_email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to parse or analyze email: {str(e)}")


@router.post("/file", response_model=AnalysisResponse)
async def analyze_email_file(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.eml', '.txt')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a valid .eml file.")
    
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="The uploaded file exceeds the 10MB limit.")

    try:
        raw_email_str = contents.decode("utf-8", errors="replace")
        return run_email_analysis(raw_email_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to process uploaded email file: {str(e)}")
