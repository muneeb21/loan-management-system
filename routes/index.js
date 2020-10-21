const express = require("express");
const router = express.Router();
const passport = require("passport");



// router.use("/loan", loanRoutes);

router.use('/user', require('./user'));




module.exports = router;