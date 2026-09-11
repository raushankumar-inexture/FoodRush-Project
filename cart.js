// Cart functionality - persists across pages using localStorage
let cart = [];

// EmailJS Configuration - SIGN UP at emailjs.com and replace these values
const EMAILJS_CONFIG = {
    serviceID: "service_et0ggzk",
    templateID: "template_i4zx1z8",
    publicKey: "6b6ZPt7N-KzQRSAnY"
};

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
    let orderDetails = document.getElementById("order-details");
    if (successMessage) {
        successMessage.innerText = "";
    }
    if (orderDetails) {
        orderDetails.style.display = "none";
    }
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // Generate Order ID
    let orderId = "FR" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
    
    // Calculate delivery time
    let now = new Date();
    let deliveryTime = new Date(now.getTime() + 30 * 60000 + Math.random() * 15 * 60000);
    let deliveryTimeStr = deliveryTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Calculate total
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    
    let loggedInUser = localStorage.getItem("loggedInUser");
    let userEmail = loggedInUser ? JSON.parse(loggedInUser).email : "guest@example.com";
    
    // Build order items list
    let itemsList = cart.map(item => `${item.name} (x${item.quantity})`).join(", ");
    
    // Display simple message on screen (Order ID and delivery time only)
    let successMessage = document.getElementById("success-message");
    let orderDetails = document.getElementById("order-details");
    
    if (successMessage) {
        successMessage.innerHTML = `Order placed successfully!<br>
            Order ID: <strong>${orderId}</strong><br>
            Estimated Delivery: <strong>${deliveryTimeStr}</strong>`;
    }
    
    // Hide the detailed order confirmation section
    if (orderDetails) {
        orderDetails.style.display = "none";
    }
    
    // Send complete order details via email
    sendOrderEmail(orderId, deliveryTimeStr, total, itemsList, userEmail);
    
    // Clear cart
    cart = [];
    saveCart();
    showCart();
}

function sendOrderEmail(orderId, deliveryTime, total, itemsList, userEmail) {
    // EmailJS configuration - make sure parameter names match your EmailJS template
    let emailData = {
        to_email: userEmail,
        order_id: orderId,
        delivery_time: deliveryTime,
        total_amount: total,
        items_list: itemsList,
        message: "Your FoodRush order has been placed successfully."
    };
    
    // Log to console for testing
    console.log("=== EmailJS Debug ===");
    console.log("Sending email to:", userEmail);
    console.log("Order details:", emailData);
    console.log("EmailJS Config:", EMAILJS_CONFIG);
    console.log("EmailJS loaded:", typeof emailjs);
    
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error("EmailJS SDK not loaded");
        alert("Email service not available. Please refresh the page.");
        return;
    }
    
    // Initialize EmailJS with your Public Key
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    // Send email using EmailJS
    emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, emailData)
        .then(function(response) {
            console.log("Email sent successfully:", response);
            alert("Confirmation email sent to " + userEmail);
        }, function(error) {
            console.log("Email failed:", error);
            alert("Order placed but email could not be sent. Please check your email settings.");
        });
}

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", function() {
    loadCart();
    clearSuccessMessage();
    showCart();
});

function clearCart() {
    cart = [];
    saveCart();
    clearSuccessMessage();
    showCart();
    updateCartCount();
}