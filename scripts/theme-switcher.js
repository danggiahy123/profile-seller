/**
 * Advanced Theme Switcher for Profile Seller
 * Supports dark/light modes, custom themes, and system preferences
 */

class ThemeSwitcher {
    constructor() {
        this.themes = {
            light: {
                name: 'Light Mode',
                icon: 'fas fa-moon',
                variables: {
                    '--bg-primary': '#ffffff',
                    '--bg-secondary': '#f9fafb',
                    '--bg-tertiary': '#f3f4f6',
                    '--text-primary': '#111827',
                    '--text-secondary': '#374151',
                    '--text-tertiary': '#6b7280',
                    '--border-primary': '#e5e7eb',
                    '--border-secondary': '#d1d5db',
                    '--shadow-primary': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    '--shadow-elevated': '0 10px 25px rgba(0, 0, 0, 0.15)'
                }
            },
            dark: {
                name: 'Dark Mode',
                icon: 'fas fa-sun',
                variables: {
                    '--bg-primary': '#111827',
                    '--bg-secondary': '#1f2937',
                    '--bg-tertiary': '#374151',
                    '--text-primary': '#f9fafb',
                    '--text-secondary': '#e5e7eb',
                    '--text-tertiary': '#9ca3af',
                    '--border-primary': '#374151',
                    '--border-secondary': '#4b5563',
                    '--shadow-primary': '0 1px 3px 0 rgb(0 0 0 / 0.3)',
                    '--shadow-elevated': '0 10px 25px rgba(0, 0, 0, 0.5)'
                }
            },
            blue: {
                name: 'Blue Theme',
                icon: 'fas fa-palette',
                variables: {
                    '--bg-primary': '#f0f9ff',
                    '--bg-secondary': '#e0f2fe',
                    '--bg-tertiary': '#bae6fd',
                    '--text-primary': '#0c4a6e',
                    '--text-secondary': '#0369a1',
                    '--text-tertiary': '#0284c7',
                    '--border-primary': '#93c5fd',
                    '--border-secondary': '#60a5fa',
                    '--shadow-primary': '0 1px 3px 0 rgb(59 130 246 / 0.2)',
                    '--shadow-elevated': '0 10px 25px rgba(59, 130, 246, 0.15)'
                }
            },
            green: {
                name: 'Green Theme',
                icon: 'fas fa-leaf',
                variables: {
                    '--bg-primary': '#f0fdf4',
                    '--bg-secondary': '#dcfce7',
                    '--bg-tertiary': '#bbf7d0',
                    '--text-primary': '#14532d',
                    '--text-secondary': '#166534',
                    '--text-tertiary': '#16a34a',
                    '--border-primary': '#86efac',
                    '--border-secondary': '#4ade80',
                    '--shadow-primary': '0 1px 3px 0 rgb(34 197 94 / 0.2)',
                    '--shadow-elevated': '0 10px 25px rgba(34, 197, 94, 0.15)'
                }
            }
        };

        this.currentTheme = localStorage.getItem('theme') || this.detectSystemTheme();
        this.savedCustomThemes = this.loadCustomThemes();
        this.init();
    }

    init() {
        this.createThemeToggle();
        this.createThemeDropdown();
        this.applyTheme(this.currentTheme);
        this.listenForSystemThemeChanges();
        this.setupThemeTransitions();
        this.createCustomThemeBuilder();
    }

    /**
     * Detect system theme preference
     */
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Create theme toggle button
     */
    createThemeToggle() {
        // Find or create theme toggle container
        let toggleContainer = document.getElementById('themeToggleContainer');
        if (!toggleContainer) {
            toggleContainer = document.createElement('div');
            toggleContainer.id = 'themeToggleContainer';
            toggleContainer.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1000;
                display: flex;
                gap: 10px;
                align-items: center;
            `;
            document.body.appendChild(toggleContainer);
        }

        // Create main toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'themeToggle';
        toggleBtn.className = 'theme-toggle';
        toggleBtn.innerHTML = `<i class="${this.themes[this.currentTheme].icon}"></i>`;
        toggleBtn.style.cssText = `
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: var(--bg-secondary, #f9fafb);
            color: var(--text-primary, #111827);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-primary, 0 4px 12px rgba(0, 0, 0, 0.15));
            position: relative;
            overflow: hidden;
        `;

        // Add hover effects
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'translateY(-2px) scale(1.05)';
            toggleBtn.style.boxShadow = 'var(--shadow-elevated, 0 8px 25px rgba(0, 0, 0, 0.2))';
        });

        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'translateY(0) scale(1)';
            toggleBtn.style.boxShadow = 'var(--shadow-primary, 0 4px 12px rgba(0, 0, 0, 0.15))';
        });

        // Theme cycle functionality
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.cycleTheme();
            this.animateToggle(toggleBtn);
        });

        toggleContainer.appendChild(toggleBtn);

        // Create theme dropdown toggle
        const dropdownBtn = document.createElement('button');
        dropdownBtn.id = 'themeDropdownToggle';
        dropdownBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        dropdownBtn.style.cssText = `
            width: 35px;
            height: 35px;
            border-radius: 8px;
            border: none;
            background: var(--bg-tertiary, #f3f4f6);
            color: var(--text-secondary, #374151);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 14px;
        `;

        dropdownBtn.addEventListener('click', () => {
            this.toggleDropdown();
        });

        toggleContainer.appendChild(dropdownBtn);
    }

    /**
     * Cycle through available themes
     */
    cycleTheme() {
        const themeOrder = ['light', 'dark', 'blue', 'green'];
        const currentIndex = themeOrder.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeOrder.length;
        this.currentTheme = themeOrder[nextIndex];
        
        this.applyTheme(this.currentTheme);
        this.updateToggleIcon();
        localStorage.setItem('theme', this.currentTheme);
        
        // Show notification
        this.showThemeNotification(this.themes[this.currentTheme].name);
    }

    /**
     * Animate toggle button
     */
    animateToggle(button) {
        const icon = button.querySelector('i');
        
        // Spin animation
        icon.style.transform = 'rotate(360deg)';
        icon.style.transition = 'transform 0.6s ease';
        
        setTimeout(() => {
            icon.style.transform = 'rotate(0deg)';
            setTimeout(() => {
                icon.style.transition = '';
            }, 600);
        }, 300);
    }

    /**
     * Update toggle button icon
     */
    updateToggleIcon() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            icon.className = this.themes[this.currentTheme].icon;
        }
    }

    /**
     * Create theme dropdown menu
     */
    createThemeDropdown() {
        const dropdown = document.createElement('div');
        dropdown.id = 'themeDropdown';
        dropdown.style.cssText = `
            position: fixed;
            top: 85px;
            left: 20px;
            background: var(--bg-primary, #ffffff);
            border: 1px solid var(--border-primary, #e5e7eb);
            border-radius: 12px;
            box-shadow: var(--shadow-elevated, 0 10px 25px rgba(0, 0, 0, 0.15));
            padding: 10px;
            min-width: 200px;
            transform: translateY(-10px) scale(0.95);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        `;

        // Add theme options
        Object.keys(this.themes).forEach(key => {
            const option = this.createThemeOption(key, this.themes[key]);
            dropdown.appendChild(option);
        });

        // Add custom themes section
        if (Object.keys(this.savedCustomThemes).length > 0) {
            const separator = document.createElement('div');
            separator.style.cssText = `
                height: 1px;
                background: var(--border-primary, #e5e7eb);
                margin: 10px 0;
            `;
            dropdown.appendChild(separator);

            const customLabel = document.createElement('div');
            customLabel.textContent = 'Custom Themes';
            customLabel.style.cssText = `
                font-size: 12px;
                font-weight: 600;
                color: var(--text-tertiary, #6b7280);
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            `;
            dropdown.appendChild(customLabel);

            Object.keys(this.savedCustomThemes).forEach(key => {
                const option = this.createThemeOption(key, this.savedCustomThemes[key], true);
                dropdown.appendChild(option);
            });
        }

        document.body.appendChild(dropdown);
    }

    /**
     * Create theme option element
     */
    createThemeOption(key, theme, isCustom = false) {
        const option = document.createElement('div');
        option.className = 'theme-option';
        option.style.cssText = `
            display: flex;
            align-items: center;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        `;

        option.innerHTML = `
            <i class="${theme.icon}" style="margin-right: 10px; width: 16px; color: var(--text-secondary, #374151);"></i>
            <span style="flex: 1; color: var(--text-primary, #111827);">${theme.name}</span>
            ${this.currentTheme === key ? '<i class="fas fa-check" style="color: var(--primary-color, #667eea);"></i>' : ''}
            ${isCustom ? '<button class="delete-custom-theme" style="background: none; border: none; color: var(--error-color, #ef4444); margin-left: 8px; cursor: pointer; opacity: 0.7;"><i class="fas fa-trash"></i></button>' : ''}
        `;

        // Add active state styling
        if (this.currentTheme === key) {
            option.style.background = 'var(--bg-tertiary, #f3f4f6)';
        }

        // Hover effects
        option.addEventListener('mouseenter', () => {
            if (this.currentTheme !== key) {
                option.style.background = 'var(--bg-secondary, #f9fafb)';
            }
        });

        option.addEventListener('mouseleave', () => {
            if (this.currentTheme !== key) {
                option.style.background = 'transparent';
            }
        });

        // Click handler
        option.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-custom-theme')) {
                this.currentTheme = key;
                this.applyTheme(key, isCustom ? this.savedCustomThemes : this.themes);
                this.updateToggleIcon();
                this.updateDropdownSelection();
                localStorage.setItem('theme', key);
                this.toggleDropdown();
                this.showThemeNotification(theme.name);
            }
        });

        // Delete custom theme handler
        const deleteBtn = option.querySelector('.delete-custom-theme');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteCustomTheme(key);
            });
        }

        return option;
    }

    /**
     * Toggle dropdown visibility
     */
    toggleDropdown() {
        const dropdown = document.getElementById('themeDropdown');
        const dropdownToggle = document.getElementById('themeDropdownToggle');
        
        if (!dropdown || !dropdownToggle) return;

        const isVisible = dropdown.style.visibility === 'visible';
        
        if (isVisible) {
            dropdown.style.transform = 'translateY(-10px) scale(0.95)';
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdownToggle.style.transform = 'rotate(0deg)';
        } else {
            dropdown.style.transform = 'translateY(0) scale(1)';
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
            dropdownToggle.style.transform = 'rotate(180deg)';
        }
    }

    /**
     * Update dropdown selection
     */
    updateDropdownSelection() {
        const options = document.querySelectorAll('.theme-option');
        options.forEach(option => {
            const checkIcon = option.querySelector('.fas.fa-check');
            if (checkIcon) {
                checkIcon.remove();
            }
            option.style.background = 'transparent';
        });

        // Find and update current selection
        options.forEach((option, index) => {
            const themeKey = Object.keys(this.themes)[index] || Object.keys(this.savedCustomThemes)[index - Object.keys(this.themes).length];
            if (themeKey === this.currentTheme) {
                const span = option.querySelector('span');
                if (span) {
                    const check = document.createElement('i');
                    check.className = 'fas fa-check';
                    check.style.color = 'var(--primary-color, #667eea)';
                    span.parentElement.appendChild(check);
                }
                option.style.background = 'var(--bg-tertiary, #f3f4f6)';
            }
        });
    }

    /**
     * Apply theme to document
     */
    applyTheme(themeName, options = null) {
        const themeSet = options || this.themes;
        const theme = themeSet[themeName];
        
        if (!theme) return;

        // Apply CSS variables
        const root = document.documentElement;
        
        Object.keys(theme.variables).forEach(variable => {
            root.style.setProperty(variable, theme.variables[variable]);
        });

        // Update document class for easier styling
        document.documentElement.className = `${themeName}-theme`;
        
        // Store current theme
        this.currentTheme = themeName;
        
        // Trigger theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName, themeData: theme }
        }));
    }

    /**
     * Show theme change notification
     */
    showThemeNotification(themeName) {
        // Use existing toast system if available
        if (window.UI && window.UI.showToast) {
            window.UI.showToast(`Switched to ${themeName}`, 'success', 2000);
            return;
        }

        // Create simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-primary, #ffffff);
            color: var(--text-primary, #111827);
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: var(--shadow-elevated, 0 10px 25px rgba(0, 0, 0, 0.15));
            z-index: 10000;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        notification.textContent = `${themeName} activated`;

        document.body.appendChild(notification);

        // Show animation
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);

        // Hide after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    /**
     * Setup theme transitions
     */
    setupThemeTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            }
            
            .theme-toggle i {
                transition: transform 0.6s ease;
            }
            
            .theme-option {
                transition: background-color 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Listen for system theme changes
     */
    listenForSystemThemeChanges() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a theme
                if (!localStorage.getItem('theme')) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.currentTheme = newTheme;
                    this.applyTheme(newTheme);
                    this.updateToggleIcon();
                    this.updateDropdownSelection();
                }
            });
        }
    }

    /**
     * Create custom theme builder
     */
    createCustomThemeBuilder() {
        // Add button to dropdown for custom theme creation
        const dropdown = document.getElementById('themeDropdown');
        if (!dropdown) return;

        const builderBtn = document.createElement('div');
        builderBtn.innerHTML = `
            <div style="display: flex; align-items: center; padding: 8px 12px; border-radius: 8px; cursor: pointer; opacity: 0.7; border-top: 1px solid var(--border-primary, #e5e7eb); margin-top: 5px;">
                <i class="fas fa-plus" style="margin-right: 10px; width: 16px; color: var(--text-secondary, #374151);"></i>
                <span style="flex: 1; color: var(--text-primary, #111827);">Create Custom Theme</span>
            </div>
        `;

        builderBtn.addEventListener('click', () => {
            this.openCustomThemeBuilder();
        });

        dropdown.appendChild(builderBtn);
    }

    /**
     * Open custom theme builder popup
     */
    openCustomThemeBuilder() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

        modal.innerHTML = `
            <div style="background: var(--bg-primary, #ffffff); border-radius: 16px; padding: 24px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: var(--text-primary, #111827);">Create Custom Theme</h3>
                    <button class="close-builder" style="background: none; border: none; color: var(--text-secondary, #374151); cursor: pointer; font-size: 20px;">&times;</button>
                </div>
                
                <div style="space-y: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary, #374151); font-weight: 500;">Theme Name</label>
                        <input type="text" id="customThemeName" placeholder="My Custom Theme" style="width: 100%; padding: 12px; border: 1px solid var(--border-primary, #e5e7eb); border-radius: 8px; background: var(--bg-secondary, #f9fafb); color: var(--text-primary, #111827);">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary, #374151); font-weight: 500;">Primary Background</label>
                        <input type="color" id="customBgPrimary" style="width: 60px; height: 40px; border: none; border-radius: 8px; cursor: pointer;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary, #374151); font-weight: 500;">Secondary Background</label>
                        <input type="color" id="customBgSecondary" style="width: 60px; height: 40px; border: none; border-radius: 8px; cursor: pointer;">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary, #374151); font-weight: 500;">Text Color</label>
                        <input type="color" id="customTextPrimary" style="width: 60px; height: 40px; border: none; border-radius: 8px; cursor: pointer;">
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <button id="saveCustomTheme" style="background: var(--primary-color, #667eea); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500; margin-right: 10px;">Save Theme</button>
                        <button id="previewCustomTheme" style="background: var(--bg-tertiary, #f3f4f6); color: var(--text-primary, #111827); border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500;">Preview</button>
                    </div>
                </div>
            </div>
        `;

        // Close handlers
        modal.querySelector('.close-builder').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);

        // Set default values
        const defaults = {
            customThemeName: 'Theme Name',
            customBgPrimary: '#ffffff',
            customBgSecondary: '#f9fafb',
            customTextPrimary: '#111827'
        };

        Object.keys(defaults).forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = defaults[id];
            }
        });
    }

    /**
     * Save custom theme
     */
    saveCustomTheme(name, colors) {
        const themeKey = name.toLowerCase().replace(/\s+/g, '_');
        
        this.savedCustomThemes[themeKey] = {
            name: name,
            icon: 'fas fa-palette',
            variables: {
                '--bg-primary': colors.primary,
                '--bg-secondary': colors.secondary,
                '--text-primary': colors.text,
                '--text-secondary': colors.text,
                '--text-tertiary': colors.text,
                '--border-primary': colors.border,
                '--border-secondary': colors.border,
                '--shadow-primary': colors.shadow,
                '--shadow-elevated': colors.shadow
            }
        };

        localStorage.setItem('customThemes', JSON.stringify(this.savedCustomThemes));
        
        // Refresh dropdown
        this.refreshDropdown();
        
        // Apply new theme
        this.currentTheme = themeKey;
        this.applyTheme(themeKey, this.savedCustomThemes);
    }

    /**
     * Load custom themes from localStorage
     */
    loadCustomThemes() {
        try {
            return JSON.parse(localStorage.getItem('customThemes') || '{}');
        } catch {
            return {};
        }
    }

    /**
     * Refresh theme dropdown
     */
    refreshDropdown() {
        const dropdown = document.getElementById('themeDropdown');
        if (dropdown) {
            dropdown.remove();
        }
        this.savedCustomThemes = this.loadCustomThemes();
        this.createThemeDropdown();
    }

    /**
     * Delete custom theme
     */
    deleteCustomTheme(themeKey) {
        delete this.savedCustomThemes[themeKey];
        localStorage.setItem('customThemes', JSON.stringify(this.savedCustomThemes));
        this.refreshDropdown();
        
        // If deleted theme was active, switch to light theme
        if (this.currentTheme === themeKey) {
            this.currentTheme = 'light';
            this.applyTheme('light');
            this.updateToggleIcon();
        }
    }

    /**
     * Public API
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(themeName) {
        if (this.themes[themeName] || this.savedCustomThemes[themeName]) {
            this.currentTheme = themeName;
            this.applyTheme(themeName);
            this.updateToggleIcon();
            localStorage.setItem('theme', themeName);
        }
    }

    getAvailableThemes() {
        return {
            builtIn: Object.keys(this.themes),
            custom: Object.keys(this.savedCustomThemes)
        };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ThemeSwitcher());
} else {
    new ThemeSwitcher();
}

// Export for external use
window.ThemeSwitcher = ThemeSwitcher;
