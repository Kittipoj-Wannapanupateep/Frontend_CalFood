let isEditMode = false;
let isPasswordChangeMode = false;

function toggleEditMode() {
    const displayValues = document.querySelectorAll('.display-value');
    const editInputs = document.querySelectorAll('.edit-input');
    const editButton = document.querySelector('.edit-button');
    const saveButton = document.querySelector('.save-button');
    const cancelButton = document.querySelector('.cancel-button');
    const changePasswordButton = document.querySelector('.change-password-button');
    const profileImageButtons = document.querySelector('.profile-image-container .button-group');

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    if (displayValues[0].style.display === 'none') {
        // Switch to view mode
        displayValues.forEach(p => p.style.display = 'block');
        editInputs.forEach(input => {
            input.style.display = 'none';
            input.closest('.info-box').classList.remove('editable');
        });
        editButton.style.display = 'block';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        changePasswordButton.style.display = 'block';
        if (profileImageButtons) {
            profileImageButtons.style.display = 'none';
        }
    } else {
        // Switch to edit mode
        displayValues.forEach(p => p.style.display = 'none');
        editInputs.forEach(input => {
            input.style.display = 'block';
            input.closest('.info-box').classList.add('editable');
        });
        editButton.style.display = 'none';
        saveButton.style.display = 'block';
        cancelButton.style.display = 'block';
        changePasswordButton.style.display = 'none';
        if (profileImageButtons) {
            profileImageButtons.style.display = 'flex';
        }
    }
}

function togglePasswordChange() {
    const profileView = document.querySelector('.profile-view');
    const passwordForm = document.querySelector('.password-change-form');
    const editButton = document.querySelector('.edit-button');
    const changePasswordButton = document.querySelector('.change-password-button');
    const savePasswordButton = document.querySelector('.save-password-button');
    const cancelPasswordButton = document.querySelector('.cancel-password-button');
    const headerText = document.querySelector('.box p');
    const profileImageSection = document.querySelector('.profile-image-box').parentElement;

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    if (profileView.style.display === 'none') {
        profileView.style.display = 'block';
        passwordForm.style.display = 'none';
        editButton.style.display = 'block';
        changePasswordButton.style.display = 'block';
        savePasswordButton.style.display = 'none';
        cancelPasswordButton.style.display = 'none';
        headerText.textContent = 'User Profile';
        profileImageSection.style.display = 'block';
    } else {
        profileView.style.display = 'none';
        passwordForm.style.display = 'block';
        editButton.style.display = 'none';
        changePasswordButton.style.display = 'none';
        savePasswordButton.style.display = 'block';
        cancelPasswordButton.style.display = 'block';
        headerText.textContent = 'Change Password';
        profileImageSection.style.display = 'none';
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.previousElementSibling.classList.add('error');
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.style.display = 'none';
    errorElement.previousElementSibling.classList.remove('error');
}

function showProfileUpdatePopup() {
    const popup = document.getElementById('profile-update-popup');
    if (popup) {
        popup.style.display = 'flex';
    }
}

function hideProfileUpdatePopup() {
    const popup = document.getElementById('profile-update-popup');
    if (popup) {
        popup.style.display = 'none';
    }
}

function saveChanges() {
    const editInputs = document.querySelectorAll('.edit-input');
    const displayValues = document.querySelectorAll('.display-value');
    
    // Hide all error messages first
    hideError('height-error');
    hideError('weight-error');

    let hasError = false;

    // Check height
    const heightInput = document.querySelector('.flex-item:nth-child(1) .edit-input');
    if (heightInput) {
        const heightValue = parseFloat(heightInput.value);
        if (isNaN(heightValue) || heightValue < 1) {
            showError('height-error', 'ความสูงผิดพลาด');
            hasError = true;
        }
    }

    // Check weight
    const weightInput = document.querySelector('.flex-item:nth-child(2) .edit-input');
    if (weightInput) {
        const weightValue = parseFloat(weightInput.value);
        if (isNaN(weightValue) || weightValue < 1) {
            showError('weight-error', 'น้ำหนักผิดพลาด');
            hasError = true;
        }
    }

    if (hasError) {
        return;
    }
    
    editInputs.forEach((input, index) => {
        displayValues[index].textContent = input.value;
    });
    
    toggleEditMode();
    showProfileUpdatePopup();
}

function showPopup() {
    const popup = document.querySelector('.popup-overlay');
    if (popup) {
        popup.style.display = 'flex';
    }
}

function hidePopup() {
    const popup = document.querySelector('.popup-overlay');
    if (popup) {
        popup.style.display = 'none';
    }
}

function savePassword() {
    const inputs = document.querySelectorAll('.password-input');
    const currentPassword = inputs[0].value;
    const newPassword = inputs[1].value;
    const confirmPassword = inputs[2].value;

    // Hide all error messages first
    hideError('current-password-error');
    hideError('new-password-error');
    hideError('confirm-password-error');

    let hasError = false;

    if (!currentPassword) {
        showError('current-password-error', 'กรุณากรอกรหัสผ่านปัจจุบัน');
        hasError = true;
    }

    if (!newPassword) {
        showError('new-password-error', 'กรุณากรอกรหัสผ่านใหม่');
        hasError = true;
    }

    if (!confirmPassword) {
        showError('confirm-password-error', 'กรุณายืนยันรหัสผ่านใหม่');
        hasError = true;
    }

    if (hasError) {
        return;
    }

    if (newPassword !== confirmPassword) {
        showError('confirm-password-error', 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
        return;
    }

    // Here you would typically make an API call to update the password
    // For now, we'll just show the success popup
    showPopup();
    togglePasswordChange();
}

function cancelEdit() {
    const editInputs = document.querySelectorAll('.edit-input');
    const displayValues = document.querySelectorAll('.display-value');
    
    // Hide error messages
    hideError('height-error');
    hideError('weight-error');
    
    editInputs.forEach((input, index) => {
        input.value = displayValues[index].textContent;
    });
    
    toggleEditMode();
}

// Add event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.querySelector('.edit-button');
    const saveButton = document.querySelector('.save-button');
    const cancelButton = document.querySelector('.cancel-button');
    const changePasswordButton = document.querySelector('.change-password-button');
    const savePasswordButton = document.querySelector('.save-password-button');
    const cancelPasswordButton = document.querySelector('.cancel-password-button');
    const popupButton = document.querySelector('.popup-button');

    // Add toggle password functionality
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.src = 'https://cdn-icons-png.flaticon.com/512/2767/2767146.png';
            } else {
                input.type = 'password';
                this.src = 'https://cdn-icons-png.flaticon.com/512/2767/2767146.png';
            }
        });
    });

    if (editButton) editButton.addEventListener('click', toggleEditMode);
    if (saveButton) saveButton.addEventListener('click', saveChanges);
    if (cancelButton) cancelButton.addEventListener('click', cancelEdit);
    if (changePasswordButton) changePasswordButton.addEventListener('click', togglePasswordChange);
    if (savePasswordButton) savePasswordButton.addEventListener('click', savePassword);
    if (cancelPasswordButton) cancelPasswordButton.addEventListener('click', togglePasswordChange);
    if (popupButton) popupButton.addEventListener('click', function() {
        hideProfileUpdatePopup();
    });
}); 