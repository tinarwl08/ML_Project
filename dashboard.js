// script.js

// Dashboard data
const dashboardData = {
    crop: {
        name: "Wheat",
        status: "Growing Season",
        yieldForecast: "2.5 tons/acre",
        yieldChange: "+15% from last year"
    },
    weather: {
        condition: "Partly Cloudy",
        temperature: "25°C",
        humidity: "60% humidity"
    }
};

// Animation functions
function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function animateTipCards() {
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, (index * 200) + 800);
    });
}

// Button click handlers
function getAdvisory() {
    showNotification("Advisory request sent! You'll receive farming recommendations soon.", "success");
    
    // Simulate loading and showing advisory data
    setTimeout(() => {
        const advisory = generateAdvisory();
        displayAdvisory(advisory);
    }, 1500);
}

function viewMarketTrends() {
    showNotification("Market analysis feature coming soon!", "info");
}

function exportData() {
    showNotification("Preparing your farming data for export...", "info");
    
    // Simulate data export
    setTimeout(() => {
        const exportData = generateExportData();
        downloadData(exportData);
        showNotification("Data exported successfully!", "success");
    }, 2000);
}

// Notification system
function showNotification(message, type = "info") {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };
    return colors[type] || colors.info;
}

// Advisory generation
function generateAdvisory() {
    const advisories = [
        {
            title: "Irrigation Recommendation",
            message: "Based on current soil moisture and weather forecast, water your crops in the next 2 days.",
            priority: "high"
        },
        {
            title: "Fertilizer Application",
            message: "Apply nitrogen-rich fertilizer as your wheat is in the tillering stage.",
            priority: "medium"
        },
        {
            title: "Pest Watch",
            message: "Monitor for aphids as weather conditions are favorable for their growth.",
            priority: "medium"
        }
    ];
    
    return advisories;
}

function displayAdvisory(advisories) {
    const modal = createModal("Farming Advisory", advisories.map(advisory => `
        <div class="advisory-item priority-${advisory.priority}">
            <h4>${advisory.title}</h4>
            <p>${advisory.message}</p>
        </div>
    `).join(''));
    
    document.body.appendChild(modal);
}

// Market trends display
function displayMarketTrends() {
    const trends = [
        { crop: "Wheat", price: "₹2,150", change: "+2.4%", trend: "up" },
        { crop: "Rice", price: "₹1,890", change: "-1.2%", trend: "down" },
        { crop: "Corn", price: "₹1,675", change: "+0.8%", trend: "up" },
        { crop: "Barley", price: "₹1,420", change: "+1.5%", trend: "up" }
    ];
    
    const trendsHTML = trends.map(trend => `
        <div class="trend-item">
            <span class="trend-crop">${trend.crop}</span>
            <span class="trend-price">${trend.price}</span>
            <span class="trend-change ${trend.trend}">${trend.change}</span>
        </div>
    `).join('');
    
    const modal = createModal("Market Trends", `
        <div class="market-trends">
            <div class="trend-header">
                <span>Crop</span>
                <span>Price/Quintal</span>
                <span>24h Change</span>
            </div>
            ${trendsHTML}
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Modal creator
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    return modal;
}

// Data export
function generateExportData() {
    return {
        timestamp: new Date().toISOString(),
        farmingData: {
            currentCrop: dashboardData.crop,
            weather: dashboardData.weather,
            tips: [
                "Water crops early morning",
                "Check for pest infestation every 3 days",
                "Apply organic fertilizer during flowering"
            ]
        }
    };
}

function downloadData(data) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `farming-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Weather update simulation
function simulateWeatherUpdate() {
    const weatherConditions = [
        { condition: "Sunny", temp: "28°C", humidity: "45%" },
        { condition: "Partly Cloudy", temp: "25°C", humidity: "60%" },
        { condition: "Overcast", temp: "22°C", humidity: "75%" },
        { condition: "Light Rain", temp: "20°C", humidity: "85%" }
    ];
    
    setInterval(() => {
        const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const weatherStatus = document.querySelector('.weather-status');
        const weatherDetails = document.querySelector('.weather-details');
        
        if (weatherStatus && weatherDetails) {
            weatherStatus.textContent = randomWeather.condition;
            weatherDetails.textContent = `${randomWeather.temp}, ${randomWeather.humidity} humidity`;
        }
    }, 30000); // Update every 30 seconds
}

// Initialize dashboard
function initDashboard() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
        }
        
        .modal .modal {
            background: white;
            border-radius: 12px;
            padding: 0;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
        }
        
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-content {
            padding: 1.5rem;
            max-height: 60vh;
            overflow-y: auto;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        
        .advisory-item {
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #4caf50;
        }
        
        .advisory-item.priority-high {
            border-left-color: #f44336;
            background: #fef5f5;
        }
        
        .advisory-item.priority-medium {
            border-left-color: #ff9800;
            background: #fff8f0;
        }
        
        .market-trends .trend-header {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1rem;
            padding: 0.5rem 0;
            border-bottom: 2px solid #4caf50;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        
        .trend-item {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1rem;
            padding: 0.8rem 0;
            border-bottom: 1px solid #eee;
        }
        
        .trend-change.up {
            color: #4caf50;
        }
        
        .trend-change.down {
            color: #f44336;
        }
    `;
    document.head.appendChild(style);
    
    // Start animations
    animateCards();
    animateTipCards();
    
    // Start simulations
    simulateWeatherUpdate();
    
    // Welcome message
    setTimeout(() => {
        showNotification("Welcome back! Your dashboard is ready.", "success");
    }, 1000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', initDashboard);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                getAdvisory();
                break;
            case '2':
                e.preventDefault();
                viewMarketTrends();
                break;
            case '3':
                e.preventDefault();
                exportData();
                break;
        }
    }
});

// Export functions for global access
window.getAdvisory = getAdvisory;
window.viewMarketTrends = viewMarketTrends;
window.exportData = exportData;