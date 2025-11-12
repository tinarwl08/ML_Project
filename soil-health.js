// script.js

// Soil analysis data and functions
class SoilHealthAnalyzer {
    constructor() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.filePreview = document.getElementById('filePreview');
        this.previewImage = document.getElementById('previewImage');
        this.removeFileBtn = document.getElementById('removeFile');
        this.form = document.getElementById('soilAnalysisForm');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.resultsSection = document.getElementById('resultsSection');
        
        this.initializeEventListeners();
        this.initializeFormValidation();
    }

    initializeEventListeners() {
        // File upload drag and drop
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        
        // File input change
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        
        // Remove file
        this.removeFileBtn.addEventListener('click', this.removeFile.bind(this));
        
        // Form submission
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    initializeFormValidation() {
        const inputs = this.form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('input', this.validateInput.bind(this));
            input.addEventListener('blur', this.validateInput.bind(this));
        });
    }

    // File upload handlers
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Please upload a valid image file (JPG, PNG, JPEG, WebP)', 'error');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('File size should be less than 10MB', 'error');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            this.filePreview.style.display = 'block';
            this.showNotification('Soil report photo uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }

    removeFile() {
        this.fileInput.value = '';
        this.filePreview.style.display = 'none';
        this.previewImage.src = '';
    }

    // Form validation
    validateInput(e) {
        const input = e.target;
        const value = parseFloat(input.value);
        
        // Remove any existing error styling
        input.classList.remove('error');
        
        // Validate based on input type
        switch(input.id) {
            case 'phLevel':
                if (value < 0 || value > 14) {
                    this.setInputError(input, 'pH should be between 0 and 14');
                }
                break;
            case 'nitrogen':
            case 'phosphorus':
            case 'potassium':
                if (value < 0) {
                    this.setInputError(input, 'Value cannot be negative');
                }
                break;
            case 'organicMatter':
            case 'soilMoisture':
                if (value < 0 || value > 100) {
                    this.setInputError(input, 'Percentage should be between 0 and 100');
                }
                break;
        }
    }

    setInputError(input, message) {
        input.classList.add('error');
        // You could add error message display here
    }

    // Form submission
    async handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const soilData = {
            phLevel: parseFloat(document.getElementById('phLevel').value),
            nitrogen: parseFloat(document.getElementById('nitrogen').value),
            phosphorus: parseFloat(document.getElementById('phosphorus').value),
            potassium: parseFloat(document.getElementById('potassium').value),
            organicMatter: parseFloat(document.getElementById('organicMatter').value),
            soilMoisture: parseFloat(document.getElementById('soilMoisture').value)
        };

        // Validate that at least some fields are filled
        const filledFields = Object.values(soilData).filter(value => !isNaN(value) && value !== '');
        if (filledFields.length === 0) {
            this.showNotification('Please fill at least one field to analyze soil health', 'warning');
            return;
        }

        // Show loading state
        this.analyzeBtn.classList.add('loading');
        this.analyzeBtn.disabled = true;
        this.analyzeBtn.textContent = 'Analyzing...';

        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Perform analysis
        const results = this.analyzeSoilHealth(soilData);
        this.displayResults(results);

        // Reset button state
        this.analyzeBtn.classList.remove('loading');
        this.analyzeBtn.disabled = false;
        this.analyzeBtn.innerHTML = '🔬 Analyze Soil Health';
    }

    // Soil health analysis logic
    analyzeSoilHealth(data) {
        const results = {};
        const recommendations = [];

        // pH Level Analysis
        if (!isNaN(data.phLevel)) {
            if (data.phLevel >= 6.0 && data.phLevel <= 7.5) {
                results.pH = { value: data.phLevel, status: 'good', label: 'Optimal' };
            } else if ((data.phLevel >= 5.5 && data.phLevel < 6.0) || (data.phLevel > 7.5 && data.phLevel <= 8.0)) {
                results.pH = { value: data.phLevel, status: 'medium', label: 'Acceptable' };
                recommendations.push(data.phLevel < 6.0 ? 
                    'Consider adding lime to increase soil pH' : 
                    'Consider adding organic matter to lower soil pH');
            } else {
                results.pH = { value: data.phLevel, status: 'poor', label: 'Needs Attention' };
                recommendations.push(data.phLevel < 5.5 ? 
                    'Soil is too acidic - add lime or wood ash' : 
                    'Soil is too alkaline - add sulfur or organic matter');
            }
        }

        // Nitrogen Analysis
        if (!isNaN(data.nitrogen)) {
            if (data.nitrogen >= 40) {
                results.nitrogen = { value: `${data.nitrogen} ppm`, status: 'good', label: 'Sufficient' };
            } else if (data.nitrogen >= 20) {
                results.nitrogen = { value: `${data.nitrogen} ppm`, status: 'medium', label: 'Moderate' };
                recommendations.push('Apply nitrogen-rich fertilizer or compost');
            } else {
                results.nitrogen = { value: `${data.nitrogen} ppm`, status: 'poor', label: 'Deficient' };
                recommendations.push('Immediate nitrogen supplementation needed - consider urea or ammonium sulfate');
            }
        }

        // Phosphorus Analysis
        if (!isNaN(data.phosphorus)) {
            if (data.phosphorus >= 30) {
                results.phosphorus = { value: `${data.phosphorus} ppm`, status: 'good', label: 'Adequate' };
            } else if (data.phosphorus >= 15) {
                results.phosphorus = { value: `${data.phosphorus} ppm`, status: 'medium', label: 'Low' };
                recommendations.push('Apply phosphorus fertilizer like rock phosphate');
            } else {
                results.phosphorus = { value: `${data.phosphorus} ppm`, status: 'poor', label: 'Very Low' };
                recommendations.push('Urgent phosphorus supplementation needed - use superphosphate fertilizer');
            }
        }

        // Potassium Analysis
        if (!isNaN(data.potassium)) {
            if (data.potassium >= 120) {
                results.potassium = { value: `${data.potassium} ppm`, status: 'good', label: 'Good' };
            } else if (data.potassium >= 60) {
                results.potassium = { value: `${data.potassium} ppm`, status: 'medium', label: 'Moderate' };
                recommendations.push('Apply potassium fertilizer like muriate of potash');
            } else {
                results.potassium = { value: `${data.potassium} ppm`, status: 'poor', label: 'Deficient' };
                recommendations.push('Immediate potassium supplementation needed - use potassium sulfate');
            }
        }

        // Organic Matter Analysis
        if (!isNaN(data.organicMatter)) {
            if (data.organicMatter >= 3.0) {
                results.organicMatter = { value: `${data.organicMatter}%`, status: 'good', label: 'Rich' };
            } else if (data.organicMatter >= 1.5) {
                results.organicMatter = { value: `${data.organicMatter}%`, status: 'medium', label: 'Moderate' };
                recommendations.push('Add compost or well-rotted manure to increase organic matter');
            } else {
                results.organicMatter = { value: `${data.organicMatter}%`, status: 'poor', label: 'Poor' };
                recommendations.push('Urgently increase organic matter - use compost, manure, or green manure crops');
            }
        }

        // Soil Moisture Analysis
        if (!isNaN(data.soilMoisture)) {
            if (data.soilMoisture >= 40 && data.soilMoisture <= 60) {
                results.soilMoisture = { value: `${data.soilMoisture}%`, status: 'good', label: 'Optimal' };
            } else if ((data.soilMoisture >= 30 && data.soilMoisture < 40) || (data.soilMoisture > 60 && data.soilMoisture <= 70)) {
                results.soilMoisture = { value: `${data.soilMoisture}%`, status: 'medium', label: 'Acceptable' };
                recommendations.push(data.soilMoisture < 40 ? 
                    'Consider improving water retention with mulching' : 
                    'Improve drainage to prevent waterlogging');
            } else {
                results.soilMoisture = { value: `${data.soilMoisture}%`, status: 'poor', label: 'Problematic' };
                recommendations.push(data.soilMoisture < 30 ? 
                    'Improve irrigation and water retention methods' : 
                    'Install proper drainage system to prevent root rot');
            }
        }

        return { results, recommendations };
    }

    // Display results
    displayResults(analysisResults) {
        const { results, recommendations } = analysisResults;
        
        // Clear previous results
        const resultsGrid = document.getElementById('resultsGrid');
        const recommendationsDiv = document.getElementById('recommendations');
        
        resultsGrid.innerHTML = '';
        recommendationsDiv.innerHTML = '';

        // Display result cards
        Object.entries(results).forEach(([key, result]) => {
            const card = document.createElement('div');
            card.className = `result-card ${result.status}`;
            card.innerHTML = `
                <div class="result-label">${this.getParameterLabel(key)}</div>
                <div class="result-value">${result.value}</div>
                <div class="result-status">${result.label}</div>
            `;
            resultsGrid.appendChild(card);
        });

        // Display recommendations
        if (recommendations.length > 0) {
            recommendationsDiv.innerHTML = `
                <h3>Recommendations</h3>
                <ul class="recommendation-list">
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            `;
        }

        // Show results section
        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        this.showNotification('Soil analysis completed successfully!', 'success');
    }

    getParameterLabel(key) {
        const labels = {
            pH: 'pH Level',
            nitrogen: 'Nitrogen',
            phosphorus: 'Phosphorus',
            potassium: 'Potassium',
            organicMatter: 'Organic Matter',
            soilMoisture: 'Soil Moisture'
        };
        return labels[key] || key;
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        return colors[type] || colors.info;
    }
}

// Advanced soil analysis features
class SoilReportAnalyzer {
    constructor() {
        this.initializeAnalysisTools();
    }

    // OCR simulation for uploaded images
    async analyzeUploadedReport(imageFile) {
        // Simulate OCR processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Return mock extracted data
        return {
            phLevel: 6.8,
            nitrogen: 85,
            phosphorus: 22,
            potassium: 165,
            organicMatter: 2.8,
            soilMoisture: 48
        };
    }

    initializeAnalysisTools() {
        this.addAnalysisStyles();
        this.setupKeyboardShortcuts();
        this.initializeDataValidation();
    }

    addAnalysisStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.8;
                transition: opacity 0.2s ease;
            }

            .notification-close:hover {
                opacity: 1;
            }

            .form-input.error {
                border-color: #f44336;
                background-color: #ffebee;
            }

            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                backdrop-filter: blur(4px);
            }

            .loading-spinner {
                text-align: center;
            }

            .loading-spinner .spinner {
                width: 50px;
                height: 50px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #4caf50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: #e0e0e0;
                border-radius: 3px;
                overflow: hidden;
                margin: 1rem 0;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4caf50, #45a049);
                border-radius: 3px;
                transition: width 0.3s ease;
                width: 0%;
            }

            .soil-tips {
                background: #f0f8f0;
                border-left: 4px solid #4caf50;
                padding: 1rem;
                margin: 1rem 0;
                border-radius: 0 8px 8px 0;
            }

            .soil-tips h4 {
                color: #2d5a3d;
                margin-bottom: 0.5rem;
                font-size: 1rem;
            }

            .soil-tips p {
                color: #555;
                font-size: 0.9rem;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        document.getElementById('analyzeBtn').click();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.resetForm();
                        break;
                }
            }
        });
    }

    initializeDataValidation() {
        // Real-time validation feedback
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateRealTime(e.target);
            });
        });
    }

    validateRealTime(input) {
        const value = parseFloat(input.value);
        const inputId = input.id;
        
        // Clear previous validation state
        input.classList.remove('error');
        
        // Skip validation if input is empty
        if (input.value === '') return;
        
        // Validation rules
        const validationRules = {
            phLevel: { min: 0, max: 14, name: 'pH Level' },
            nitrogen: { min: 0, max: 500, name: 'Nitrogen' },
            phosphorus: { min: 0, max: 200, name: 'Phosphorus' },
            potassium: { min: 0, max: 1000, name: 'Potassium' },
            organicMatter: { min: 0, max: 100, name: 'Organic Matter' },
            soilMoisture: { min: 0, max: 100, name: 'Soil Moisture' }
        };
        
        const rule = validationRules[inputId];
        if (rule && (isNaN(value) || value < rule.min || value > rule.max)) {
            input.classList.add('error');
        }
    }

    resetForm() {
        document.getElementById('soilAnalysisForm').reset();
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('filePreview').style.display = 'none';
        
        // Clear validation states
        document.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('error');
        });
    }

    // Export results functionality
    exportResults(results, format = 'json') {
        const timestamp = new Date().toISOString();
        const exportData = {
            timestamp,
            soilAnalysis: results,
            exportFormat: format
        };

        switch(format) {
            case 'json':
                this.downloadJSON(exportData);
                break;
            case 'csv':
                this.downloadCSV(exportData);
                break;
            case 'pdf':
                this.generatePDF(exportData);
                break;
        }
    }

    downloadJSON(data) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        this.downloadFile(dataBlob, `soil-analysis-${Date.now()}.json`);
    }

    downloadCSV(data) {
        const csvContent = this.convertToCSV(data.soilAnalysis);
        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        this.downloadFile(dataBlob, `soil-analysis-${Date.now()}.csv`);
    }

    convertToCSV(results) {
        const headers = ['Parameter', 'Value', 'Status', 'Label'];
        const rows = Object.entries(results.results).map(([key, result]) => [
            this.getParameterLabel(key),
            result.value,
            result.status,
            result.label
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        return csvContent;
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    getParameterLabel(key) {
        const labels = {
            pH: 'pH Level',
            nitrogen: 'Nitrogen (N)',
            phosphorus: 'Phosphorus (P)',
            potassium: 'Potassium (K)',
            organicMatter: 'Organic Matter',
            soilMoisture: 'Soil Moisture'
        };
        return labels[key] || key;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const soilAnalyzer = new SoilHealthAnalyzer();
    const reportAnalyzer = new SoilReportAnalyzer();
    
    // Add helpful tips
    setTimeout(() => {
        soilAnalyzer.showNotification('💡 Tip: You can drag and drop soil report images directly onto the upload area!', 'info');
    }, 2000);
    
    // Add keyboard shortcuts info
    console.log('Keyboard shortcuts:');
    console.log('Ctrl/Cmd + Enter: Analyze soil health');
    console.log('Ctrl/Cmd + R: Reset form');
});