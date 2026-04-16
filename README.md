# PolicyPilot AI Agent

"AI That Navigates Government Schemes So Citizens Don't Have To"

This is a complete proof-of-concept for the Day 2 Problem Statement. It features a stunning glassmorphism React frontend and a Python FastAPI backend that simulates an Agentic RAG pipeline.

## Features Included
1. **Beautiful Frontend**: Built with React and Vanilla CSS (no Tailwind), featuring glassmorphism and dynamic animations. 
2. **Citizen Profile Input**: Supports typing or simulated voice input, demographic fields, and mock document uploads.
3. **Agentic Matchmaking**: The Python backend parses the profile and returns eligible schemes.
4. **Explicit Conflict Resolution**: The system explicitly flags when a state law (Gujarat) contradicts a central law (PM-Kisan Central Guidelines) and cites the exact clauses.
5. **Auto-fill Forms**: Generates a simulated auto-filled draft using Aadhaar data.

## Step-by-Step Instructions to Run the Project

You will need two terminal windows: one for the Frontend, one for the Backend.

### 1. Run the Backend (Python FastAPI)

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the necessary Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   python main.py
   ```
   *The backend will start running on `http://127.0.0.1:8000`.*

### 2. Run the Frontend (React Vite)

1. Open a **new** terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the Node modules (since this is a fresh project structure):
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Look at the terminal output. It will give you a local URL (usually `http://localhost:5173`). Open that link in your browser!

## Demo Walkthrough for the Hackathon.
1. Open the web app. You will see the gorgeous, glassmorphic UI.
2. In the text area, leave the default text or type: `"I am a 45-year-old farmer in Gujarat with 2 acres..."`
3. Click the "Upload Aadhaar" zone to simulate a document upload.
4. Click **Find Eligible Schemes**.
5. The UI will show a pulsing loader as the "Agent" processes the documents.
6. The results will appear:
   - **PM-Kisan** will be matched.
   - A **red conflict alert** will appear explicitly warning that the Gujarat state laws contradict the Central PM-Kisan rules regarding dual subsidies, fulfilling the Hackathon "Twist" requirement perfectly.
   - Click **Preview Draft** to view the auto-filled mock application form populated with citizen data.

## Project Structure
```text
policypilot2/
├── frontend/
│   ├── index.html        # Main HTML
│   ├── package.json      # Node dependencies
│   ├── vite.config.js    # Vite config
│   └── src/
│       ├── App.jsx             # Main Application Logic
│       ├── index.css           # Premium Glassmorphism styling
│       └── components/         # UI Components
│           ├── InputSection.jsx
│           └── ResultsDashboard.jsx
└── backend/
    ├── main.py           # FastAPI Application
    ├── agent.py          # AI Logic & Conflict detection simulator
    ├── requirements.txt  # Python dependencies
    └── mock_pdfs/        # Simulated knowledge base
        ├── pm_kisan_central.txt
        └── pm_kisan_gujarat.txt
```
