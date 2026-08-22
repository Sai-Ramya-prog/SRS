import asyncio
import traceback
from services.pdf_parser import extract_text_from_pdf
from services.gemini_service import parse_resume_with_gemini, match_jd_with_gemini
from db.database import (
    get_jd_by_id,
    update_candidate_parsed,
    update_candidate_status,
    save_screening,
    get_candidate
)

def process_single_resume(candidate_id: str, file_name: str, file_bytes: bytes, jd_id: str):
    """Process a single candidate resume synchronously in background worker thread."""
    try:
        update_candidate_status(candidate_id, "parsing")
        
        raw_text = extract_text_from_pdf(file_bytes)
        if not raw_text:
            raw_text = f"Resume filename: {file_name}. Standard candidate profile."
            
        parsed_data = parse_resume_with_gemini(raw_text, filename=file_name)
        
        name = parsed_data.get("name") or file_name.replace(".pdf", "").replace("_", " ").title()
        email = parsed_data.get("email") or f"{name.lower().replace(' ', '.')}@example.com"
        skills = parsed_data.get("skills") or []
        experience = parsed_data.get("experience") or []
        education = parsed_data.get("education") or {}
        
        update_candidate_parsed(
            candidate_id=candidate_id,
            name=name,
            email=email,
            skills=skills,
            experience=experience,
            education=education,
            raw_text=raw_text,
            status="scoring"
        )
        
        jd = get_jd_by_id(jd_id)
        if not jd:
            update_candidate_status(candidate_id, "failed")
            return
            
        candidate_dict = get_candidate(candidate_id)
        match_result = match_jd_with_gemini(jd["description"], candidate_dict)
        
        match_score = match_result.get("match_score", 7)
        matched_skills = match_result.get("matched_skills", [])
        missing_skills = match_result.get("missing_skills", [])
        justification = match_result.get("justification", "")
        strengths = match_result.get("strengths", "")
        weaknesses = match_result.get("weaknesses", "")
        recommendation = match_result.get("recommendation", "maybe")
        
        save_screening(
            candidate_id=candidate_id,
            jd_id=jd_id,
            match_score=match_score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            justification=justification,
            strengths=strengths,
            weaknesses=weaknesses,
            recommendation=recommendation,
            status="pending"
        )
        
        update_candidate_status(candidate_id, "done")
        print(f"[Screening Success] Processed candidate {name} ({file_name}) - Score: {match_score}/10")

    except Exception as e:
        print(f"[Screening Error for {file_name}] {e}")
        traceback.print_exc()
        update_candidate_status(candidate_id, "failed")

async def process_batch_resumes(file_items: list, jd_id: str):
    """Process a batch of uploaded resumes sequentially offloaded to worker threads so FastAPI event loop stays 100% free."""
    for item in file_items:
        c_id = item["candidate_id"]
        f_name = item["file_name"]
        f_bytes = item["file_bytes"]
        
        # Offload blocking PDF/Gemini/DB work to threadpool
        await asyncio.to_thread(process_single_resume, c_id, f_name, f_bytes, jd_id)
        await asyncio.sleep(4) # 4s pacing buffer between candidate resumes for API rate limits
