
const User=require('../../../models/user');
const loan = require('../../../models/loan');
const jwt = require('jsonwebtoken');



// new loan request
module.exports.newLoanRequest= async function(req,res){

    

    try{

        const user = await User.findById(req.params.id);
        

    if (!user){
        return res.json(422, {
            message: "Invalid user "
        });
        
    }
    
    if(user.userType=='customer'){
        const principle=req.body.principle;
        const interest=calculateInterest(principle);
        const monthsToRepay=req.body.timetorepay;
        const status="NEW";
        const repaymentAmount=calculateAmount(principle,monthsToRepay);
        const emi=repaymentAmount/monthsToRepay;
        const id=req.params.id;

        const newRequest=await Loan.create( { user:id, principle:principle,interest:interest,monthsToRepay:monthsToRepay,
        repaymentAmount:repaymentAmount,emi:emi});


        return res.json(200, {
            message: 'loan request made successfully',
            
            
        })
    }

    

    return res.json(200, {
        message: 'Loan request cannot be made',
       
        
    });
    
    

        
    

}catch(err){
    console.log('********', err);
    return res.json(500, {
        message: "Internal Server Error"
    });
}

}


// loan approval

module.exports.approveLoan = async function(req, res){

    try{
        let user = await User.findById(req.params.id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

		// Comparing entered password with stored password
		
			

            if(user.userType=='admin'){

                return res.json(200, {
                    message: '',
                    data:  {
                      }
                });
            }
            return res.json(200, {
                message: 'Your approval request is still pending',
                
            });
       

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}

module.exports.rejectLoan=async function(req,res){

}

module.exports.editLoan=async function(req,res){

}



module.exports.listLoan=async function(req,res){

}
