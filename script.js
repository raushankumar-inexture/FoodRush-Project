
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


let randomNumber = Math.floor(Math.random() * offers.length);

let selectedOffer = offers[randomNumber];

document.getElementById("offer-discount").innerHTML =
    "Get " + selectedOffer.discount + " OFF<br>on " + selectedOffer.food;

document.getElementById("offer-code").textContent =
    selectedOffer.code;

console.log(selectedOffer);





