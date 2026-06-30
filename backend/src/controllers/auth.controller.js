// backend/src/controllers/auth.controller.js

const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../models/blackList.model");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model"); // Added Transaction Model
const mongoose = require("mongoose");
const ledgerModel = require("../models/ledger.model");
/**
 * - USER REGISTER CONTROLLER
 * - POST /api/auth/register
 */
// backend/src/controllers/auth.controller.js

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

        // 5. Secure Cookie Configuration
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000 
        };

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

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000 
    };

    res.cookie("token", token, cookieOptions);
    
    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
 */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        });
    }

    await tokenBlackListModel.create({
        token: token
    });

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(200).json({
        message: "User logged out successfully"
    });
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