// backend/src/controllers/auth.controller.js

const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../models/blackList.model");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model"); 
const ledgerModel = require("../models/ledger.model");
const mongoose = require("mongoose");

// Standardized Cookie Options for Cross-Origin (Netlify Frontend -> Render Backend)
const cookieOptions = {
    httpOnly: true,
    secure: true,      // Must be true for cross-origin
    sameSite: "none",  // Must be "none" to allow third-party cookies across domains
    maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
};

/**
 * - USER REGISTER CONTROLLER
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
    try {
        const { email, name, password } = req.body;

        const isExists = await userModel.findOne({ email: email });

        if (isExists) {
            return res.status(422).json({
                message: "Email already exists",
                status: "failed"
            });
        }

        // 1. Create the User Profile
        const user = await userModel.create({
            email, password, name
        });

        // 2. Create the Bank Account
        const newAccount = await accountModel.create({
            user: user._id
        });

        // 3. Inject Welcome Bonus Safely (Transaction + Ledger)
        try {
            const systemAccountId = "111111111111111111111111"; // System Bank ID

            // A. Create the Transaction Receipt
            const welcomeTx = await transactionModel.create({
                fromAccount: systemAccountId, 
                toAccount: newAccount._id,
                amount: 7000,
                status: "COMPLETED", 
                idempotencyKey: `welcome-bonus-${user._id}`
            });

            // B. Write to the Ledger (CREDIT the user's account)
            await ledgerModel.create({
                transaction: welcomeTx._id,
                account: newAccount._id,
                type: "CREDIT",
                amount: 7000
            });

            // C. Write to the Ledger (DEBIT the system account to keep books balanced)
            await ledgerModel.create({
                transaction: welcomeTx._id,
                account: systemAccountId,
                type: "DEBIT",
                amount: 7000
            });

        } catch (txError) {
            console.error("Welcome Bonus Error:", txError.message);
        }

        // 4. Generate Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        
        // 5. Apply Secure Cookie Configuration
        res.cookie("token", token, cookieOptions);
        
        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });

        // 6. Send Email Safely
        try {
            await emailService.sendRegistrationEmail(user.email, user.name);
        } catch (emailError) {
            console.error("Email Sending Error:", emailError.message);
        }

    } catch (error) {
        console.error("Registration Server Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

/**
 * - USER LOGIN CONTROLLER
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");
        
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        res.cookie("token", token, cookieOptions);
        
        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        console.error("Login Server Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
 */
async function userLogoutController(req, res) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(200).json({
                message: "User logged out successfully"
            });
        }

        await tokenBlackListModel.create({
            token: token
        });

        // Browsers require the exact same path and domain parameters to clear the cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("Logout Server Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

/**
 * - Get Current Logged In User
 * - GET /api/auth/me
 */
async function getUserProfileController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    res.status(200).json({
        user: {
            _id: req.user._id,
            email: req.user.email,
            name: req.user.name
        }
    });
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController,
    getUserProfileController
};