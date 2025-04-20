"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { loginSchema } = require("../joi-validations/userValidation");
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = req.body;
        const existingUser = yield User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        yield User.create({ email, password: hashedPassword });
        return res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const { email, password } = req.body;
        const user = yield User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Email not found" });
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid password" });
        const token = jwt.sign({ _id: user._id, email: user.email }, // include email here
        process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, email });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.logout = (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
};
