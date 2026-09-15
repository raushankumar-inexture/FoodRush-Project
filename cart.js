let cart = [];

// EmailJS Configuration - SIGN UP at emailjs.com and replace these values
const EMAILJS_CONFIG = {
    serviceID: "service_et0ggzk",
    templateID: "template_i4zx1z8",
    publicKey: "6b6ZPt7N-KzQRSAnY"
};

// get card from localStorage
function loadCart() {
    const savedCart = localStorage.getItem("foodrushCart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}


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

function decreaseQuantity(name) {
    let item = cart.find(food => food.name === name);
    if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
            cart = cart.filter(food => food.name !== name);
        }
    }
    saveCart();
    showCart();
    updateCartCount();
}

function removeItem(name) {
    cart = cart.filter(food => food.name !== name);
    saveCart();
    showCart();
    updateCartCount();
}

function showCart() {
    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");
    let summarySubtotal = document.getElementById("summary-subtotal");
    let summaryDiscount = document.getElementById("summary-discount");
    let summaryTotal = document.getElementById("summary-total");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `<div style="padding:40px; text-align:center; color:#999; font-size:16px;">Your cart is empty.</div>`;
        if (summarySubtotal) summarySubtotal.textContent = "₹0";
        if (summaryDiscount) summaryDiscount.textContent = "-₹0";
        if (summaryTotal) summaryTotal.textContent = "₹0";
        if (cartTotal) cartTotal.textContent = "0";
        return;
    }

    let subtotal = 0;

    cart.forEach(function(item) {
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        let row = document.createElement("div");
        row.style.cssText = "display:flex; align-items:center; justify-content:space-between; padding:12px 15px; border-bottom:1px solid #eee; flex-wrap:wrap; gap:10px;";
        
        row.innerHTML = `
            <div style="flex:1; min-width:120px;">
                <div style="font-weight:bold; color:#333; font-size:15px;">${item.name}</div>
                <div style="color:#888; font-size:13px;">₹${item.price} each</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <button onclick="decreaseQuantity('${item.name}')" style="width:28px; height:28px; border:1px solid #ddd; background:white; border-radius:4px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center;">−</button>
                <span style="font-weight:bold; min-width:20px; text-align:center;">${item.quantity}</span>
                <button onclick="addToCart('${item.name}', ${item.price})" style="width:28px; height:28px; border:1px solid #ddd; background:white; border-radius:4px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center;">+</button>
            </div>
            <div style="font-weight:bold; color:#333; min-width:80px; text-align:right;">₹${itemTotal}</div>
            <button onclick="removeItem('${item.name}')" style="background:none; border:none; color:#999; cursor:pointer; font-size:18px; padding:0 5px;" title="Remove">×</button>
        `;
        
        cartItems.appendChild(row);
    });

    let discount = discountApplied || 0;
    let finalTotal = subtotal - discount;

    if (summarySubtotal) summarySubtotal.textContent = "₹" + subtotal;
    if (summaryDiscount) summaryDiscount.textContent = "-₹" + discount;
    if (summaryTotal) summaryTotal.textContent = "₹" + finalTotal;
    if (cartTotal) cartTotal.textContent = finalTotal;
    
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
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) - discountApplied;
    
    
    let loggedInUser = localStorage.getItem("loggedInUser");
    let userEmail = loggedInUser ? JSON.parse(loggedInUser).email : "guest@example.com";
    
    
    let itemsList = cart.map(item => `${item.name} (x${item.quantity})`).join(", ");
    
    
    let successMessage = document.getElementById("success-message");
    let orderDetails = document.getElementById("order-details");
    
    if (successMessage) {
        successMessage.innerHTML = `Order placed successfully!<br>
            Order ID: <strong>${orderId}</strong><br>
            Estimated Delivery: <strong>${deliveryTimeStr}</strong>`;
    }
    
    
    if (orderDetails) {
        orderDetails.style.display = "none";
    }
    
    
    let orderHistory = JSON.parse(localStorage.getItem("foodrushOrders") || "[]");
    orderHistory.push({
        orderId: orderId,
        items: itemsList,
        total: total,
        deliveryTime: deliveryTimeStr,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("foodrushOrders", JSON.stringify(orderHistory));

    
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

    let first50Coupon = document.getElementById("first50-coupon");
    if (first50Coupon && hasPreviousOrders()) {
        first50Coupon.style.display = "none";
    }

    let availableCoupons = getAvailableCoupons();
    let regularCoupons = document.querySelectorAll(".regular-coupon");
    regularCoupons.forEach(function(card) {
        let code = card.getAttribute("data-coupon");
        if (availableCoupons.includes(code)) {
            card.style.display = "inline-block";
        } else {
            card.style.display = "none";
        }
    });

    if (availableCoupons.length === 0) {
        let noOffers = document.getElementById("no-offers-message");
        if (noOffers) {
            noOffers.style.display = "block";
        }
    }
});

function clearCart() {
    cart = [];
    saveCart();
    clearSuccessMessage();
    showCart();
    updateCartCount();
}

// Coupon System
let discountApplied = 0;

function hasPreviousOrders() {
    let orders = JSON.parse(localStorage.getItem("foodrushOrders") || "[]");
    return orders.length > 0;
}

function getAvailableCoupons() {
    let day = new Date().getDay();
    let available = [];
    if (day === 2) available.push("SAVE10");
    if (day === 6) available.push("SAVE30");
    if (day === 0) available.push("SAVE50");
    return available;
}

function isCouponAvailableToday(code) {
    if (code === "FIRST50") return true;
    return getAvailableCoupons().includes(code);
}

function useCoupon(code) {
    let input = document.getElementById("coupon-input");
    input.value = code;
}

function applyCoupon() {
    let code = document.getElementById("coupon-input").value.trim().toUpperCase();
    let message = document.getElementById("coupon-message");
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!code) {
        message.textContent = "Please enter a coupon code.";
        message.style.color = "red";
        return;
    }

    if (code === "FIRST50" && !hasPreviousOrders()) {
        discountApplied = total * 0.50;
        message.textContent = "Coupon applied! You saved ₹" + Math.round(discountApplied);
        message.style.color = "#28a745";
        return;
    }

    if (!isCouponAvailableToday(code)) {
        message.textContent = "This coupon is not available today.";
        message.style.color = "red";
        return;
    }

    if (code === "SAVE10" && total >= 200) {
        discountApplied = total * 0.10;
        message.textContent = "Coupon applied! You saved ₹" + Math.round(discountApplied);
        message.style.color = "#28a745";

    } else if (code === "SAVE30" && total >= 500) {
        discountApplied = total * 0.30;
        message.textContent = "Coupon applied! You saved ₹" + Math.round(discountApplied);
        message.style.color = "#28a745";

    } else if (code === "SAVE50" && total >= 1000) {
        discountApplied = total * 0.50;
        message.textContent = "Coupon applied! You saved ₹" + Math.round(discountApplied);
        message.style.color = "#28a745";

    } else {
        discountApplied = 0;
        message.textContent = "Invalid or minimum order not met.";
        message.style.color = "red";
    }
}
