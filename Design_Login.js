document.addEventListener("DOMContentLoaded", function () {
    const toggleButtons = document.querySelectorAll(".toggle-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");
    const categoryHeaders = document.querySelectorAll(".category-header");
    const typeHeading = document.querySelector(".type h1");
    const buttonsContainer = document.querySelector(".buttons-container");
    const addButtons = document.querySelectorAll(".sum-ingredients .box button");
    const ingredientBoxes = document.querySelectorAll(".sum-ingredients .box");

    // Define button categories for each ingredient type
    const buttonCategories = {
        "คาร์โบไฮเดรต": ["แป้ง", "เส้น", "ข้าว", "อื่นๆ"],
        "โปรตีน": ["เนื้อสัตว์", "ผลิตภัณฑ์จากนม", "ไข่", "อื่นๆ"],
        "ไขมัน": ["น้ำมัน", "เนย", "ไขมันสัตว์", "อื่นๆ"],
        "ผัก": ["ผักใบเขียว", "ผักหัว", "ผักผล", "อื่นๆ"],
        "ธัญพืช": ["ถั่ว", "เมล็ดพืช", "ธัญพืช", "อื่นๆ"]
    };

    // Define which subcategories belong to which main category
    const categorySubcategories = {
        "คาร์โบไฮเดรต": ["แป้ง", "เส้น", "ข้าว", "อื่นๆ"],
        "โปรตีน": ["เนื้อสัตว์", "ผลิตภัณฑ์จากนม", "ไข่", "อื่นๆ"],
        "ไขมัน": ["น้ำมัน", "เนย", "ไขมันสัตว์", "อื่นๆ"],
        "ผัก": ["ผักใบเขียว", "ผักหัว", "ผักผล", "อื่นๆ"],
        "ธัญพืช": ["ถั่ว", "เมล็ดพืช", "ธัญพืช", "อื่นๆ"]
    };

    // Initialize all sections as closed
    document.querySelectorAll(".ingredient-items").forEach(items => {
        items.style.display = "none";
    });

    // Function to show ingredients for a specific category
    function showCategoryIngredients(category) {
        const subcategories = categorySubcategories[category];
        ingredientBoxes.forEach(box => {
            const boxCategory = box.getAttribute('data-category');
            if (subcategories.includes(boxCategory)) {
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
        });
    }

    // Function to reset all buttons to inactive state
    function resetButtons() {
        buttonsContainer.querySelectorAll('.button').forEach(button => {
            button.classList.remove('active');
        });
    }

    // Function to reset all category headers to inactive state
    function resetCategoryHeaders() {
        categoryHeaders.forEach(header => {
            header.classList.remove('active');
        });
    }

    // Function to scroll to top
    function scrollToTop() {
        // Scroll the scrollable content to top
        const scrollableContent = document.querySelector('.scrollable-content');
        if (scrollableContent) {
            scrollableContent.scrollIntoView({ behavior: 'smooth' });
        }

        // Also ensure the window is scrolled to the correct position
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Update buttons based on category with scroll to top functionality
    function updateButtons(categoryName) {
        const buttons = buttonCategories[categoryName];
        if (buttons && buttonsContainer) {
            buttonsContainer.innerHTML = buttons.map(buttonText => 
                `<div class="button">${buttonText}</div>`
            ).join('');

            // Add click handlers to the new buttons
            buttonsContainer.querySelectorAll('.button').forEach(button => {
                button.addEventListener('click', function() {
                    const subcategory = this.textContent;
                    
                    // Toggle active state
                    if (this.classList.contains('active')) {
                        this.classList.remove('active');
                        // Show all ingredients for the current category
                        showCategoryIngredients(categoryName);
                    } else {
                        // Reset all buttons
                        resetButtons();
                        // Set this button as active
                        this.classList.add('active');
                        // Filter ingredients
                        filterIngredients(categoryName, subcategory);
                    }

                    // Scroll to top after filtering
                    scrollToTop();
                });
            });
        }
    }

    // Handle category headers with updated button functionality
    categoryHeaders.forEach(header => {
        header.addEventListener("click", function() {
            const categoryName = this.querySelector("span:last-child").textContent;
            if (typeHeading) {
                typeHeading.textContent = categoryName;
            }
            
            // Reset all category headers and set this one as active
            resetCategoryHeaders();
            this.classList.add('active');
            
            // Show ingredients for this category
            showCategoryIngredients(categoryName);
            
            // Update buttons with scroll functionality
            updateButtons(categoryName);
        });
    });

    // Function to filter ingredients based on category and subcategory
    function filterIngredients(category, subcategory) {
        ingredientBoxes.forEach(box => {
            const boxCategory = box.getAttribute('data-category');
            if (boxCategory === subcategory) {
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
        });
    }

    // Handle toggle buttons for all categories
    toggleButtons.forEach(button => {
        button.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent event bubbling
            const parent = this.closest(".ingredient-category");
            
            // Find or create the ingredient-items container
            let items = parent.querySelector(".ingredient-items");
            if (!items) {
                items = document.createElement("div");
                items.className = "ingredient-items";
                parent.appendChild(items);
            }
            
            const isOpen = items.style.display !== "none";

            // Toggle arrow and content
            if (!isOpen) {
                items.style.display = "block";
                this.textContent = "▼";
            } else {
                items.style.display = "none";
                this.textContent = "▶";
            }
        });
    });

    // Handle delete buttons for ingredients
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const ingredientItem = this.closest(".ingredient-item");
            if (ingredientItem) {
                ingredientItem.remove();
            }
        });
    });

    // Handle Add button clicks
    addButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Disable the button immediately
            this.disabled = true;
            this.style.backgroundColor = '#cccccc';
            this.style.cursor = 'not-allowed';

            const box = this.closest(".box");
            if (!box) {
                console.log("Box not found");
                return;
            }

            const imgElement = box.querySelector("img");
            const nameElement = box.querySelector("h1");
            const caloriesText = box.querySelector("p:last-of-type").textContent;
            const mainCategory = box.getAttribute('data-main-category');

            if (!imgElement || !nameElement || !caloriesText || !mainCategory) {
                console.log("Missing required elements");
                return;
            }

            const targetHeader = Array.from(categoryHeaders).find(header => {
                const categorySpan = header.querySelector("span:last-child");
                return categorySpan && categorySpan.textContent === mainCategory;
            });

            if (targetHeader) {
                const categoryContainer = targetHeader.closest('.ingredient-category');
                if (!categoryContainer) {
                    console.log("Category container not found");
                    return;
                }

                let itemsContainer = categoryContainer.querySelector('.ingredient-items');
                if (!itemsContainer) {
                    itemsContainer = document.createElement('div');
                    itemsContainer.className = 'ingredient-items';
                    categoryContainer.appendChild(itemsContainer);
                }

                const newItem = document.createElement('div');
                newItem.className = 'ingredient-item';
                newItem.innerHTML = `
                    <img src="${imgElement.src}" class="food-img">
                    <div class="ingredient-info">
                        <div class="name-calorie-container">
                            <span>${nameElement.textContent}</span>
                            <div class="calorie-container">
                                <span>${caloriesText.split(": ")[1]}</span>
                            </div>
                        </div>
                        <div class="quantity-delete-container">
                            <input type="number" class="quantity-input" value="1" min="1">
                            <button class="delete-btn">
                                <img src="Image/delete.png">
                            </button>
                        </div>
                    </div>
                `;

                // Store reference to the add button in the new item
                newItem.dataset.addButtonId = this.uniqueId || (this.uniqueId = 'add-btn-' + Math.random().toString(36).substr(2, 9));

                // Add delete functionality to the new item
                const deleteBtn = newItem.querySelector('.delete-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => {
                        newItem.remove();
                        // Re-enable the corresponding add button
                        const addButton = document.querySelector(`button[data-unique-id="${newItem.dataset.addButtonId}"]`);
                        if (addButton) {
                            addButton.disabled = false;
                            addButton.style.backgroundColor = '';
                            addButton.style.cursor = 'pointer';
                        }
                    });
                }

                // Add the new item and show the container
                itemsContainer.appendChild(newItem);
                itemsContainer.style.display = 'block';

                // Update toggle button
                const toggleBtn = targetHeader.querySelector('.toggle-btn');
                if (toggleBtn) {
                    toggleBtn.textContent = '▼';
                }

                // Store the unique ID in the add button
                this.setAttribute('data-unique-id', newItem.dataset.addButtonId);

                console.log("Successfully added item to category:", mainCategory);
            } else {
                console.log("Target header not found for category:", mainCategory);
                // Re-enable the button if adding fails
                this.disabled = false;
                this.style.backgroundColor = '';
                this.style.cursor = 'pointer';
            }
        });
    });

    // Sidebar toggle functionality
    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    const leftContent = document.querySelector('.left-content');
    const rightContent = document.querySelector('.right-content');
    const fixedHeader = document.querySelector('.fixed-header');

    toggleBtn.addEventListener('click', function() {
        leftContent.classList.toggle('collapsed');
        rightContent.classList.toggle('expanded');
        fixedHeader.classList.toggle('expanded');
        toggleBtn.classList.toggle('collapsed');
        
        // Update button text based on state
        if (leftContent.classList.contains('collapsed')) {
            toggleBtn.textContent = '▶';
        } else {
            toggleBtn.textContent = '◀';
        }
    });

    // Update reset button functionality
    const resetButton = document.querySelector('.reset-button');
    const resetConfirmModal = document.getElementById('resetConfirmModal');
    const confirmResetBtn = document.getElementById('confirmReset');
    const cancelResetBtn = document.getElementById('cancelReset');

    if (resetButton && resetConfirmModal) {
        resetButton.addEventListener('click', function() {
            resetConfirmModal.style.display = 'flex';
        });

        // Handle confirm reset
        confirmResetBtn.addEventListener('click', function() {
            // Find all ingredient-items containers and remove their children
            const ingredientContainers = document.querySelectorAll('.ingredient-items');
            ingredientContainers.forEach(container => {
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            });

            // Re-enable all add buttons
            const addButtons = document.querySelectorAll('.sum-ingredients .box button');
            addButtons.forEach(button => {
                button.disabled = false;
                button.style.backgroundColor = '';
                button.style.cursor = 'pointer';
            });

            // Close the confirmation modal
            resetConfirmModal.style.display = 'none';

            // Scroll to top after reset
            scrollToTop();
        });

        // Handle cancel reset
        cancelResetBtn.addEventListener('click', function() {
            resetConfirmModal.style.display = 'none';
        });

        // Close reset confirmation modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === resetConfirmModal) {
                resetConfirmModal.style.display = 'none';
            }
        });
    }

    // Handle save button click with custom modal
    const saveButton = document.querySelector('.save-button');
    const saveModal = document.getElementById('saveModal');
    const successModal = document.getElementById('successModal');
    const confirmSave = document.getElementById('confirmSave');
    const cancelSave = document.getElementById('cancelSave');
    const foodNameInput = document.getElementById('foodName');
    const mealTypeSelect = document.getElementById('mealType');
    const datetimeInput = document.getElementById('datetime');

    // Set default datetime to now
    if (datetimeInput) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        datetimeInput.value = now.toISOString().slice(0, 16);
    }

    function showError(input, show = true) {
        const formGroup = input.closest('.form-group');
        if (show) {
            formGroup.classList.add('error');
        } else {
            formGroup.classList.remove('error');
        }
    }

    function validateForm() {
        let isValid = true;

        // Validate food name
        if (!foodNameInput.value.trim()) {
            showError(foodNameInput, true);
            isValid = false;
        } else {
            showError(foodNameInput, false);
        }

        // Validate datetime
        if (!datetimeInput.value) {
            isValid = false;
        }

        return isValid;
    }

    function showSuccessModal() {
        saveModal.style.display = 'none';
        successModal.style.display = 'flex';
    }

    function resetForm() {
        foodNameInput.value = '';
        showError(foodNameInput, false);
        mealTypeSelect.value = 'breakfast';
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        datetimeInput.value = now.toISOString().slice(0, 16);
    }

    if (saveButton && saveModal && confirmSave && cancelSave) {
        saveButton.addEventListener('click', function() {
            saveModal.style.display = 'flex';
        });

        // Remove error when user starts typing
        foodNameInput.addEventListener('input', function() {
            showError(foodNameInput, false);
        });

        confirmSave.addEventListener('click', function() {
            if (validateForm()) {
                // Show success modal
                showSuccessModal();
            }
        });

        cancelSave.addEventListener('click', function() {
            saveModal.style.display = 'none';
            resetForm();
        });

        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === saveModal) {
                saveModal.style.display = 'none';
                resetForm();
            } else if (event.target === successModal) {
                successModal.style.display = 'none';
                resetForm();
                window.location.reload(); // รีเฟรชหน้าเพื่อรีเซ็ตทุกอย่าง
            }
        });

        // Close success modal and reload page when clicking anywhere
        successModal.addEventListener('click', function() {
            successModal.style.display = 'none';
            resetForm();
            window.location.reload(); // รีเฟรชหน้าเพื่อรีเซ็ตทุกอย่าง
        });
    }

    // Initialize the page with carbohydrate ingredients and scroll functionality
    function initializePage() {
        if (typeHeading) {
            typeHeading.textContent = "คาร์โบไฮเดรต";
        }
        
        showCategoryIngredients("คาร์โบไฮเดรต");
        
        // Set up buttons with scroll functionality
        updateButtons("คาร์โบไฮเดรต");

        const carbHeader = Array.from(categoryHeaders).find(header => 
            header.querySelector("span:last-child").textContent === "คาร์โบไฮเดรต"
        );
        if (carbHeader) {
            carbHeader.classList.add('active');
        }
    }

    // Initialize the page with carbohydrate ingredients
    initializePage();
});






