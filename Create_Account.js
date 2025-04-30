document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const password = document.getElementById('create-password');
    const confirmPassword = document.getElementById('create-confirm-password');

    function togglePasswordVisibility(inputField, toggleButton) {
        const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
        inputField.setAttribute('type', type);
        toggleButton.src = type === 'password' 
            ? 'https://cdn-icons-png.flaticon.com/512/2767/2767146.png'
            : 'https://cdn-icons-png.flaticon.com/512/2767/2767194.png';
    }

    togglePassword.addEventListener('click', function() {
        togglePasswordVisibility(password, this);
    });

    toggleConfirmPassword.addEventListener('click', function() {
        togglePasswordVisibility(confirmPassword, this);
    });
}); 