// =====================
// FAQ Functionality
// =====================

// Toggle FAQ items
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Category filtering
document.querySelectorAll('.faq-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;

        // Update active button
        document.querySelectorAll('.faq-category-btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        // Filter FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Search functionality
document.getElementById('faqSearch')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();

        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
            if (searchTerm.length > 2) {
                item.classList.add('active');
            }
        } else {
            item.style.display = 'none';
        }
    });
});
