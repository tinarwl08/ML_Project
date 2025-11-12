// Valid credentials for demo purposes
const validCredentials = [
    { username: "demo", password: "demo123" },
    { username: "farmer@krushi.com", password: "password123" },
    { username: "test@example.com", password: "test123" },
    { username: "9876543210", password: "mobile123" },
    { username: "admin", password: "admin123" }
];

// DOM elements
let loginForm, demoBtn, loginButton, alertMessage, loginTab, registerTab, welcomeText;
let usernameInput, passwordInput;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    attachEventListeners();
    showWelcomeMessage();
});

// Initialize all DOM elements
function initializeElements() {
    loginForm = document.getElementById('loginForm');
    demoBtn = document.getElementById('demoLogin');
    loginButton = document.getElementById('loginButton');
    alertMessage = document.getElementById('alertMessage');
    loginTab = document.getElementById('loginTab');
    registerTab = document.getElementById('registerTab');
    welcomeText = document.querySelector('.welcome-text');
    usernameInput = document.getElementById('username');
    passwordInput = document.getElementById('password');
}

// Attach all event listeners
function attachEventListeners() {
    // Tab switching
    loginTab.addEventListener('click', switchToLogin);
    registerTab.addEventListener('click', switchToRegister);
    
    // Form submission
    loginForm.addEventListener('submit', handleFormSubmit);
    
    // Demo login
    demoBtn.addEventListener('click', handleDemoLogin);
    
    // Input focus effects
    attachInputFocusEffects();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Tab switching functions
function switchToLogin() {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    welcomeText.textContent = 'Welcome Back';
    loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Login</span>';
    hideAlert();
    clearForm();
}

function switchToRegister() {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    welcomeText.textContent = 'Create Account';
    loginButton.innerHTML = '<i class="fas fa-user-plus"></i> <span>Register</span>';
    hideAlert();
    clearForm();
}

// Alert functions
function showAlert(message, type) {
    alertMessage.textContent = message;
    alertMessage.className = `alert ${type}`;
    alertMessage.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(hideAlert, 5000);
    
    // Scroll alert into view if needed
    alertMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideAlert() {
    if (alertMessage) {
        alertMessage.style.display = 'none';
    }
}

// Loading state management
function setLoading(isLoading) {
    const buttons = [loginButton, demoBtn];
    
    buttons.forEach(btn => {
        if (btn) {
            btn.disabled = isLoading;
            if (isLoading) {
                btn.classList.add('loading');
            } else {
                btn.classList.remove('loading');
            }
        }
    });
    
    // Disable form inputs during loading
    if (usernameInput && passwordInput) {
        usernameInput.disabled = isLoading;
        passwordInput.disabled = isLoading;
    }
}

// Authentication function
function authenticateUser(username, password) {
    return validCredentials.some(cred => 
        cred.username === username && cred.password === password
    );
}

// Form validation
function validateForm(username, password) {
    const errors = [];
    
    if (!username.trim()) {
        errors.push('Username/Email is required');
    }
    
    if (!password) {
        errors.push('Password is required');
    }
    
    if (password && password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    
    // Email validation if it looks like an email
    if (username.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            errors.push('Please enter a valid email address');
        }
    }
    
    // Phone validation if it looks like a phone number
    if (/^\d+$/.test(username) && username.length !== 10) {
        errors.push('Phone number must be 10 digits');
    }
    
    return errors;
}

// Main form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const isRegisterMode = registerTab.classList.contains('active');
    
    // Validate form
    const errors = validateForm(username, password);
    if (errors.length > 0) {
        showAlert(errors.join('. '), 'error');
        return;
    }
    
    setLoading(true);
    hideAlert();
    
    // Simulate API call delay
    setTimeout(() => {
        if (isRegisterMode) {
            handleRegistration(username, password);
        } else {
            handleLogin(username, password);
        }
    }, 1500);
}

// Handle login process
function handleLogin(username, password) {
    if (authenticateUser(username, password)) {
        showAlert('Login successful! Redirecting to dashboard...', 'success');
        
        // Store user data (in a real app, this would be handled securely)
        storeUserData(username);
        
        // Redirect after success message
        setTimeout(() => {
            redirectToDashboard();
        }, 2000);
    } else {
        showAlert('Invalid credentials! Try: demo/demo123 or farmer@krushi.com/password123', 'error');
        
        // Shake animation for invalid login
        loginForm.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginForm.style.animation = '';
        }, 500);
    }
    
    setLoading(false);
}

// Handle registration process
function handleRegistration(username, password) {
    // Simulate registration success
    showAlert('Account created successfully! You can now login.', 'success');
    
    // Switch to login tab and prefill username
    setTimeout(() => {
        switchToLogin();
        usernameInput.value = username;
        passwordInput.value = '';
        passwordInput.focus();
    }, 1000);
    
    setLoading(false);
}

// Demo login handler
function handleDemoLogin() {
    setLoading(true);
    hideAlert();
    
    setTimeout(() => {
        showAlert('Demo mode activated! Welcome to KrushiVishwa!', 'success');
        
        // Fill demo credentials
        usernameInput.value = 'demo';
        passwordInput.value = 'demo123';
        
        // Store demo user data
        storeUserData('Demo User');
        
        setTimeout(() => {
            redirectToDashboard();
        }, 2000);
        
        setLoading(false);
    }, 1000);
}

// Store user data in localStorage
function storeUserData(username) {
    // Store authentication data
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('loginTime', new Date().toISOString());
    
    if (username === 'Demo User') {
        localStorage.setItem('isDemo', 'true');
    }
    
    console.log('User data stored in localStorage:', {
        username: username,
        loginTime: localStorage.getItem('loginTime'),
        isDemo: localStorage.getItem('isDemo') === 'true'
    });
}

// Redirect to dashboard (actual redirect)
function redirectToDashboard() {
    showAlert('Redirecting to KrushiVishwa Dashboard...', 'success');
    
    setTimeout(() => {
        // Redirect to the main index page
        window.location.href = '/dashboard';
    }, 1500);
}

// Input focus effects
function attachInputFocusEffects() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
        
        // Real-time validation feedback
        input.addEventListener('input', () => {
            clearTimeout(input.validationTimeout);
            input.validationTimeout = setTimeout(() => {
                validateInputRealTime(input);
            }, 500);
        });
    });
}

// Real-time input validation
function validateInputRealTime(input) {
    const value = input.value.trim();
    const inputGroup = input.parentElement;
    
    // Remove existing validation classes
    inputGroup.classList.remove('valid', 'invalid');
    
    if (value.length > 0) {
        if (input.type === 'email' || input.id === 'username') {
            // Email or username validation
            if (value.includes('@')) {
                const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                inputGroup.classList.add(isValidEmail ? 'valid' : 'invalid');
            } else if (/^\d+$/.test(value)) {
                // Phone number validation
                const isValidPhone = value.length === 10;
                inputGroup.classList.add(isValidPhone ? 'valid' : 'invalid');
            } else {
                // Username validation
                inputGroup.classList.add(value.length >= 3 ? 'valid' : 'invalid');
            }
        } else if (input.type === 'password') {
            // Password validation
            const isValidPassword = value.length >= 6;
            inputGroup.classList.add(isValidPassword ? 'valid' : 'invalid');
        }
    }
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Alt + D for demo login
    if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDemoLogin();
    }
    
    // Alt + R for register tab
    if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        switchToRegister();
    }
    
    // Alt + L for login tab
    if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        switchToLogin();
    }
}

// Utility functions
function clearForm() {
    if (usernameInput && passwordInput) {
        usernameInput.value = '';
        passwordInput.value = '';
    }
}

function showWelcomeMessage() {
    setTimeout(() => {
        showAlert('Welcome to KrushiVishwa! Use demo/demo123 or try Demo Mode (Alt+D)', 'success');
    }, 500);
}

// Add shake animation CSS
const shakeStyles = `
@keyframes shake {
    0%, 20%, 40%, 60%, 80%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
}
`;

// Inject shake animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = shakeStyles;
document.head.appendChild(styleSheet);

// Add validation styles
const validationStyles = `
.input-group.valid input {
    border-color: #4caf50;
    background-color: #f8fff8;
}

.input-group.invalid input {
    border-color: #f44336;
    background-color: #fff8f8;
}

.input-group.valid .icon {
    color: #4caf50;
}

.input-group.invalid .icon {
    color: #f44336;
}
`;

const validationStyleSheet = document.createElement('style');
validationStyleSheet.textContent = validationStyles;
document.head.appendChild(validationStyleSheet);

// Export functions for potential external use
window.KrushiVishwaLogin = {
    switchToLogin,
    switchToRegister,
    handleDemoLogin,
    showAlert,
    hideAlert
};

// Log initialization
console.log('KrushiVishwa Login System Initialized');
console.log('Available demo credentials:', validCredentials.map(cred => `${cred.username}/${cred.password}`));
console.log('Keyboard shortcuts: Alt+D (Demo), Alt+L (Login), Alt+R (Register)');