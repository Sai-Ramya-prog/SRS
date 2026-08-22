from fastapi import APIRouter, HTTPException
from models.schemas import StatusUpdate
from db.database import (
    get_jd_by_id,
    get_screening_results_by_jd,
    update_screening_status,
    get_shortlisted_screenings_by_jd
)

router = APIRouter(prefix="/api/screening", tags=["Screening & Results"])

@router.get("/results/{jd_id}")
def get_screening_results(jd_id: str):
    jd = get_jd_by_id(jd_id)
    if not jd:
        raise HTTPException(status_code=404, detail="Job Description not found")
        
    results = get_screening_results_by_jd(jd_id)
    return {
        "jd_id": jd_id,
        "jd_title": jd["title"],
        "total_screened": len(results),
        "results": results
    }

@router.patch("/{screening_id}/status")
def update_candidate_screening_status(screening_id: str, payload: StatusUpdate):
    valid_statuses = ["pending", "shortlisted", "rejected"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")
        
    update_screening_status(screening_id, payload.status)
    return {"message": "Status updated successfully", "screening_id": screening_id, "status": payload.status}

@router.get("/shortlisted/{jd_id}")
def get_shortlisted_candidates(jd_id: str):
    jd = get_jd_by_id(jd_id)
    if not jd:
        raise HTTPException(status_code=404, detail="Job Description not found")
        
    results = get_shortlisted_screenings_by_jd(jd_id)
    return {
        "jd_id": jd_id,
        "jd_title": jd["title"],
        "total_shortlisted": len(results),
        "results": results
    }
