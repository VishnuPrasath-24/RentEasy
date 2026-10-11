if (!sessionStorage.getItem("login")) {
    window.location.href = "../login/login.html";
}

const bookingList = document.getElementById("bookingList");
const noBookings = document.getElementById("noBookings");

function loadBookings() {
    fetch("http://localhost:3500/bookings")
        .then(function (response) {
            return response.json();
        })
        .then(function (bookings) {+
            displayBookings(bookings);
        })
        .catch(function (error) {
            console.log(error);
        });
}
loadBookings();

function displayBookings(bookings) {
    bookingList.innerHTML = "";
    if (bookings.length === 0) {
        noBookings.style.display = "block";
        return;
    }
    noBookings.style.display = "none";

    bookings.forEach(function (booking, index) {
        bookingList.innerHTML +=
            `<div class="booking-card">
                <div class="header">
                    <h2>${booking.product}</h2><span>Booking Product - ${index + 1}</span>
                </div>

                <div class="details">
                    <p><strong>Name: </strong>${booking.name}</p>
                    <p><strong>Phone: </strong>${booking.phone}</p>
                    <p><strong>From Date: </strong>${booking.fromDate}</p>
                    <p><strong>To Date: </strong>${booking.toDate}</p>
                    <p><strong>Number of Days: </strong>${booking.days}</p>
                    <p><strong>Price Per Day: </strong>₹${booking.price}</p>
                </div>

                <div class="total">
                    <span>Total Amount</span>
                    <strong>₹${booking.totalAmount}</strong>
                </div>

                <button onclick="deleteBooking('${booking.id}')">Delete Booking</button>
            </div>`;
    });
}

function deleteBooking(id) {
    fetch("http://localhost:3500/bookings/" + id, {
        method: "DELETE"
    })
        .then(function (response) {
            if (response.ok) {
                alert("Booking deleted successfully.");
                loadBookings();
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function logout() {
    sessionStorage.removeItem("login");
    window.location.href = "../index.html";
}