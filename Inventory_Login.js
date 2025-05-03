document.addEventListener("DOMContentLoaded", function () {
    // Meal Icons Object
    const mealIcons = {
        breakfast: [
            "https://cdn-icons-png.flaticon.com/512/3480/3480823.png",
            "https://cdn-icons-png.flaticon.com/512/3480/3480824.png",
            "https://cdn-icons-png.flaticon.com/512/3480/3480825.png"
        ],
        lunch: [
            "https://cdn-icons-png.flaticon.com/512/3274/3274099.png",
            "https://cdn-icons-png.flaticon.com/512/3274/3274100.png",
            "https://cdn-icons-png.flaticon.com/512/3274/3274101.png"
        ],
        dinner: [
            "https://cdn-icons-png.flaticon.com/512/12009/12009846.png",
            "https://cdn-icons-png.flaticon.com/512/12009/12009847.png",
            "https://cdn-icons-png.flaticon.com/512/12009/12009848.png"
        ]
    };

    // Function to create icon options
    function createIconOptions(mealType) {
        const iconOptions = document.createElement('div');
        iconOptions.className = 'icon-options';
        
        mealIcons[mealType].forEach((iconUrl, index) => {
            const img = document.createElement('img');
            img.src = iconUrl;
            img.alt = `${mealType} ${index + 1}`;
            img.dataset.icon = `${mealType}${index + 1}`;
            iconOptions.appendChild(img);
        });
        
        return iconOptions;
    }

    // Function to initialize icon selectors
    function initializeIconSelectors() {
        document.querySelectorAll('.icon-selector').forEach(selector => {
            const mealType = selector.closest('.meal-section-edit').classList[1]; // breakfast, lunch, or dinner
            const mainIcon = selector.querySelector('.meal-icon');
            const iconOptions = createIconOptions(mealType);
            
            // Set default icon
            mainIcon.src = mealIcons[mealType][0];
            
            // Replace existing icon options with new ones
            const existingOptions = selector.querySelector('.icon-options');
            if (existingOptions) {
                existingOptions.remove();
            }
            selector.appendChild(iconOptions);
        });
    }

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
        fixedHeader: document.querySelector('.fixed-header'),
        editDailyMealModal: document.getElementById('editDailyMealModal'),
        selectMenuModal: document.getElementById('selectMenuModal'),
        cancelEditBtn: document.getElementById('cancelEdit'),
        confirmMenuBtn: document.getElementById('confirmMenu'),
        cancelMenuBtn: document.getElementById('cancelMenu')
    };

    // State variables
    let currentDailyMealCard = null;
    let selectedMealType = null;
    let selectedMenu = null;
    let menuToDelete = null;

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
        document.querySelector('.search-bar').style.display = 'block';

        // Set specific display based on menu type
        if (menuType === 'My Menu') {
            elements.rightContent.classList.add('my-menu-active');
            document.querySelector('.menu-container').style.display = 'flex';
            sortMenuCards();
        } else if (menuType === 'Daily Meal') {
            elements.rightContent.classList.add('daily-meal-active');
            document.querySelector('.daily-meal-content').style.display = 'block';
            sortDailyMealCards();
        } else if (menuType === 'My Healthy') {
            elements.rightContent.classList.add('my-healthy-active');
            document.querySelector('.healthy-content').style.display = 'block';
            document.querySelector('.search-bar').style.display = 'none';
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

    // Sort menu cards by creation date
    function sortMenuCards() {
        const menuCards = Array.from(elements.menuGrid.children);
        menuCards.sort((a, b) => {
            const dateA = new Date(a.querySelector('.menu-date').textContent.split(': ')[1]);
            const dateB = new Date(b.querySelector('.menu-date').textContent.split(': ')[1]);
            return dateB - dateA;
        });
        menuCards.forEach(card => elements.menuGrid.appendChild(card));
    }

    // Sort daily meal cards by date
    function sortDailyMealCards() {
        const dailyMealContent = document.querySelector('.daily-meal-content');
        const dailyMealCards = Array.from(dailyMealContent.children);
        
        // Thai month mapping
        const thaiMonths = {
            'มกราคม': '01', 'กุมภาพันธ์': '02', 'มีนาคม': '03', 'เมษายน': '04',
            'พฤษภาคม': '05', 'มิถุนายน': '06', 'กรกฎาคม': '07', 'สิงหาคม': '08',
            'กันยายน': '09', 'ตุลาคม': '10', 'พฤศจิกายน': '11', 'ธันวาคม': '12'
        };

        dailyMealCards.sort((a, b) => {
            const dateTextA = a.querySelector('.date-info .date').textContent;
            const dateTextB = b.querySelector('.date-info .date').textContent;
            
            // Extract date parts
            const [dayA, monthA, yearA] = dateTextA.replace('วันที่ ', '').split(' ');
            const [dayB, monthB, yearB] = dateTextB.replace('วันที่ ', '').split(' ');
            
            // Convert to comparable date format
            const dateA = new Date(`${yearA}-${thaiMonths[monthA]}-${dayA.padStart(2, '0')}`);
            const dateB = new Date(`${yearB}-${thaiMonths[monthB]}-${dayB.padStart(2, '0')}`);
            
            return dateB - dateA; // Sort in descending order (newest first)
        });
        
        // Reappend sorted cards
        dailyMealCards.forEach(card => dailyMealContent.appendChild(card));
    }

    // Delete functionality for My Menu
    elements.deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            menuToDelete = button.closest('.menu-card');
            elements.deleteConfirmModal.style.display = 'flex';
        });
    });

    // Delete functionality for Daily Meal
    document.querySelectorAll('.daily-meal-card .delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentDailyMealCard = button.closest('.daily-meal-card');
            elements.deleteConfirmModal.style.display = 'flex';
        });
    });

    // Save edit changes
    document.getElementById('saveEdit').addEventListener('click', () => {
        const newDate = new Date(document.getElementById('editDate').value);
        const thaiMonths = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        const dateText = `วันที่ ${newDate.getDate()} ${thaiMonths[newDate.getMonth()]} ${newDate.getFullYear()}`;

        if (currentDailyMealCard) {
            // Update existing card
            currentDailyMealCard.querySelector('.date-info .date').textContent = dateText;
        } else {
            // Create new card
            const dailyMealContent = document.querySelector('.daily-meal-content');
            const newCard = document.createElement('div');
            newCard.className = 'daily-meal-card';
            newCard.innerHTML = `
                <div class="daily-meal-header">
                    <div class="date-info">
                        <span class="date">${dateText}</span>
                    </div>
                    <div class="action-buttons">
                        <button class="edit-btn">
                            <img src="https://cdn-icons-png.flaticon.com/512/992/992664.png" alt="Edit">Edit
                        </button>
                        <button class="delete-btn">
                            <img src="https://cdn-icons-png.flaticon.com/512/3096/3096673.png" alt="Delete">Delete
                        </button>
                    </div>
                </div>
            `;

            // Add meal sections
            ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                const editSection = document.querySelector(`.meal-section-edit.${mealType}`);
                const mealName = editSection.querySelector('.meal-name').textContent;
                const calories = editSection.querySelector('.meal-calories').textContent.split(' ')[0];
                const icon = editSection.querySelector('.meal-icon').src;
                const mealTypeText = editSection.querySelector('.meal-type-label').textContent;

                const mealSection = document.createElement('div');
                mealSection.className = `meal-section ${mealType}`;
                mealSection.innerHTML = `
                    <div class="meal-info">
                        <div class="meal-image">
                            <img src="${icon}" alt="${mealTypeText}">
                        </div>
                        <div class="meal-details">
                            <h3 class="meal-name">${mealName}</h3>
                            <span class="meal-type">${mealTypeText}</span>
                        </div>
                        <div class="meal-calories">
                            <span class="calorie-value">${calories}</span>
                            <span class="calorie-unit">kcal</span>
                        </div>
                    </div>
                `;
                newCard.appendChild(mealSection);
            });

            // Add total calories
            let total = 0;
            ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                const editSection = document.querySelector(`.meal-section-edit.${mealType}`);
                const calories = parseInt(editSection.querySelector('.meal-calories').textContent);
                if (!isNaN(calories)) total += calories;
            });

            const totalCaloriesDiv = document.createElement('div');
            totalCaloriesDiv.className = 'total-calories';
            totalCaloriesDiv.innerHTML = `
                <span>แคลอรี่ทั้งหมด:</span>
                <span class="total-calorie-value">${total}</span>
                <span class="calorie-unit">kcal</span>
            `;
            newCard.appendChild(totalCaloriesDiv);

            // Add event listeners to new buttons
            newCard.querySelector('.edit-btn').addEventListener('click', () => {
                currentDailyMealCard = newCard;
                populateEditModal(newCard);
                elements.editDailyMealModal.style.display = 'flex';
            });

            newCard.querySelector('.delete-btn').addEventListener('click', () => {
                currentDailyMealCard = newCard;
                elements.deleteConfirmModal.style.display = 'flex';
            });

            // Add the new card to the content
            dailyMealContent.appendChild(newCard);
        }

        // Update or create meal sections
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            const editSection = document.querySelector(`.meal-section-edit.${mealType}`);
            const mealName = editSection.querySelector('.meal-name').textContent;
            const calories = editSection.querySelector('.meal-calories').textContent.split(' ')[0];
            const icon = editSection.querySelector('.meal-icon').src;
            const mealTypeText = editSection.querySelector('.meal-type-label').textContent;

            let mealSection = currentDailyMealCard ? 
                currentDailyMealCard.querySelector(`.meal-section.${mealType}`) : 
                document.querySelector(`.daily-meal-card:last-child .meal-section.${mealType}`);

            if (!mealSection) {
                mealSection = document.createElement('div');
                mealSection.className = `meal-section ${mealType}`;
                const ref = mealType === 'breakfast' ? 
                    (currentDailyMealCard ? 
                        currentDailyMealCard.querySelector('.meal-section.lunch') || 
                        currentDailyMealCard.querySelector('.meal-section.dinner') : 
                        document.querySelector(`.daily-meal-card:last-child .meal-section.lunch`) || 
                        document.querySelector(`.daily-meal-card:last-child .meal-section.dinner`)) : 
                    mealType === 'lunch' ? 
                        (currentDailyMealCard ? 
                            currentDailyMealCard.querySelector('.meal-section.dinner') : 
                            document.querySelector(`.daily-meal-card:last-child .meal-section.dinner`)) : 
                        null;

                const targetCard = currentDailyMealCard || document.querySelector('.daily-meal-card:last-child');
                if (ref) {
                    targetCard.insertBefore(mealSection, ref);
                } else {
                    const header = targetCard.querySelector('.daily-meal-header');
                    header.insertAdjacentElement('afterend', mealSection);
                }
            }

            if (mealName === 'เมนูยังไม่ถูกเลือก' || calories === '0') {
                mealSection.innerHTML = `
                    <div class="meal-info">
                        <div class="meal-image">
                            <img src="${icon}" alt="${mealTypeText}">
                        </div>
                        <div class="meal-details">
                            <h3 class="meal-name">เมนูยังไม่ถูกเลือก</h3>
                            <span class="meal-type">${mealTypeText}</span>
                        </div>
                        <div class="meal-calories">
                            <span class="calorie-value">0</span>
                            <span class="calorie-unit">kcal</span>
                        </div>
                    </div>
                `;
            } else {
                mealSection.innerHTML = `
                    <div class="meal-info">
                        <div class="meal-image">
                            <img src="${icon}" alt="${mealTypeText}">
                        </div>
                        <div class="meal-details">
                            <h3 class="meal-name">${mealName}</h3>
                            <span class="meal-type">${mealTypeText}</span>
                        </div>
                        <div class="meal-calories">
                            <span class="calorie-value">${calories}</span>
                            <span class="calorie-unit">kcal</span>
                        </div>
                    </div>
                `;
            }
        });

        // Update total calories
        let total = 0;
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            const editSection = document.querySelector(`.meal-section-edit.${mealType}`);
            const calories = parseInt(editSection.querySelector('.meal-calories').textContent);
            if (!isNaN(calories)) total += calories;
        });

        const targetCard = currentDailyMealCard || document.querySelector('.daily-meal-card:last-child');
        targetCard.querySelector('.total-calorie-value').textContent = total;

        // Close modal and show success message
        elements.editDailyMealModal.style.display = 'none';
        
        // Update success modal content
        const successModal = elements.deleteSuccessModal;
        successModal.querySelector('h2').textContent = currentDailyMealCard ? 'แก้ไขสำเร็จ' : 'เพิ่มเมนูสำเร็จ';
        successModal.style.display = 'flex';

        // Sort cards after adding/editing
        sortDailyMealCards();

        // Reset currentDailyMealCard
        currentDailyMealCard = null;
    });

    // Confirm delete
    elements.confirmDeleteBtn.addEventListener('click', () => {
        if (menuToDelete) {
            menuToDelete.remove();
            elements.deleteConfirmModal.style.display = 'none';
            // Update success modal content for delete
            const successModal = elements.deleteSuccessModal;
            successModal.querySelector('h2').textContent = 'ลบเมนูเสร็จสิ้น';
            successModal.style.display = 'flex';
            menuToDelete = null;
        } else if (currentDailyMealCard) {
            currentDailyMealCard.remove();
            elements.deleteConfirmModal.style.display = 'none';
            // Update success modal content for delete
            const successModal = elements.deleteSuccessModal;
            successModal.querySelector('h2').textContent = 'ลบเมนูเสร็จสิ้น';
            successModal.style.display = 'flex';
            currentDailyMealCard = null;
        }
    });

    // Cancel delete
    elements.cancelDeleteBtn.addEventListener('click', () => {
        elements.deleteConfirmModal.style.display = 'none';
        menuToDelete = null;
        currentDailyMealCard = null;
    });

    // Close success modal
    elements.closeSuccessBtn.addEventListener('click', () => {
        elements.deleteSuccessModal.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.deleteConfirmModal) {
            elements.deleteConfirmModal.style.display = 'none';
            menuToDelete = null;
            currentDailyMealCard = null;
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

    // Daily Meal Edit functionality
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentDailyMealCard = button.closest('.daily-meal-card');
            populateEditModal(currentDailyMealCard);
            elements.editDailyMealModal.style.display = 'flex';
        });
    });

    // Populate edit modal with current meal data
    function populateEditModal(card) {
        // Set date
        const dateText = card.querySelector('.date-info .date').textContent;
        const [day, month, year] = dateText.replace('วันที่ ', '').split(' ');
        const thaiMonths = {
            'มกราคม': '01', 'กุมภาพันธ์': '02', 'มีนาคม': '03', 'เมษายน': '04',
            'พฤษภาคม': '05', 'มิถุนายน': '06', 'กรกฎาคม': '07', 'สิงหาคม': '08',
            'กันยายน': '09', 'ตุลาคม': '10', 'พฤศจิกายน': '11', 'ธันวาคม': '12'
        };
        const date = `${year}-${thaiMonths[month]}-${day.padStart(2, '0')}`;
        document.getElementById('editDate').value = date;

        // Populate meal sections
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            const mealSection = card.querySelector(`.meal-section.${mealType}`);
            const editSection = document.querySelector(`.meal-section-edit.${mealType}`);
            const selectBtn = editSection.querySelector('.select-new-meal-btn');
            const deleteBtn = editSection.querySelector('.delete-meal-btn');

            let mealName, calories, icon;
            if (mealSection) {
                mealName = mealSection.querySelector('.meal-name').textContent;
                calories = mealSection.querySelector('.calorie-value').textContent;
                icon = mealSection.querySelector('.meal-image img').src;
            } else {
                mealName = 'เมนูยังไม่ถูกเลือก';
                calories = '0';
                icon = editSection.querySelector('.meal-icon').src;
            }
            editSection.querySelector('.meal-name').textContent = mealName;
            editSection.querySelector('.meal-calories').textContent = `${calories} kcal`;
            editSection.querySelector('.meal-icon').src = icon;

            if (mealName === 'เมนูยังไม่ถูกเลือก' || calories === '0' || calories === '0 kcal') {
                editSection.classList.add('empty');
                selectBtn.style.display = 'flex';
                deleteBtn.style.display = 'none';
            } else {
                editSection.classList.remove('empty');
                selectBtn.style.display = 'none';
                deleteBtn.style.display = 'flex';
            }
        });

        // Update total calories
        let total = 0;
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            const editSection = document.querySelector(`.meal-section-edit.${mealType}`);
            const calories = parseInt(editSection.querySelector('.meal-calories').textContent);
            if (!isNaN(calories)) total += calories;
        });
        document.querySelector('.total-calories-edit .total-calorie-value').textContent = total;
    }

    // Handle menu selection confirmation
    elements.confirmMenuBtn.addEventListener('click', () => {
        if (selectedMenu && selectedMealType) {
            const editSection = document.querySelector(`.meal-section-edit.${selectedMealType}`);
            if (editSection) {
                editSection.querySelector('.meal-name').textContent = selectedMenu.name;
                editSection.querySelector('.meal-calories').textContent = `${selectedMenu.calories} kcal`;
                editSection.classList.remove('empty');
                // Hide select-new-meal-btn, show delete-meal-btn
                editSection.querySelector('.select-new-meal-btn').style.display = 'none';
                editSection.querySelector('.delete-meal-btn').style.display = 'flex';
                updateTotalCaloriesEdit();
                elements.selectMenuModal.style.display = 'none';
                elements.editDailyMealModal.style.display = 'flex';
                // Re-populate modal to ensure state is correct and keep currentDailyMealCard
                // (Do not call resetSelection() here)
                //populateEditModal(currentDailyMealCard); // Not needed, just keep state
            }
        }
    });

    // Handle meal deletion (delete icon in edit modal)
    document.querySelectorAll('.meal-section-edit .delete-meal-btn').forEach(button => {
        button.addEventListener('click', () => {
            const mealSection = button.closest('.meal-section-edit');
            mealSection.querySelector('.meal-name').textContent = 'เมนูยังไม่ถูกเลือก';
            mealSection.querySelector('.meal-calories').textContent = '0 kcal';
            mealSection.classList.add('empty');
            // Show select-new-meal-btn, hide delete-meal-btn
            mealSection.querySelector('.select-new-meal-btn').style.display = 'flex';
            button.style.display = 'none';
            updateTotalCaloriesEdit();
        });
    });

    // Handle icon selection
    document.querySelectorAll('.icon-options img').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            const iconSelector = icon.closest('.icon-selector');
            const mainIcon = iconSelector.querySelector('.meal-icon');
            mainIcon.src = icon.src;
            mainIcon.dataset.icon = icon.dataset.icon;
        });
    });

    // Handle menu selection
    document.querySelectorAll('.select-new-meal-btn').forEach(button => {
        button.addEventListener('click', () => {
            const mealSection = button.closest('.meal-section-edit');
            selectedMealType = mealSection.classList[1]; // breakfast, lunch, or dinner
            showMenuSelection();
        });
    });

    // Show menu selection modal
    function showMenuSelection() {
        elements.editDailyMealModal.style.display = 'none';
        elements.selectMenuModal.style.display = 'flex';
        
        // Populate menu list
        const menuList = elements.selectMenuModal.querySelector('.menu-list');
        menuList.innerHTML = '';
        
        // Get all menu cards from My Menu
        const menuCards = document.querySelectorAll('.menu-card');
        menuCards.forEach(card => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <div class="menu-info">
                    <span class="menu-name">${card.querySelector('.menu-name').textContent}</span>
                </div>
                <div class="calorie-info">
                    <span class="calorie-value">${card.querySelector('.calorie-value').textContent}</span>
                    <span class="calorie-unit">kcal</span>
                </div>
            `;
            
            menuItem.addEventListener('click', () => {
                document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('selected'));
                menuItem.classList.add('selected');
                selectedMenu = {
                    name: card.querySelector('.menu-name').textContent,
                    calories: card.querySelector('.calorie-value').textContent
                };
            });
            
            menuList.appendChild(menuItem);
        });
    }

    // Update total calories in edit modal
    function updateTotalCaloriesEdit() {
        const total = Array.from(document.querySelectorAll('.meal-section-edit .meal-calories'))
            .reduce((sum, el) => sum + parseInt(el.textContent), 0);
        document.querySelector('.total-calories-edit .total-calorie-value').textContent = total;
    }

    // Reset selection
    function resetSelection() {
        selectedMealType = null;
        selectedMenu = null;
        currentDailyMealCard = null;
    }

    // Cancel edit
    elements.cancelEditBtn.addEventListener('click', () => {
        elements.editDailyMealModal.style.display = 'none';
        resetSelection();
    });

    // Cancel menu selection
    elements.cancelMenuBtn.addEventListener('click', () => {
        elements.selectMenuModal.style.display = 'none';
        elements.editDailyMealModal.style.display = 'flex';
    });

    // Add Daily Meal button functionality
    document.querySelector('.add-daily-meal-btn').addEventListener('click', () => {
        // Reset the edit modal
        document.getElementById('editDate').value = new Date().toISOString().split('T')[0];
        
        // Reset all meal sections
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            const editSection = document.querySelector(`.meal-section-edit.${mealType}`);
            editSection.querySelector('.meal-name').textContent = 'เมนูยังไม่ถูกเลือก';
            editSection.querySelector('.meal-calories').textContent = '0 kcal';
            editSection.classList.add('empty');
            editSection.querySelector('.select-new-meal-btn').style.display = 'flex';
            editSection.querySelector('.delete-meal-btn').style.display = 'none';
        });

        // Reset total calories
        document.querySelector('.total-calories-edit .total-calorie-value').textContent = '0';

        // Show the edit modal
        elements.editDailyMealModal.style.display = 'flex';
    });

    // Initialize icon selectors when the page loads
    initializeIconSelectors();

    // Add event listeners for icon selection
    document.addEventListener('click', function(e) {
        if (e.target.closest('.icon-options img')) {
            const selectedIcon = e.target;
            const iconSelector = selectedIcon.closest('.icon-selector');
            const mainIcon = iconSelector.querySelector('.meal-icon');
            mainIcon.src = selectedIcon.src;
        }
    });

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

    // Initialize page on load
    initializePage();
});