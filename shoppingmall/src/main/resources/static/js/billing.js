const CUSTOMERS_API = 'http://localhost:8080/api/customers';
const SHOPS_API = 'http://localhost:8080/api/shops';
const BILLS_API = 'http://localhost:8080/api/bills';

let selectedShopId = null;
let allProducts = [];
let billItems = [];

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

document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
    loadShops();
});

async function loadCustomers() {
    const response = await fetch(CUSTOMERS_API, { headers: authHeaders() });
    if (response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return;
    }
    const customers = await response.json();
    const select = document.getElementById('customerSelect');
    customers.forEach(c => {
        const option = document.createElement('option');
        option.value = c.customerId;
        option.textContent = c.name;
        select.appendChild(option);
    });
}

async function loadShops() {
    const response = await fetch(SHOPS_API, { headers: authHeaders() });
    const shops = await response.json();
    const select = document.getElementById('shopSelect');
    shops.forEach(s => {
        const option = document.createElement('option');
        option.value = s.shopId;
        option.textContent = s.name;
        select.appendChild(option);
    });
}

document.getElementById('shopSelect').addEventListener('change', async (e) => {
    selectedShopId = e.target.value;
    billItems = [];
    renderBillItems();

    const productSelect = document.getElementById('productSelect');
    productSelect.innerHTML = '<option value="">-- Select Product --</option>';

    if (!selectedShopId) return;

    const response = await fetch(`${SHOPS_API}/${selectedShopId}/products`, {
        headers: authHeaders()
    });
    allProducts = await response.json();

    allProducts.forEach(p => {
        const option = document.createElement('option');
        option.value = p.productId;
        option.textContent = `${p.name} - ₹${p.price}`;
        productSelect.appendChild(option);
    });
});

document.getElementById('addItemBtn').addEventListener('click', () => {
    const productId = document.getElementById('productSelect').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!productId || !quantity || quantity < 1) {
        alert('Please select a product and valid quantity');
        return;
    }

    const product = allProducts.find(p => p.productId == productId);

    billItems.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity: quantity
    });

    renderBillItems();
});

function renderBillItems() {
    const tbody = document.getElementById('billItemsBody');
    tbody.innerHTML = '';
    let total = 0;

    billItems.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>${item.quantity}</td>
            <td>₹${subtotal.toFixed(2)}</td>
            <td><button class="delete-btn" onclick="removeItem(${index})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('totalAmount').textContent = total.toFixed(2);
}

function removeItem(index) {
    billItems.splice(index, 1);
    renderBillItems();
}

document.getElementById('submitBillBtn').addEventListener('click', async () => {
    const customerId = document.getElementById('customerSelect').value;
    const shopId = document.getElementById('shopSelect').value;

    if (!customerId || !shopId || billItems.length === 0) {
        alert('Please select customer, shop, and add at least one product');
        return;
    }

    const billRequest = {
        customerId: parseInt(customerId),
        shopId: parseInt(shopId),
        items: billItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }))
    };

    try {
        const response = await fetch(BILLS_API, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(billRequest)
        });

        if (response.ok) {
            const bill = await response.json();
            document.getElementById('billResult').innerHTML =
                `<h3>Bill #${bill.billId} created! Total: ₹${bill.totalAmount}</h3>`;
            billItems = [];
            renderBillItems();
        } else {
            alert('Failed to create bill');
        }
    } catch (error) {
        console.error('Error creating bill:', error);
    }

});