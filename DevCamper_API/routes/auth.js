const express = require("express");
// use deastructuring and bring register method
const { register } = require("../controllers/auth");
// create router
const router = express.Router();
router.post("/register", register);
module.exports = router;
