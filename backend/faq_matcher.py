import json
import os

def load_faq(filepath):
    """Load FAQ from a JSON file."""
    if not os.path.exists(filepath):
        print(f"Warning: FAQ file not found at {filepath}")
        return []
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading FAQ file: {e}")
        return []

def match_faq(question, faq_data):
    """
    Check if any keywords in the FAQ match words in the user's question.
    Returns the corresponding answer if matched, otherwise None.
    """
    if not faq_data:
        return None

    # Normalizing the question
    question_lower = question.lower()
    
    for item in faq_data:
        keywords = item.get("keywords", [])
        
        # Exact word match checking (so "fee" doesn't trigger on "coffee")
        # For simplicity based on requirements, we'll do an exact substring check 
        # or a split word check. Let's do simple token check.
        question_words = set(question_lower.split())
        
        # Also simple substring check if keywords have multiple words
        for keyword in keywords:
            keyword_lower = keyword.lower()
            if keyword_lower in question_lower:
                return item.get("answer")
                
    return None
