// =====================
// Advanced Detection Features
// =====================

class DetectionHistory {
    constructor() {
        this.storageKey = 'dermAI_history';
        this.maxHistory = 10;
    }

    // Save detection to history
    save(detection) {
        let history = this.getAll();

        const record = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            diagnosis: detection.diagnosis,
            confidence: detection.confidence,
            imageData: detection.imageData,
            predictions: detection.predictions
        };

        history.unshift(record);

        // Keep only last maxHistory items
        if (history.length > this.maxHistory) {
            history = history.slice(0, this.maxHistory);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    // Get all history
    getAll() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Get single record by ID
    getById(id) {
        const history = this.getAll();
        return history.find(record => record.id === id);
    }

    // Delete record
    delete(id) {
        let history = this.getAll();
        history = history.filter(record => record.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    // Clear all history
    clear() {
        localStorage.removeItem(this.storageKey);
    }

    // Export history as JSON
    export() {
        const history = this.getAll();
        const dataStr = JSON.stringify(history, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `dermAI_history_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize history manager
const detectionHistory = new DetectionHistory();

// =====================
// Image Processing Utilities
// =====================

class ImageProcessor {
    // Enhance image quality
    static async enhanceImage(imageElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = imageElement.width;
        canvas.height = imageElement.height;

        // Draw original image
        ctx.drawImage(imageElement, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply brightness and contrast adjustment
        const factor = 1.2;
        const offset = 10;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * factor + offset);     // Red
            data[i + 1] = Math.min(255, data[i + 1] * factor + offset); // Green
            data[i + 2] = Math.min(255, data[i + 2] * factor + offset); // Blue
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    }

    // Crop image to focus area
    static cropImage(imageElement, x, y, width, height) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(imageElement, x, y, width, height, 0, 0, width, height);
        return canvas.toDataURL();
    }

    // Detect and remove background
    static async removeBackground(imageElement) {
        // Placeholder for background removal
        // In production, use ML-based background removal
        return imageElement.src;
    }

    // Get dominant colors
    static getDominantColors(imageElement, count = 5) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        ctx.drawImage(imageElement, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const colorMap = {};

        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
            const r = Math.floor(data[i] / 10) * 10;
            const g = Math.floor(data[i + 1] / 10) * 10;
            const b = Math.floor(data[i + 2] / 10) * 10;
            const key = `${r},${g},${b}`;
            colorMap[key] = (colorMap[key] || 0) + 1;
        }

        // Sort by frequency
        const sortedColors = Object.entries(colorMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, count)
            .map(([color]) => {
                const [r, g, b] = color.split(',');
                return { r: parseInt(r), g: parseInt(g), b: parseInt(b) };
            });

        return sortedColors;
    }
}

// =====================
// Advanced Analysis Functions
// =====================

class AdvancedAnalyzer {
    // Analyze image quality
    static analyzeImageQuality(imageElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        ctx.drawImage(imageElement, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Calculate brightness
        let brightness = 0;
        for (let i = 0; i < data.length; i += 4) {
            brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
        }
        brightness = brightness / (data.length / 4);

        // Calculate contrast (standard deviation)
        let variance = 0;
        for (let i = 0; i < data.length; i += 4) {
            const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            variance += Math.pow(pixelBrightness - brightness, 2);
        }
        const contrast = Math.sqrt(variance / (data.length / 4));

        // Calculate sharpness (edge detection)
        const sharpness = this.calculateSharpness(data, canvas.width, canvas.height);

        return {
            brightness: brightness / 255,
            contrast: contrast / 128,
            sharpness: sharpness,
            resolution: imageElement.width * imageElement.height,
            isGoodQuality: brightness > 80 && brightness < 200 && contrast > 20
        };
    }

    static calculateSharpness(data, width, height) {
        let sharpness = 0;
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                const center = data[idx];
                const right = data[idx + 4];
                const bottom = data[(y + 1) * width * 4 + x * 4];

                sharpness += Math.abs(center - right) + Math.abs(center - bottom);
            }
        }
        return sharpness / (width * height);
    }

    // Detect skin regions
    static detectSkinRegions(imageElement) {
        // Simplified skin detection using color ranges
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        ctx.drawImage(imageElement, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let skinPixels = 0;
        const totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Simple skin color detection
            if (r > 95 && g > 40 && b > 20 &&
                r > g && r > b &&
                Math.abs(r - g) > 15 &&
                Math.max(r, g, b) - Math.min(r, g, b) > 15) {
                skinPixels++;
            }
        }

        return {
            skinPercentage: (skinPixels / totalPixels) * 100,
            hasSufficientSkin: (skinPixels / totalPixels) > 0.3
        };
    }
}

// =====================
// Enhanced Analysis with Multiple Features
// =====================

async function analyzeImageAdvanced() {
    if (!uploadedImage) {
        showNotification('Please upload an image first', 'error');
        return;
    }

    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsContent = document.getElementById('resultsContent');

    resultsSection.style.display = 'block';
    loadingSpinner.style.display = 'block';
    resultsContent.style.display = 'none';

    // Create image element for processing
    const img = new Image();
    img.src = uploadedImage;

    await new Promise(resolve => img.onload = resolve);

    // Analyze image quality
    const quality = AdvancedAnalyzer.analyzeImageQuality(img);
    console.log('Image Quality:', quality);

    if (!quality.isGoodQuality) {
        showNotification('Image quality may affect accuracy. Please use better lighting.', 'warning');
    }

    // Detect skin regions
    const skinAnalysis = AdvancedAnalyzer.detectSkinRegions(img);
    console.log('Skin Analysis:', skinAnalysis);

    if (!skinAnalysis.hasSufficientSkin) {
        showNotification('Please ensure the skin area is clearly visible.', 'warning');
    }

    // Run AI prediction
    const predictions = await classifier.predict(img);

    // Save to history
    detectionHistory.save({
        diagnosis: predictions[0].className,
        confidence: predictions[0].probability,
        imageData: uploadedImage,
        predictions: predictions.slice(0, 5)
    });

    // Display results
    displayResults(predictions);

    loadingSpinner.style.display = 'none';
    resultsContent.style.display = 'block';
}

// Update the analyzeImage function to use advanced analysis
if (typeof analyzeImage !== 'undefined') {
    const originalAnalyzeImage = analyzeImage;
    analyzeImage = analyzeImageAdvanced;
}
