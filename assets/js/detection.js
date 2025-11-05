// =====================
// AI Detection Module
// =====================

// Disease information database
const diseaseDatabase = {
    'Acne': {
        description: 'Acne is a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells.',
        severity: 'Low to Medium',
        recommendations: [
            'Cleanse face twice daily with gentle cleanser',
            'Avoid touching or picking at affected areas',
            'Use non-comedogenic skincare products',
            'Consider over-the-counter benzoyl peroxide or salicylic acid treatments',
            'Maintain a healthy diet and stay hydrated',
            'Consult a dermatologist if condition persists or worsens'
        ]
    },
    'Eczema': {
        description: 'Eczema (atopic dermatitis) is a chronic condition causing skin inflammation, redness, and itching.',
        severity: 'Medium',
        recommendations: [
            'Keep skin well-moisturized with fragrance-free lotions',
            'Avoid known triggers (harsh soaps, stress, allergens)',
            'Take lukewarm (not hot) showers',
            'Use mild, unscented detergents for laundry',
            'Apply prescribed topical corticosteroids as directed',
            'Consult with a dermatologist for personalized treatment plan'
        ]
    },
    'Psoriasis': {
        description: 'Psoriasis is an autoimmune condition causing rapid skin cell buildup, resulting in scaling and inflammation.',
        severity: 'Medium to High',
        recommendations: [
            'Keep skin moisturized to reduce scaling',
            'Avoid triggers such as stress, infections, and skin injuries',
            'Consider phototherapy under medical supervision',
            'Use prescribed topical treatments regularly',
            'Maintain a healthy lifestyle with regular exercise',
            'Consult a dermatologist for systemic treatment options'
        ]
    },
    'Melanoma': {
        description: 'Melanoma is a serious form of skin cancer that develops in melanocytes. Early detection is critical.',
        severity: 'HIGH - URGENT',
        recommendations: [
            '⚠️ SEEK IMMEDIATE MEDICAL ATTENTION',
            'Schedule appointment with dermatologist or oncologist urgently',
            'Do not delay - early treatment is crucial',
            'Document any changes in size, shape, or color',
            'Avoid sun exposure until evaluated by specialist',
            'Prepare list of questions for your doctor'
        ]
    },
    'Dermatitis': {
        description: 'Contact dermatitis is skin inflammation caused by contact with irritants or allergens.',
        severity: 'Low to Medium',
        recommendations: [
            'Identify and avoid the triggering substance',
            'Wash affected area with mild soap and water',
            'Apply cold compresses to reduce inflammation',
            'Use over-the-counter hydrocortisone cream',
            'Keep affected area clean and dry',
            'See a doctor if symptoms persist beyond a few days'
        ]
    },
    'Rosacea': {
        description: 'Rosacea is a chronic inflammatory condition causing facial redness and visible blood vessels.',
        severity: 'Medium',
        recommendations: [
            'Avoid triggers (spicy foods, alcohol, extreme temperatures)',
            'Use gentle skincare products formulated for sensitive skin',
            'Apply broad-spectrum sunscreen daily (SPF 30+)',
            'Keep a symptom diary to identify personal triggers',
            'Consider prescription medications from dermatologist',
            'Laser therapy may help with visible blood vessels'
        ]
    }
};

// Simulated disease classes for demonstration
const diseaseClasses = ['Acne', 'Eczema', 'Psoriasis', 'Melanoma', 'Dermatitis', 'Rosacea'];

// Global variables
let uploadedImage = null;
let model = null;

// =====================
// Image Upload Handling
// =====================
const imageUpload = document.getElementById('imageUpload');
const uploadArea = document.getElementById('uploadArea');
const imagePreview = document.getElementById('imagePreview');
const uploadContent = document.getElementById('uploadContent');
const previewImg = document.getElementById('previewImg');

// Drag and drop functionality
if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
        uploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#e2e8f0';
        uploadArea.style.background = 'white';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e2e8f0';
        uploadArea.style.background = 'white';

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });
}

if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });
}

function handleImageUpload(file) {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
    }

    // Read and display image
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImage = e.target.result;
        previewImg.src = uploadedImage;
        uploadContent.style.display = 'none';
        imagePreview.style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

function resetUpload() {
    uploadedImage = null;
    imageUpload.value = '';
    uploadContent.style.display = 'block';
    imagePreview.style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
}

// =====================
// AI Analysis Function
// =====================
async function analyzeImage() {
    if (!uploadedImage) {
        showNotification('Please upload an image first', 'error');
        return;
    }

    // Show results section with loading
    const resultsSection = document.getElementById('resultsSection');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsContent = document.getElementById('resultsContent');

    resultsSection.style.display = 'block';
    loadingSpinner.style.display = 'block';
    resultsContent.style.display = 'none';

    // Simulate AI processing (replace with actual TensorFlow.js model)
    setTimeout(() => {
        const predictions = simulateAIPrediction();
        displayResults(predictions);

        loadingSpinner.style.display = 'none';
        resultsContent.style.display = 'block';
    }, 3000);
}

// Simulate AI prediction (replace with actual model inference)
function simulateAIPrediction() {
    // Generate random predictions for demonstration
    const predictions = diseaseClasses.map(disease => ({
        className: disease,
        probability: Math.random()
    }));

    // Normalize probabilities to sum to 1
    const total = predictions.reduce((sum, pred) => sum + pred.probability, 0);
    predictions.forEach(pred => pred.probability /= total);

    // Sort by probability (highest first)
    predictions.sort((a, b) => b.probability - a.probability);

    return predictions;
}

// =====================
// Display Results
// =====================
function displayResults(predictions) {
    const topPrediction = predictions[0];
    const diseaseInfo = diseaseDatabase[topPrediction.className];

    // Update diagnosis name
    document.getElementById('diagnosisName').textContent = topPrediction.className;

    // Update confidence
    const confidence = (topPrediction.probability * 100).toFixed(1);
    document.getElementById('confidencePercent').textContent = confidence + '%';
    document.getElementById('confidenceFill').style.width = confidence + '%';

    // Display probability table
    const probabilityList = document.getElementById('probabilityList');
    probabilityList.innerHTML = '';

    predictions.forEach(pred => {
        const probability = (pred.probability * 100).toFixed(1);
        const riskLevel = getRiskLevel(pred.probability);

        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <span>${pred.className}</span>
            <span>${probability}%</span>
            <span class="risk-badge risk-${riskLevel}">${riskLevel.toUpperCase()}</span>
        `;
        probabilityList.appendChild(row);
    });

    // Display recommendations
    const recommendationContent = document.getElementById('recommendationContent');
    recommendationContent.innerHTML = `
        <p><strong>${diseaseInfo.description}</strong></p>
        <p><strong>Severity Level:</strong> ${diseaseInfo.severity}</p>
        <h4>Recommended Actions:</h4>
        <ul>
            ${diseaseInfo.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    `;

    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function getRiskLevel(probability) {
    if (probability > 0.5) return 'high';
    if (probability > 0.2) return 'medium';
    return 'low';
}

// =====================
// Download Report
// =====================
function downloadReport() {
    const diagnosisName = document.getElementById('diagnosisName').textContent;
    const confidence = document.getElementById('confidencePercent').textContent;

    const report = `
DermAI - Skin Disease Detection Report
Generated: ${new Date().toLocaleString()}

DIAGNOSIS
---------
Condition: ${diagnosisName}
Confidence: ${confidence}

ANALYSIS
--------
${diseaseDatabase[diagnosisName].description}

Severity Level: ${diseaseDatabase[diagnosisName].severity}

RECOMMENDATIONS
---------------
${diseaseDatabase[diagnosisName].recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('
')}

DISCLAIMER
----------
This AI analysis is for informational purposes only and should not replace
professional medical advice. Please consult a dermatologist for proper
diagnosis and treatment.

---
DermAI © 2025
    `;

    // Create and download file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DermAI_Report_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('Report downloaded successfully!', 'success');
}

// =====================
// TensorFlow.js Model Loading (Optional)
// =====================
/* Uncomment and configure when you have a trained model

async function loadModel() {
    try {
        // Load your pre-trained model
        model = await tf.loadLayersModel('path/to/your/model.json');
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
    }
}

async function runRealPrediction(imageElement) {
    if (!model) {
        console.error('Model not loaded');
        return simulateAIPrediction();
    }

    // Preprocess image
    const tensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255.0))
        .expandDims();

    // Run prediction
    const predictions = await model.predict(tensor).data();

    // Format predictions
    return diseaseClasses.map((className, index) => ({
        className,
        probability: predictions[index]
    })).sort((a, b) => b.probability - a.probability);
}

// Initialize model on page load
window.addEventListener('load', loadModel);
