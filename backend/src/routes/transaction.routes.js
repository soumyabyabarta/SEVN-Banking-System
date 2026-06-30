const express = require("express");
const router = express.Router();

const { transferFunds, getTransactionHistory } = require("../controllers/transaction.controller"); 

// Import auth middleware
let authMiddleware = require("../middleware/auth.middleware"); 

// BULLETPROOF MIDDLEWARE EXTRACTOR: 
// If the middleware is imported as an object (e.g., { protect: [Function] }), 
// this will automatically extract the function out of it.
if (typeof authMiddleware === 'object' && authMiddleware !== null) {
    const middlewareKeys = Object.keys(authMiddleware);
    if (middlewareKeys.length > 0) {
        authMiddleware = authMiddleware[middlewareKeys[0]];
    }
}

// Routes
router.post("/transfer", authMiddleware, transferFunds);
router.get("/history", authMiddleware, getTransactionHistory);

module.exports = router;