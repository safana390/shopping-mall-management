const API_URL = 'http://localhost:8080/api/customers';

function authHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}
document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        window.location.href = 'login.html';
    });

if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', loadCustomers);

document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newCustomer = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(newCustomer)
        });

        if (response.ok) {
            document.getElementById('customerForm').reset();
            loadCustomers();
        } else {
            alert('Failed to add customer');
        }
    } catch (error) {
        console.error('Error adding customer:', error);
    }
});

async function loadCustomers() {
    try {
        const response = await fetch(API_URL, { headers: authHeaders() });

        if (response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        const customers = await response.json();

        const tableBody = document.getElementById('customersTableBody');
        tableBody.innerHTML = '';

        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.customerId}</td>
                <td>${customer.name}</td>
                <td>${customer.email || '-'}</td>
                <td>${customer.phone || '-'}</td>
                <td><button class="delete-btn" onclick="deleteCustomer(${customer.customerId})">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

async function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (response.ok) {
            loadCustomers();
        } else {
            alert('Failed to delete customer');
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
    }

}