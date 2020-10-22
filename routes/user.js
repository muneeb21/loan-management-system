  
const express = require("express");
const router = express.Router();
const passport=require("passport");

const loanRoutes = require("./loan");
const userController = require("../controllers/api/v1/userController");

router.use("/loan", loanRoutes);



router.post("/signup", userController.userSignup);
router.post("/login", userController.login);



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

router.post(
	"/approveAgent/:id",
	passport.authenticate("jwt", { session: false }),
	userController.approveAgent
);

router.post(
	"/updatePassword/:id",
	passport.authenticate("jwt", { session: false }),
	userController.updatePassword
);

module.exports = router;