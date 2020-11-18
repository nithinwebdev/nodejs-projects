const express = require("express");
// use deastructuring and bring register method
const { register, login } = require("../controllers/auth");
// create router
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
module.exports = router;
