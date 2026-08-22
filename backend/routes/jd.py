from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from models.schemas import JDCreate, JDResponse
from db.database import save_jd, get_all_jds, get_jd_by_id
from services.pdf_parser import extract_text_from_pdf

router = APIRouter(prefix="/api/jd", tags=["Job Description"])

@router.post("/create", response_model=dict)
def create_jd_typed(data: JDCreate):
    if not data.title.strip() or not data.description.strip():
        raise HTTPException(status_code=400, detail="Title and description are required")
    jd_id = save_jd(title=data.title, description=data.description, input_type="typed")
    return {"jd_id": jd_id, "message": "JD created successfully"}

@router.post("/upload", response_model=dict)
async def create_jd_pdf(title: str = Form(...), file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for JD upload")
    
    bytes_content = await file.read()
    extracted_text = extract_text_from_pdf(bytes_content)
    if not extracted_text:
        extracted_text = f"Job Description uploaded from {file.filename}"
        
    jd_id = save_jd(title=title, description=extracted_text, input_type="pdf")
    return {"jd_id": jd_id, "message": "JD created from PDF successfully"}

@router.get("/all")
def list_jds():
    return get_all_jds()

@router.get("/{jd_id}")
def get_jd(jd_id: str):
    jd = get_jd_by_id(jd_id)
    if not jd:
        raise HTTPException(status_code=404, detail="Job description not found")
    return jd
