const express = require("express");
const router = express.Router();
const passport = require("passport");



console.log('router loaded');

router.use('/user', require('./user'));




module.exports = router;