import os
import json
import uuid
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path)
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("[DB Error] DATABASE_URL is not configured in environment variables. Supabase database connection failed.")

# Ensure proper driver format for PostgreSQL
db_url = DATABASE_URL
if db_url.startswith("postgresql://") and not db_url.startswith("postgresql+psycopg2://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

try:
    engine = create_engine(db_url, pool_pre_ping=True)
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("[DB] Successfully connected to PostgreSQL / Supabase!")
except Exception as e:
    print(f"[DB Error] Could not connect to Supabase PostgreSQL: {e}")
    raise RuntimeError(f"Database Error: Supabase database is not working! ({e})")

def init_db():
    with engine.begin() as conn:
        conn.execute(text("""
        CREATE TABLE IF NOT EXISTS job_descriptions (
            id VARCHAR(64) PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            input_type VARCHAR(20) DEFAULT 'typed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """))
        conn.execute(text("""
        CREATE TABLE IF NOT EXISTS candidates (
            id VARCHAR(64) PRIMARY KEY,
            jd_id VARCHAR(64) REFERENCES job_descriptions(id) ON DELETE CASCADE,
            name TEXT,
            email TEXT,
            skills JSONB,
            experience JSONB,
            education JSONB,
            raw_text TEXT,
            file_name TEXT,
            status VARCHAR(30) DEFAULT 'uploading',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """))
        conn.execute(text("ALTER TABLE candidates ADD COLUMN IF NOT EXISTS jd_id VARCHAR(64);"))
        conn.execute(text("""
        CREATE TABLE IF NOT EXISTS screenings (
            id VARCHAR(64) PRIMARY KEY,
            candidate_id VARCHAR(64) REFERENCES candidates(id) ON DELETE CASCADE,
            jd_id VARCHAR(64) REFERENCES job_descriptions(id) ON DELETE CASCADE,
            match_score INT DEFAULT 0,
            matched_skills JSONB,
            missing_skills JSONB,
            justification TEXT,
            strengths TEXT,
            weaknesses TEXT,
            recommendation VARCHAR(30) DEFAULT 'maybe',
            status VARCHAR(30) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """))
        conn.execute(text("UPDATE candidates SET jd_id = s.jd_id FROM screenings s WHERE candidates.id = s.candidate_id AND candidates.jd_id IS NULL;"))

def save_jd(title: str, description: str, input_type: str = "typed") -> str:
    jd_id = str(uuid.uuid4())
    with engine.begin() as conn:
        conn.execute(
            text("INSERT INTO job_descriptions (id, title, description, input_type) VALUES (:id, :title, :description, :input_type)"),
            {"id": jd_id, "title": title, "description": description, "input_type": input_type}
        )
    return jd_id

def get_all_jds():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, title, description, input_type, created_at FROM job_descriptions ORDER BY created_at DESC"))
        rows = result.fetchall()
        jds = []
        for r in rows:
            created_at_str = str(r[4]) if r[4] else ""
            jds.append({
                "id": str(r[0]),
                "title": r[1],
                "description": r[2],
                "input_type": r[3] or "typed",
                "created_at": created_at_str
            })
        return jds

def get_jd_by_id(jd_id: str):
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, title, description, input_type, created_at FROM job_descriptions WHERE id = :jd_id"), {"jd_id": jd_id})
        row = result.fetchone()
        if not row:
            return None
        return {
            "id": str(row[0]),
            "title": row[1],
            "description": row[2],
            "input_type": row[3] or "typed",
            "created_at": str(row[4]) if row[4] else ""
        }

def save_candidate(candidate_id: str, file_name: str, jd_id: str = "", status: str = "uploading") -> str:
    with engine.begin() as conn:
        conn.execute(
            text("INSERT INTO candidates (id, file_name, jd_id, status) VALUES (:id, :file_name, :jd_id, :status)"),
            {"id": candidate_id, "file_name": file_name, "jd_id": jd_id, "status": status}
        )
    return candidate_id

def update_candidate_parsed(candidate_id: str, name: str, email: str, skills: list, experience: list, education: dict, raw_text: str, status: str = "scoring"):
    skills_json = json.dumps(skills or [])
    exp_json = json.dumps(experience or [])
    edu_json = json.dumps(education or {})
    with engine.begin() as conn:
        conn.execute(
            text("""
            UPDATE candidates 
            SET name = :name, email = :email, skills = CAST(:skills AS jsonb), experience = CAST(:experience AS jsonb), 
                education = CAST(:education AS jsonb), raw_text = :raw_text, status = :status
            WHERE id = :id
            """),
            {"id": candidate_id, "name": name, "email": email, "skills": skills_json, "experience": exp_json, "education": edu_json, "raw_text": raw_text, "status": status}
        )

def update_candidate_status(candidate_id: str, status: str):
    with engine.begin() as conn:
        conn.execute(text("UPDATE candidates SET status = :status WHERE id = :id"), {"id": candidate_id, "status": status})

def get_candidate(candidate_id: str):
    with engine.connect() as conn:
        res = conn.execute(text("SELECT id, name, email, skills, experience, education, raw_text, file_name, status, created_at FROM candidates WHERE id = :id"), {"id": candidate_id})
        r = res.fetchone()
        if not r:
            return None
        skills = json.loads(r[3]) if isinstance(r[3], str) else (r[3] or [])
        exp = json.loads(r[4]) if isinstance(r[4], str) else (r[4] or [])
        edu = json.loads(r[5]) if isinstance(r[5], str) else (r[5] or {})
        return {
            "id": r[0],
            "name": r[1],
            "email": r[2],
            "skills": skills,
            "experience": exp,
            "education": edu,
            "raw_text": r[6],
            "file_name": r[7],
            "status": r[8],
            "created_at": str(r[9]) if r[9] else ""
        }

def save_screening(candidate_id: str, jd_id: str, match_score: int, matched_skills: list, missing_skills: list, justification: str, strengths: str, weaknesses: str, recommendation: str, status: str = "pending") -> str:
    screening_id = str(uuid.uuid4())
    matched_json = json.dumps(matched_skills or [])
    missing_json = json.dumps(missing_skills or [])
    
    with engine.begin() as conn:
        conn.execute(
            text("""
            INSERT INTO screenings (id, candidate_id, jd_id, match_score, matched_skills, missing_skills, justification, strengths, weaknesses, recommendation, status)
            VALUES (:id, :candidate_id, :jd_id, :match_score, CAST(:matched_skills AS jsonb), CAST(:missing_skills AS jsonb), :justification, :strengths, :weaknesses, :recommendation, :status)
            """),
            {
                "id": screening_id, "candidate_id": candidate_id, "jd_id": jd_id,
                "match_score": match_score, "matched_skills": matched_json, "missing_skills": missing_json,
                "justification": justification, "strengths": strengths, "weaknesses": weaknesses,
                "recommendation": recommendation, "status": status
            }
        )
    return screening_id

def get_candidates_by_jd(jd_id: str):
    with engine.connect() as conn:
        query = text("""
        SELECT DISTINCT c.id, c.file_name, c.status, c.created_at
        FROM candidates c
        LEFT JOIN screenings s ON c.id = s.candidate_id
        WHERE c.jd_id = :jd_id OR s.jd_id = :jd_id
        ORDER BY c.created_at DESC
        """)
        res = conn.execute(query, {"jd_id": jd_id})
        rows = res.fetchall()
        candidates = []
        for r in rows:
            candidates.append({
                "candidate_id": r[0],
                "file_name": r[1],
                "status": r[2]
            })
        return candidates

def get_screening_results_by_jd(jd_id: str):
    with engine.connect() as conn:
        query = text("""
        SELECT 
            s.id as screening_id,
            c.id as candidate_id,
            c.name,
            c.email,
            c.file_name,
            s.match_score,
            s.matched_skills,
            s.missing_skills,
            s.justification,
            s.strengths,
            s.weaknesses,
            s.recommendation,
            s.status as hr_status,
            c.skills,
            c.experience,
            c.education,
            s.created_at
        FROM screenings s
        JOIN candidates c ON s.candidate_id = c.id
        WHERE s.jd_id = :jd_id
        ORDER BY s.match_score DESC
        """)
        res = conn.execute(query, {"jd_id": jd_id})
        rows = res.fetchall()
        results = []
        for r in rows:
            matched_skills = json.loads(r[6]) if isinstance(r[6], str) else (r[6] or [])
            missing_skills = json.loads(r[7]) if isinstance(r[7], str) else (r[7] or [])
            skills = json.loads(r[13]) if isinstance(r[13], str) else (r[13] or [])
            exp = json.loads(r[14]) if isinstance(r[14], str) else (r[14] or [])
            edu = json.loads(r[15]) if isinstance(r[15], str) else (r[15] or {})
            results.append({
                "screening_id": str(r[0]),
                "candidate_id": str(r[1]),
                "candidate_name": r[2] or "Unknown Candidate",
                "email": r[3] or "N/A",
                "file_name": r[4] or "",
                "match_score": r[5] or 0,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "justification": r[8] or "",
                "strengths": r[9] or "",
                "weaknesses": r[10] or "",
                "recommendation": r[11] or "maybe",
                "status": r[12] or "pending",
                "skills": skills,
                "experience": exp,
                "education": edu,
                "created_at": str(r[16]) if r[16] else ""
            })
        return results

def update_screening_status(screening_id: str, status: str):
    with engine.begin() as conn:
        conn.execute(text("UPDATE screenings SET status = :status WHERE id = :id"), {"id": screening_id, "status": status})

def get_shortlisted_screenings_by_jd(jd_id: str):
    all_results = get_screening_results_by_jd(jd_id)
    return [r for r in all_results if r["status"] == "shortlisted"]
