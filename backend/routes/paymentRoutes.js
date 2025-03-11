const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const paypal = require("@paypal/checkout-server-sdk");
const Transaction = require("../models/Transaction");

// ✅ Handle CORS Middleware for API Routes
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // ✅ Allow only frontend
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    // ✅ Handle Preflight Requests
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// ✅ PayPal Configuration

const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);

const client = new paypal.core.PayPalHttpClient(environment);

// ✅ Stripe Payment Route
router.post("/stripe", async (req, res) => {
    try {
        const { amount, paymentMethod, userId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: "usd",
            payment_method: paymentMethod.id,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,  // ✅ Enable automatic methods
                allow_redirects: "never"  // ✅ Prevent redirect-based payments
            }
        });

        // ✅ Save transaction to MongoDB
        const transaction = new Transaction({
            userId,
            amount,
            paymentMethod: "Stripe",
            status: "Success",
            transactionId: paymentIntent.id,
        });

        await transaction.save();

        res.json({ success: true, paymentIntent });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// ✅ PayPal Payment Route
router.post("/paypal", async (req, res) => {
    const { orderID, userId, amount, payerID } = req.body;

    console.log("🔹 PayPal Route Hit with Order ID:", orderID);

    try {
        // ✅ Ensure the order is not captured again
        const request = new paypal.orders.OrdersGetRequest(orderID);
        const response = await client.execute(request);

        console.log("✅ PayPal Order Details:", response.result);

        if (response.result.status !== "COMPLETED") {
            return res.status(400).json({ success: false, error: "Order is not completed" });
        }

        // ✅ Save transaction in MongoDB
        const transaction = new Transaction({
            userId,
            amount,
            paymentMethod: "PayPal",
            status: response.result.status,
            transactionId: response.result.id,
            payerID: payerID,
        });

        await transaction.save();
        res.json({ success: true, payment: response.result });
    } catch (error) {
        console.error("❌ PayPal Execution Error:", error);
        return res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;


