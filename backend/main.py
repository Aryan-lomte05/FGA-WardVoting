from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import random
from collections import Counter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity in demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Store (In-memory for demo) ---
# Parties and Candidates
PARTIES = ["Party A", "Party B", "Party C", "Party D", "Party E"]
CANDIDATES = []
CANDIDATE_PARTY_MAP = {}

# Initialize Candidates
for party in PARTIES:
    for i in range(1, 5):
        c_name = f"{party} - Candidate {i}"
        CANDIDATES.append(c_name)
        CANDIDATE_PARTY_MAP[c_name] = party
        
OPTIONS = CANDIDATES + ["NOTA"]

# Store votes: List of chosen candidates
VOTES = []

class VoteRequest(BaseModel):
    candidate: str

@app.get("/")
def read_root():
    return {"message": "EVM Backend is running"}

@app.get("/config")
def get_config():
    """Return the ballot configuration."""
    return {
        "parties": PARTIES,
        "candidates": CANDIDATES,
        "options": OPTIONS,
        "candidate_party_map": CANDIDATE_PARTY_MAP
    }

@app.post("/vote")
def cast_vote(vote: VoteRequest):
    if vote.candidate not in OPTIONS:
        raise HTTPException(status_code=400, detail="Invalid candidate")
    
    VOTES.append(vote.candidate)
    return {"message": "Vote cast successfully", "total_votes": len(VOTES)}

@app.post("/simulate/{count}")
def simulate_votes(count: int):
    """Simulate 'count' random votes."""
    added = []
    for _ in range(count):
        choice = random.choice(OPTIONS)
        VOTES.append(choice)
        added.append(choice)
    return {"message": f"Simulated {count} votes", "total_votes": len(VOTES)}

@app.get("/results")
def get_results():
    if not VOTES:
        return {"results": {}, "winner": None, "total": 0}
        
    counts = Counter(VOTES)
    
    # Calculate winner
    winner_name, winner_count = counts.most_common(1)[0]
    
    return {
        "results": counts,
        "total": len(VOTES),
        "winner": {
            "name": winner_name,
            "votes": winner_count
        }
    }

@app.post("/reset")
def reset_votes():
    global VOTES
    VOTES = []
    return {"message": "Votes reset"}
