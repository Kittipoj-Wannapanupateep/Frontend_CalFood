document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        const foodImage = document.querySelector('.food-image img');
        if (foodImage) {
            foodImage.src = imageUrl;
        }
        console.log('Selected file:', file.name);
    }
});

// Handle save button click with custom modal
const saveModal = document.getElementById('saveModal');
const successModal = document.getElementById('successModal');
const confirmSave = document.getElementById('confirmSave');
const cancelSave = document.getElementById('cancelSave');
const mealTypeSelect = document.getElementById('mealType');
const datetimeInput = document.getElementById('datetime');

// Set default datetime to now
if (datetimeInput) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    datetimeInput.value = now.toISOString().slice(0, 16);
}

function validateForm() {
    // Only validate datetime since food name is now fixed
    return datetimeInput.value !== '';
}

function showModal(modal) {
    modal.style.display = 'flex';
    // Trigger reflow
    modal.offsetHeight;
    modal.classList.add('show');
}

function hideModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Match transition duration
}

function handleSaveMenu() {
    showModal(saveModal);
}

// Event Listeners
if (saveModal && confirmSave && cancelSave) {
    confirmSave.addEventListener('click', function() {
        if (validateForm()) {
            hideModal(saveModal);
            setTimeout(() => {
                showModal(successModal);
            }, 300);
        }
    });

    cancelSave.addEventListener('click', function() {
        hideModal(saveModal);
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === saveModal) {
            hideModal(saveModal);
        } else if (event.target === successModal) {
            hideModal(successModal);
            setTimeout(() => {
                window.location.reload();
            }, 300);
        }
    });

    // Close success modal and reload page when clicking anywhere
    successModal.addEventListener('click', function() {
        hideModal(successModal);
        setTimeout(() => {
            window.location.reload();
        }, 300);
    });
}