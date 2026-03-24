import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from agent import PolicyAgent

app = FastAPI(title="PolicyPilot API", version="1.0.0")

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend running successfully"}

@app.get("/test")
def test():
    return {"status": "ok"}

class CitizenProfile(BaseModel):
    profileText: str
    state: str
    category: str
    income: str
    files: dict

agent = PolicyAgent(documents_path='./mock_pdfs')

@app.post("/api/analyze")
async def analyze_profile(profile: CitizenProfile):
    """
    Takes citizen profile and returns matched schemes with RAG citations
    and explicit conflict flagging.
    """
    # Simulate processing delay
    import time
    time.sleep(1.5)
    
    # Process through our mocked RAG agent
    results = agent.process_query(
        profile_text=profile.profileText,
        state=profile.state,
        income=profile.income
    )
    
    return results

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
