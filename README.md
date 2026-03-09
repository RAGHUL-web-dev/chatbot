# College Chatbot

A lightweight full-stack chatbot web application built specifically to answer university/college queries.

## 🌟 Key Features
- **Frontend**: Clean and modern UI built with purely HTML, vanilla JS, and TailwindCSS (via CDN). Includes a dynamic floating widget and chat interface with typing indicators.
- **Backend**: FastAPI
- **Dual Processing Priority Logic**:
  1. Primary: Constant-time FAQ keyword matcher (loads QA pairs from a local `faq.json`).
  2. Secondary (Fallback): RAG Pipeline that performs semantic search over a designated college PDF document utilizing FAISS, LangChain, and OpenAI models.

## 🚀 Setup Instructions

### 1. Installation

Navigate to the project directory and install the required dependencies:
```bash
cd college_chatbot
pip install -r requirements.txt
```

*(Note: Depending on your system, you may need to use `pip3` instead of `pip`).*

### 2. Prepare Data (PDF Document)
The RAG pipeline requires a PDF file to extract context from.
1. Place your college PDF file at: `backend/data/college.pdf`.
2. **Alternatively (for testing)**, you can automatically generate a dummy PDF file using the provided script:
```bash
python generate_sample_pdf.py
```

### 3. Setup Environment Variables
To get answers from the RAG fallback pipeline, you must utilize an LLM via OpenAI:
1. Open the file `backend/.env`
2. Replace `"YOUR_OPENAI_API_KEY_HERE"` with your actual OpenAI Secret Key.

### 4. Run the Backend Server
Navigate into the `backend` folder and start the server using Uvicorn:
```bash
cd backend
uvicorn app:app --reload
```
You should see output indicating that the HuggingFace embeddings have loaded, the PDF chunks have been vectorized, and the server is running on `http://0.0.0.0:8000`.

### 5. Access the Frontend
Since the frontend operates on static HTML, JS, and CSS via CDN, simply open `frontend/index.html` in any modern web browser (e.g., double-click the file or use a Live Server extension in VS Code).

Click the blue chatbot icon floating in the bottom-right corner to open the widget and start chatting!
