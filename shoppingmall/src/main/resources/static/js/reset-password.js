const API_URL = 'http://localhost:8080/api/auth/reset-password';

// Extract the token from the URL query string, e.g. reset-password.html?token=abc123
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;

    if (!token) {
        document.getElementById('message').textContent = 'Invalid reset link - no token found.';
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });

        const message = await response.text();
        document.getElementById('message').textContent = message;

        if (response.ok) {
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'Something went wrong. Please try again.';
    }
});