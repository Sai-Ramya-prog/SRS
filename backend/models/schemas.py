from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class JDCreate(BaseModel):
    title: str = Field(..., example="Backend Engineer")
    description: str = Field(..., example="We are looking for a Python developer with FastAPI and SQL experience...")

class JDResponse(BaseModel):
    id: str
    title: str
    description: str
    input_type: str  # 'typed' or 'pdf'
    created_at: str

class CandidateItemStatus(BaseModel):
    candidate_id: str
    file_name: str
    status: str  # uploading, parsing, scoring, done, failed

class ResumeUploadResponse(BaseModel):
    message: str
    total: int
    jd_id: str
    candidates: List[CandidateItemStatus]

class ResumeStatusResponse(BaseModel):
    total: int
    done: int
    failed: int
    candidates: List[CandidateItemStatus]

class ScreeningResultItem(BaseModel):
    screening_id: str
    candidate_id: str
    candidate_name: str
    email: Optional[str] = "N/A"
    file_name: Optional[str] = ""
    match_score: int
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    justification: str = ""
    strengths: str = ""
    weaknesses: str = ""
    recommendation: str = "maybe"  # shortlist, reject, maybe
    status: str = "pending"       # pending, shortlisted, rejected
    skills: List[str] = []
    experience: Any = []
    education: Any = {}
    created_at: str

class ScreeningResultsResponse(BaseModel):
    jd_id: str
    jd_title: str
    total_screened: int
    results: List[ScreeningResultItem]

class StatusUpdate(BaseModel):
    status: str = Field(..., example="shortlisted")  # shortlisted, rejected, pending
