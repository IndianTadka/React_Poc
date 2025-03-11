require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// ✅ Use CORS Middleware (Avoid Duplication)
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error("CORS policy: This origin is not allowed"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/payments", paymentRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

