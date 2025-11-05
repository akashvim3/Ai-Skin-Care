// =====================
// History Page Functionality
// =====================

let historyData = [];
let filteredData = [];

// Load history on page load
window.addEventListener('load', () => {
    loadHistory();
    updateStats();
});

function loadHistory() {
    historyData = detectionHistory.getAll();
    filteredData = [...historyData];
    renderHistory();
}

function renderHistory() {
    const historyGrid = document.getElementById('historyGrid');
    const emptyState = document.getElementById('emptyState');

    if (filteredData.length === 0) {
        historyGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    historyGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    historyGrid.innerHTML = '';

    filteredData.forEach(record => {
        const item = createHistoryItem(record);
        historyGrid.appendChild(item);
    });
}

function createHistoryItem(record) {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.onclick = () => showDetail(record.id);

    const date = new Date(record.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    div.innerHTML = `
        <img src="${record.imageData}" alt="${record.diagnosis}" class="history-item-image">
        <div class="history-item-content">
            <div class="history-item-header">
                <div class="history-item-diagnosis">${record.diagnosis}</div>
                <div class="history-item-confidence">${(record.confidence * 100).toFixed(1)}%</div>
            </div>
            <div class="history-item-date">
                <i class="fas fa-clock"></i>
                ${formattedDate}
            </div>
            <div class="history-item-actions">
                <button class="icon-btn" onclick="event.stopPropagation(); viewDetail(${record.id})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="event.stopPropagation(); downloadRecord(${record.id})" title="Download">
                    <i class="fas fa-download"></i>
                </button>
                <button class="icon-btn" onclick="event.stopPropagation(); deleteRecord(${record.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    return div;
}

function showDetail(id) {
    const record = detectionHistory.getById(id);
    if (!record) return;

    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');

    const date = new Date(record.timestamp);
    const formattedDate = date.toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
    });

    modalBody.innerHTML = `
        <img src="${record.imageData}" alt="${record.diagnosis}" class="modal-image">
        <div class="modal-body">
            <div class="modal-diagnosis">${record.diagnosis}</div>
            <div style="margin-bottom: 2rem;">
                <strong>Confidence:</strong> ${(record.confidence * 100).toFixed(1)}%<br>
                <strong>Date:</strong> ${formattedDate}
            </div>

            <div class="modal-predictions">
                <h3>Detailed Predictions</h3>
                <div class="result-table">
                    <div class="table-header">
                        <span>Condition</span>
                        <span>Probability</span>
                        <span>Risk Level</span>
                    </div>
                    ${record.predictions.map(pred => `
                        <div class="table-row">
                            <span>${pred.className}</span>
                            <span>${(pred.probability * 100).toFixed(1)}%</span>
                            <span class="risk-badge risk-${getRiskLevel(pred.probability)}">
                                ${getRiskLevel(pred.probability).toUpperCase()}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="downloadRecord(${record.id})">
                    <i class="fas fa-download"></i> Download Report
                </button>
                <button class="btn btn-danger" onclick="deleteRecord(${record.id}); closeModal();">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        detectionHistory.delete(id);
        loadHistory();
        updateStats();
        showNotification('Record deleted successfully', 'success');
    }
}

function downloadRecord(id) {
    const record = detectionHistory.getById(id);
    if (!record) return;

    const report = `
DermAI - Analysis Report
========================

Diagnosis: ${record.diagnosis}
Confidence: ${(record.confidence * 100).toFixed(1)}%
Date: ${new Date(record.timestamp).toLocaleString()}

Detailed Predictions:
${record.predictions.map((pred, i) =>
    `${i + 1}. ${pred.className}: ${(pred.probability * 100).toFixed(1)}%`
).join('
')}

---
This report is for informational purposes only.
Please consult a healthcare professional for medical advice.
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DermAI_Report_${record.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
        detectionHistory.clear();
        loadHistory();
        updateStats();
        showNotification('History cleared', 'success');
    }
}

function exportHistory() {
    detectionHistory.export();
    showNotification('History exported successfully', 'success');
}

function updateStats() {
    const history = detectionHistory.getAll();

    // Total analyses
    document.getElementById('totalAnalyses').textContent = history.length;

    // This month
    const now = new Date();
    const thisMonth = history.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.getMonth() === now.getMonth() &&
               recordDate.getFullYear() === now.getFullYear();
    }).length;
    document.getElementById('thisMonth').textContent = thisMonth;

    // Most common diagnosis
    const diagnosisCounts = {};
    history.forEach(record => {
        diagnosisCounts[record.diagnosis] = (diagnosisCounts[record.diagnosis] || 0) + 1;
    });

    const mostCommon = Object.entries(diagnosisCounts)
        .sort((a, b) => b[1] - a[1])[0];

    document.getElementById('mostCommon').textContent =
        mostCommon ? mostCommon[0] : '-';
}

// Search functionality
document.getElementById('searchHistory')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filteredData = historyData.filter(record =>
        record.diagnosis.toLowerCase().includes(searchTerm)
    );
    renderHistory();
});

// Sort functionality
document.getElementById('sortHistory')?.addEventListener('change', (e) => {
    const sortType = e.target.value;

    switch(sortType) {
        case 'newest':
            filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            break;
        case 'oldest':
            filteredData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            break;
        case 'confidence':
            filteredData.sort((a, b) => b.confidence - a.confidence);
            break;
    }

    renderHistory();
});

// Close modal when clicking outside
window.onclick = (event) => {
    const modal = document.getElementById('detailModal');
    if (event.target === modal) {
        closeModal();
    }
};

function getRiskLevel(probability) {
    if (probability > 0.5) return 'high';
    if (probability > 0.2) return 'medium';
    return 'low';
}
