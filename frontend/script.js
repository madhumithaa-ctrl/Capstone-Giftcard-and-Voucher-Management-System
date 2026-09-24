function registerUser(event) {

    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword =
        document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        alert("Passwords do not match!");

        return;
    }

    let user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Registration successful!");

    window.location.href = "login.html";
}function loginUser(event) {

    event.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let savedUser = localStorage.getItem("user");

    if (savedUser === null) {

        alert("Please register first!");

        return;
    }

    let user = JSON.parse(savedUser);

    if (email === user.email && password === user.password) {

        alert("Login successful!");

        localStorage.setItem("loggedIn", "true");

        window.location.href = "home.html";

    } else {

        alert("Invalid email or password!");

    }
}function logout() {

    localStorage.removeItem("loggedIn");

    alert("Logged out successfully!");

    window.location.href = "login.html";
}function selectGiftCard(cardName, cardValue) {

    let card = {
        name: cardName,
        value: cardValue,
        status: "Active"
    };

    localStorage.setItem("selectedGiftCard", JSON.stringify(card));

    alert(cardName + " selected successfully!");

    window.location.href = "mycards.html";
}

function selectVoucher(voucherName) {

    alert(voucherName + " selected successfully!");

}window.onload = function () {

    let cardName = localStorage.getItem("selectedGiftCard");

    let cardContainer = document.getElementById("myCard");

    if (cardContainer && cardName) {

        let value = "₹500";

        if (cardName === "Food Gift Card") {
            value = "₹300";
        }

        cardContainer.innerHTML = `
            <div class="gift-card">
                <h2>${cardName}</h2>
                <p>Value: ${value}</p>
                <p>Status: Active</p>
            </div>
        `;

    } else if (cardContainer) {

        cardContainer.innerHTML =
            "<p>No gift card selected yet.</p>";

    }
};function selectVoucher(voucherName) {

    localStorage.setItem("selectedVoucher", voucherName);

    alert(voucherName + " selected successfully!");

    window.location.href = "myvouchers.html";
}window.addEventListener("load", function () {

    let voucherName = localStorage.getItem("selectedVoucher");

    let voucherContainer = document.getElementById("myVoucher");

    if (voucherContainer && voucherName) {

        let discount = "10%";

        if (voucherName === "Shopping Voucher") {
            discount = "20%";
        }
        else if (voucherName === "Food Voucher") {
            discount = "15%";
        }

        voucherContainer.innerHTML = `
            <div class="gift-card">
                <h2>${voucherName}</h2>
                <p>Discount: ${discount}</p>
                <p>Status: Active</p>
            </div>
        `;

    } else if (voucherContainer) {

        voucherContainer.innerHTML =
            "<p>No voucher selected yet.</p>";

    }

});