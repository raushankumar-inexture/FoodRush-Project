// Offer data
let offers = [
    {
        food: "Pizza",
        discount: "50%",
        code: "PIZZA50"
    },
    {
        food: "Noodles",
        discount: "40%",
        code: "NOODLES40"
    },
    {
        food: "Desserts",
        discount: "30%",
        code: "SWEET30"
    },
    {
        food: "Mexican Food",
        discount: "35%",
        code: "MEXICAN35"
    },
    {
        food: "Biryani",
        discount: "45%",
        code: "BIRYANI45"
    }
];

let images = [
    "images/pizza.jpg",
    "images/noodles.jpg",
    "images/dessert.jpg",
    "images/mexican.jpg",
    "images/biryani.jpg"
];

let randomNumber = Math.floor(Math.random() * offers.length);

let selectedOffer = offers[randomNumber];

document.getElementById("offer-discount").innerHTML =
    "Get " + selectedOffer.discount + " OFF<br>on " + selectedOffer.food;

document.getElementById("offer-code").textContent =
    selectedOffer.code;

document.getElementById("offer-image").src =
    images[randomNumber];

console.log(selectedOffer);


    // Search Functionality
    function searchFood() {
        let input = document.getElementById("search-input");
        let message = document.getElementById("search-message");
        let query = input.value.trim().toLowerCase();

        message.textContent = "";

        if (!query) return;

        let restaurants = [
            "italian corner", "burger house", "spice kitchen",
            "pizza palace", "burger barn", "noodle ninja",
            "taco town", "sweet dreams"
        ];

        let foodCategories = [
            { name: "pizza", param: "pizza" },
            { name: "burger", param: "burger" },
            { name: "noodle", param: "noodles" },
            { name: "biryani", param: "biryani" },
            { name: "mexican", param: "mexican" },
            { name: "dessert", param: "dessert" }
        ];

        // Step 1: Check exact restaurant match
        for (let i = 0; i < restaurants.length; i++) {
            if (restaurants[i] === query) {
                window.location.href = "Restaurants.html";
                return;
            }
        }

        // Step 2: Check exact food match
        for (let j = 0; j < foodCategories.length; j++) {
            if (foodCategories[j].name === query) {
                window.location.href = "categories.html?restaurant=" + foodCategories[j].param;
                return;
            }
        }

        // Step 3: Check partial restaurant match
        for (let i = 0; i < restaurants.length; i++) {
            if (restaurants[i].indexOf(query) !== -1 || query.indexOf(restaurants[i]) !== -1) {
                window.location.href = "Restaurants.html";
                return;
            }
        }

        // Step 4: Check partial food match
        for (let j = 0; j < foodCategories.length; j++) {
            if (foodCategories[j].name.indexOf(query) !== -1 || query.indexOf(foodCategories[j].name) !== -1) {
                window.location.href = "categories.html?restaurant=" + foodCategories[j].param;
                return;
            }
        }

        message.textContent = "No food or restaurant found.";
        message.style.color = "red";
        message.style.marginTop = "10px";
    }


    // Hamburger menu
let menuBtn = document.getElementById("menu-btn");
let navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", function() {
    navbar.classList.toggle("active");
});


// User 
function checkAuthState() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const loginBtn = document.getElementById("loginBtn");
    const userInfo = document.getElementById("userInfo");
    const userName = document.getElementById("userName");

    if (loggedInUser) {
        // User is logged in - show user info, hide login button
        const user = JSON.parse(loggedInUser);
        loginBtn.style.display = "none";
        userName.textContent = user.name;
        userInfo.style.display = "flex";
    } else {
        // User is not logged in - show login button, hide user info
        loginBtn.style.display = "block";
        userInfo.style.display = "none";
    }
}

// Logout function
function logout() {
    localStorage.removeItem("loggedInUser");
    checkAuthState();
}

// Initialize auth state when page loads
document.addEventListener("DOMContentLoaded", function() {
    checkAuthState();

    let searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                searchFood();
            }
        });
    }

    // Add logout event listener if user info element exists
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});
