const express = require("express");
const cookieParser = require("cookie-parser"); 
const cors = require("cors");
const path = require("path");

const ledgerModel = require('./models/ledger.model');

const app = express();

// CORS Configuration
app.use(
    cors({
        origin: "http://localhost:5173", // Keep for local development
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

/**
 * - API Routes
 */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes");

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);

/**
 * - Health Check Route (Moved to /api/status so it doesn't block the frontend root)
 */
app.get("/api/status", (req, res) => {
    res.send("Ledger Service is up and running");
});

/**
 * - Serve Frontend (Production Setup for Render)
 */
// __dirname is backend/src. Go up two levels to reach SEVN root, then frontend/dist
const frontendDistPath = path.join(__dirname, "../../frontend/dist");

// Serve static files from the React app
app.use(express.static(frontendDistPath));

// Catch-all route: For any request that doesn't match an API route, send back React's index.html
/*app.get("*", (req, res) => { */
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
});

module.exports = app;