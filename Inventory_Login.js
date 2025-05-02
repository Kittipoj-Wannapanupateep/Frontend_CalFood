document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const elements = {
        menuHeaders: document.querySelectorAll('.category-header'),
        filterButtons: document.querySelector('.filter-buttons'),
        rightContent: document.querySelector('.right-content'),
        sectionTitle: document.querySelector('.section-title h1'),
        menuGrid: document.querySelector('.menu-grid'),
        deleteButtons: document.querySelectorAll('.delete-menu-btn'),
        deleteConfirmModal: document.getElementById('deleteConfirmModal'),
        deleteSuccessModal: document.getElementById('deleteSuccessModal'),
        confirmDeleteBtn: document.getElementById('confirmDelete'),
        cancelDeleteBtn: document.getElementById('cancelDelete'),
        closeSuccessBtn: document.getElementById('closeSuccess'),
        sidebarToggle: document.getElementById('sidebar-toggle'),
        leftContent: document.querySelector('.left-content'),
        fixedHeader: document.querySelector('.fixed-header')
    };

    // Button categories for each menu type
    const buttonCategories = {
        'My Menu': [],
        'Daily Meal': [],
        'My Healthy': []
    };

    // Menu header functionality
    elements.menuHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const menuType = header.querySelector('span').textContent;
            resetMenuHeaders();
            header.classList.add('active');
            updateDisplayedMenuType(menuType);
            updateButtons(menuType);
            scrollToTop();
        });
    });

    // Reset all menu headers
    function resetMenuHeaders() {
        elements.menuHeaders.forEach(header => header.classList.remove('active'));
    }

    // Update displayed menu type
    function updateDisplayedMenuType(menuType) {
        // Reset all classes and displays
        elements.rightContent.className = 'right-content';
        document.querySelector('.menu-container').style.display = 'none';
        document.querySelector('.daily-meal-content').style.display = 'none';
        document.querySelector('.healthy-content').style.display = 'none';

        // Set specific display based on menu type
        if (menuType === 'My Menu') {
            elements.rightContent.classList.add('my-menu-active');
            document.querySelector('.menu-container').style.display = 'flex';
        } else if (menuType === 'Daily Meal') {
            elements.rightContent.classList.add('daily-meal-active');
            document.querySelector('.daily-meal-content').style.display = 'block';
        } else if (menuType === 'My Healthy') {
            elements.rightContent.classList.add('my-healthy-active');
            document.querySelector('.healthy-content').style.display = 'block';
        }
        
        elements.sectionTitle.textContent = menuType;
    }

    // Update filter buttons based on menu type
    function updateButtons(menuType) {
        elements.filterButtons.innerHTML = '';
        buttonCategories[menuType].forEach(category => {
            const button = document.createElement('button');
            button.className = 'button';
            button.textContent = category;
            if (category === 'All' || category === 'Today' || category === 'BMI') {
                button.classList.add('active');
            }
            elements.filterButtons.appendChild(button);
        });
    }

    // Scroll to top of content
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Delete functionality
    let menuToDelete = null;

    elements.deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            menuToDelete = button.closest('.menu-card');
            elements.deleteConfirmModal.style.display = 'flex';
        });
    });

    elements.confirmDeleteBtn.addEventListener('click', () => {
        if (menuToDelete) {
            menuToDelete.remove();
            elements.deleteConfirmModal.style.display = 'none';
            elements.deleteSuccessModal.style.display = 'flex';
        }
    });

    elements.cancelDeleteBtn.addEventListener('click', () => {
        elements.deleteConfirmModal.style.display = 'none';
        menuToDelete = null;
    });

    elements.closeSuccessBtn.addEventListener('click', () => {
        elements.deleteSuccessModal.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.deleteConfirmModal) {
            elements.deleteConfirmModal.style.display = 'none';
            menuToDelete = null;
        }
        if (e.target === elements.deleteSuccessModal) {
            elements.deleteSuccessModal.style.display = 'none';
        }
    });

    // Sidebar toggle functionality
    elements.sidebarToggle.addEventListener('click', () => {
        elements.leftContent.classList.toggle('collapsed');
        elements.rightContent.classList.toggle('expanded');
        elements.fixedHeader.classList.toggle('expanded');
        elements.sidebarToggle.classList.toggle('collapsed');
        elements.sidebarToggle.textContent = elements.sidebarToggle.classList.contains('collapsed') ? '▶' : '◀';
    });

    // Sort menu cards by creation date
    function sortMenuCards() {
        const menuCards = Array.from(elements.menuGrid.children);
        menuCards.sort((a, b) => {
            const dateA = new Date(a.dataset.created);
            const dateB = new Date(b.dataset.created);
            return dateB - dateA;
        });
        menuCards.forEach(card => elements.menuGrid.appendChild(card));
    }

    // Initialize page
    function initializePage() {
        const myMenuHeader = Array.from(elements.menuHeaders).find(header => 
            header.querySelector('span').textContent === 'My Menu'
        );
        if (myMenuHeader) {
            myMenuHeader.click();
        }
        sortMenuCards();
    }

    // Activity level selection
    const activityButtons = document.querySelectorAll('.activity-btn');
    activityButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            activityButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update TDEE calculation based on selected activity level
            updateTDEE(button.dataset.multiplier);
        });
    });

    // Update TDEE calculation
    function updateTDEE(multiplier) {
        // Example BMR calculation (you should replace this with actual user data)
        const bmr = 1500; // This should be calculated based on user's weight, height, age, and gender
        const tdee = Math.round(bmr * multiplier);
        
        // Update the display
        const minCalories = Math.round(tdee * 0.9);
        const maxCalories = Math.round(tdee * 1.1);
        
        document.querySelector('.range-item:first-child .value').textContent = minCalories;
        document.querySelector('.range-item:last-child .value').textContent = maxCalories;
    }

    // Initialize page on load
    initializePage();
});






