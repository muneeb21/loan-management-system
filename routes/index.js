const express = require("express");
const router = express.Router();
const passport = require("passport");

const userRoutes = require("./user");
const loanRoutes = require("./loan");

const reportsController = require("../controllers/reports-controller");

router.use("/user", userRoutes);
router.use("/loan", loanRoutes);



module.exports = router;