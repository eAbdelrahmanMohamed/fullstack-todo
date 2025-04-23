"use strict";
const express = require("express");
const router = express.Router();
const { login, register, logout } = require("../controllers/userController");
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
module.exports = router;
