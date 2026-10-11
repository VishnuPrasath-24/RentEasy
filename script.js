let products = [];
const productGrid = document.getElementById("productGrid");

fetch("http://localhost:3500/products")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        products = data;
        displayProducts(products);
    })
    .catch(function (error) {
        console.log(error);
    });
function displayProducts(list) {
    productGrid.innerHTML = "";
    if (list.length === 0) {
        productGrid.innerHTML =
            `<div class="noresults">
                <h3>No rental items found</h3>
                <p>Try searching for another item.</p>
            </div>`;
        return;
    }
    list.forEach(function (product) {
        productGrid.innerHTML +=
            `<div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <span class="category">
                        ${product.category}
                    </span>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-location">
                        Location: ${product.location}
                    </div>
                    <div class="product-bottom">
                        <div class="product-price">
                            ₹${product.price}
                            <span>/day</span>
                        </div>
                    </div>
                    <button onclick="bookProduct('${product.name}')">Rent Now</button>
                </div>
            </div>`;
    });
}

document.getElementById("searchInput").addEventListener("input",
    function () {
        const searchText = this.value.toLowerCase();
        const filteredProducts = products.filter(
            function (product) {
                return (
                    product.name.toLowerCase().includes(searchText) ||
                    product.category.toLowerCase().includes(searchText) ||
                    product.location.toLowerCase().includes(searchText)
                );
            }
        );
        displayProducts(filteredProducts);
    }
);

function searchProperties() {
    const category = document.getElementById("propertyType").value;
    if (category === "all") {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(
            function (product) {
                return product.category === category;
            }
        );
        displayProducts(filteredProducts);
    }
}

let selectedProduct = "";
let selectedPrice = 0;

function bookProduct(name) {
    selectedProduct = name;
    const product = products.find(
        function (item) {
            return item.name === name;
        }
    );
    selectedPrice = product.price;
    document.getElementById("bookingProduct").innerText = "Product: " + product.name;
    document.getElementById("dailyPrice").innerText = "₹" + selectedPrice;
    document.getElementById("totalDays").innerText = "0";
    document.getElementById("totalAmount").innerText = "₹0";
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    document.getElementById("bookingBox").style.display = "block";
}

function calculateAmount() {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    if (fromDate === "" || toDate === "") {
        return;
    }
    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (end < start) {
        alert("To Date cannot be before From Date.");
        document.getElementById("toDate").value = "";
        return;
    }
    const difference = end - start;
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24)) + 1;
    const amount = days * selectedPrice;
    document.getElementById("totalDays").innerText = days;
    document.getElementById("totalAmount").innerText = "₹" + amount;
}

function confirmBooking() {
    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const days = document.getElementById("totalDays").innerText;
    const totalAmount = days * selectedPrice;

    const numbers = "0123456789";
    for (let i = 0; i < name.length; i++) {
        if (numbers.includes(name[i])) {
            alert("Name should not contain numbers");
            return;
        }
    }
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (phone.length !== 10) {
        alert("phone number should contain 10 digits");
        return;
    }
    for (let i = 0; i < phone.length; i++) {
        if (letters.includes(phone[i])) {
            alert("Phone Number should not contain letters");
            return;
        }
    }

    if (name === "" || phone === "" || fromDate === "" || toDate === "") {
        alert("Please fill all details.");
        return;
    }

    const booking = {
        product: selectedProduct,
        name: name,
        phone: phone,
        fromDate: fromDate,
        toDate: toDate,
        days: days,
        price: selectedPrice,
        totalAmount: totalAmount
    };

    fetch("http://localhost:3500/bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
    })
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            closeBooking();
            document.getElementById("successMessage").style.display = "block";
            setTimeout(function () {
                window.location.href = "./booking/booking.html";
            }, 3000);
        })
        .catch(function (error) {
            console.log(error);
            alert("Booking failed. Please check JSON Server.");
        });
}

function closeBooking() {
    document.getElementById("bookingBox").style.display = "none";
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    document.getElementById("totalDays").innerText = "0";
    document.getElementById("totalAmount").innerText = "₹0";
}