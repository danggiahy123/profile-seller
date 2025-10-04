/**
 * UI Enhancements for Profile Seller
 * Enhanced interactions, animations, and micro-behaviors
 */

class UIEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupInteractions();
        this.setupThemeSwitcher();
        this.setupLoadingStates();
        this.setupToastNotifications();
        this.setupMicroInteractions();
    }

    /**
     * Setup entrance animations for page elements
     */
    setupAnimations() {
        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-fadeIn');
                            entry.target.classList.remove('animate-ready');
                            this.observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
            );

            // Observe elements with animation-ready class
            document.querySelectorAll('.animate-ready').forEach(el => {
                this.observer.observe(el);
            });
        }

        // Stagger animations for grid items
        this.staggerGridAnimations();
    }

    /**
     * Stagger animation timing for grid items
     */
    staggerGridAnimations() {
        const gridItems = document.querySelectorAll('.grid-responsive .animate-ready');
        gridItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 100}ms`;
        });
    }

    /**
     * Setup interactive behaviors
     */
    setupInteractions() {
        // Enhanced button interactions
        this.setupButtonInteractions();
        
        // Card hover effects
        this.setupCardInteractions();
        
        // Form field enhancements
        this.setupFormInteractions();
        
        // Parallax scrolling
        this.setupParallaxScroll();
    }

    /**
     * Enhanced button interactions with ripple effect
     */
    setupButtonInteractions() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });

            // Enhanced hover effects
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    /**
     * Create ripple effect on button click
     */
    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Enhanced card interactions
     */
    setupCardInteractions() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
    }

    /**
     * Enhanced form interactions
     */
    setupFormInteractions() {
        // Floating labels
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
                this.animateFieldFocus(input);
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
                this.animateFieldBlur(input);
            });

            // Real-time validation indicators
            input.addEventListener('input', () => {
                this.validateField(input);
            });
        });

        // Password toggle enhancement
        this.setupPasswordToggle();
    }

    /**
     * Animate field focus
     */
    animateFieldFocus(input) {
        input.style.transform = 'translateY(-1px)';
        input.style.borderColor = '#667eea';
        input.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
    }

    /**
     * Animate field blur
     */
    animateFieldBlur(input) {
        input.style.transform = 'translateY(0)';
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }

    /**
     * Real-time field validation
     */
    validateField(input) {
        const isValid = input.checkValidity();
        const isEmail = input.type === 'email';
        const isPassword = input.type === 'password';

        if (input.value.length > 0) {
            if (isValid) {
                input.style.borderColor = '#10b981';
                input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            } else {
                input.style.borderColor = '#ef4444';
                input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            }
        } else {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        }
    }

    /**
        /**
         * Enhanced password toggle functionality
         */
        setupPasswordToggle() {
            document.querySelectorAll('[id="togglePassword"]').forEach(toggle => {
                const passwordInput = toggle.previousElementSibling || toggle.parentElement.querySelector('input[type="password"], input[type="text"]');
                
                toggle.addEventListener('click', () => {
                    const icon = toggle.querySelector('i');
                    
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        icon.className = 'fas fa-eye-slash';
                        toggle.setAttribute('aria-pressed', 'true');
                    } else {
                        passwordInput.type = 'password';
                        icon.className = 'fas fa-eye';
                        toggle.setAttribute('aria-pressed', 'false');
                    }
                    
                    // Animate the icon change
                    icon.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        icon.style.transform = 'scale(1)';
                    }, 200);
                });
            });
        }

        /**
         * Setup parallax scrolling effects
         */
        setupParallaxScroll() {
            if (window.innerWidth > 768) { // Only on desktop
                window.addEventListener('scroll', () => {
                    const scrolled = window.pageYOffset;
                    const parallaxElements = document.querySelectorAll('.parallax');
                    
                    parallaxElements.forEach(element => {
                        const rate = scrolled * -0.5;
                        element.style.transform = `translateY(${rate}px)`;
                    });
                });
            }
        }

        /**
         * Setup dark mode theme switcher
         */
        setupThemeSwitcher() {
            const themeToggle = document.getElementById('themeToggle');
            const currentTheme = localStorage.getItem('theme') || 'light';
            
            // Initial theme setup
            document.documentElement.setAttribute('data-theme', currentTheme);
            
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    
                    // Animate theme transition
                    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
                    document.documentElement.setAttribute('data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);
                    
                    // Update toggle icon
                    const icon = themeToggle.querySelector('i');
                    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                    
                    setTimeout(() => {
                        document.documentElement.style.transition = '';
                    }, 300);
                });
            }
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                }
            });
        }

        /**
         * Enhanced loading states
         */
        setupLoadingStates() {
            // Skeleton loading for cards
            this.setupSkeletonLoading();
            
            // Progress indicators
            this.setupProgressIndicators();
        }

        /**
         * Setup skeleton loading animations
         */
        setupSkeletonLoading() {
            const skeletonElements = document.querySelectorAll('.skeleton');
            
            skeletonElements.forEach(skeleton => {
                // Shimmer effect
                skeleton.addEventListener('animationstart', () => {
                    skeleton.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
                    skeleton.style.backgroundSize = '200% 100%';
                    skeleton.style.animation = 'shimmer 1.5s infinite';
                });
            });
        }

        /**
         * Setup progress indicators
         */
        setupProgressIndicators() {
            // Page load progress
            this.showPageProgress();
            
            // Form submission progress
            this.setupFormProgress();
        }

        /**
         * Show page loading progress
         */
        showPageProgress() {
            let progress = 0;
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                z-index: 9999;
                transition: width 0.3s ease;
            `;
            
            document.body.appendChild(progressBar);
            
            const updateProgress = () => {
                progress += Math.random() * 10;
                if (progress < 90) {
                    progressBar.style.width = `${progress}%`;
                    setTimeout(updateProgress, 100);
                } else {
                    progressBar.style.width = '100%';
                    setTimeout(() => {
                        progressBar.remove();
                    }, 500);
                }
            };
            
            updateProgress();
        }

        /**
         * Setup form submission progress
         */
        setupFormProgress() {
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', (e) => {
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn && !submitBtn.dataset.processing) {
                        submitBtn.dataset.processing = 'true';
                        submitBtn.style.position = 'relative';
                        submitBtn.style.overflow = 'hidden';
                        
                        // Create loading overlay
                        const overlay = document.createElement('div');
                        overlay.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: -100%;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                            animation: shimmer 1s ease-in-out;
                        `;
                        
                        submitBtn.appendChild(overlay);
                        
                        // Update button text
                        const originalText = submitBtn.innerHTML;
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang xử lý...';
                        
                        // Hide button text during processing
                        submitBtn.style.color = 'transparent';
                        
                        setTimeout(() => {
                            submitBtn.style.color = '';
                        }, 100);
                    }
                });
            });
        }

        /**
         * Setup toast notification system
         */
        setupToastNotifications() {
            this.toastContainer = document.createElement('div');
            this.toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1060;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(this.toastContainer);
        }

        /**
         * Show toast notification
         */
        showToast(message, type = 'success', duration = 3000) {
            const toast = document.createElement('div');
            const iconMap = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-triangle',
                warning: 'fas fa-exclamation-triangle',
                info: 'fas fa-info-circle'
            };
            
            const colorMap = {
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            };
            
            toast.innerHTML = `
                <div style="
                    background: white;
                    border-left: 4px solid ${colorMap[type]};
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 300px;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                ">
                    <i class="${iconMap[type]}" style="color: ${colorMap[type]}; font-size: 20px;"></i>
                    <span style="flex: 1; color: #374151; font-weight: 500;">${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: none;
                        border: none;
                        color: #9ca3af;
                        cursor: pointer;
                        padding: 4px;
                    ">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            this.toastContainer.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
                toast.querySelector('div').style.transform = 'translateX(0)';
            }, 100);
            
            // Auto remove
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.querySelector('div').style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        toast.remove();
                    }, 300);
                }
            }, duration);
        }

        /**
         * Setup micro-interactions
         */
        setupMicroInteractions() {
            // Enhanced hover effects for interactive elements
            this.setupMicroHoverEffects();
            
            // Sound feedback (optional)
            this.setupAudioFeedback();
            
            // Haptic feedback for mobile
            this.setupHapticFeedback();
        }

        /**
         * Setup micro hover effects
         */
        setupMicroHoverEffects() {
            // Enhanced link hover effects
            document.querySelectorAll('a').forEach(link => {
                link.addEventListener('mouseenter', () => {
                    link.style.transform = 'scale(1.02)';
                });
                
                link.addEventListener('mouseleave', () => {
                    link.style.transform = 'scale(1)';
                });
            });

            // Icon hover effects
            document.querySelectorAll('.fas, .far, .fab').forEach(icon => {
                icon.addEventListener('mouseenter', () => {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                });
                
                icon.addEventListener('mouseleave', () => {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                });
            });
        }

        /**
         * Setup audio feedback (optional)
         */
        setupAudioFeedback() {
            // Only enable if user hasn't disabled it
            const audioEnabled = localStorage.getItem('audioEnabled') !== 'false';
            
            if (audioEnabled && 'AudioContext' in window) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                document.addEventListener('click', (e) => {
                    if (e.target.matches('button, .btn, [role="button"]')) {
                        this.playClickSound();
                    }
                });
            }
        }

        /**
         * Play subtle click sound
         */
        playClickSound() {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        }

        /**
         * Setup haptic feedback for mobile devices
         */
        setupHapticFeedback() {
            if ('vibrate' in navigator) {
                document.addEventListener('click', (e) => {
                    if (e.target.matches('button, .btn, [role="button"]')) {
                        navigator.vibrate(10); // Very subtle vibration
                    }
                });
            }
        }

        /**
         * Utility method to add animation-ready class
         */
        animateElements(selector, animation = 'fadeIn') {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('animate-ready');
                el.style.animationDelay = `${index * 100}ms`;
            });
        }

        /**
         * Utility method to show loading overlay
         */
        showLoadingOverlay(message = 'Đang tải...') {
            const overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            `;
            
            overlay.innerHTML = `
                <div style="text-align: center; color: white;">
                    <div class="spinner" style="width: 60px; height: 60px; margin-bottom: 20px;"></div>
                    <p style="font-size: 18px; font-weight: 500;">${message}</p>
                </div>
            `;
            
            document.body.style.overflow = 'hidden';
            document.body.appendChild(overlay);
            
            return overlay;
        }

        /**
         * Hide loading overlay
         */
        hideLoadingOverlay() {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.remove();
                document.body.style.overflow = '';
            }
        }

        /**
         * Enhanced form validation with real-time feedback
         */
        validateForm(form) {
            let isValid = true;
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    isValid = false;
                    this.animateFieldError(input);
                } else {
                    this.animateFieldSuccess(input);
                }
            });
            
            if (!isValid) {
                this.showToast('Vui lòng kiểm tra lại thông tin nhập vào', 'error');
            }
            
            return isValid;
        }

        /**
         * Animate field error state
         */
        animateFieldError(field) {
            field.style.borderColor = '#ef4444';
            field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            field.style.transform = 'shake(0.5s)';
            
            setTimeout(() => {
                field.style.transform = '';
            }, 500);
        }

        /**
         * Animate field success state
         */
        animateFieldSuccess(field) {
            field.style.borderColor = '#10b981';
            field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        }
    }

    // CSS Animation Styles Injection
    const animationStyles = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        @keyframes shake {
            0%, 20%, 40%, 60%, 80% { transform: translateX(-2px); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(2px); }
        }
        
        .animate-ready {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .animate-ready.animate-fadeIn {
            opacity: 1;
            transform: translateY(0);
        }
        
        .toast-slide-in {
            animation: slideInRight 0.3s ease;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .focused label {
            color: #667eea;
            transform: translateY(-2px);
            font-weight: 600;
        }
        
        .form-input:focus + .floating-label {
            transform: translateY(-100%) scale(0.85);
            color: #667eea;
        }
        
        .floating-label {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            transition: all 0.3s ease;
            pointer-events: none;
            background: white;
            padding: 0 4px;
        }
    `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);

    // Public API
    window.UI = {
        showToast: (message, type, duration) => new UIEnhancements().showToast(message, type, duration),
        showLoading: (message) => new UIEnhancements().showLoadingOverlay(message),
        hideLoading: () => new UIEnhancements().hideLoadingOverlay(),
        validateForm: (form) => new UIEnhancements().validateForm(form),
        animateElements: (selector, animation) => new UIEnhancements().animateElements(selector, animation)
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new UIEnhancements());
    } else {
        new UIEnhancements();
    }
