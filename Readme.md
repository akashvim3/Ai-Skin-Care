# DermAI - AI-Powered Skin Disease Detector

![DermAI Logo](assets/images/hero-illustration.png)

## 🚀 Overview

DermAI is an advanced, professional-level web application that uses artificial intelligence and deep learning to detect and analyze various skin conditions. Built with modern web technologies, it provides instant, accurate preliminary assessments to help users identify potential skin issues early.

### ✨ Key Features

- **AI-Powered Detection**: Advanced CNN-based image analysis
- **15+ Skin Conditions**: Comprehensive disease database
- **Real-time Analysis**: Instant results in seconds
- **Privacy-First**: Client-side processing, no data uploaded
- **Offline Support**: PWA with full offline capabilities
- **History Tracking**: Save and compare analyses over time
- **Comparison Tool**: Track progression and changes
- **Responsive Design**: Works on all devices
- **Modern UI/UX**: Professional healthcare interface
- **Educational Resources**: Comprehensive guides and articles

## 📋 Table of Contents

- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Features](#features)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid & Flexbox
- **JavaScript (ES6+)**: Vanilla JS for functionality
- **TensorFlow.js**: Machine learning in the browser

### Progressive Web App
- **Service Worker**: Offline functionality
- **Web App Manifest**: Installable app
- **IndexedDB**: Local data storage
- **Cache API**: Resource caching

### Libraries & Tools
- **Font Awesome 6.4.0**: Icons
- **Chart.js 4.4.0**: Data visualization
- **TensorFlow.js 4.11.0**: AI/ML framework

## 📦 Installation

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Local web server (optional for development)
- Text editor or IDE

### Setup Instructions

1. **Clone or download the project**
git clone https://github.com/akashvim3/dermAI.git
cd dermAI

## 📁 Project Structure
├── HTML Pages (10 pages)
│   ├── Home, Detection, About, Diseases
│   ├── History, Compare, Resources, FAQ
│   └── Contact, Settings, Offline
│
├── CSS Stylesheets (7 files)
│   ├── Main styles, History, Compare
│   ├── Settings, Resources, FAQ
│   └── Responsive design
│
├── JavaScript Modules (10 files)
│   ├── Core functionality
│   ├── AI/ML integration
│   ├── PWA features
│   └── Utilities
│
└── Assets
├── Images (20+ files)
├── Icons (PWA icons)
└── AI Model (optional)

## 🎯 Features

### 1. AI Detection
- Upload or capture skin images
- Real-time analysis
- Confidence scoring
- Multiple disease detection
- Detailed reports

### 2. History Management
- Save detection results
- View past analyses
- Export history
- Delete records
- Search and filter

### 3. Comparison Tool
- Compare two images
- Track changes over time
- Visual charts
- Progression analysis
- Downloadable reports

### 4. Educational Resources
- Comprehensive guides
- Video tutorials
- Latest articles
- Research papers
- Quick health tips

### 5. Settings
- Dark mode
- Font size adjustment
- Privacy controls
- Data management
- Export/Import settings

## 💻 Usage

### Basic Detection

1. Navigate to **Detect** page
2. Click "Choose Image" or drag & drop
3. Wait for AI analysis (2-5 seconds)
4. View detailed results
5. Download report if needed

### Comparing Images

1. Go to **Compare** page
2. Upload two images (before/after)
3. Click "Compare" button
4. Review detailed comparison
5. Download comparison report

### Managing History

1. Visit **History** page
2. View all past analyses
3. Search or filter results
4. Click any item for details
5. Export or clear data

## 🔌 API Integration

### Using a Custom Model

Replace the simulated prediction in `assets/js/model.js`:
async function loadModel() {
try {
model = await tf.loadLayersModel('path/to/your/model.json');
console.log('Model loaded successfully');
} catch (error) {
console.error('Error loading model:', error);
}
}

### Training Your Own Model
Example TensorFlow model trainingimport tensorflow as tfLoad and preprocess data... your training code ...Convert to TensorFlow.js formattfjs.converters.save_keras_model(model, 'models/')

## 🚀 Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch and folder
4. Save and wait for deployment

### Netlify

1. Connect GitHub repository
2. Set build command: none
3. Set publish directory: /
4. Deploy site

### Vercel
   vercel

### Custom Server

Upload files to your web server via FTP/SFTP and ensure HTTPS is enabled for PWA features.

## 🔧 Configuration

### Customization

**Colors** (`assets/css/style.css`):
:root {
--primary-color: #667eea;
--secondary-color: #764ba2;
--accent-color: #f093fb;
}

**Disease Classes** (`assets/js/model.js`):
this.classes = [
'Acne',
'Eczema',
'Psoriasis',
// Add more conditions
];

## 📱 PWA Features

- Offline functionality
- Install to home screen
- Push notifications
- Background sync
- Cache management

## 🐛 Troubleshooting

**Analysis not working?**
- Check browser compatibility
- Clear cache and reload
- Ensure JavaScript is enabled
- Check console for errors

**Images not loading?**
- Verify image paths
- Check file formats (JPG/PNG)
- Ensure file size < 5MB

**PWA not installing?**
- Use HTTPS (required)
- Check manifest.json
- Verify service worker registration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- Your Name - Initial work

## 🙏 Acknowledgments

- TensorFlow.js team
- Font Awesome
- Chart.js
- Medical professionals who provided domain expertise

## 📞 Support

For support, email info@dermai.com or visit our [Contact Page](contact.html).

## 🔮 Future Enhancements

- Multi-language support
- Voice commands
- Telemedicine integration
- Mobile apps (iOS/Android)
- More skin conditions
- 3D skin mapping

---

**Disclaimer**: DermAI is for educational and informational purposes only. Always consult a qualified healthcare professional for medical advice, diagnosis, and treatment.

Made with ❤️ for better skin health .
