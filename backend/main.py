import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import init_db
from routes import jd, resume, screening

app = FastAPI(
    title="Smart Resume Screener API",
    description="AI-powered candidate ranking and resume screening system using Gemini AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jd.router)
app.include_router(resume.router)
app.include_router(screening.router)

@app.on_event("startup")
def on_startup():
    print("[Startup] Initializing Database Schema...")
    init_db()
    print("[Startup] Smart Resume Screener Backend Ready!")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Smart Resume Screener Backend",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
