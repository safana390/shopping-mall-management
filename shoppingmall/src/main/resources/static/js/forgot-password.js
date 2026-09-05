const API_URL = 'http://localhost:8080/api/auth/forgot-password';

document.getElementById('forgotForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const message = await response.text();
        document.getElementById('message').textContent = message;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'Something went wrong. Please try again.';
    }
});