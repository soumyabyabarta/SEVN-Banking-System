const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

/**
 * 1. Create a new transaction (Standard User Transfer)
 */
async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"
        });
    }

    const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({ message: "Invalid fromAccount or toAccount" });
    }

    const isTransactionAlreadyExists = await transactionModel.findOne({ idempotencyKey });
    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({ message: "Transaction already processed", transaction: isTransactionAlreadyExists });
        }
        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({ message: "Transaction is still processing" });
        }
        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({ message: "Transaction processing failed, please retry" });
        }
        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({ message: "Transaction was reversed, please retry" });
        }
    }

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        });
    }

    const balance = await fromUserAccount.getBalance();
    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
        });
    }

    const session = await mongoose.startSession();
    let transaction;

    try {
        session.startTransaction();

        transaction = (await transactionModel.create([ {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        } ], { session }))[0];

        await ledgerModel.create([ {
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        } ], { session });

        await ledgerModel.create([ {
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        } ], { session });

        transaction = await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            
            /*{ session, new: true }*/

            { session, returnDocument: 'after' }
        );

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({
            message: "Transaction failed and changes rolled back. Please retry.",
            error: error.message
        });
    } finally {
        session.endSession();
    }

    try {
        await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);
    } catch (emailError) {
        console.error("Email notification failed to send:", emailError);
    }

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction
    });
}

/**
 * 2. Create initial funds transaction from system user
 */
async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        });
    }

    const toUserAccount = await accountModel.findOne({ _id: toAccount });
    const fromUserAccount = await accountModel.findOne({ user: req.user._id });

    if (!toUserAccount) {
        return res.status(400).json({ message: "Invalid toAccount" });
    }
    if (!fromUserAccount) {
        return res.status(400).json({ message: "System user account not found" });
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const [transaction] = await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "COMPLETED"
        }], { session });

        await ledgerModel.create([
            { account: fromUserAccount._id, amount, transaction: transaction._id, type: "DEBIT" },
            { account: toAccount, amount, transaction: transaction._id, type: "CREDIT" }
        ], { session });

        await session.commitTransaction();
        
        return res.status(201).json({
            message: "Initial funds transaction completed successfully",
            transaction
        });
    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({ message: "System fund allocation failed", error: error.message });
    } finally {
        session.endSession();
    }
}

/**
 * 3. Get transaction history (Flexible context for User Sessions & URL parameters)
 */
async function getTransactionHistory(req, res) {
    try {
        let accountId = req.params.accountId;

        // Fallback context logic: If no account ID is passed via route URL parameter, 
        // try to automatically locate the account belonging to the logged-in session user.
        if (!accountId && req.user && req.user._id) {
            const userAccount = await accountModel.findOne({ user: req.user._id });
            if (userAccount) {
                accountId = userAccount._id;
            }
        }

        if (!accountId) {
            return res.status(400).json({ message: "Account mapping context could not be found." });
        }

        // Correctly matches target database records using internal Account IDs
        const transactions = await transactionModel.find({
            $or: [{ fromAccount: accountId }, { toAccount: accountId }]
        }).sort({ createdAt: -1 });

        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching history:", error);
        return res.status(500).json({ message: "Server error while fetching history" });
    }
}

module.exports = {
    createTransaction,
    transferFunds: createTransaction, 
    createInitialFundsTransaction,
    getTransactionHistory
};