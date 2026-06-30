// backend/src/models/transaction.model.js

const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required:[true,"Transaction must have a source account"],
        index:true
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required:[true,"Transaction must have a destination account"], // Fixed typo in error message
        index:true
    },
    status:{
        type: String,
        enum:{
            // Standardized to UPPERCASE
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "status can be either PENDING, COMPLETED, FAILED or REVERSED",
        },
        default: "PENDING"
    },
    amount:{
        type: Number,
        required:[true,"Transaction amount is required"],
        min:[0,"Transaction amount cannot be negative"]
    },
    idempotencyKey:{
        type: String,
        required:[true,"Idempotency key is required for transaction"],
        index:true,
        unique:true
    }
}, {
    timestamps:true
})

const transactionModel = mongoose.model("transaction",transactionSchema)

module.exports = transactionModel