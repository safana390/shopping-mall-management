const API_URL = 'http://localhost:8080/api/shops';

function authHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = 'login.html';
});

document.addEventListener('DOMContentLoaded', loadShops);

document.getElementById('shopForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newShop = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        floorNumber: parseInt(document.getElementById('floorNumber').value),
        ownerName: document.getElementById('ownerName').value,
        contact: document.getElementById('contact').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(newShop)
        });

        if (response.ok) {
            document.getElementById('shopForm').reset();
            loadShops();
        } else {
            alert('Failed to add shop');
        }
    } catch (error) {
        console.error('Error adding shop:', error);
        alert('Error connecting to server');
    }
});

async function loadShops() {
    try {
        const response = await fetch(API_URL, {
            headers: authHeaders()
        });

        if (response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        const shops = await response.json();

        const tableBody = document.getElementById('shopsTableBody');
        tableBody.innerHTML = '';

        shops.forEach(shop => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${shop.shopId}</td>
                <td>${shop.name}</td>
                <td>${shop.category}</td>
                <td>${shop.floorNumber}</td>
                <td>${shop.ownerName}</td>
                <td>${shop.contact}</td>
                <td><button class="delete-btn" onclick="deleteShop(${shop.shopId})">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading shops:', error);
    }
}

async function deleteShop(id) {
    if (!confirm('Are you sure you want to delete this shop?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (response.ok) {
            loadShops();
        } else {
            alert('Failed to delete shop');
        }
    } catch (error) {
        console.error('Error deleting shop:', error);
    }
}