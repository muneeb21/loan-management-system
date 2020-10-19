const express = require("express");
const router = express.Router();
const passport = require("passport");

const userRoutes = require("./user");


const reportsController = require("../controllers/reports-controller");

router.use("/user", userRoutes);




module.exports = router;