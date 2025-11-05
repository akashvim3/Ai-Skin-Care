// =====================
// Image Comparison Tool
// =====================

let comparisonData = {
    image1: null,
    image2: null,
    results1: null,
    results2: null
};

let comparisonChart = null;

// Upload image handlers
function uploadImage(imageNumber) {
    const fileInput = document.getElementById(`fileInput${imageNumber}`);
    fileInput.click();
}

document.getElementById('fileInput1')?.addEventListener('change', (e) => {
    handleImageUpload(e.target.files[0], 1);
});

document.getElementById('fileInput2')?.addEventListener('change', (e) => {
    handleImageUpload(e.target.files[0], 2);
});

async function handleImageUpload(file, imageNumber) {
    if (!file || !file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageData = e.target.result;

        // Store image
        comparisonData[`image${imageNumber}`] = imageData;

        // Display image
        document.getElementById(`uploadZone${imageNumber}`).style.display = 'none';
        document.getElementById(`preview${imageNumber}`).style.display = 'block';
        document.getElementById(`img${imageNumber}`).src = imageData;

        // Analyze image
        await analyzeComparisonImage(imageNumber);

        // Enable compare button if both images are uploaded
        checkCompareReady();
    };
    reader.readAsDataURL(file);
}

function removeImage(imageNumber) {
    comparisonData[`image${imageNumber}`] = null;
    comparisonData[`results${imageNumber}`] = null;

    document.getElementById(`uploadZone${imageNumber}`).style.display = 'flex';
    document.getElementById(`preview${imageNumber}`).style.display = 'none';
    document.getElementById(`results${imageNumber}`).style.display = 'none';
    document.getElementById(`fileInput${imageNumber}`).value = '';

    checkCompareReady();
}

async function analyzeComparisonImage(imageNumber) {
    const img = document.getElementById(`img${imageNumber}`);

    // Show loading state
    const resultsDiv = document.getElementById(`results${imageNumber}`);
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Analyzing...</p></div>';

    // Wait for image to load
    await new Promise(resolve => {
        if (img.complete) resolve();
        else img.onload = resolve;
    });

    // Run prediction
    const predictions = await classifier.predict(img);
    comparisonData[`results${imageNumber}`] = predictions;

    // Display results
    displayComparisonResults(predictions, imageNumber);
}

function displayComparisonResults(predictions, imageNumber) {
    const resultsDiv = document.getElementById(`results${imageNumber}`);
    const topResult = predictions[0];

    resultsDiv.innerHTML = `
        <div class="result-item">
            <span class="result-label">Diagnosis:</span>
            <span class="result-value">${topResult.className}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Confidence:</span>
            <span class="result-value">${(topResult.probability * 100).toFixed(1)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">Status:</span>
            <span class="result-value">Analyzed</span>
        </div>
    `;
}

function checkCompareReady() {
    const compareBtn = document.getElementById('compareBtn');
    if (comparisonData.results1 && comparisonData.results2) {
        compareBtn.disabled = false;
    } else {
        compareBtn.disabled = true;
    }
}

// =====================
// Comparison Analysis
// =====================

async function compareImages() {
    if (!comparisonData.results1 || !comparisonData.results2) {
        showNotification('Please upload and analyze both images first', 'error');
        return;
    }

    const detailedComparison = document.getElementById('detailedComparison');
    detailedComparison.style.display = 'block';

    // Calculate comparison metrics
    const metrics = calculateComparisonMetrics();

    // Display diagnosis change
    displayDiagnosisChange(metrics);

    // Display confidence change
    displayConfidenceChange(metrics);

    // Display similarity score
    displaySimilarityScore(metrics);

    // Create comparison chart
    createComparisonChart();

    // Display progression analysis
    displayProgressionAnalysis(metrics);

    // Scroll to results
    detailedComparison.scrollIntoView({ behavior: 'smooth' });
}

function calculateComparisonMetrics() {
    const result1 = comparisonData.results1[0];
    const result2 = comparisonData.results2[0];

    // Calculate confidence change
    const confidenceChange = ((result2.probability - result1.probability) * 100).toFixed(1);

    // Calculate similarity score
    const similarity = calculateSimilarity(
        comparisonData.results1,
        comparisonData.results2
    );

    // Determine if condition improved, worsened, or stayed same
    let changeStatus = 'neutral';
    if (result1.className !== result2.className) {
        changeStatus = 'changed';
    } else if (Math.abs(confidenceChange) < 5) {
        changeStatus = 'stable';
    } else if (confidenceChange > 0) {
        changeStatus = 'increased';
    } else {
        changeStatus = 'decreased';
    }

    return {
        diagnosis1: result1.className,
        diagnosis2: result2.className,
        confidence1: result1.probability,
        confidence2: result2.probability,
        confidenceChange: parseFloat(confidenceChange),
        similarity: similarity,
        changeStatus: changeStatus
    };
}

function calculateSimilarity(results1, results2) {
    // Calculate cosine similarity between probability vectors
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    const maxLength = Math.max(results1.length, results2.length);

    for (let i = 0; i < maxLength; i++) {
        const prob1 = results1[i]?.probability || 0;
        const prob2 = results2[i]?.probability || 0;

        dotProduct += prob1 * prob2;
        magnitude1 += prob1 * prob1;
        magnitude2 += prob2 * prob2;
    }

    const similarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
    return (similarity * 100).toFixed(1);
}

function displayDiagnosisChange(metrics) {
    const diagnosisDiv = document.getElementById('diagnosisChange');

    let html = `
        <div style="margin-bottom: 1rem;">
            <div style="font-size: 1.125rem; color: var(--gray); margin-bottom: 0.5rem;">Before:</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: var(--dark);">${metrics.diagnosis1}</div>
        </div>
        <div class="arrow-indicator">→</div>
        <div>
            <div style="font-size: 1.125rem; color: var(--gray); margin-bottom: 0.5rem;">After:</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: var(--dark);">${metrics.diagnosis2}</div>
        </div>
    `;

    if (metrics.diagnosis1 === metrics.diagnosis2) {
        html += '<div style="margin-top: 1rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: 10px; color: var(--success-color); font-weight: 600;">No Change in Diagnosis</div>';
    } else {
        html += '<div style="margin-top: 1rem; padding: 1rem; background: rgba(245, 158, 11, 0.1); border-radius: 10px; color: var(--warning-color); font-weight: 600;">Diagnosis Changed</div>';
    }

    diagnosisDiv.innerHTML = html;
}

function displayConfidenceChange(metrics) {
    const confidenceDiv = document.getElementById('confidenceChange');

    const changeClass = metrics.confidenceChange > 0 ? 'change-positive' :
                       metrics.confidenceChange < 0 ? 'change-negative' : 'change-neutral';

    const changeIcon = metrics.confidenceChange > 0 ? '↑' :
                      metrics.confidenceChange < 0 ? '↓' : '→';

    confidenceDiv.innerHTML = `
        <div class="change-indicator ${changeClass}">
            ${changeIcon} ${Math.abs(metrics.confidenceChange)}%
        </div>
        <div style="color: var(--gray);">
            From ${(metrics.confidence1 * 100).toFixed(1)}% to ${(metrics.confidence2 * 100).toFixed(1)}%
        </div>
        <div class="progress-indicator">
            <div class="progress-bar-compare">
                <div class="progress-fill-compare" style="width: ${metrics.confidence2 * 100}%"></div>
            </div>
        </div>
    `;
}

function displaySimilarityScore(metrics) {
    const similarityDiv = document.getElementById('similarityScore');

    const scoreClass = metrics.similarity > 80 ? 'change-positive' :
                      metrics.similarity > 50 ? 'change-neutral' : 'change-negative';

    similarityDiv.innerHTML = `
        <div class="change-indicator ${scoreClass}">
            ${metrics.similarity}%
        </div>
        <div style="color: var(--gray);">
            ${metrics.similarity > 80 ? 'Very Similar' :
              metrics.similarity > 50 ? 'Moderately Similar' : 'Different'}
        </div>
        <div class="progress-indicator">
            <div class="progress-bar-compare">
                <div class="progress-fill-compare" style="width: ${metrics.similarity}%"></div>
            </div>
        </div>
    `;
}

function createComparisonChart() {
    const canvas = document.getElementById('comparisonChart');
    const ctx = canvas.getContext('2d');

    // Destroy existing chart
    if (comparisonChart) {
        comparisonChart.destroy();
    }

    // Get top 5 predictions from both analyses
    const labels = [];
    const data1 = [];
    const data2 = [];

    for (let i = 0; i < Math.min(5, comparisonData.results1.length); i++) {
        const label = comparisonData.results1[i].className;
        if (!labels.includes(label)) {
            labels.push(label);
        }
    }

    for (let i = 0; i < Math.min(5, comparisonData.results2.length); i++) {
        const label = comparisonData.results2[i].className;
        if (!labels.includes(label)) {
            labels.push(label);
        }
    }

    // Fill data arrays
    labels.forEach(label => {
        const result1 = comparisonData.results1.find(r => r.className === label);
        const result2 = comparisonData.results2.find(r => r.className === label);

        data1.push(result1 ? (result1.probability * 100).toFixed(1) : 0);
        data2.push(result2 ? (result2.probability * 100).toFixed(1) : 0);
    });

    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Before',
                    data: data1,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                },
                {
                    label: 'After',
                    data: data2,
                    backgroundColor: 'rgba(118, 75, 162, 0.8)',
                    borderColor: 'rgba(118, 75, 162, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

function displayProgressionAnalysis(metrics) {
    const progressionDiv = document.getElementById('progressionAnalysis');

    let analysis = '';

    if (metrics.diagnosis1 === metrics.diagnosis2) {
        if (Math.abs(metrics.confidenceChange) < 5) {
            analysis = '<p><strong>Stable Condition:</strong> The condition remains consistent between both images with minimal confidence change. Continue monitoring and follow recommended treatment plans.</p>';
        } else if (metrics.confidenceChange > 0) {
            analysis = '<p><strong>Increasing Confidence:</strong> The AI is more certain about the diagnosis in the second image. This could indicate the condition is becoming more characteristic or prominent.</p>';
        } else {
            analysis = '<p><strong>Decreasing Confidence:</strong> The AI is less certain about the diagnosis in the second image. This could indicate improvement, healing, or changes in image quality.</p>';
        }
    } else {
        analysis = '<p><strong>Condition Changed:</strong> The AI has detected a different condition in the second image. This could indicate:</p>';
        analysis += '<ul>';
        analysis += '<li>The condition has evolved or changed</li>';
        analysis += '<li>Different areas of skin were captured</li>';
        analysis += '<li>Image quality or lighting differences</li>';
        analysis += '<li>Treatment has affected the appearance</li>';
        analysis += '</ul>';
        analysis += '<p><strong>Recommendation:</strong> Consult with a dermatologist to evaluate these changes professionally.</p>';
    }

    progressionDiv.innerHTML = `<div class="timeline-content">${analysis}</div>`;
}

function downloadComparison() {
    const metrics = calculateComparisonMetrics();

    const report = `
DermAI - Comparison Report
==========================

ANALYSIS DATE: ${new Date().toLocaleString()}

IMAGE 1 (BEFORE)
----------------
Diagnosis: ${metrics.diagnosis1}
Confidence: ${(metrics.confidence1 * 100).toFixed(1)}%

IMAGE 2 (AFTER)
---------------
Diagnosis: ${metrics.diagnosis2}
Confidence: ${(metrics.confidence2 * 100).toFixed(1)}%

COMPARISON METRICS
------------------
Confidence Change: ${metrics.confidenceChange > 0 ? '+' : ''}${metrics.confidenceChange}%
Similarity Score: ${metrics.similarity}%
Status: ${metrics.changeStatus}

DETAILED PREDICTIONS - IMAGE 1
-------------------------------
${comparisonData.results1.slice(0, 5).map((r, i) =>
    `${i + 1}. ${r.className}: ${(r.probability * 100).toFixed(1)}%`
).join('
')}

DETAILED PREDICTIONS - IMAGE 2
-------------------------------
${comparisonData.results2.slice(0, 5).map((r, i) =>
    `${i + 1}. ${r.className}: ${(r.probability * 100).toFixed(1)}%`
).join('
')}

RECOMMENDATION
--------------
${metrics.diagnosis1 === metrics.diagnosis2 ?
    'The condition appears consistent between images. Continue monitoring.' :
    'The diagnosis has changed. Please consult with a healthcare professional.'}

---
DISCLAIMER: This analysis is for informational purposes only and
should not replace professional medical advice.

Generated by DermAI © 2025
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DermAI_Comparison_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Comparison report downloaded!', 'success');
}

function resetComparison() {
    if (confirm('Are you sure you want to reset the comparison?')) {
        removeImage(1);
        removeImage(2);
        document.getElementById('detailedComparison').style.display = 'none';
        document.getElementById('comparisonStats').style.display = 'none';

        if (comparisonChart) {
            comparisonChart.destroy();
            comparisonChart = null;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
