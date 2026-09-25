const LOGIN_API = '/api/auth/login';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(LOGIN_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();

            // Store the token so other pages can use it
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);

            // Redirect to the main app
            window.location.href = 'shops.html';
        } else {
            document.getElementById('errorMsg').textContent = 'Invalid username or password';
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('errorMsg').textContent = 'Error connecting to server';
    }
});
const togglePw = document.getElementById('togglePw');
if (togglePw) {
    togglePw.addEventListener('click', () => {
        const pwInput = document.getElementById('password');
        const icon = togglePw.querySelector('i');
        if (pwInput.type === 'password') {
            pwInput.type = 'text';
            icon.className = 'fa-regular fa-eye-slash';
        } else {
            pwInput.type = 'password';
            icon.className = 'fa-regular fa-eye';
        }
    });
}