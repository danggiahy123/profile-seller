// Profile Seller Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    setupScrollAnimations();
    setupButtonInteractions();
    setupFeatureCards();
    setupTrashAnimation();
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, section > div');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Button interactions
function setupButtonInteractions() {
    const getStartedBtn = document.querySelector('button[class*="bg-teal-500"]');
    const learnMoreLink = document.querySelector('a[href="#learn-more"]');
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            showDemo();
        });
    }
    
    if (learnMoreLink) {
        learnMoreLink.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollTo('#learn-more');
        });
    }
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('hover-scale');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('hover-scale');
        });
    });
}

// Feature cards setup
function setupFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover-lift');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-lift');
        });
    });
}

// Trash bin animation
function setupTrashAnimation() {
    const trashBin = document.querySelector('.fa-trash-alt').parentElement.parentElement;
    const particles = document.querySelectorAll('.animate-pulse');
    
    if (trashBin) {
        // Add floating animation to trash bin
        trashBin.classList.add('floating');
        
        // Add hover effect
        trashBin.addEventListener('mouseenter', function() {
            this.classList.add('glow-animation');
        });
        
        trashBin.addEventListener('mouseleave', function() {
            this.classList.remove('glow-animation');
        });
    }
    
    // Enhanced particle animations
    particles.forEach((particle, index) => {
        particle.style.animationDuration = `${2 + index * 0.5}s`;
    });
}

// Smooth scroll function
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Demo/showcase function
function showDemo() {
    // Create a modal or redirect to demo
    const demoUrl = '#demo';
    
    // For this landing page, we'll show an alert
    alert('Demo sẽ được mở trong tab mới. Hiện tại đang trong chế độ development.');
    
    // In production, you might want to:
    // window.systemAlert(demoUrl, '_blank');
}

// Show toast notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 max-w-sm transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    }`;
    
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Scroll progress indicator
function setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 w-full h-1 bg-gray-200 z-50';
    
    const progressFill = document.createElement('div');
    progressFill.className = 'h-full bg-teal-500 transition-all duration-300';
    progressBar.appendChild(progressFill);
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress on load
setupScrollProgress();

// Utility functions for global use
window.ProfileSeller = {
    showToast,
    smoothScrollTo,
    showDemo
};