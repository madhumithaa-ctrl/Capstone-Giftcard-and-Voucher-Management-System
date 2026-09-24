const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Srilakshmi@2007",
    database: "gift_card_db"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err.message);
    } else {
        console.log("Database connected successfully");
    }
});

app.get("/", (req, res) => {
    res.send("Gift Card and Voucher Management System Backend");
});app.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Registration failed"
            });
        }

        res.json({
            message: "Registration successful"
        });
    });
});
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Login failed"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password!"
            });
        }

        res.json({
            message: "Login successful!"
        });
    });
});
app.get("/giftcards", (req, res) => {

    const sql = "SELECT * FROM gift_cards";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Failed to fetch gift cards"
            });
        }

        res.json(results);
    });
});
app.get("/purchases", (req, res) => {

    const sql = "SELECT * FROM purchases ORDER BY purchase_date DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to fetch purchases"
            });
        }

        res.json(results);
    });
});
app.get("/vouchers-purchased", (req, res) => {

    const sql = `
        SELECT * FROM purchases
        WHERE item_type = 'Voucher'
        ORDER BY purchase_date DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to fetch vouchers"
            });
        }

        res.json(results);
    });
});
app.post("/redeem-voucher", (req, res) => {

    const { voucherName, code } = req.body;

    const checkSql = `
        SELECT * FROM purchases
        WHERE item_type = 'Voucher'
        AND item_name = ?
    `;

    db.query(checkSql, [voucherName], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Voucher check failed"
            });
        }

        if (results.length > 0) {
            return res.status(400).json({
                message: "This voucher has already been redeemed!"
            });
        }

        const sql = `
            INSERT INTO purchases
            (user_id, item_type, item_id, item_name, code)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [null, "Voucher", null, voucherName, code],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        message: "Voucher redemption failed"
                    });
                }

                res.json({
                    message: "Voucher redeemed and saved successfully"
                });
            }
        );
    });
});
app.post("/purchase", (req, res) => {
    console.log("Purchase request received:", req.body);

    const { user_id, item_type, item_id, item_name, code } = req.body;

    const sql = `
        INSERT INTO purchases
        (user_id, item_type, item_id, item_name, code)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [user_id, item_type, item_id, item_name, code],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Purchase failed"
                });
            }

            res.json({
                message: "Purchase saved successfully"
            });
        }
    );
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
});