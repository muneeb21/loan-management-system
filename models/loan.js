const mongoose = require('mongoose');



const loanSchema = new mongoose.Schema({
    
    user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		
	},
    principle: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        
    },
    
    
    monthsToRepay: {
        type: Number,
        required: true
    },
   
    repaymentAmount: {
        type: Number,
        
    },
    emi: {
        type: Number,
        
    },
    
    status: {
		type: String,
		enum: ["NEW", "REJECTED", "APPROVED"],
	},
    
    
}, {
    timestamps: true
});






const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;