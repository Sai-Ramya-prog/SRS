import uuid
import asyncio
from typing import List
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
from models.schemas import ResumeUploadResponse, ResumeStatusResponse, CandidateItemStatus
from db.database import save_candidate, get_candidates_by_jd, get_candidate, get_jd_by_id
from services.screening_service import process_batch_resumes

router = APIRouter(prefix="/api/resume", tags=["Resume Management"])

@router.post("/upload")
async def upload_resumes(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    jd_id: str = Form(...)
):
    jd = get_jd_by_id(jd_id)
    if not jd:
        raise HTTPException(status_code=404, detail="Target Job Description not found")
        
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
        
    candidates_list = []
    file_items = []
    
    for file in files:
        c_id = str(uuid.uuid4())
        save_candidate(c_id, file.filename, jd_id=jd_id, status="uploading")
        candidates_list.append({
            "candidate_id": c_id,
            "file_name": file.filename,
            "status": "uploading"
        })
        
        content = await file.read()
        file_items.append({
            "candidate_id": c_id,
            "file_name": file.filename,
            "file_bytes": content
        })
        
    background_tasks.add_task(process_batch_resumes, file_items, jd_id)
    
    return {
        "message": "Processing started",
        "total": len(candidates_list),
        "jd_id": jd_id,
        "candidates": candidates_list
    }

@router.get("/status/{jd_id}")
def get_resume_status(jd_id: str):
    candidates = get_candidates_by_jd(jd_id)
    total = len(candidates)
    done = sum(1 for c in candidates if c["status"] == "done")
    failed = sum(1 for c in candidates if c["status"] == "failed")
    
    return {
        "total": total,
        "done": done,
        "failed": failed,
        "candidates": candidates
    }

@router.get("/{candidate_id}")
def get_candidate_details(candidate_id: str):
    cand = get_candidate(candidate_id)
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return cand
