async function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/send-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Failed to send OTP");
            return;
        }

        sessionStorage.setItem("pendingEmail", email);
        alert("OTP sent to your email!");
        window.location.href = "verify-otp.html";

    } catch (error) {
        console.error(error);
        alert("Backend connection failed. Check the server.");
    }
}
function loginUser(event) {

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

    window.location.href = "purchase.html";
}

function selectVoucher(voucherName) {

    alert(voucherName + " selected successfully!");

}
window.onload = function () {
    const cardContainer = document.getElementById("myCard");

    if (!cardContainer) return;

    const purchasedCards = JSON.parse(
        localStorage.getItem("purchasedCards") || "[]"
    );

    if (purchasedCards.length > 0) {
        cardContainer.innerHTML = purchasedCards.map(card => `
            <div class="gift-card">
                <h2>${card.name || "Gift Card"}</h2>
                <p>Value: ₹${Number(card.value) || 500}</p>
                <p>Status: ${card.status || "Active"}</p>
                <p>Gift Card Code: ${card.code || "Not generated"}</p>
                <p>Purchase Date: ${card.purchaseDate
                ? new Date(card.purchaseDate).toLocaleDateString("en-IN")
                : "Not available"
            }</p>
            </div>
        `).join("");
    } else {
        cardContainer.innerHTML = "<p>No purchased gift cards yet.</p>";
    }
};
function selectVoucher(voucherName) {

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

async function purchaseGiftCard() {
    let selectedCard = localStorage.getItem("selectedGiftCard");

    if (!selectedCard) {
        alert("Please select a gift card first!");
        window.location.href = "giftcards.html";
        return;
    }

    let card = JSON.parse(selectedCard);

    card.name = card.name || "Shopping Gift Card";
    card.value = Number(card.value) || 500;
    card.type = "Gift Card";
    card.status = "Active";
    card.code = "GC-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    card.purchaseDate = new Date().toISOString();

    try {
        const response = await fetch("http://localhost:5000/purchase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: null,
                item_type: "Gift Card",
                item_id: null,
                item_name: card.name,
                code: card.code
            })
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Purchase failed!");
            return;
        }

        let purchasedCards = JSON.parse(
            localStorage.getItem("purchasedCards") || "[]"
        );

        purchasedCards.push(card);

        localStorage.setItem(
            "purchasedCards",
            JSON.stringify(purchasedCards)
        );

        alert("Purchase successful!");

        window.location.href = "mycards.html";

    } catch (error) {
        console.error(error);
        alert("Backend connection failed. Please check the server.");
    }
}