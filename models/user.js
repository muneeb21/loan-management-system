const mongoose = require('mongoose');


// model schema for user
const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        unique:true
    },
    password: {
        type: String,
        required: true,
        
    },
    userType: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean
        
    },
    loans: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Loan",
		},
	],
    
}, {
    timestamps: true
});






const User = mongoose.model('User', userSchema);

module.exports = User;