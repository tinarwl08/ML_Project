// js/main.js

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    checkAuthenticationStatus();
    setupUserInterface();
    attachEventListeners();
    loadDefaultPage();
    initializeChatbot();
}

// Check if user is logged in
function checkAuthenticationStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    
    if (isLoggedIn !== 'true' || !username) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    console.log('User authenticated:', username);
}

// Setup user interface elements
function setupUserInterface() {
    displayUsername();
    highlightActiveNavItem();
    setupChatbotBadge();
}

// Display username in navbar
function displayUsername() {
    const username = localStorage.getItem('username');
    const navUsernameElement = document.getElementById('nav-username');
    
    if (navUsernameElement && username) {
        // Format username for display
        let displayName = username;
        
        if (username === 'Demo User') {
            displayName = 'Demo User';
        } else if (username === 'demo') {
            displayName = 'Demo';
        } else if (username.includes('@')) {
            // Extract name from email
            displayName = username.split('@')[0];
            displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        } else if (/^\d+$/.test(username)) {
            // Format phone number
            displayName = 'User';
        }
        
        navUsernameElement.textContent = displayName;
        
        // Add welcome tooltip
        navUsernameElement.title = `Welcome, ${displayName}!`;
    }
}

// Setup chatbot badge
function setupChatbotBadge() {
    document.getElementById('chatbotBtn').addEventListener('click', function() {
    window.location.href = "{{ url_for('chat_bot') }}";
});
}

// Attach all event listeners
function attachEventListeners() {
    setupLogoutButton();
    setupNavigationLinks();
    setupLanguageSelector();
    setupLogoClick();
    setupChatbotButton();
}

// Setup logout functionality
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
        
        // Add tooltip
        logoutBtn.title = 'Logout';
    }
}

// Handle logout process
function handleLogout() {
    // Show confirmation dialog
    const confirmLogout = confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
        // Clear all stored data
        localStorage.clear();
        
        // Add logout animation
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.3s ease';
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 300);
        
        console.log('User logged out successfully');
    }
}

// Setup navigation link functionality
function setupNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const mainIframe = document.querySelector('.main-iframe');
    
    if (!mainIframe) {
        console.error('Main iframe not found');
        return;
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const page = link.dataset.page;
            
            if (page) {
                loadPage(page, link);
            }
        });
        
        // Add hover effects
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });
}

// Load page in iframe
function loadPage(pageName, linkElement) {
    const mainIframe = document.querySelector('.main-iframe');
    
    if (!mainIframe) {
        console.error('Main iframe not found');
        return;
    }
    
    // Show loading state
    showLoadingState(true);
    
    // Update active navigation item
    updateActiveNavItem(linkElement);
    
    // Load the page
    mainIframe.src = pageName;
    
    // Handle iframe load event
    mainIframe.onload = () => {
        showLoadingState(false);
        console.log(`Loaded page: ${pageName}`);
    };
    
    // Handle iframe error
    mainIframe.onerror = () => {
        showLoadingState(false);
        showErrorMessage(`Failed to load ${pageName}`);
        
        // Fallback to dashboard
        if (pageName !== 'dashboard.html') {
            mainIframe.src = 'dashboard.html';
        }
    };
    
    // Store current page
    localStorage.setItem('currentPage', pageName);
}

// Update active navigation item
function updateActiveNavItem(activeLink) {
    // Remove active class from all links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        link.style.backgroundColor = '';
        link.style.color = '';
    });
    
    // Add active class to clicked link
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
        activeLink.style.color = '#4caf50';
        activeLink.style.borderRadius = '25px';
    }
}

// Highlight active navigation item on page load
function highlightActiveNavItem() {
    const currentPage = localStorage.getItem('currentPage') || 'dashboard.html';
    const currentLink = document.querySelector(`[data-page="${currentPage}"]`);
    
    if (currentLink) {
        updateActiveNavItem(currentLink);
    }
}

// Setup chatbot button functionality
function setupChatbotButton() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const closeChatbot = document.getElementById('closeChatbot');
    
    if (chatbotBtn && chatbotPanel) {
        chatbotBtn.addEventListener('click', toggleChatbot);
        closeChatbot.addEventListener('click', closeChatbotPanel);
        
        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            if (!chatbotPanel.contains(e.target) && !chatbotBtn.contains(e.target)) {
                if (chatbotPanel.style.display === 'flex') {
                    closeChatbotPanel();
                }
            }
        });
        
        // Add tooltip
        chatbotBtn.title = 'AI Assistant - Ask me anything about farming!';
    }
}

// Toggle chatbot panel
function toggleChatbot() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const badge = document.getElementById('chatbotBadge');
    
    if (chatbotPanel.style.display === 'flex') {
        closeChatbotPanel();
    } else {
        chatbotPanel.style.display = 'flex';
        chatbotBtn.classList.add('active');
        badge.style.display = 'none';
        localStorage.setItem('chatbotUnread', 'false');
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('chatbotInput').focus();
        }, 300);
    }
}

// Close chatbot panel
function closeChatbotPanel() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotPanel = document.getElementById('chatbotPanel');
    
    chatbotPanel.style.display = 'none';
    chatbotBtn.classList.remove('active');
}

// Initialize chatbot functionality
function initializeChatbot() {
    const sendBtn = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatbotInput');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', sendMessage);
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Auto-resize input
        chatInput.addEventListener('input', () => {
            if (chatInput.value.length > 0) {
                sendBtn.style.background = '#4caf50';
            } else {
                sendBtn.style.background = '#ccc';
            }
        });
    }
    
    // Quick action buttons
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleQuickAction(action);
        });
    });
}

// Handle quick actions
function handleQuickAction(action) {
    const messages = {
        weather: "What's the weather forecast for my area?",
        'crop-advice': "Can you give me advice for my current crop?",
        'market-price': "Show me current market prices for my crops"
    };
    
    const message = messages[action];
    if (message) {
        document.getElementById('chatbotInput').value = message;
        sendMessage();
    }
}

// Send message to chatbot
function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessageToChat('user', message);
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate bot response
    setTimeout(() => {
        hideTypingIndicator();
        const botResponse = generateBotResponse(message);
        addMessageToChat('bot', botResponse);
    }, Math.random() * 2000 + 1000); // Random delay 1-3 seconds
}

// Add message to chat
function addMessageToChat(sender, message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${message}</div>
            <div class="message-time">${currentTime}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Generate bot response
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Weather responses
    if (message.includes('weather')) {
        return "🌤️ Today's weather: Partly cloudy, 28°C with 60% humidity. Perfect conditions for watering your crops early morning. Rain expected in 2 days.";
    }
    
    // Crop advice responses
    if (message.includes('crop') || message.includes('plant') || message.includes('grow')) {
        return "🌱 For your wheat crop, I recommend: 1) Water early morning for better absorption 2) Check for pest infestation every 3 days 3) Apply nitrogen-rich fertilizer as it's in tillering stage. Need specific advice for another crop?";
    }
    
    // Market price responses
    if (message.includes('market') || message.includes('price')) {
        return "📈 Current market prices: Wheat: ₹2,150/quintal (+₹50), Rice: ₹1,890/quintal (-₹20), Corn: ₹1,675/quintal (+₹15). Wheat prices are trending upward - good time to sell!";
    }
    
    // Soil related responses
    if (message.includes('soil') || message.includes('fertilizer')) {
        return "🌾 For healthy soil: Maintain pH between 6-7, add organic matter regularly, test NPK levels monthly. Your soil analysis shows good nitrogen levels. Consider phosphorus supplementation for better yield.";
    }
    
    // Pest related responses
    if (message.includes('pest') || message.includes('insect') || message.includes('disease')) {
        return "🐛 Common pests this season: Aphids and stem borers. Use neem oil spray for organic control or consult your local agricultural extension officer for chemical options. Monitor daily during morning hours.";
    }
    
    // Irrigation responses
    if (message.includes('water') || message.includes('irrigation')) {
        return "💧 Irrigation tips: Water early morning (5-7 AM) for best absorption. Your crops need 2-3 inches per week. Check soil moisture 2 inches deep - if dry, it's time to water.";
    }
    
    // General farming responses
    if (message.includes('farming') || message.includes('agriculture')) {
        return "🚜 I'm here to help with all your farming needs! I can assist with crop management, weather updates, market prices, soil health, pest control, and irrigation advice. What specific area would you like to explore?";
    }
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "👋 Hello! I'm KrishiBot, your AI farming assistant. I can help you with crop advice, weather updates, market prices, and farming best practices. How can I assist you today?";
    }
    
    // Thank you responses
    if (message.includes('thank') || message.includes('thanks')) {
        return "🙏 You're welcome! I'm always here to help with your farming questions. Feel free to ask anything about crops, weather, markets, or farming techniques.";
    }
    
    // Default response
    return "🤖 I understand you're asking about farming. I can help with crop management, weather forecasts, market prices, soil health, pest control, and irrigation. Could you please be more specific about what you'd like to know?";
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.getElementById('chatbotTyping');
    if (typingDiv) {
        typingDiv.style.display = 'flex';
        
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight + 50;
    }
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingDiv = document.getElementById('chatbotTyping');
    if (typingDiv) {
        typingDiv.style.display = 'none';
    }
}

// Show/hide loading state
function showLoadingState(isLoading) {
    let loadingOverlay = document.getElementById('loadingOverlay');
    
    if (isLoading) {
        if (!loadingOverlay) {
            loadingOverlay = createLoadingOverlay();
            document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.style.display = 'flex';
    } else {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

// Create loading overlay
function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(2px);
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 4px solid #e0e0e0;
        border-top: 4px solid #4caf50;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    overlay.appendChild(spinner);
    return overlay;
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
        z-index: 1001;
        font-family: 'Poppins', sans-serif;
        animation: slideIn 0.3s ease-out;
    `;
    
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Setup language selector
function setupLanguageSelector() {
    const langSelector = document.getElementById('language-selector');
    
    if (langSelector) {
        // Load saved language preference
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        langSelector.value = savedLanguage;
        
        langSelector.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            localStorage.setItem('selectedLanguage', selectedLanguage);
            
            // Show language change notification
            showLanguageChangeNotification(selectedLanguage);
            
            console.log('Language changed to:', selectedLanguage);
        });
        
        // Add tooltip
        langSelector.title = 'Select Language / भाषा चुनें';
    }
}

// Show language change notification
function showLanguageChangeNotification(language) {
    const languageNames = {
        'en': 'English',
        'hi': 'हिंदी'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        z-index: 1001;
        font-family: 'Poppins', sans-serif;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = `Language changed to ${languageNames[language]}`;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Setup logo click functionality
function setupLogoClick() {
    const logo = document.querySelector('.logo');
    
    if (logo) {
        logo.addEventListener('click', () => {
            // Load dashboard when logo is clicked
            const dashboardLink = document.querySelector('[data-page="dashboard.html"]');
            if (dashboardLink) {
                loadPage('dashboard.html', dashboardLink);
            }
        });
        
        // Add cursor pointer
        logo.style.cursor = 'pointer';
    }
}

// Load default page (dashboard)
function loadDefaultPage() {
    const currentPage = localStorage.getItem('currentPage');
    const defaultPage = 'dashboard.html';
    
    // If no current page or current page doesn't exist, load dashboard
    const pageToLoad = currentPage || defaultPage;
    
    const mainIframe = document.querySelector('.main-iframe');
    if (mainIframe) {
        // Set initial page
        mainIframe.src = pageToLoad;
        
        // Update navigation highlight
        const currentLink = document.querySelector(`[data-page="${pageToLoad}"]`);
        if (currentLink) {
            updateActiveNavItem(currentLink);
        }
    }
}

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
        // Refresh user authentication when page becomes visible
        checkAuthenticationStatus();
    }
});

// Handle beforeunload event
window.addEventListener('beforeunload', (e) => {
    // Save current state before page unload
    const currentPage = document.querySelector('.main-iframe')?.src;
    if (currentPage) {
        localStorage.setItem('lastVisitedPage', currentPage);
    }
});

// Export functions for external use
window.KrushiVishwaMain = {
    loadPage,
    handleLogout,
    showErrorMessage,
    updateActiveNavItem,
    toggleChatbot,
    addMessageToChat
};

// Initialize app when DOM is ready
console.log('KrushiVishwa Main Application Initialized');
console.log('Current user:', localStorage.getItem('username'));
console.log('Chatbot ready for assistance');