const express = require("express");
const router = express.Router();
const passport = require("passport");

const loanController = require("../controllers/api/v1/loanController");


router.post(
	"/newLoan/:id",
	passport.authenticate("jwt", { session: false }),
	loanController.newLoanRequest
);

router.post(
	"/approveLoan/:id",
	passport.authenticate("jwt", { session: false }),
	loanController.approveLoan
);

router.post(
	"/rejectLoan/:id",
	passport.authenticate("jwt", { session: false }),
	loanController.rejectLoan
);

router.post(
	"/editLoan/:id",
	passport.authenticate("jwt", { session: false }),
	loanController.editLoan
);


router.get(
	"/allLoans/:id",
	passport.authenticate("jwt", { session: false }),
	loanController.allLoans
);

router.post(
	"/loansbyFilter/:id",
	passport.authenticate("jwt", { session: false }),
	loanController.LoansbyFilter
);

module.exports = router;