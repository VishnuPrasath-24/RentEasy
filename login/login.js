function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    fetch("http://localhost:3500/users")
        .then(function (response) {
            return response.json();
        })
        .then(function (users) {
            const user = users.find(function (u) {
                return u.username === username && u.password === password;
            });
            
            if (user) {
                window.location.href = "../booking/booking.html";
                sessionStorage.setItem("login", "yes");
            } else {
                document.getElementById("errorMsg").innerText = "Invalid username or password";
            }
        })
        .catch(function (error) {
            console.log(error);
            document.getElementById("errorMsg").innerText = "Please check JSON Server";
        });
}


function gobackhome(){
    window.location.href = "../index.html"
}