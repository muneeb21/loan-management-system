  
const express = require("express");
const router = express.Router();
const passport=require("passport");

const loanRoutes = require("./loan");
const userController = require("../controllers/api/v1/userController");

router.use("/loan", loanRoutes);

router.post("/signup", userController.userSignup);
router.post("/login", userController.login);

router.get("/sendData", userController.sendData);
router.get("/list", userController.sendData);

router.get(
	"/sendData",
	passport.authenticate("jwt", { session: false }),
	userController.sendData
);

router.get(
	"/listUsers/:id",
	passport.authenticate("jwt", { session: false }),
	userController.listUsers
);

router.get(
	"/agentRequestList/:id",
	passport.authenticate("jwt", { session: false }),
	userController.agentRequestList
);

router.get(
	"/approveAgent/:id",
	passport.authenticate("jwt", { session: false }),
	userController.approveAgent
);


module.exports = router;