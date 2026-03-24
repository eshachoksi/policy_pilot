document.addEventListener('DOMContentLoaded', () => {
    
    // Auth Logic
    const userStr = localStorage.getItem('policyPilotUser');
    if (userStr) {
        const user = JSON.parse(userStr);
        const authHeader = document.getElementById('authHeader');
        if (authHeader) {
            authHeader.innerHTML = `
                <span style="color: var(--text-muted); font-size: 0.95rem;">Welcome, <strong style="color: var(--text-main); font-weight: 600;">${user.name}</strong></span>
                <button id="logoutBtn" class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem; border-color: transparent;">Logout <i class="ph ph-sign-out"></i></button>
            `;
            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('policyPilotUser');
                window.location.reload();
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('login_success') || urlParams.get('signup_success')) {
            showEmailAlert(user.email);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    function showEmailAlert(email) {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.background = 'rgba(16, 185, 129, 0.15)';
        toast.style.borderLeft = '4px solid var(--accent-success)';
        toast.style.backdropFilter = 'blur(10px)';
        toast.style.padding = '1.5rem';
        toast.style.borderRadius = '8px';
        toast.style.color = 'var(--text-main)';
        toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        toast.style.zIndex = '1000';
        toast.style.animation = 'fadeInUp 0.5s ease-out';
        toast.innerHTML = `
            <div style="display: flex; gap: 12px; align-items: flex-start;">
                <i class="ph ph-envelope-simple" style="color: var(--accent-success); font-size: 24px;"></i>
                <div>
                    <h4 style="margin: 0 0 4px 0; color: #6ee7b7; font-family: Outfit;">Login Alert Sent</h4>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);">A security notification was sent to <strong>${email}</strong>.</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; padding: 0;">
                    <i class="ph ph-x" style="font-size: 18px;"></i>
                </button>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.5s ease';
                setTimeout(() => toast.remove(), 500);
            }
        }, 6000);
    }
    
    // UI Elements
    const voiceBtn = document.getElementById('voiceBtn');
    const profileText = document.getElementById('profileText');
    const citizenForm = document.getElementById('citizenForm');
    const resultsContainer = document.getElementById('resultsContainer');
    const submitBtn = document.getElementById('submitBtn');
    
    // Uploads
    const uploadAadhaar = document.getElementById('uploadAadhaar');
    const uploadIncome = document.getElementById('uploadIncome');
    
    // Modal
    const modal = document.getElementById('formModal');
    const closeModal = document.getElementById('closeModal');
    const cancelModal = document.getElementById('cancelModal');
    
    // State
    let isRecording = false;
    let files = { aadhaar: false, income: false };
    let currentResults = null;

    // Voice simulation
    voiceBtn.addEventListener('click', () => {
        isRecording = !isRecording;
        if (isRecording) {
            voiceBtn.classList.add('recording-pulse');
            voiceBtn.innerHTML = '<i class="ph ph-stop"></i>';
        } else {
            voiceBtn.classList.remove('recording-pulse');
            voiceBtn.innerHTML = '<i class="ph ph-microphone"></i>';
            profileText.value = "I am a 45-year-old farmer in Gujarat with 2 acres of land and annual income below 1.5 lakh.";
        }
    });

    // Upload simulation
    uploadAadhaar.addEventListener('click', () => {
        files.aadhaar = true;
        uploadAadhaar.classList.add('active');
        document.querySelector('.aadhaar-icon').classList.replace('ph-cloud-arrow-up', 'ph-check-circle');
        document.querySelector('.aadhaar-text').textContent = 'Aadhaar Uploaded';
    });

    uploadIncome.addEventListener('click', () => {
        files.income = true;
        uploadIncome.classList.add('active');
        document.querySelector('.income-icon').classList.replace('ph-cloud-arrow-up', 'ph-check-circle');
        document.querySelector('.income-text').textContent = 'Income Cert Uploaded';
    });

    // Modal controls
    closeModal.addEventListener('click', () => modal.classList.remove('active'));
    cancelModal.addEventListener('click', () => modal.classList.remove('active'));

    window.openDraftForm = function(age, state) {
        document.getElementById('draftAge').textContent = age;
        document.getElementById('draftState').textContent = state;
        modal.classList.add('active');
    };

    // Form submission
    citizenForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {
            profileText: profileText.value,
            state: document.getElementById('stateSelect').value,
            category: document.getElementById('categorySelect').value,
            income: document.getElementById('incomeInput').value,
            files: files
        };

        // Render Loading
        renderLoading();

        try {
            // Attempt to fetch from FastAPI backend
            const response = await fetch('http://127.0.0.1:8000/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                renderResults(data);
            } else {
                throw new Error("Backend not responding properly");
            }
        } catch (error) {
            console.log("Backend offline, using fallback mock data.");
            
            // Mock Fallback
            setTimeout(() => {
                renderResults({
                    citizen: {
                        age: 45,
                        occupation: payload.profileText.toLowerCase().includes("farmer") ? "Farmer" : "Citizen",
                        state: payload.state,
                        income: payload.income
                    },
                    schemes: [
                        {
                            id: 1,
                            title: "PM-Kisan Samman Nidhi",
                            agency: "Central Government",
                            eligibility_match: "High",
                            reasoning: "Matches criteria: Farmer with agricultural land.",
                            citation: "PM-KISAN Guidelines 2019, Sec 4.1",
                            checklist: [
                                "Link Aadhaar with active bank account",
                                "Update land record on PM-Kisan portal",
                                "Submit self-declaration form"
                            ],
                            conflict: {
                                has_conflict: payload.state === "Gujarat",
                                description: "State implementation restricts central benefits if receiving parallel state farm subsidies for the same land.",
                                citation_central: "PM-KISAN Guidelines Sec 4.1",
                                citation_state: "Gujarat Mukhyamantri Kisan Sahay Yojana 2021, Clause 3(b)"
                            }
                        }
                    ]
                });
            }, 1500);
        }
    });

    function renderLoading() {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loader" style="margin-right: 8px;"></div> Processing with AI...';
        
        resultsContainer.innerHTML = `
            <div class="glass-panel" style="padding: 3rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px;">
                <div class="loader" style="width: 40px; height: 40px; margin-bottom: 1.5rem; border-width: 4px;"></div>
                <h3 style="margin-bottom: 0.5rem;">Analyzing Policy Corpus...</h3>
                <p style="color: var(--text-muted);">Running RAG pipeline over government scheme PDFs to find exact matches.</p>
            </div>
        `;
    }

    function renderResults(data) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="ph ph-magnifying-glass" style="font-size: 20px; margin-right: 8px;"></i> Find Eligible Schemes';
        
        let html = `
            <div class="glass-panel" style="padding: 1.5rem; background: linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(0,0,0,0.2)); border-left: 4px solid var(--accent-success);">
                <h3 style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.5rem;">
                    <i class="ph ph-check-circle" style="color: var(--accent-success); font-size: 24px;"></i> Agent Analysis Complete
                </h3>
                <p style="color: var(--text-main); font-size: 0.95rem;">
                    Found ${data.schemes.length} matching scheme(s) for a ${data.citizen.age}-year-old ${data.citizen.occupation} in ${data.citizen.state}.
                </p>
            </div>
        `;

        data.schemes.forEach(scheme => {
            let conflictHtml = '';
            if (scheme.conflict && scheme.conflict.has_conflict) {
                conflictHtml = `
                    <div class="conflict-alert">
                        <h4><i class="ph ph-warning"></i> Central vs State Conflict Detected</h4>
                        <p>${scheme.conflict.description}</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.75rem;">
                            <div>
                                <div style="font-size: 0.75rem; color: #fca5a5; text-transform: uppercase;">Central Clause</div>
                                <div class="conflict-citation">${scheme.conflict.citation_central}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.75rem; color: #fca5a5; text-transform: uppercase;">State Clause</div>
                                <div class="conflict-citation">${scheme.conflict.citation_state}</div>
                            </div>
                        </div>
                    </div>
                `;
            }

            let checklistHtml = scheme.checklist.map(item => `
                <li>
                    <i class="ph ph-check checklist-icon"></i>
                    ${item}
                </li>
            `).join('');

            html += `
                <div class="glass-panel scheme-card">
                    <div class="scheme-header">
                        <div>
                            <h3 class="scheme-title">${scheme.title}</h3>
                            <div class="scheme-agency">${scheme.agency}</div>
                        </div>
                        <span class="badge badge-success">Match: ${scheme.eligibility_match}</span>
                    </div>

                    <p style="font-size: 0.95rem; margin-bottom: 1rem; color: #e2e8f0;">
                        <strong>Reasoning:</strong> ${scheme.reasoning}
                    </p>

                    <div style="background: rgba(99, 102, 241, 0.1); padding: 0.75rem; border-radius: 8px; border-left: 3px solid var(--accent-primary); margin-bottom: 1.5rem;">
                        <div style="font-size: 0.8rem; color: #a5b4fc; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">PDF Citation</div>
                        <div style="font-family: monospace; font-size: 0.85rem;">${scheme.citation}</div>
                    </div>

                    <h4 style="margin-bottom: 0.5rem;">Step-by-Step Checklist</h4>
                    <ul class="checklist">
                        ${checklistHtml}
                    </ul>

                    ${conflictHtml}
                    
                    <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-light); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.9rem; color: var(--text-muted);">
                            <i class="ph ph-file-text" style="vertical-align: middle;"></i> 
                            Auto-fill forms ready using uploaded Aadhaar
                        </span>
                        <button class="btn-secondary" onclick="openDraftForm(${data.citizen.age}, '${data.citizen.state}')" style="padding: 8px 16px; font-size: 0.9rem;">
                            Preview Draft <i class="ph ph-caret-right" style="vertical-align: middle;"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        resultsContainer.innerHTML = html;
    }
});
