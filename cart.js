// Cart functionality - persists across pages using localStorage
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem("foodrushCart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("foodrushCart", JSON.stringify(cart));
}

function addToCart(name, price) {
    let item = cart.find(food => food.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    clearSuccessMessage();
    showCart();
    updateCartCount();
}

function updateCartCount() {
    let cartCount = document.getElementById("cart-count");
    if (cartCount) {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function showCart() {
    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach(function(item) {
            let itemTotal = item.price * item.quantity;
            total = total + itemTotal;

            cartItems.innerHTML += `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>
                        ${item.quantity} × ₹${item.price}
                        = ₹${itemTotal}
                    </span>
                </div>
            `;
        });
    }

    cartTotal.innerText = total;
    updateCartCount();
}

function clearSuccessMessage() {
    let successMessage = document.getElementById("success-message");
    if (successMessage) {
        successMessage.innerText = "";
    }
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    let successMessage = document.getElementById("success-message");
    if (successMessage) {
        successMessage.innerText = "Order placed successfully!";
    }

    cart = [];
    saveCart();
    showCart();
}

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", function() {
    loadCart();
    clearSuccessMessage();
    showCart();
});