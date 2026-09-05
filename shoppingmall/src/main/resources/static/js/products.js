const SHOPS_API = 'http://localhost:8080/api/shops';
const PRODUCTS_API = 'http://localhost:8080/api/products';

let selectedShopId = null;
let allProducts = [];

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

document.addEventListener('DOMContentLoaded', loadShopsDropdown);

async function loadShopsDropdown() {
    try {
        const response = await fetch(SHOPS_API, { headers: authHeaders() });

        if (response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        const shops = await response.json();
        const select = document.getElementById('shopSelect');
        shops.forEach(shop => {
            const option = document.createElement('option');
            option.value = shop.shopId;
            option.textContent = `${shop.name} (Floor ${shop.floorNumber})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading shops:', error);
    }
}

document.getElementById('shopSelect').addEventListener('change', async (e) => {
    selectedShopId = e.target.value;
    if (!selectedShopId) {
        document.getElementById('productsTableBody').innerHTML = '';
        return;
    }
    loadProducts(selectedShopId);
});

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedShopId) {
        alert('Please select a shop first');
        return;
    }

    const newProduct = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        stockQty: parseInt(document.getElementById('stockQty').value)
    };

    try {
        const response = await fetch(`${SHOPS_API}/${selectedShopId}/products`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(newProduct)
        });

        if (response.ok) {
            document.getElementById('productForm').reset();
            loadProducts(selectedShopId);
        } else {
            alert('Failed to add product');
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
});

async function loadProducts(shopId) {
    try {
        const response = await fetch(`${SHOPS_API}/${shopId}/products`, {
            headers: authHeaders()
        });

        if (response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        allProducts = await response.json();

        const tableBody = document.getElementById('productsTableBody');
        tableBody.innerHTML = '';

        allProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.productId}</td>
                <td>${product.name}</td>
                <td>₹${product.price}</td>
                <td>${product.stockQty}</td>
                <td><button class="delete-btn" onclick="deleteProduct(${product.productId})">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${PRODUCTS_API}/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (response.ok) {
            loadProducts(selectedShopId);
        } else {
            alert('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }

}