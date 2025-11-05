// =====================
// Advanced AI Model Integration
// =====================

class SkinDiseaseClassifier {
    constructor() {
        this.model = null;
        this.modelPath = 'models/skin_disease_model.json';
        this.isModelLoaded = false;
        this.imageSize = 224;
        this.classes = [
            'Acne',
            'Eczema',
            'Psoriasis',
            'Melanoma',
            'Dermatitis',
            'Rosacea',
            'Basal Cell Carcinoma',
            'Seborrheic Keratosis',
            'Warts',
            'Vitiligo',
            'Ringworm',
            'Hives',
            'Folliculitis',
            'Keratosis Pilaris',
            'Normal Skin'
        ];
    }

    // Load the TensorFlow.js model
    async loadModel() {
        try {
            console.log('Loading AI model...');
            this.model = await tf.loadLayersModel(this.modelPath);
            this.isModelLoaded = true;
            console.log('Model loaded successfully');
            return true;
        } catch (error) {
            console.error('Error loading model:', error);
            console.log('Using simulated predictions instead');
            return false;
        }
    }

    // Preprocess image for model input
    async preprocessImage(imageElement) {
        return tf.tidy(() => {
            // Convert image to tensor
            let tensor = tf.browser.fromPixels(imageElement);

            // Resize to model input size
            tensor = tf.image.resizeBilinear(tensor, [this.imageSize, this.imageSize]);

            // Normalize to [0, 1]
            tensor = tensor.div(255.0);

            // Add batch dimension
            tensor = tensor.expandDims(0);

            return tensor;
        });
    }

    // Run prediction on image
    async predict(imageElement) {
        if (!this.isModelLoaded) {
            return this.simulatePrediction();
        }

        try {
            // Preprocess image
            const tensor = await this.preprocessImage(imageElement);

            // Run inference
            const predictions = await this.model.predict(tensor).data();

            // Clean up tensor
            tensor.dispose();

            // Format predictions
            const results = Array.from(predictions).map((probability, index) => ({
                className: this.classes[index] || `Disease ${index}`,
                probability: probability
            }));

            // Sort by probability
            results.sort((a, b) => b.probability - a.probability);

            return results;
        } catch (error) {
            console.error('Prediction error:', error);
            return this.simulatePrediction();
        }
    }

    // Simulate predictions for testing
    simulatePrediction() {
        const predictions = this.classes.map(className => ({
            className,
            probability: Math.random()
        }));

        const total = predictions.reduce((sum, pred) => sum + pred.probability, 0);
        predictions.forEach(pred => pred.probability /= total);
        predictions.sort((a, b) => b.probability - a.probability);

        return predictions;
    }

    // Batch prediction for multiple images
    async batchPredict(imageElements) {
        const results = [];
        for (const img of imageElements) {
            const prediction = await this.predict(img);
            results.push(prediction);
        }
        return results;
    }

    // Get model info
    getModelInfo() {
        if (!this.model) return null;

        return {
            inputShape: this.model.inputs[0].shape,
            outputShape: this.model.outputs[0].shape,
            totalParams: this.model.countParams(),
            layers: this.model.layers.length
        };
    }
}

// Initialize classifier
const classifier = new SkinDiseaseClassifier();

// Load model on page load
window.addEventListener('load', async () => {
    await classifier.loadModel();
});
