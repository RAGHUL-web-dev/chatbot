import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFacePipeline
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.question_answering import load_qa_chain
from transformers import pipeline
import warnings

# Suppress HuggingFace/transformers warnings for cleaner console output
os.environ["TOKENIZERS_PARALLELISM"] = "false"
warnings.filterwarnings("ignore")

class RAGPipeline:
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.vector_store = None
        
        # Initialize embeddings using Hugging Face (local model)
        print("Initializing HuggingFace embeddings...")
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # Initialize the local LLM using Hugging Face Pipeline
        print("Initializing Local LLM (this may take a moment to download the first time)...")
        # We use a very small, fast model suitable for CPU execution
        # TinyLlama or similar small models are ideal for lightweight local setups
        # We'll use google/flan-t5-small as it is explicitly fine-tuned for instruction/QA and is very fast
        pipe = pipeline(
            "text2text-generation",
            model="google/flan-t5-small",
            max_length=256,
            truncation=True
        )
        self.llm = HuggingFacePipeline(pipeline=pipe)
        
        self.setup()

    def setup(self):
        """Loads PDF, splits it, creates embeddings, and builds the vector store."""
        if not os.path.exists(self.pdf_path):
            print(f"Warning: PDF file not found at {self.pdf_path}.")
            print("Please run `generate_sample_pdf.py` first to create the sample PDF.")
            return

        print(f"Loading document from {self.pdf_path}...")
        try:
            loader = PyPDFLoader(self.pdf_path)
            documents = loader.load()

            print("Splitting text into chunks...")
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,  # Smaller chunks work better with small LLMs
                chunk_overlap=50,
                length_function=len
            )
            chunks = text_splitter.split_documents(documents)

            print(f"Creating vector store for {len(chunks)} chunks...")
            self.vector_store = FAISS.from_documents(chunks, self.embeddings)
            print("====================================")
            print("RAG Pipeline successfully initialized.")
            print("====================================")
        except Exception as e:
            print(f"Error during RAG setup: {e}")

    def get_answer(self, question):
        """Perform semantic search and query the local LLM."""
        if not self.vector_store:
            return "Knowledge base not initialized. Ensure the college PDF is available in the data directory and the backend is restarted."

        print(f"Querying vector store for: {question}")
        docs = self.vector_store.similarity_search(question, k=2) # Keep k small for smaller LLMs
        
        if not docs:
            return "I couldn't find any relevant information regarding your query."

        print("Generating response via Local LLM...")
        
        chain = load_qa_chain(self.llm, chain_type="stuff")
        
        try:
            response = chain.run(input_documents=docs, question=question)
            return response.strip()
        except Exception as e:
            error_msg = str(e)
            print(f"Error calling LLM: {error_msg}")
            return "I'm having trouble generating an answer right now."
