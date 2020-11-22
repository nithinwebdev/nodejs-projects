const express = require("express");
// use deastructuring and bring register method
const { register, login, getMe } = require("../controllers/auth");
// create router
const router = express.Router();
// add the auth middleware to access the req.user in middleware/auth.js
const { protect } = require("../middleware/auth");
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
module.exports = router;
