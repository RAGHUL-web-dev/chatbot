import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from faq_matcher import load_faq, match_faq
from rag_pipeline import RAGPipeline

# Load environment variables
load_dotenv()

app = FastAPI(title="College Chatbot API")

# Setup CORS to allow the HTML frontend to communicate across local ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

# Resolve file paths explicitly
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

FAQ_PATH = os.path.join(BASE_DIR, "data", "faq.json")
PDF_PATH = os.path.join(PROJECT_ROOT, "Loyola College Rag.pdf")

# Preload data and initialize the RAG pipeline when server starts
faq_data = load_faq(FAQ_PATH)
rag_pipeline = RAGPipeline(PDF_PATH)

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    question = request.question.strip()
    
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
        
    print(f"\n[Incoming Request] Question: '{question}'")
    
    # Step 1: FAQ Keyword Matcher
    print("[Step 1] Checking FAQ JSON for keyword matches...")
    faq_answer = match_faq(question, faq_data)
    
    if faq_answer:
        print("-> Match found in FAQ!")
        return {"answer": faq_answer}
        
    # Step 2: RAG Pipeline Fallback
    print("[Step 2] No FAQ match found. Falling back to RAG pipeline via PDF...")
    rag_answer = rag_pipeline.get_answer(question)
    
    return {"answer": rag_answer}

@app.get("/")
def health_check():
    return {"status": "College Chatbot API is running properly"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
