from fpdf import FPDF
import os

def create_pdf():
    pdf = FPDF()
    pdf.add_page()
    
    # Title
    pdf.set_font("Arial", 'B', size=16)
    pdf.cell(200, 10, txt="University Information & Setup Guide", ln=True, align='C')
    
    # Body
    pdf.set_font("Arial", size=12)
    content = """
Welcome to the sample college handbook.

Key Information for Students:
- The campus library is open 24/7 during exam weeks, and from 8 AM to 10 PM on regular days.
- The annual cultural festival "TechnoArt" happens in November every year.
- Transportation: Shuttle services are available every 30 minutes connecting the North and South campuses.
- Dress Code: Business casual on Thursdays, regular casual attire on other weekdays.
- Grading System: A minimum CGPA of 6.0 is required to maintain merit-based scholarships throughout the program length.
- Sports: The sports complex has an olympic-sized swimming pool, indoor badminton courts, and an athletics track.
"""
    pdf.multi_cell(0, 10, content)
    
    # Ensure folder exists
    os.makedirs("backend/data", exist_ok=True)
    
    # Output file
    output_path = "backend/data/college.pdf"
    pdf.output(output_path)
    print(f"Successfully generated a test PDF document at: {output_path}")

if __name__ == "__main__":
    create_pdf()
