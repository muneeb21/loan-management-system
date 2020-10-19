const mongoose = require('mongoose');



const loanSchema = new mongoose.Schema({
    
    user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
    principle: {
        type: String,
        required: true
    },
    interest: {
        type: Number,
        required: true,
        unique: true
    },
    
    loanType: {
        type: String,
        required: true
    },
    monthsToRepay: {
        type: Number,
        required: true
    },
    collateral: {
        type: String,
        required: true
    },
    repaymentAmount: {
        type: Number,
        required: true
    },
    emi: {
        type: Number,
        required: true
    },
    status: {
		type: String,
		required: true,
		enum: ["NEW", "REJECTED", "APPROVED"],
	},
    
    
}, {
    timestamps: true
});






const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;