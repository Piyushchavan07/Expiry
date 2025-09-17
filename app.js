// Enhanced Expiry Guard Application
class ExpiryGuardPro {
    constructor() {
        // Enhanced data structure
        this.products = [];
        this.currentId = 1;
        this.scanner = null;
        this.currentTheme = 'light';
        this.currentView = 'dashboard';
        this.filteredProducts = [];
        this.selectedProducts = new Set();
        this.bulkMode = false;
        this.charts = {};
        
        // Settings with defaults
        this.settings = {
            notifications: {
                enabled: true,
                thresholds: [3, 7, 14],
                customThreshold: 3,
                sound: true,
                email: false
            },
            theme: 'light',
            language: 'en',
            currency: 'USD',
            defaultCategory: 'Other',
            autoBackup: true,
            reportSchedule: 'monthly'
        };
        
        // Initialize sample data with enhanced structure
        this.initializeEnhancedSampleData();
        
        // Initialize the application
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeTheme();
        this.updateDashboard();
        this.renderProducts();
        this.requestNotificationPermission();
        this.initializeCharts();
        this.startPeriodicNotificationCheck();
    }

    initializeEnhancedSampleData() {
        const enhancedSampleData = [
            {
                id: 1,
                name: "Organic Milk",
                expiryDate: "2025-09-20",
                barcode: "123456789012",
                ocrText: "BEST BEFORE 20/09/2025",
                notes: "Keep refrigerated below 4°C",
                dateAdded: "2025-09-15",
                category: "Dairy",
                purchaseDate: "2025-09-15",
                price: 4.99,
                quantity: 1,
                brand: "Organic Valley",
                location: "Refrigerator",
                nutritionInfo: "Protein: 8g, Fat: 8g, Carbs: 12g per 250ml"
            },
            {
                id: 2,
                name: "Whole Wheat Bread",
                expiryDate: "2025-09-25",
                barcode: "987654321098",
                ocrText: "USE BY 25 SEP 2025",
                notes: "Store in cool, dry place",
                dateAdded: "2025-09-16",
                category: "Bakery",
                purchaseDate: "2025-09-16",
                price: 2.49,
                quantity: 1,
                brand: "Nature's Own",
                location: "Pantry"
            },
            {
                id: 3,
                name: "Greek Yogurt",
                expiryDate: "2025-09-18",
                barcode: "456789123456",
                ocrText: "EXP 18/09/2025",
                notes: "High protein - discard if expired",
                dateAdded: "2025-09-10",
                category: "Dairy",
                purchaseDate: "2025-09-10",
                price: 3.99,
                quantity: 4,
                brand: "Fage",
                location: "Refrigerator"
            },
            {
                id: 4,
                name: "Fresh Salmon",
                expiryDate: "2025-09-19",
                barcode: "789123456789",
                ocrText: "CONSUME BY 19 SEP 2025",
                notes: "Cook within 2 days",
                dateAdded: "2025-09-17",
                category: "Meat & Fish",
                purchaseDate: "2025-09-17",
                price: 12.99,
                quantity: 1,
                brand: "Atlantic Fresh",
                location: "Refrigerator"
            },
            {
                id: 5,
                name: "Vitamin C Tablets",
                expiryDate: "2025-12-31",
                barcode: "321654987321",
                ocrText: "EXP DATE: DEC 2025",
                notes: "Take with food",
                dateAdded: "2025-09-01",
                category: "Medicine",
                purchaseDate: "2025-09-01",
                price: 15.99,
                quantity: 60,
                brand: "Nature Made",
                location: "Medicine Cabinet"
            }
        ];
        
        this.products = [...enhancedSampleData];
        this.currentId = 6;
        this.filteredProducts = [...this.products];
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Forms - Fixed form submission
        document.getElementById('addProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.addProduct();
        });

        document.getElementById('editProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.updateProduct();
        });

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.querySelector('.modal-overlay').addEventListener('click', () => this.closeModal());

        // Scanner controls
        document.getElementById('startScanner').addEventListener('click', () => this.startScanner());
        document.getElementById('stopScanner').addEventListener('click', () => this.stopScanner());

        // OCR controls
        document.getElementById('ocrImageInput').addEventListener('change', (e) => this.handleImageUpload(e));
        document.getElementById('processOCR').addEventListener('click', () => this.processOCR());

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', () => this.filterProducts());
        document.getElementById('filterCategory').addEventListener('change', () => this.filterProducts());
        document.getElementById('filterExpiry').addEventListener('change', () => this.filterProducts());

        // Bulk operations - Fixed bulk functionality
        document.getElementById('bulkActions').addEventListener('click', () => this.toggleBulkMode());
        document.getElementById('selectAll').addEventListener('click', () => this.selectAllProducts());
        document.getElementById('deselectAll').addEventListener('click', () => this.deselectAllProducts());
        document.getElementById('bulkDelete').addEventListener('click', () => this.bulkDeleteProducts());

        // Reports
        document.getElementById('generateReport').addEventListener('click', () => this.generateReport());
        document.getElementById('downloadReport').addEventListener('click', () => this.downloadReport());
        document.getElementById('exportReportData').addEventListener('click', () => this.exportReportData());

        // Settings
        document.getElementById('notificationsEnabled').addEventListener('change', (e) => {
            this.settings.notifications.enabled = e.target.checked;
            this.showNotification('Settings Updated', 'Notification preferences saved', 'success');
        });

        document.getElementById('alertThreshold').addEventListener('change', (e) => {
            this.settings.notifications.customThreshold = parseInt(e.target.value);
            this.showNotification('Settings Updated', `Alert threshold set to ${e.target.value} days`, 'success');
        });

        document.getElementById('soundEnabled').addEventListener('change', (e) => {
            this.settings.notifications.sound = e.target.checked;
        });

        // Data management
        document.getElementById('backupData').addEventListener('click', () => this.backupData());
        document.getElementById('importData').addEventListener('change', (e) => this.importData(e));
        document.getElementById('clearData').addEventListener('click', () => this.clearAllData());
        document.getElementById('exportData').addEventListener('click', () => this.exportAllData());

        // Other controls
        document.getElementById('deleteProduct').addEventListener('click', () => this.deleteProduct());
        document.getElementById('darkModeToggle').addEventListener('click', () => this.toggleTheme());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.backupData();
            }
        });
    }

    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update views
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        document.getElementById(`${viewName}-view`).classList.add('active');

        this.currentView = viewName;

        // Initialize view-specific functionality
        if (viewName === 'dashboard') {
            this.updateDashboard();
            this.updateCharts();
        } else if (viewName === 'reports') {
            this.initializeReportsView();
        } else if (viewName === 'settings') {
            this.loadSettings();
        }
    }

    initializeTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme = this.settings.theme || (prefersDark ? 'dark' : 'light');
        this.applyTheme();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.settings.theme = this.currentTheme;
        this.applyTheme();
        this.showNotification('Theme Changed', `Switched to ${this.currentTheme} mode`, 'success');
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');

        if (tabName !== 'scanner' && this.scanner) {
            this.stopScanner();
        }
    }

    // OCR Functionality
    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById('previewImage');
            img.src = e.target.result;
            document.getElementById('ocrPreview').style.display = 'block';
            document.getElementById('ocrResult').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    async processOCR() {
        const img = document.getElementById('previewImage');
        if (!img.src) return;

        this.showLoading(true, 'Processing image with OCR...');
        document.getElementById('ocrProgress').style.display = 'block';

        try {
            const { data: { text } } = await Tesseract.recognize(img.src, 'eng', {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        document.querySelector('.progress-fill').style.width = `${progress}%`;
                        document.querySelector('.progress-text').textContent = `Processing... ${progress}%`;
                    }
                }
            });

            this.displayOCRResult(text);
        } catch (error) {
            console.error('OCR Error:', error);
            this.showNotification('OCR Error', 'Failed to process image. Please try again.', 'error');
        } finally {
            this.showLoading(false);
            document.getElementById('ocrProgress').style.display = 'none';
        }
    }

    displayOCRResult(text) {
        document.getElementById('extractedText').textContent = text;
        document.getElementById('ocrResult').style.display = 'block';

        // Extract potential dates
        const dates = this.extractDatesFromText(text);
        const datesContainer = document.getElementById('detectedDates');
        
        if (dates.length > 0) {
            datesContainer.innerHTML = `
                <h5>Detected Dates:</h5>
                ${dates.map(date => `
                    <div class="date-option" onclick="app.selectDetectedDate('${date}')">
                        <span>📅</span>
                        <span>${date}</span>
                    </div>
                `).join('')}
            `;
        } else {
            datesContainer.innerHTML = '<p>No dates detected in the image.</p>';
        }

        this.showNotification('OCR Complete', 'Text extracted successfully!', 'success');
    }

    extractDatesFromText(text) {
        const datePatterns = [
            /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g,
            /\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}\b/gi,
            /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{2,4}\b/gi,
            /\b\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}\b/g
        ];

        const dates = [];
        datePatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    const normalizedDate = this.normalizeDateString(match.trim());
                    if (normalizedDate && !dates.includes(normalizedDate)) {
                        dates.push(normalizedDate);
                    }
                });
            }
        });

        return dates;
    }

    normalizeDateString(dateStr) {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return null;
            return date.toISOString().split('T')[0];
        } catch {
            return null;
        }
    }

    selectDetectedDate(dateStr) {
        document.getElementById('expiryDate').value = dateStr;
        this.switchTab('manual');
        document.getElementById('productName').focus();
        this.showNotification('Date Selected', 'Expiry date filled automatically', 'success');
    }

    // Enhanced Product Management - Fixed form validation
    addProduct() {
        // Get form elements directly to avoid validation issues
        const name = document.getElementById('productName').value.trim();
        const expiryDate = document.getElementById('expiryDate').value;
        const barcode = document.getElementById('barcode').value.trim();
        const notes = document.getElementById('notes').value.trim();
        const category = document.getElementById('category').value;
        const purchaseDate = document.getElementById('purchaseDate').value || new Date().toISOString().split('T')[0];
        const price = parseFloat(document.getElementById('price').value || 0);
        const quantity = parseInt(document.getElementById('quantity').value || 1);
        const location = document.getElementById('location').value || 'Other';
        const scannedBarcode = document.getElementById('scannedBarcode').textContent.trim();

        // Basic validation
        if (!name) {
            this.showNotification('Error', 'Product name is required', 'error');
            document.getElementById('productName').focus();
            return;
        }

        if (!expiryDate) {
            this.showNotification('Error', 'Expiry date is required', 'error');
            document.getElementById('expiryDate').focus();
            return;
        }

        const product = {
            id: this.currentId++,
            name: name,
            expiryDate: expiryDate,
            barcode: scannedBarcode || barcode,
            notes: notes,
            category: category,
            purchaseDate: purchaseDate,
            price: price,
            quantity: quantity,
            location: location,
            dateAdded: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString()
        };

        // Expiry date validation
        const today = new Date();
        const expiry = new Date(product.expiryDate);
        if (expiry < today.setHours(0,0,0,0)) {
            this.showNotification('Warning', 'Product is already expired', 'warning');
        }

        this.products.push(product);
        this.updateDashboard();
        this.filterProducts();
        this.clearForm('add');
        this.updateCharts();
        this.showNotification('Success', `${product.name} added successfully!`, 'success');

        // Clear OCR/scanner results
        this.clearScanResults();
    }

    updateProduct() {
        const productId = parseInt(document.getElementById('editProductId').value);
        const productIndex = this.products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) return;

        // Get form values directly
        const name = document.getElementById('editProductName').value.trim();
        const expiryDate = document.getElementById('editExpiryDate').value;
        const barcode = document.getElementById('editBarcode').value.trim();
        const notes = document.getElementById('editNotes').value.trim();
        const category = document.getElementById('editCategory').value;
        const price = parseFloat(document.getElementById('editPrice').value || 0);
        const quantity = parseInt(document.getElementById('editQuantity').value || 1);
        const location = document.getElementById('editLocation').value || 'Other';
        
        // Validation
        if (!name || !expiryDate) {
            this.showNotification('Error', 'Please fill in required fields', 'error');
            return;
        }

        this.products[productIndex] = {
            ...this.products[productIndex],
            name: name,
            expiryDate: expiryDate,
            barcode: barcode,
            notes: notes,
            category: category,
            price: price,
            quantity: quantity,
            location: location,
            lastModified: new Date().toISOString()
        };

        this.updateDashboard();
        this.filterProducts();
        this.updateCharts();
        this.closeModal();
        this.showNotification('Success', 'Product updated successfully!', 'success');
    }

    deleteProduct() {
        const productId = parseInt(document.getElementById('editProductId').value);
        const productIndex = this.products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) return;

        const productName = this.products[productIndex].name;
        this.products.splice(productIndex, 1);
        
        this.updateDashboard();
        this.filterProducts();
        this.updateCharts();
        this.closeModal();
        this.showNotification('Success', `${productName} deleted successfully!`, 'success');
    }

    // Bulk Operations - Fixed implementation
    toggleBulkMode() {
        this.bulkMode = !this.bulkMode;
        const bulkControls = document.getElementById('bulkControls');
        const bulkButton = document.getElementById('bulkActions');
        
        if (this.bulkMode) {
            bulkControls.style.display = 'block';
            bulkButton.textContent = '✖️';
            bulkButton.title = 'Exit Bulk Mode';
            this.selectedProducts.clear();
            this.showNotification('Bulk Mode', 'Bulk selection mode enabled. Click products to select them.', 'info');
        } else {
            bulkControls.style.display = 'none';
            bulkButton.textContent = '📋';
            bulkButton.title = 'Bulk Actions';
            this.selectedProducts.clear();
            this.showNotification('Bulk Mode', 'Bulk selection mode disabled', 'info');
        }
        
        this.renderProducts();
        this.updateSelectedCount();
    }

    selectAllProducts() {
        this.filteredProducts.forEach(product => this.selectedProducts.add(product.id));
        this.renderProducts();
        this.updateSelectedCount();
        this.showNotification('Bulk Selection', `${this.selectedProducts.size} products selected`, 'info');
    }

    deselectAllProducts() {
        this.selectedProducts.clear();
        this.renderProducts();
        this.updateSelectedCount();
        this.showNotification('Bulk Selection', 'All products deselected', 'info');
    }

    updateSelectedCount() {
        const countElement = document.getElementById('selectedCount');
        if (countElement) {
            countElement.textContent = `${this.selectedProducts.size} selected`;
        }
    }

    bulkDeleteProducts() {
        if (this.selectedProducts.size === 0) {
            this.showNotification('Error', 'No products selected', 'error');
            return;
        }

        if (confirm(`Delete ${this.selectedProducts.size} selected products? This action cannot be undone.`)) {
            const deletedCount = this.selectedProducts.size;
            this.products = this.products.filter(p => !this.selectedProducts.has(p.id));
            this.selectedProducts.clear();
            this.updateDashboard();
            this.filterProducts();
            this.updateCharts();
            this.updateSelectedCount();
            this.showNotification('Success', `${deletedCount} products deleted successfully`, 'success');
        }
    }

    toggleProductSelection(productId, event) {
        if (event) {
            event.stopPropagation();
        }
        
        if (this.selectedProducts.has(productId)) {
            this.selectedProducts.delete(productId);
        } else {
            this.selectedProducts.add(productId);
        }
        this.renderProducts();
        this.updateSelectedCount();
    }

    // Enhanced Analytics and Charts
    initializeCharts() {
        // Add slight delay to ensure DOM is ready
        setTimeout(() => {
            this.createCategoryChart();
            this.createExpiryTrendChart();
        }, 100);
    }

    createCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;
        
        const categoryData = this.getCategoryData();
        
        this.charts.categoryChart = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.values,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Products by Category'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createExpiryTrendChart() {
        const ctx = document.getElementById('expiryTrendChart');
        if (!ctx) return;
        
        const trendData = this.getExpiryTrendData();
        
        this.charts.expiryTrendChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: trendData.labels,
                datasets: [
                    {
                        label: 'Expired',
                        data: trendData.expired,
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Expiring Soon',
                        data: trendData.expiring,
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Expiry Trend (Last 7 Days)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    getCategoryData() {
        const categories = {};
        this.products.forEach(product => {
            categories[product.category] = (categories[product.category] || 0) + 1;
        });

        return {
            labels: Object.keys(categories),
            values: Object.values(categories)
        };
    }

    getExpiryTrendData() {
        const labels = [];
        const expired = [];
        const expiring = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // This is simulated data - in a real app, you'd track historical data
            expired.push(Math.floor(Math.random() * 3));
            expiring.push(Math.floor(Math.random() * 5) + 1);
        }
        
        return { labels, expired, expiring };
    }

    updateCharts() {
        if (this.charts.categoryChart) {
            const categoryData = this.getCategoryData();
            this.charts.categoryChart.data.labels = categoryData.labels;
            this.charts.categoryChart.data.datasets[0].data = categoryData.values;
            this.charts.categoryChart.update();
        }

        if (this.charts.expiryTrendChart) {
            const trendData = this.getExpiryTrendData();
            this.charts.expiryTrendChart.data.datasets[0].data = trendData.expired;
            this.charts.expiryTrendChart.data.datasets[1].data = trendData.expiring;
            this.charts.expiryTrendChart.update();
        }
    }

    // Enhanced Dashboard
    updateDashboard() {
        const now = new Date();
        const alertDate = new Date(now.getTime() + (this.settings.notifications.customThreshold * 24 * 60 * 60 * 1000));
        
        const stats = {
            total: this.products.length,
            expired: 0,
            expiringSoon: 0,
            totalValue: 0
        };

        this.products.forEach(product => {
            const expiryDate = new Date(product.expiryDate);
            stats.totalValue += (product.price || 0) * (product.quantity || 1);
            
            if (expiryDate < now) {
                stats.expired++;
            } else if (expiryDate <= alertDate) {
                stats.expiringSoon++;
            }
        });

        document.getElementById('totalProducts').textContent = stats.total;
        document.getElementById('expiredProducts').textContent = stats.expired;
        document.getElementById('expiringSoon').textContent = stats.expiringSoon;
        document.getElementById('totalValue').textContent = `$${stats.totalValue.toFixed(2)}`;

        this.checkExpiryNotifications();
    }

    // Enhanced Product Rendering with proper bulk selection
    renderProducts() {
        const container = document.getElementById('productsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (this.filteredProducts.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        container.innerHTML = this.filteredProducts.map(product => {
            const status = this.getExpiryStatus(product.expiryDate);
            const daysUntilExpiry = this.getDaysUntilExpiry(product.expiryDate);
            
            let statusText, statusClass, daysText;
            
            switch (status) {
                case 'expired':
                    statusText = 'EXPIRED';
                    statusClass = 'status-expired';
                    daysText = `${Math.abs(daysUntilExpiry)} day(s) ago`;
                    break;
                case 'expiring':
                    statusText = 'EXPIRING SOON';
                    statusClass = 'status-expiring';
                    daysText = daysUntilExpiry === 0 ? 'Today' : `${daysUntilExpiry} day(s) left`;
                    break;
                default:
                    statusText = 'FRESH';
                    statusClass = 'status-fresh';
                    daysText = `${daysUntilExpiry} day(s) left`;
            }
            
            const totalValue = (product.price || 0) * (product.quantity || 1);
            const isSelected = this.selectedProducts.has(product.id);
            
            return `
                <div class="product-card product-card--${status} ${this.bulkMode ? 'has-checkbox' : ''}" 
                     onclick="${this.bulkMode ? `app.toggleProductSelection(${product.id}, event)` : `app.editProductModal(${product.id})`}" 
                     tabindex="0">
                    ${this.bulkMode ? `
                        <input type="checkbox" 
                               class="product-checkbox" 
                               ${isSelected ? 'checked' : ''} 
                               onclick="app.toggleProductSelection(${product.id}, event)"
                               onchange="app.toggleProductSelection(${product.id}, event)">
                    ` : ''}
                    <div class="product-header">
                        <div>
                            <h3 class="product-name">${product.name}</h3>
                            <div class="product-category">${product.category}</div>
                        </div>
                        <span class="product-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="product-details">
                        <div class="product-detail">
                            <span class="product-detail-label">Expiry Date:</span>
                            <span class="product-detail-value">${new Date(product.expiryDate).toLocaleDateString()}</span>
                        </div>
                        <div class="product-detail">
                            <span class="product-detail-label">Days:</span>
                            <span class="product-detail-value">${daysText}</span>
                        </div>
                        <div class="product-detail">
                            <span class="product-detail-label">Quantity:</span>
                            <span class="product-detail-value">${product.quantity || 1}</span>
                        </div>
                        <div class="product-detail">
                            <span class="product-detail-label">Value:</span>
                            <span class="product-detail-value">$${totalValue.toFixed(2)}</span>
                        </div>
                        <div class="product-detail">
                            <span class="product-detail-label">Location:</span>
                            <span class="product-detail-value">${product.location || 'Not specified'}</span>
                        </div>
                        ${product.barcode ? `
                        <div class="product-detail">
                            <span class="product-detail-label">Barcode:</span>
                            <span class="product-detail-value">${product.barcode}</span>
                        </div>
                        ` : ''}
                    </div>
                    ${product.notes ? `<div class="product-notes">${product.notes}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    // Reports and PDF Generation
    generateReport() {
        const month = document.getElementById('reportMonth').value;
        const reportData = this.generateReportData(month);
        
        this.displayReportPreview(reportData);
        document.getElementById('reportPreview').style.display = 'block';
        this.showNotification('Report Generated', 'Monthly report preview is ready', 'success');
    }

    generateReportData(period) {
        const now = new Date();
        const reportDate = period === 'last' ? 
            new Date(now.getFullYear(), now.getMonth() - 1, 1) :
            new Date(now.getFullYear(), now.getMonth(), 1);

        const stats = {
            totalProducts: this.products.length,
            expired: this.products.filter(p => new Date(p.expiryDate) < now).length,
            totalValue: this.products.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 1)), 0),
            categories: this.getCategoryData()
        };

        return {
            title: `${period === 'last' ? 'Last' : 'Current'} Month Report`,
            date: reportDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
            stats
        };
    }

    displayReportPreview(reportData) {
        document.getElementById('reportTitle').textContent = reportData.title;
        document.getElementById('reportDate').textContent = reportData.date;
        document.getElementById('reportTotalProducts').textContent = reportData.stats.totalProducts;
        document.getElementById('reportExpired').textContent = reportData.stats.expired;
        document.getElementById('reportValue').textContent = `$${reportData.stats.totalValue.toFixed(2)}`;

        // Create report chart
        const ctx = document.getElementById('reportChart');
        if (!ctx) return;
        
        if (this.charts.reportChart) {
            this.charts.reportChart.destroy();
        }
        
        this.charts.reportChart = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: reportData.stats.categories.labels,
                datasets: [{
                    label: 'Products by Category',
                    data: reportData.stats.categories.values,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Category Distribution'
                    }
                }
            }
        });
    }

    async downloadReport() {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            
            // Add title
            pdf.setFontSize(20);
            pdf.text('Expiry Guard Pro - Monthly Report', 20, 30);
            
            // Add date
            pdf.setFontSize(12);
            pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
            
            // Add statistics
            pdf.setFontSize(14);
            pdf.text('Summary Statistics:', 20, 65);
            
            const stats = [
                `Total Products: ${document.getElementById('reportTotalProducts').textContent}`,
                `Expired Products: ${document.getElementById('reportExpired').textContent}`,
                `Total Value: ${document.getElementById('reportValue').textContent}`
            ];
            
            stats.forEach((stat, index) => {
                pdf.text(stat, 25, 80 + (index * 10));
            });
            
            // Add product list
            pdf.text('Product List:', 20, 120);
            let yPos = 135;
            
            this.products.slice(0, 15).forEach((product, index) => {
                const status = this.getExpiryStatus(product.expiryDate);
                const statusText = status === 'expired' ? '[EXPIRED]' : status === 'expiring' ? '[EXPIRING]' : '[FRESH]';
                const text = `${product.name} - ${product.expiryDate} ${statusText}`;
                pdf.text(text, 25, yPos + (index * 8));
            });
            
            if (this.products.length > 15) {
                pdf.text(`... and ${this.products.length - 15} more products`, 25, yPos + (15 * 8));
            }
            
            pdf.save(`expiry-guard-report-${new Date().toISOString().split('T')[0]}.pdf`);
            this.showNotification('Success', 'PDF report downloaded successfully!', 'success');
        } catch (error) {
            console.error('PDF Error:', error);
            this.showNotification('Error', 'Failed to generate PDF report. Please try again.', 'error');
        }
    }

    exportReportData() {
        const reportData = {
            generated: new Date().toISOString(),
            statistics: {
                totalProducts: this.products.length,
                expired: this.products.filter(p => new Date(p.expiryDate) < new Date()).length,
                totalValue: this.products.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 1)), 0)
            },
            products: this.products
        };
        
        this.downloadJSON(reportData, `expiry-guard-report-${new Date().toISOString().split('T')[0]}.json`);
        this.showNotification('Success', 'Report data exported successfully!', 'success');
    }

    // Data Management
    backupData() {
        const backup = {
            version: '2.0',
            timestamp: new Date().toISOString(),
            products: this.products,
            settings: this.settings
        };
        
        this.downloadJSON(backup, `expiry-guard-backup-${new Date().toISOString().split('T')[0]}.json`);
        this.showNotification('Success', 'Data backup created successfully!', 'success');
    }

    async importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.products && Array.isArray(data.products)) {
                this.products = data.products;
                this.currentId = Math.max(...this.products.map(p => p.id), 0) + 1;
            }
            
            if (data.settings) {
                this.settings = { ...this.settings, ...data.settings };
            }
            
            this.updateDashboard();
            this.filterProducts();
            this.updateCharts();
            this.loadSettings();
            this.showNotification('Success', `Imported ${this.products.length} products successfully!`, 'success');
        } catch (error) {
            console.error('Import Error:', error);
            this.showNotification('Error', 'Failed to import data. Invalid file format.', 'error');
        }
        
        // Reset file input
        event.target.value = '';
    }

    exportAllData() {
        const exportData = {
            version: '2.0',
            products: this.products,
            settings: this.settings,
            exported: new Date().toISOString()
        };
        
        this.downloadJSON(exportData, `expiry-guard-export-${new Date().toISOString().split('T')[0]}.json`);
        this.showNotification('Success', 'All data exported successfully!', 'success');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.products = [];
            this.selectedProducts.clear();
            this.currentId = 1;
            this.updateDashboard();
            this.filterProducts();
            this.updateCharts();
            this.showNotification('Success', 'All data cleared successfully', 'success');
        }
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Notification System with 3-day default
    startPeriodicNotificationCheck() {
        // Check every hour
        setInterval(() => {
            this.checkExpiryNotifications();
        }, 60 * 60 * 1000);
        
        // Initial check after 5 seconds
        setTimeout(() => this.checkExpiryNotifications(), 5000);
    }

    checkExpiryNotifications() {
        if (!this.settings.notifications.enabled) return;
        
        const now = new Date();
        const alertThreshold = this.settings.notifications.customThreshold;
        
        this.products.forEach(product => {
            const expiryDate = new Date(product.expiryDate);
            const daysUntilExpiry = this.getDaysUntilExpiry(product.expiryDate);
            
            // Check for browser notifications
            if ('Notification' in window && Notification.permission === 'granted') {
                if (expiryDate < now && expiryDate.toDateString() === now.toDateString()) {
                    new Notification(`${product.name} has expired!`, {
                        body: `${product.name} expired today. Please check the product.`,
                        icon: '🛡️'
                    });
                } else if (daysUntilExpiry <= alertThreshold && daysUntilExpiry > 0) {
                    new Notification(`${product.name} expires soon!`, {
                        body: `${product.name} expires in ${daysUntilExpiry} day(s).`,
                        icon: '⚠️'
                    });
                }
            }
        });
    }

    // Utility methods
    getExpiryStatus(expiryDate) {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const alertDate = new Date(now.getTime() + (this.settings.notifications.customThreshold * 24 * 60 * 60 * 1000));
        
        if (expiry < now) {
            return 'expired';
        } else if (expiry <= alertDate) {
            return 'expiring';
        }
        return 'fresh';
    }

    getDaysUntilExpiry(expiryDate) {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    filterProducts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('filterCategory').value;
        const expiryFilter = document.getElementById('filterExpiry').value;
        
        this.filteredProducts = this.products.filter(product => {
            const matchesSearch = !searchTerm || 
                product.name.toLowerCase().includes(searchTerm) ||
                (product.notes && product.notes.toLowerCase().includes(searchTerm)) ||
                product.category.toLowerCase().includes(searchTerm) ||
                (product.barcode && product.barcode.includes(searchTerm)) ||
                (product.location && product.location.toLowerCase().includes(searchTerm));
            
            const matchesCategory = !categoryFilter || product.category === categoryFilter;
            
            let matchesExpiry = true;
            if (expiryFilter) {
                const status = this.getExpiryStatus(product.expiryDate);
                matchesExpiry = status === expiryFilter;
            }
            
            return matchesSearch && matchesCategory && matchesExpiry;
        });
        
        this.renderProducts();
        
        // Clear selection when filter changes
        if (this.bulkMode) {
            this.selectedProducts.clear();
            this.updateSelectedCount();
        }
    }

    // Scanner functionality
    async startScanner() {
        try {
            if (!this.scanner) {
                this.scanner = new Html5QrcodeScanner("qr-reader", {
                    qrbox: 250,
                    fps: 20,
                });
            }
            
            await this.scanner.render(
                (decodedText) => this.handleScanSuccess(decodedText),
                (error) => {}
            );
            
            document.getElementById('startScanner').style.display = 'none';
            document.getElementById('stopScanner').style.display = 'inline-block';
            
        } catch (error) {
            this.showNotification('Error', 'Unable to start camera. Please check permissions.', 'error');
        }
    }

    stopScanner() {
        if (this.scanner) {
            this.scanner.clear();
            this.scanner = null;
        }
        
        document.getElementById('startScanner').style.display = 'inline-block';
        document.getElementById('stopScanner').style.display = 'none';
    }

    handleScanSuccess(decodedText) {
        document.getElementById('scannedBarcode').textContent = decodedText;
        document.getElementById('scanResult').style.display = 'block';
        document.getElementById('barcode').value = decodedText;
        
        this.stopScanner();
        this.switchTab('manual');
        document.getElementById('productName').focus();
        
        this.showNotification('Success', `Barcode scanned: ${decodedText}`, 'success');
    }

    clearScanResults() {
        const scanResult = document.getElementById('scanResult');
        const ocrResult = document.getElementById('ocrResult');
        const ocrPreview = document.getElementById('ocrPreview');
        
        if (scanResult) scanResult.style.display = 'none';
        if (ocrResult) ocrResult.style.display = 'none';
        if (ocrPreview) ocrPreview.style.display = 'none';
        
        document.getElementById('scannedBarcode').textContent = '';
    }

    // Modal and form management
    editProductModal(productId) {
        if (this.bulkMode) return;
        
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editExpiryDate').value = product.expiryDate;
        document.getElementById('editBarcode').value = product.barcode || '';
        document.getElementById('editNotes').value = product.notes || '';
        document.getElementById('editCategory').value = product.category;
        document.getElementById('editPrice').value = product.price || '';
        document.getElementById('editQuantity').value = product.quantity || 1;
        document.getElementById('editLocation').value = product.location || 'Other';
        
        this.openModal();
    }

    openModal() {
        document.getElementById('productModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('productModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    clearForm(mode = 'add') {
        if (mode === 'add') {
            document.getElementById('addProductForm').reset();
            document.getElementById('productName').focus();
        }
    }

    // Settings management
    loadSettings() {
        document.getElementById('notificationsEnabled').checked = this.settings.notifications.enabled;
        document.getElementById('alertThreshold').value = this.settings.notifications.customThreshold;
        document.getElementById('soundEnabled').checked = this.settings.notifications.sound;
    }

    initializeReportsView() {
        const monthSelect = document.getElementById('reportMonth');
        if (!monthSelect) return;
        
        const now = new Date();
        monthSelect.innerHTML = `
            <option value="current">${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</option>
            <option value="last">${new Date(now.getFullYear(), now.getMonth() - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</option>
        `;
    }

    // Utility functions
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification('Notifications Enabled', 'You will receive alerts for expiring products', 'success');
                }
            });
        }
    }

    showLoading(show, message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = document.querySelector('.loading-text');
        
        if (show && overlay && text) {
            text.textContent = message;
            overlay.classList.remove('hidden');
        } else if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    showNotification(title, message, type = 'info') {
        const container = document.getElementById('notifications');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        container.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);

        // Play sound if enabled
        if (this.settings.notifications.sound && type !== 'info') {
            this.playNotificationSound();
        }
    }

    playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio not supported');
        }
    }
}

// Initialize the enhanced application
const app = new ExpiryGuardPro();

// Add keyboard support for product cards
document.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('product-card') && e.key === 'Enter') {
        e.target.click();
    }
});

// Add service worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('SW registered'))
            .catch(() => console.log('SW registration failed'));
    });
}