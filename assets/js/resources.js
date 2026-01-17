// =====================
// Resources Page Functionality
// =====================

let currentCategory = 'all';
let allResources = [];

// Initialize on page load
window.addEventListener('load', () => {
    initializeResources();
    setupCategoryFilters();
    setupNewsletterForm();
    animateOnScroll();
});

// =====================
// Initialize Resources
// =====================

function initializeResources() {
    // Collect all resource items
    allResources = [
        ...document.querySelectorAll('.resource-card'),
        ...document.querySelectorAll('.article-item'),
        ...document.querySelectorAll('.video-card'),
        ...document.querySelectorAll('.research-item')
    ];
}

// =====================
// Category Filtering
// =====================

function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;

            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter resources
            filterResources(category);

            // Smooth scroll to resources
            document.querySelector('.resource-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

function filterResources(category) {
    currentCategory = category;

    allResources.forEach(item => {
        const itemCategory = item.dataset.category;

        if (category === 'all' || itemCategory === category) {
            item.style.display = '';
            item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });

    // Hide sections if no items visible
    updateSectionVisibility();
}

function updateSectionVisibility() {
    const sections = document.querySelectorAll('.resource-section');

    sections.forEach(section => {
        const visibleItems = Array.from(section.querySelectorAll('[data-category]'))
            .filter(item => item.style.display !== 'none');

        if (visibleItems.length === 0 && currentCategory !== 'all') {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// =====================
// Resource Opening
// =====================

function openResource(resourceId) {
    // Resource content database
    const resources = {
        'skincare-basics': {
            title: 'Skin Care Basics',
            content: `
                <h2>Essential Daily Skincare Routines</h2>

                <h3>Morning Routine</h3>
                <ol>
                    <li><strong>Cleanse:</strong> Use a gentle cleanser to remove overnight oils and impurities</li>
                    <li><strong>Tone:</strong> Apply toner to balance skin pH</li>
                    <li><strong>Serum:</strong> Use vitamin C serum for antioxidant protection</li>
                    <li><strong>Moisturize:</strong> Apply a lightweight moisturizer</li>
                    <li><strong>Sunscreen:</strong> Always use SPF 30+ as the final step</li>
                </ol>

                <h3>Evening Routine</h3>
                <ol>
                    <li><strong>Remove Makeup:</strong> Use an oil-based cleanser</li>
                    <li><strong>Cleanse:</strong> Follow with a water-based cleanser</li>
                    <li><strong>Exfoliate:</strong> 2-3 times per week</li>
                    <li><strong>Treatment:</strong> Apply targeted treatments (retinol, acids)</li>
                    <li><strong>Eye Cream:</strong> Gently pat around eye area</li>
                    <li><strong>Night Cream:</strong> Use a richer moisturizer</li>
                </ol>

                <h3>Key Tips</h3>
                <ul>
                    <li>Always patch test new products</li>
                    <li>Introduce new products one at a time</li>
                    <li>Be consistent with your routine</li>
                    <li>Adjust based on skin type and season</li>
                    <li>Stay hydrated and get adequate sleep</li>
                </ul>
            `
        },
        'sun-protection': {
            title: 'Sun Protection Guide',
            content: `
                <h2>Complete Guide to Sun Protection</h2>

                <h3>Why Sun Protection Matters</h3>
                <p>UV radiation can cause:</p>
                <ul>
                    <li>Premature aging (wrinkles, age spots)</li>
                    <li>Skin cancer (melanoma, basal cell, squamous cell)</li>
                    <li>Immune system suppression</li>
                    <li>Eye damage</li>
                </ul>

                <h3>Choosing the Right Sunscreen</h3>
                <ul>
                    <li><strong>SPF 30 minimum:</strong> Blocks 97% of UVB rays</li>
                    <li><strong>Broad spectrum:</strong> Protects against UVA and UVB</li>
                    <li><strong>Water resistant:</strong> For swimming or sweating</li>
                    <li><strong>Right formula:</strong> Choose based on skin type</li>
                </ul>

                <h3>Proper Application</h3>
                <ol>
                    <li>Apply 15-30 minutes before sun exposure</li>
                    <li>Use approximately 1 oz (shot glass full) for entire body</li>
                    <li>Don't forget: ears, neck, hands, feet</li>
                    <li>Reapply every 2 hours</li>
                    <li>Reapply after swimming or sweating</li>
                </ol>

                <h3>Additional Protection</h3>
                <ul>
                    <li>Seek shade during peak hours (10 AM - 4 PM)</li>
                    <li>Wear protective clothing (UPF-rated)</li>
                    <li>Use wide-brimmed hats</li>
                    <li>Wear UV-protective sunglasses</li>
                    <li>Be extra cautious near water, snow, sand</li>
                </ul>
            `
        },
        'ai-detection': {
            title: 'Understanding AI Detection',
            content: `
                <h2>How AI Analyzes Skin Conditions</h2>

                <h3>The Technology Behind DermAI</h3>
                <p>DermAI uses Convolutional Neural Networks (CNNs), a type of deep learning
                algorithm specifically designed for image analysis.</p>

                <h3>The Process</h3>
                <ol>
                    <li><strong>Image Input:</strong> You upload a photo of the affected skin area</li>
                    <li><strong>Preprocessing:</strong> Image is resized and normalized</li>
                    <li><strong>Feature Extraction:</strong> CNN identifies patterns and features</li>
                    <li><strong>Classification:</strong> AI matches patterns to known conditions</li>
                    <li><strong>Confidence Scoring:</strong> Probability calculated for each condition</li>
                    <li><strong>Results:</strong> Top predictions displayed with confidence levels</li>
                </ol>

                <h3>Training Data</h3>
                <p>Our model has been trained on:</p>
                <ul>
                    <li>50,000+ dermatological images</li>
                    <li>Verified medical datasets</li>
                    <li>Multiple skin types and tones</li>
                    <li>Various lighting conditions</li>
                    <li>Different image qualities</li>
                </ul>

                <h3>Accuracy Factors</h3>
                <p>Accuracy depends on:</p>
                <ul>
                    <li>Image quality and lighting</li>
                    <li>Camera angle and distance</li>
                    <li>Clarity of the affected area</li>
                    <li>Stage of the condition</li>
                    <li>Individual variations</li>
                </ul>

                <h3>Limitations</h3>
                <ul>
                    <li>Cannot replace professional diagnosis</li>
                    <li>May struggle with rare conditions</li>
                    <li>Requires clear, well-lit images</li>
                    <li>Cannot assess symptoms beyond visual</li>
                    <li>Should be used as screening tool only</li>
                </ul>

                <h3>Interpreting Results</h3>
                <ul>
                    <li><strong>High confidence (>80%):</strong> Strong match to condition</li>
                    <li><strong>Medium confidence (50-80%):</strong> Possible match, needs verification</li>
                    <li><strong>Low confidence (<50%):</strong> Uncertain, multiple possibilities</li>
                </ul>
            `
        },
        'photo-guide': {
            title: 'Taking Quality Photos',
            content: `
                <h2>Professional Photography Tips</h2>

                <h3>Lighting</h3>
                <ul>
                    <li><strong>Natural daylight is best:</strong> Take photos near a window</li>
                    <li><strong>Avoid direct sunlight:</strong> Can cause harsh shadows</li>
                    <li><strong>Even lighting:</strong> No shadows on the affected area</li>
                    <li><strong>Avoid flash:</strong> Can wash out details</li>
                    <li><strong>Indoor lighting:</strong> Use bright, white LED lights if needed</li>
                </ul>

                <h3>Camera Settings</h3>
                <ul>
                    <li>Use the highest resolution available</li>
                    <li>Enable HDR mode if available</li>
                    <li>Turn off flash</li>
                    <li>Use focus lock on the affected area</li>
                    <li>Keep camera steady (use timer or tripod)</li>
                </ul>

                <h3>Composition</h3>
                <ul>
                    <li><strong>Fill the frame:</strong> Affected area should be prominent</li>
                    <li><strong>Distance:</strong> 6-12 inches from skin</li>
                    <li><strong>Angle:</strong> Perpendicular to skin surface</li>
                    <li><strong>Background:</strong> Simple, neutral background</li>
                    <li><strong>Reference:</strong> Include ruler or coin for scale if possible</li>
                </ul>

                <h3>Common Mistakes to Avoid</h3>
                <ul>
                    <li>❌ Blurry or out-of-focus images</li>
                    <li>❌ Too dark or too bright</li>
                    <li>❌ Shadows covering the area</li>
                    <li>❌ Too far away (area too small)</li>
                    <li>❌ Extreme angles</li>
                    <li>❌ Dirty camera lens</li>
                    <li>❌ Heavy filters or editing</li>
                </ul>

                <h3>Multiple Angles</h3>
                <p>Take photos from different angles:</p>
                <ul>
                    <li>Direct overhead view</li>
                    <li>45-degree angle</li>
                    <li>Close-up of details</li>
                    <li>Wider shot showing surrounding area</li>
                </ul>

                <h3>Before Uploading</h3>
                <ul>
                    <li>Review image quality</li>
                    <li>Ensure affected area is clear</li>
                    <li>Check for adequate lighting</li>
                    <li>Verify image is in focus</li>
                    <li>Make sure file size is under 5MB</li>
                </ul>
            `
        }
    };

    const resource = resources[resourceId];

    if (resource) {
        showResourceModal(resource);
    } else {
        showNotification('Resource not found', 'error');
    }
}

function showResourceModal(resource) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'resource-modal';
    modal.innerHTML = `
        <div class="resource-modal-content">
            <button class="resource-modal-close" onclick="closeResourceModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="resource-modal-body">
                <h1>${resource.title}</h1>
                ${resource.content}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Animate in
    setTimeout(() => modal.classList.add('active'), 10);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeResourceModal() {
    const modal = document.querySelector('.resource-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Add modal styles dynamically
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .resource-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .resource-modal.active {
        opacity: 1;
    }

    .resource-modal-content {
        background: white;
        border-radius: 20px;
        max-width: 900px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .resource-modal-close {
        position: sticky;
        top: 1rem;
        right: 1rem;
        float: right;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #ef4444;
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        transition: transform 0.3s ease;
        z-index: 1;
    }

    .resource-modal-close:hover {
        transform: scale(1.1);
    }

    .resource-modal-body {
        padding: 3rem;
    }

    .resource-modal-body h1 {
        font-size: 2.5rem;
        color: #1a202c;
        margin-bottom: 2rem;
    }

    .resource-modal-body h2 {
        font-size: 2rem;
        color: #1a202c;
        margin: 2rem 0 1rem;
    }

    .resource-modal-body h3 {
        font-size: 1.5rem;
        color: #2d3748;
        margin: 1.5rem 0 1rem;
    }

    .resource-modal-body p {
        color: #4a5568;
        line-height: 1.8;
        margin-bottom: 1rem;
    }

    .resource-modal-body ul,
    .resource-modal-body ol {
        color: #4a5568;
        line-height: 1.8;
        margin-bottom: 1.5rem;
        padding-left: 2rem;
    }

    .resource-modal-body li {
        margin-bottom: 0.5rem;
    }

    .resource-modal-body strong {
        color: #1a202c;
        font-weight: 600;
    }

    @media (max-width: 768px) {
        .resource-modal-body {
            padding: 2rem 1.5rem;
        }

        .resource-modal-body h1 {
            font-size: 1.75rem;
        }
    }
`;
document.head.appendChild(modalStyles);

// =====================
// Newsletter Form
// =====================

function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value;

            // Validate email
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate subscription
            subscribeNewsletter(email);

            // Reset form
            form.reset();
        });
    }
}

function subscribeNewsletter(email) {
    // Show loading state
    const submitBtn = document.querySelector('.newsletter-form button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Store subscription
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');

        if (subscribers.includes(email)) {
            showNotification('You are already subscribed!', 'warning');
        } else {
            subscribers.push(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            showNotification('Successfully subscribed! Check your email for confirmation.', 'success');
        }

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^\\S+@\\S+\\.\\S+$/;
    return emailRegex.test(email);
}

// =====================
// Video Player
// =====================

document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
        const videoTitle = card.querySelector('.video-info h3').textContent;
        playVideo(videoTitle);
    });
});

function playVideo(title) {
    // Create video modal
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <button class="video-modal-close" onclick="closeVideoModal()">
                <i class="fas fa-times"></i>
            </button>
            <h2>${title}</h2>
            <div class="video-placeholder">
                <i class="fas fa-play-circle"></i>
                <p>Video player would be embedded here</p>
                <p class="video-note">Connect to YouTube, Vimeo, or custom video source</p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Add video modal styles
const videoModalStyles = document.createElement('style');
videoModalStyles.textContent = `
    .video-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .video-modal.active {
        opacity: 1;
    }

    .video-modal-content {
        max-width: 1200px;
        width: 100%;
    }

    .video-modal-content h2 {
        color: white;
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .video-modal-close {
        position: absolute;
        top: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #ef4444;
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        transition: transform 0.3s ease;
    }

    .video-modal-close:hover {
        transform: scale(1.1);
    }

    .video-placeholder {
        background: #1a202c;
        border-radius: 15px;
        padding: 4rem;
        text-align: center;
        color: white;
        aspect-ratio: 16/9;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .video-placeholder i {
        font-size: 5rem;
        color: #667eea;
        margin-bottom: 1rem;
    }

    .video-placeholder p {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
    }

    .video-note {
        color: #a0aec0;
        font-size: 0.875rem !important;
    }
`;
document.head.appendChild(videoModalStyles);

// =====================
// Scroll Animations
// =====================

function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.resource-card, .article-item, .video-card, .research-item, .tip-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// =====================
// Reading Time Calculator
// =====================

function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
}

// =====================
// Search Functionality (if needed)
// =====================

function searchResources(query) {
    query = query.toLowerCase();
    let matchCount = 0;

    allResources.forEach(item => {
        const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = item.querySelector('p')?.textContent.toLowerCase() || '';

        if (title.includes(query) || description.includes(query)) {
            item.style.display = '';
            matchCount++;
        } else {
            item.style.display = 'none';
        }
    });

    return matchCount;
}

// =====================
// Print Resource
// =====================

function printResource(resourceId) {
    window.print();
}

// =====================
// Share Resource
// =====================

function shareResource(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'Check out this resource from DermAI',
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        });
    }
}

// =====================
// Add Fade In Animation CSS
// =====================

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animationStyles);

// Export functions for global use
window.openResource = openResource;
window.closeResourceModal = closeResourceModal;
window.closeVideoModal = closeVideoModal;
window.shareResource = shareResource;
window.printResource = printResource;

console.log('Resources page initialized successfully');
