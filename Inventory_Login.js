document.addEventListener("DOMContentLoaded", function () {
    // Meal Icons Object
    const mealIcons = {
        breakfast: [
            "https://cdn-icons-png.flaticon.com/512/3480/3480823.png",
            "https://cdn-icons-png.flaticon.com/512/3274/3274099.png",
            "https://cdn-icons-png.flaticon.com/512/12009/12009846.png"
        ],
        lunch: [
            "https://cdn-icons-png.flaticon.com/512/3480/3480823.png",
            "https://cdn-icons-png.flaticon.com/512/3274/3274099.png",
            "https://cdn-icons-png.flaticon.com/512/12009/12009846.png"
        ],
        dinner: [
            "https://cdn-icons-png.flaticon.com/512/3480/3480823.png",
            "https://cdn-icons-png.flaticon.com/512/3274/3274099.png",
            "https://cdn-icons-png.flaticon.com/512/12009/12009846.png"
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
    let isEdit = false;

    // Button categories for each menu type
    const buttonCategories = {
        'เมนูอาหารของฉัน': [],
        'มื้ออาหารของฉัน': [],
        'สุขภาพของฉัน': []
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

    // Show or hide search bar based on menu cards and search results
    function showOrHideSearchBar() {
        const searchBar = document.querySelector('.search-bar');
        const menuGrid = document.querySelector('.menu-grid');
        const searchInput = searchBar?.querySelector('input');
        const searchText = searchInput?.value?.toLowerCase() || '';
        const noResultMessage = document.querySelector('.no-search-result-message');
        
        // ถ้าไม่มีเมนูเลย ให้ซ่อน search bar
        if (!menuGrid || !menuGrid.querySelector('.menu-card')) {
            if (searchBar) searchBar.style.display = 'none';
            return;
        }

        // ถ้ามีเมนู ให้แสดง search bar
        if (searchBar) searchBar.style.display = 'block';

        // ถ้ามีการค้นหา ให้ตรวจสอบและแสดงเฉพาะเมนูที่ตรงกับคำค้นหา
        if (searchText) {
            const menuCards = menuGrid.querySelectorAll('.menu-card');
            let hasMatch = false;
            
            menuCards.forEach(card => {
                const menuName = card.querySelector('.menu-name')?.textContent?.toLowerCase() || '';
                if (menuName.includes(searchText)) {
                    card.style.display = 'block';
                    hasMatch = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // ถ้าไม่พบเมนูที่ตรงกับคำค้นหา ให้ซ่อน menu grid และแสดงข้อความ
            if (menuGrid) {
                menuGrid.style.display = hasMatch ? 'flex' : 'none';
                if (!hasMatch) {
                    if (!noResultMessage) {
                        const messageDiv = document.createElement('div');
                        messageDiv.className = 'no-search-result-message';
                        messageDiv.style.textAlign = 'center';
                        messageDiv.style.color = '#888';
                        messageDiv.style.fontSize = '1.1rem';
                        messageDiv.style.margin = '32px 0';
                        messageDiv.textContent = 'ไม่มีชื่อเมนูที่บันทึกไว้';
                        menuGrid.parentNode.insertBefore(messageDiv, menuGrid.nextSibling);
                    } else {
                        noResultMessage.style.display = 'block';
                    }
                } else if (noResultMessage) {
                    noResultMessage.style.display = 'none';
                }
            }
        } else {
            // ถ้าไม่มีการค้นหา ให้แสดง menu grid ทั้งหมดและซ่อนข้อความ
            if (menuGrid) {
                menuGrid.style.display = 'flex';
                menuGrid.querySelectorAll('.menu-card').forEach(card => {
                    card.style.display = 'block';
                });
                if (noResultMessage) {
                    noResultMessage.style.display = 'none';
                }
            }
        }
    }

    // Show or hide daily meal search bar and handle search
    function showOrHideDailyMealSearchBar() {
        const searchBar = document.querySelector('.search-bar');
        const dailyMealContent = document.querySelector('.daily-meal-content');
        const searchInput = searchBar?.querySelector('input');
        const searchText = searchInput?.value?.toLowerCase() || '';
        let noResultMessage = document.querySelector('.no-dailymeal-search-result-message');
        
        // ถ้าไม่มีรายการ Daily Meal เลย ให้ซ่อน search bar
        if (!dailyMealContent || !dailyMealContent.querySelector('.daily-meal-card')) {
            if (searchBar) searchBar.style.display = 'none';
            if (noResultMessage) noResultMessage.style.display = 'none';
            return;
        }

        // ถ้ามีรายการ Daily Meal ให้แสดง search bar
        if (searchBar) searchBar.style.display = 'block';

        // ถ้ามีการค้นหา ให้ตรวจสอบและแสดงเฉพาะ Daily Meal ที่มีเมนูตรงกับคำค้นหา
        if (searchText) {
            const dailyMealCards = dailyMealContent.querySelectorAll('.daily-meal-card');
            let hasMatch = false;
            
            dailyMealCards.forEach(card => {
                const mealSections = card.querySelectorAll('.meal-section');
                let cardHasMatch = false;
                
                mealSections.forEach(section => {
                    const mealItems = section.querySelectorAll('.meal-list-item');
                    mealItems.forEach(item => {
                        const menuName = item.querySelector('.meal-name')?.textContent?.toLowerCase() || '';
                        if (menuName.includes(searchText)) {
                            cardHasMatch = true;
                            hasMatch = true;
                        }
                    });
                });
                // แสดง/ซ่อน Daily Meal card ตามผลการค้นหา
                card.style.display = cardHasMatch ? 'block' : 'none';
            });

            // ถ้าไม่พบเมนูที่ตรงกับคำค้นหาเลย ให้ซ่อน daily meal content และแสดงข้อความ
            if (dailyMealContent) {
                dailyMealContent.style.display = hasMatch ? 'block' : 'none';
                if (!hasMatch) {
                    if (!noResultMessage) {
                        noResultMessage = document.createElement('div');
                        noResultMessage.className = 'no-dailymeal-search-result-message';
                        noResultMessage.style.textAlign = 'center';
                        noResultMessage.style.color = '#888';
                        noResultMessage.style.fontSize = '1.1rem';
                        noResultMessage.style.margin = '32px 0';
                        noResultMessage.textContent = 'ไม่มีชื่อเมนูที่บันทึกไว้';
                        dailyMealContent.parentNode.insertBefore(noResultMessage, dailyMealContent.nextSibling);
                    } else {
                        noResultMessage.style.display = 'block';
                    }
                } else if (noResultMessage) {
                    noResultMessage.style.display = 'none';
                }
            }
        } else {
            // ถ้าไม่มีการค้นหา ให้แสดง daily meal content ทั้งหมดและซ่อนข้อความ
            if (dailyMealContent) {
                dailyMealContent.style.display = 'block';
                dailyMealContent.querySelectorAll('.daily-meal-card').forEach(card => {
                    card.style.display = 'block';
                });
                if (noResultMessage) {
                    noResultMessage.style.display = 'none';
                }
            }
        }
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
        if (menuType === 'เมนูอาหารของฉัน') {
            elements.rightContent.classList.add('my-menu-active');
            document.querySelector('.menu-container').style.display = 'flex';
            sortMenuCards();
            showOrHideSearchBar();
        } else if (menuType === 'มื้ออาหารของฉัน') {
            elements.rightContent.classList.add('daily-meal-active');
            document.querySelector('.daily-meal-content').style.display = 'block';
            sortDailyMealCards();
            showOrHideDailyMealSearchBar();
        } else if (menuType === 'สุขภาพของฉัน') {
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
        const menuGrid = document.querySelector('.menu-grid');
        const menuCards = Array.from(menuGrid.querySelectorAll('.menu-card'));
        const thaiMonths = {
            'มกราคม': '01', 'กุมภาพันธ์': '02', 'มีนาคม': '03', 'เมษายน': '04',
            'พฤษภาคม': '05', 'มิถุนายน': '06', 'กรกฎาคม': '07', 'สิงหาคม': '08',
            'กันยายน': '09', 'ตุลาคม': '10', 'พฤศจิกายน': '11', 'ธันวาคม': '12'
        };
        menuCards.sort((a, b) => {
            // ดึงวันที่จาก .menu-date หรือ data-created
            let dateA = a.querySelector('.menu-date')?.textContent.replace('Created:', '').trim() || a.getAttribute('data-created') || '';
            let dateB = b.querySelector('.menu-date')?.textContent.replace('Created:', '').trim() || b.getAttribute('data-created') || '';
            // รองรับรูปแบบวันที่ไทย (วันที่ dd เดือน yyyy)
            if (dateA.startsWith('วันที่')) {
                const [_, day, month, year] = dateA.split(' ');
                dateA = `${year}-${thaiMonths[month]}-${day.padStart(2, '0')}`;
            }
            if (dateB.startsWith('วันที่')) {
                const [_, day, month, year] = dateB.split(' ');
                dateB = `${year}-${thaiMonths[month]}-${day.padStart(2, '0')}`;
            }
            // แปลงเป็น Date object
            const dA = new Date(dateA);
            const dB = new Date(dateB);
            return dB - dA;
        });
        menuCards.forEach(card => menuGrid.appendChild(card));
        showOrHideNoMyMenuMessage();
        showOrHideSearchBar();
    }

    // Sort daily meal cards by date
    function sortDailyMealCards() {
        const dailyMealContent = document.querySelector('.daily-meal-content');
        const dailyMealCards = Array.from(dailyMealContent.querySelectorAll('.daily-meal-card'));
        
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
        showOrHideNoDailyMealMessage();
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

    // State for edit modal
    let editMeals = {
        breakfast: [],
        lunch: [],
        dinner: []
    };

    // Render meal list for a meal type
    function renderMealList(mealType) {
        const mealListDiv = document.querySelector(`.meal-section-edit.${mealType} .meal-list`);
        mealListDiv.innerHTML = '';
        editMeals[mealType].forEach((meal, idx) => {
            const item = document.createElement('div');
            item.className = 'meal-list-item';
            item.innerHTML = `
                <span class="meal-name">${meal.name}</span>
                <span class="meal-calories">${meal.calories} kcal</span>
                <button class="delete-meal-btn" data-idx="${idx}">
                    <img src="https://cdn-icons-png.flaticon.com/512/3096/3096673.png" alt="Delete">
                </button>
            `;
            item.querySelector('.delete-meal-btn').onclick = () => {
                editMeals[mealType].splice(idx, 1);
                renderMealList(mealType);
                updateTotalCaloriesEdit();
            };
            mealListDiv.appendChild(item);
        });
    }

    // Add meal button functionality
    function setupAddMealBtns() {
        document.querySelectorAll('.meal-section-edit').forEach(section => {
            const btn = section.querySelector('.add-meal-btn');
            if (btn) {
                btn.onclick = () => {
                    selectedMealType = section.classList[1];
                    showMenuSelection();
                };
            }
        });
    }

    // Handle menu selection confirmation
    elements.confirmMenuBtn.addEventListener('click', () => {
        if (selectedMenu && selectedMealType) {
            editMeals[selectedMealType].push({...selectedMenu});
            renderMealList(selectedMealType);
            updateTotalCaloriesEdit();
            elements.selectMenuModal.style.display = 'none';
            elements.editDailyMealModal.style.display = 'flex';
        }
    });

    // Update total calories in edit modal
    function updateTotalCaloriesEdit() {
        let total = 0;
        Object.values(editMeals).forEach(meals => {
            meals.forEach(meal => {
                total += parseInt(meal.calories);
            });
        });
        document.querySelector('.total-calories-edit .total-calorie-value').textContent = total;
    }

    // Populate edit modal with current meal data
    function populateEditModal(card) {
        // Reset editMeals
        editMeals = { breakfast: [], lunch: [], dinner: [] };
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
        // Populate meal sections (อ่านทุกเมนูในแต่ละมื้อ)
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            const mealSection = card.querySelector(`.meal-section.${mealType}`);
            editMeals[mealType] = [];
            if (mealSection) {
                // อ่านทุก .meal-list-item ภายใน .meal-section
                const mealItems = mealSection.querySelectorAll('.meal-list-item');
                mealItems.forEach(item => {
                    const name = item.querySelector('.meal-name')?.childNodes[0]?.textContent.trim() || '';
                    const caloriesText = item.querySelector('.menu-calories')?.textContent || '';
                    // รองรับ (450 kcal), (450kcal), (450) หรือ ( 450 kcal )
                    const caloriesMatch = caloriesText.match(/\((\d+)\s*(kcal)?\)/i);
                    const calories = caloriesMatch ? caloriesMatch[1] : '0';
                    if (name && name !== 'เมนูยังไม่ถูกเลือก') {
                        editMeals[mealType].push({ name, calories });
                    }
                });
            }
            renderMealList(mealType);
        });
        updateTotalCaloriesEdit();
    }

    // Save edit changes
    const saveEditBtn = document.getElementById('saveEdit');
    if (saveEditBtn) {
        saveEditBtn.onclick = () => {
            const newDate = new Date(document.getElementById('editDate').value);
            const thaiMonths = [
                'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
            ];
            const dateText = `วันที่ ${newDate.getDate()} ${thaiMonths[newDate.getMonth()]} ${newDate.getFullYear()}`;
            if (currentDailyMealCard) {
                // Update existing card: ลบ meal-section เดิมและเติมใหม่
                currentDailyMealCard.querySelector('.date-info .date').textContent = dateText;
                // ลบ meal-section เดิม
                currentDailyMealCard.querySelectorAll('.meal-section').forEach(e => e.remove());
                // ลบ total-calories เดิม
                const oldTotal = currentDailyMealCard.querySelector('.total-calories');
                if (oldTotal) oldTotal.remove();
                // เติม meal-section ใหม่
                ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                    const mealSection = document.createElement('div');
                    mealSection.className = `meal-section ${mealType}`;
                    const mealTypeLabel = mealType === 'breakfast' ? 'มื้อเช้า' : mealType === 'lunch' ? 'มื้อกลางวัน' : 'มื้อเย็น';
                    const iconUrl = document.querySelector(`.meal-section-edit.${mealType} .meal-icon`).src;
                    let mealListHtml = '';
                    if (editMeals[mealType].length > 0) {
                        mealListHtml = editMeals[mealType].map(m => `
                            <div class="meal-list-item web-view">
                                <span class="meal-name">${m.name} <span class="menu-calories">(${m.calories} kcal)</span></span>
                            </div>
                        `).join('');
                    } else {
                        mealListHtml = `<div class="meal-list-item web-view"><span class="meal-name">เมนูยังไม่ถูกเลือก</span></div>`;
                    }
                    const totalMealCalories = editMeals[mealType].reduce((sum, m) => sum + parseInt(m.calories), 0);
                    mealSection.innerHTML = `
                        <div class="meal-info web-view" style="align-items:flex-start;">
                            <div class="meal-image">
                                <img src="${iconUrl}" alt="${mealTypeLabel}">
                            </div>
                            <div class="meal-details" style="flex:1;">
                                <span class="meal-type meal-type-title">${mealTypeLabel}</span>
                                <div class="meal-list">${mealListHtml}</div>
                            </div>
                            <div class="meal-calories meal-total-calories-inline">
                                <span class="calorie-value">${totalMealCalories}</span>
                                <span class="calorie-unit">kcal</span>
                            </div>
                        </div>
                    `;
                    currentDailyMealCard.appendChild(mealSection);
                });
                // เติม total-calories ใหม่
                const totalCaloriesDiv = document.createElement('div');
                totalCaloriesDiv.className = 'total-calories';
                const totalCalories = Object.values(editMeals).reduce((sum, meals) => 
                    sum + meals.reduce((mealSum, meal) => mealSum + parseInt(meal.calories), 0), 0
                );
                totalCaloriesDiv.innerHTML = `
                    <span>แคลอรี่ทั้งหมด:</span>
                    <span class="total-calorie-value">${totalCalories}</span>
                    <span class="calorie-unit">kcal</span>
                `;
                currentDailyMealCard.appendChild(totalCaloriesDiv);
                // reset ตัวแปรหลังบันทึก
                currentDailyMealCard = null;
            } else {
                // เพิ่มใหม่
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
                // Add meal sections (เหมือนกับตอนแก้ไข)
                ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                    const mealSection = document.createElement('div');
                    mealSection.className = `meal-section ${mealType}`;
                    const mealTypeLabel = mealType === 'breakfast' ? 'มื้อเช้า' : mealType === 'lunch' ? 'มื้อกลางวัน' : 'มื้อเย็น';
                    const iconUrl = document.querySelector(`.meal-section-edit.${mealType} .meal-icon`).src;
                    let mealListHtml = '';
                    if (editMeals[mealType].length > 0) {
                        mealListHtml = editMeals[mealType].map(m => `
                            <div class="meal-list-item web-view">
                                <span class="meal-name">${m.name} <span class="menu-calories">(${m.calories} kcal)</span></span>
                            </div>
                        `).join('');
                    } else {
                        mealListHtml = `<div class="meal-list-item web-view"><span class="meal-name">เมนูยังไม่ถูกเลือก</span></div>`;
                    }
                    const totalMealCalories = editMeals[mealType].reduce((sum, m) => sum + parseInt(m.calories), 0);
                    mealSection.innerHTML = `
                        <div class="meal-info web-view" style="align-items:flex-start;">
                            <div class="meal-image">
                                <img src="${iconUrl}" alt="${mealTypeLabel}">
                            </div>
                            <div class="meal-details" style="flex:1;">
                                <span class="meal-type meal-type-title">${mealTypeLabel}</span>
                                <div class="meal-list">${mealListHtml}</div>
                            </div>
                            <div class="meal-calories meal-total-calories-inline">
                                <span class="calorie-value">${totalMealCalories}</span>
                                <span class="calorie-unit">kcal</span>
                            </div>
                        </div>
                    `;
                    newCard.appendChild(mealSection);
                });
                // Add total calories
                const totalCaloriesDiv = document.createElement('div');
                totalCaloriesDiv.className = 'total-calories';
                const totalCalories = Object.values(editMeals).reduce((sum, meals) => 
                    sum + meals.reduce((mealSum, meal) => mealSum + parseInt(meal.calories), 0), 0
                );
                totalCaloriesDiv.innerHTML = `
                    <span>แคลอรี่ทั้งหมด:</span>
                    <span class="total-calorie-value">${totalCalories}</span>
                    <span class="calorie-unit">kcal</span>
                `;
                newCard.appendChild(totalCaloriesDiv);
                // Add event listeners to new buttons
                newCard.querySelector('.edit-btn').addEventListener('click', () => {
                    currentDailyMealCard = newCard;
                    populateEditModal(newCard);
                    document.getElementById('editDailyMealModal').style.display = 'flex';
                });
                newCard.querySelector('.delete-btn').addEventListener('click', () => {
                    currentDailyMealCard = newCard;
                    document.getElementById('deleteConfirmModal').style.display = 'flex';
                });
                // Add the new card to the content
                dailyMealContent.appendChild(newCard);
                // เรียงกล่องตามวันที่ (ใหม่สุดอยู่บน)
                sortDailyMealCards();
            }
            // Close modal and show success message
            document.getElementById('editDailyMealModal').style.display = 'none';
            const successModal = document.getElementById('deleteSuccessModal');
            if (isEdit) {
                successModal.querySelector('h2').textContent = 'แก้ไขสำเร็จ';
            } else {
                successModal.querySelector('h2').textContent = 'เพิ่มเมนูสำเร็จ';
            }
            successModal.style.display = 'flex';
            // Sort cards after adding/editing
            sortDailyMealCards();
            // Reset currentDailyMealCard
            currentDailyMealCard = null;
            isEdit = false;
            setupEditButtons();
            // เรียกให้แสดงช่อง search ทันทีหลังเพิ่มเมนูต่อวัน
            showOrHideDailyMealSearchBar();
        };
    }

    // Setup add meal buttons on page load
    setupAddMealBtns();

    // Delete functionality for Daily Meal
    document.querySelectorAll('.daily-meal-card .delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentDailyMealCard = button.closest('.daily-meal-card');
            elements.deleteConfirmModal.style.display = 'flex';
        });
    });

    // Confirm delete
    elements.confirmDeleteBtn.addEventListener('click', () => {
        if (menuToDelete) {
            // ลบเฉพาะเมนูอาหารของฉัน
            menuToDelete.remove();
            elements.deleteConfirmModal.style.display = 'none';
            // Update success modal content for delete
            const successModal = elements.deleteSuccessModal;
            successModal.querySelector('h2').textContent = 'ลบเมนูเสร็จสิ้น';
            successModal.style.display = 'flex';
            menuToDelete = null;
            showOrHideNoMyMenuMessage();
            showOrHideSearchBar();
            // ไม่ต้องเรียก showOrHideNoDailyMealMessage() หรือ showOrHideDailyMealSearchBar() ที่นี่
        } else if (currentDailyMealCard) {
            // ลบเฉพาะมื้ออาหารของฉัน
            currentDailyMealCard.remove();
            elements.deleteConfirmModal.style.display = 'none';
            // Update success modal content for delete
            const successModal = elements.deleteSuccessModal;
            successModal.querySelector('h2').textContent = 'ลบเมนูเสร็จสิ้น';
            successModal.style.display = 'flex';
            currentDailyMealCard = null;
            showOrHideNoDailyMealMessage();
            showOrHideDailyMealSearchBar();
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
    function setupEditButtons() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.onclick = () => {
                currentDailyMealCard = button.closest('.daily-meal-card');
                isEdit = true;
                populateEditModal(currentDailyMealCard);
                document.querySelector('#editDailyMealModal .modal-header h2').textContent = 'แก้ไขมื้ออาหาร';
                document.getElementById('editDailyMealModal').style.display = 'flex';
            };
        });
    }

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
        if (menuCards.length === 0) {
            // ถ้าไม่มีเมนูเลย ให้แสดงข้อความ
            const emptyMsg = document.createElement('div');
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.color = '#888';
            emptyMsg.style.fontSize = '1.1rem';
            emptyMsg.style.margin = '32px 0';
            emptyMsg.textContent = 'ขณะนี้ไม่มีเมนูอาหารที่บันทึกไว้';
            menuList.appendChild(emptyMsg);
            return;
        }
        menuCards.forEach(card => {
            const menuName = card.querySelector('.menu-name')?.textContent || '';
            const calorieValue = card.querySelector('.calorie-value')?.textContent || '';
            if (!menuName || !calorieValue) return;
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <div class="menu-info">
                    <span class="menu-name">${menuName}</span>
                </div>
                <div class="calorie-info">
                    <span class="calorie-value">${calorieValue}</span>
                    <span class="calorie-unit">kcal</span>
                </div>
            `;
            menuItem.addEventListener('click', () => {
                document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('selected'));
                menuItem.classList.add('selected');
                selectedMenu = {
                    name: menuName,
                    calories: calorieValue
                };
            });
            menuList.appendChild(menuItem);
        });
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
    const addDailyMealBtn = document.querySelector('.add-daily-meal-btn');
    if (addDailyMealBtn) {
        addDailyMealBtn.addEventListener('click', () => {
            editMeals = { breakfast: [], lunch: [], dinner: [] };
            document.getElementById('editDate').value = new Date().toISOString().split('T')[0];
            currentDailyMealCard = null;
            isEdit = false;
            ['breakfast', 'lunch', 'dinner'].forEach(mealType => renderMealList(mealType));
            updateTotalCaloriesEdit();
            document.querySelector('#editDailyMealModal .modal-header h2').textContent = 'เพิ่มมื้ออาหารของฉัน';
            document.getElementById('editDailyMealModal').style.display = 'flex';
        });
    }

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
            header.querySelector('span').textContent === 'เมนูอาหารของฉัน'
        );
        if (myMenuHeader) {
            myMenuHeader.click();
        }
        sortMenuCards();
    }

    // Initialize page on load
    initializePage();

    function showOrHideNoDailyMealMessage() {
        const dailyMealContent = document.querySelector('.daily-meal-content');
        const noMsg = dailyMealContent.querySelector('.no-daily-meal-message');
        const hasCard = dailyMealContent.querySelector('.daily-meal-card');
        if (noMsg) {
            noMsg.style.display = hasCard ? 'none' : 'block';
        }
    }

    function showOrHideNoMyMenuMessage() {
        const menuContainer = document.querySelector('.menu-container');
        const noMsg = menuContainer.querySelector('.no-my-menu-message');
        const hasCard = menuContainer.querySelector('.menu-card');
        if (noMsg) {
            noMsg.style.display = hasCard ? 'none' : 'block';
        }
    }

    // เรียกใช้หลังเพิ่ม/ลบ/เรียง .menu-card ทุกครั้ง เช่นในฟังก์ชัน sortMenuCards, หลังลบ/เพิ่มเมนู
    const menuGrid = document.querySelector('.menu-grid');
    if (menuGrid) {
        const observer = new MutationObserver(function() {
            showOrHideNoMyMenuMessage();
            showOrHideSearchBar();
        });
        observer.observe(menuGrid, { childList: true, subtree: false });
        // เรียกครั้งแรกหลังโหลดหน้า
        showOrHideNoMyMenuMessage();
        showOrHideSearchBar();
    }

    // --- Popup รายละเอียดเมนู My Menu ---
    // ตัวอย่าง mock ข้อมูลวัตถุดิบ (ควรดึงจากฐานข้อมูลจริง)
    const menuData = {
        "ข้าวผัดกุ้ง": {
            ingredients: [
                { name: "ข้าวสวย", calories: 200 },
                { name: "กุ้ง", calories: 120 },
                { name: "น้ำมัน", calories: 50 },
                { name: "ไข่", calories: 80 }
            ]
        },
        "ข้าวไข่กุ้ง": {
            ingredients: [
                { name: "ข้าวสวย", calories: 200 },
                { name: "ไข่", calories: 80 },
                { name: "กุ้ง", calories: 120 },
                { name: "น้ำมัน", calories: 50 }
            ]
        }
        // เพิ่มเมนูอื่นๆ ตามต้องการ
    };

    function setupViewDetailsButtons() {
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.onclick = function() {
                const card = btn.closest('.menu-card');
                const menuName = card.querySelector('.menu-name').textContent.trim();
                const menuDate = card.querySelector('.menu-date')?.textContent.replace('Created:', '').trim() || card.getAttribute('data-created') || '';
                const modal = document.getElementById('menuDetailModal');
                const nameElem = modal.querySelector('.detail-menu-name');
                const dateElem = modal.querySelector('.detail-menu-date');
                const ingElem = modal.querySelector('.detail-ingredients');
                const totalElem = modal.querySelector('.detail-total-calories');
                nameElem.textContent = menuName;
                dateElem.textContent = menuDate ? `สร้างเมื่อ: ${menuDate}` : '';
                // ดึงวัตถุดิบจากข้อมูลจริง
                const menu = menuData[menuName];
                if (menu && menu.ingredients.length > 0) {
                    let total = 0;
                    ingElem.innerHTML = menu.ingredients.map(ing => {
                        total += ing.calories;
                        return `<div class="detail-ingredient-row"><span>${ing.name}</span><span>${ing.calories} kcal</span></div>`;
                    }).join('');
                    totalElem.textContent = `แคลอรี่รวม: ${total} kcal`;
                } else {
                    ingElem.innerHTML = '<div style="color:#888;">ไม่มีข้อมูลวัตถุดิบ</div>';
                    totalElem.textContent = '';
                }
                modal.style.display = 'flex';
            };
        });
    }

    // ปุ่มปิด popup
    const closeDetailBtn = document.querySelector('.close-detail-modal');
    if (closeDetailBtn) {
        closeDetailBtn.onclick = function() {
            document.getElementById('menuDetailModal').style.display = 'none';
        };
    }
    // ปิดเมื่อคลิกนอก modal
    const menuDetailModal = document.getElementById('menuDetailModal');
    if (menuDetailModal) {
        menuDetailModal.onclick = function(e) {
            if (e.target === this) this.style.display = 'none';
        };
    }

    // เรียก setupViewDetailsButtons() หลังโหลดหน้าและหลังเพิ่ม/ลบเมนู
    setupViewDetailsButtons();

    // Add search input event listeners
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        // Remove previous event listener
        searchInput.removeEventListener('input', showOrHideSearchBar);
        
        // Add new event listeners
        searchInput.addEventListener('input', function() {
            if (document.querySelector('.right-content.my-menu-active')) {
                showOrHideSearchBar();
            } else if (document.querySelector('.right-content.daily-meal-active')) {
                showOrHideDailyMealSearchBar();
            }
        });
    }
});