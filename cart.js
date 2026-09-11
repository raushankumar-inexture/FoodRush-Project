// Cart functionality for categories.html
let cart = [];

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

    showCart();
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
    showCart();
}

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", function() {
    showCart();
});