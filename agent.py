import re

class PolicyAgent:
    def __init__(self, documents_path):
        self.documents_path = documents_path
        # In a real system, this would initialize an embedding model and load PDFs into ChromaDB/Pinecone.

    def extract_entities(self, text):
        # Extremely basic entity extraction for prototyping
        age_match = re.search(r'(\d+)-year-old', text)
        age = int(age_match.group(1)) if age_match else 30
        
        occupation = "Citizen"
        if "farmer" in text.lower():
            occupation = "Farmer"
            
        land_match = re.search(r'(\d+)\s*acres?', text.lower())
        land_acres = int(land_match.group(1)) if land_match else 0
        
        return {
            "age": age,
            "occupation": occupation,
            "land_acres": land_acres
        }

    def process_query(self, profile_text, state, income):
        """Mocked Agent Logic connecting to mock RAG documents"""
        
        entities = self.extract_entities(profile_text)
        
        # Base Agent Response
        response = {
            "citizen": {
                "age": entities["age"],
                "occupation": entities["occupation"],
                "state": state,
                "income": income
            },
            "schemes": []
        }
        
        # 1. PM-Kisan matching logic & Conflict Flagging
        if entities["occupation"].lower() == "farmer":
            conflict_detected = state == "Gujarat"
            
            scheme_1 = {
                "id": 1,
                "title": "PM-Kisan Samman Nidhi",
                "agency": "Central Government",
                "eligibility_match": "High" if int(income) < 200000 else "Medium",
                "reasoning": "Matches criteria: Farmer with agricultural land and income below threshold.",
                "citation": "PM-KISAN Guidelines 2019, Sec 4.1: 'All landholding farmers' families are eligible...'",
                "checklist": [
                  "Link Aadhaar with active bank account",
                  "Update land record on PM-Kisan portal",
                  "Submit self-declaration form"
                ],
                "conflict": { "has_conflict": False }
            }
            
            if conflict_detected:
                scheme_1["conflict"] = {
                    "has_conflict": True,
                    "description": "State implementation in Gujarat restricts central benefits if receiving parallel state farm subsidies for the same land.",
                    "citation_central": "PM-KISAN Guidelines Sec 4.1 (No restriction on state subsidies)",
                    "citation_state": "Gujarat Mukhyamantri Kisan Sahay Yojana 2021, Clause 3(b) (Prohibits dual central+state direct cash transfer for same acreage)"
                }
            
            response["schemes"].append(scheme_1)
            
        # 2. Universal Health Scheme match
        response["schemes"].append({
            "id": 2,
            "title": "Ayushman Bharat PM-JAY",
            "agency": "Central Government",
            "eligibility_match": "Medium",
            "reasoning": f"Income criteria (₹{income}) falls within eligible bounds, awaiting final SECC database verification.",
            "citation": "Ayushman Bharat Guidelines Sec 2.2: 'Families listed in SECC 2011 database under D1-D7 deprivations...'",
            "checklist": [
                "Verify name in SECC database using Aadhaar",
                "Visit nearest CSC for eCard generation",
                "Pay ₹30 processing fee"
            ],
            "conflict": { "has_conflict": False }
        })
        
        return response
