const express = require("express");
const router = express.Router();
const passport = require("passport");

const loanController = require("../controllers/api/v1/loanController");

//routes for loan releted quesrries

router.post(
	"/newLoan",
	passport.authenticate("jwt", { session: false }),
	loanController.newLoanRequest
);

router.post(
	"/approveLoan",
	passport.authenticate("jwt", { session: false }),
	loanController.approveLoan
);

router.post(
	"/rejectLoan",
	passport.authenticate("jwt", { session: false }),
	loanController.rejectLoan
);

router.post(
	"/editLoan",
	passport.authenticate("jwt", { session: false }),
	loanController.editLoan
);


router.get(
	"/allLoans",
	passport.authenticate("jwt", { session: false }),
	loanController.allLoans
);

router.post(
	"/loansbyFilter",
	passport.authenticate("jwt", { session: false }),
	loanController.LoansbyFilter
);

module.exports = router;