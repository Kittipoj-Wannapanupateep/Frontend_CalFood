document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.src = type === 'password' 
            ? 'https://cdn-icons-png.flaticon.com/512/2767/2767146.png'
            : 'https://cdn-icons-png.flaticon.com/512/2767/2767194.png';
    });
}); 