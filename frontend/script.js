// Backend API URL
const API_URL = 'http://localhost:8000/chat';

// Enhanced knowledge base (2026 focused)
const knowledgeBase = [
    { keywords: ["loyola college","name","college name","about college","general","tell me about loyola"], answer: "Loyola College, est. 1925 (Jesuit), Chennai. NAAC A++, NIRF #5, 8700+ students, 410 faculty, 54+ programs. Centenary year 2025-26." },
    { keywords: ["founded","established","history","old","when start","year"], answer: "Loyola College was founded in 1925 by the Society of Jesus (Jesuits). Celebrating its centenary 2025-26." },
    { keywords: ["location","where","address","city","situated"], answer: "Sterling Road, Nungambakkam, Chennai - 600034. Near Nungambakkam railway station (5 min walk)." },
    { keywords: ["admission","apply","application","join","process","how to"], answer: "Admissions 2026-27: online portal opens Jan 2026. Merit-based (12th marks) for UG, entrance for select PG. Last date UG: 30 May 2026. Apply at admissions.loyolacollege.edu" },
    { keywords: ["fee","fees","cost","tuition","how much"], answer: "2026-27 fees: Shift1 (Aided) UG: ₹84K-1.35L; Shift2 self-financing UG: ₹1.9L-5.5L; PG Arts: ₹45K-1.3L; PG Science: ₹85K-2.8L. Scholarships available." },
    { keywords: ["courses","programs","majors","degrees","ug","pg","offerings"], answer: "34 UG, 20 PG for 2026. New: B.Sc AI & Data Science, M.Sc Cybersecurity. Popular: B.Com, BBA, B.Sc CS, BA Economics, M.Sc Data Science, M.Com." },
    { keywords: ["placement","jobs","recruiters","salary","career"], answer: "Placement 2026: 92% placed. Top recruiters: Deloitte, EY, TCS, Zoho, Google. Highest package ₹18 LPA, average ₹5.2 LPA." },
    { keywords: ["scholarship","scholarships","financial aid","jesuit"], answer: "LSSS, government scholarships, Centenary Merit Scholarships (₹50,000), sports quota, Jesuit Education Support. Apply by May 2026." },
    { keywords: ["ranking","nirf","naac","accreditation"], answer: "NAAC A++ (re-accredited 2026), NIRF #5 among colleges in India 2026." },
    { keywords: ["hostel","accommodation","stay","room"], answer: "Separate hostels for boys & girls, capacity 800+, well-furnished, mess, recreation. Apply by June 2026." },
    { keywords: ["events","fest","cultural","eminence"], answer: "NIAC 2026 (Apr 10-12), Eminence 2026 (Aug), Zenith, Innodhya. Centenary celebrations throughout 2026." },
    { keywords: ["sports","cricket","gym","athletics"], answer: "Floodlit cricket ground, synthetic courts, modern gym. Overall intervarsity champions 2026." },
    { keywords: ["b.com","bcom","commerce"], answer: "B.Com programs: General, CS, Accounting & Finance, FinTech (new). High cutoff, excellent placement." },
    { keywords: ["data science","ai","machine learning"], answer: "New B.Sc AI & Data Science (2026) and M.Sc Data Science with industry collaborations." },
    { keywords: ["alumni","famous","vijay","suriya","raman"], answer: "Notable alumni: C.V. Raman (Nobel), actors Vijay, Suriya, Vikram, Mani Ratnam, R. Ashwin." },
    { keywords: ["library","books","reading"], answer: "Central Library: 1.5 lakh books, digital archive, 24/7 reading hall." }
];

async function getBotResponse(question) {
    const q = question.toLowerCase();
    
    // Step 1: Check Local Knowledge Base for Keywords
    for (let item of knowledgeBase) {
        for (let kw of item.keywords) {
            if (q.includes(kw.toLowerCase())) {
                return item.answer;
            }
        }
    }
    
    // Step 2: Fallback to RAG Backend
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data && data.answer) {
            return data.answer;
        } else {
            return "Sorry, I received an unexpected response format.";
        }
    } catch (error) {
        console.error('Error fetching response:', error);
        return "I'm your Loyola 2026 assistant. Please connect the backend server to enable advanced features or contact the admissions office for specific queries.";
    }
}
