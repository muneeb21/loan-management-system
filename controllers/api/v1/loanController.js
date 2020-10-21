
const User=require('../../../models/user');
const Loan = require('../../../models/loan');
const jwt = require('jsonwebtoken');
const crypto=require('crypto');
// const Utils = require('./utils');


function calculateInterest(principle){
    if(principle>=10000 && principle<50000){
        return 2;
    }
    if(principle>=50000 && principle<100000){
        return 3;
    }

    if(principle>=10000){
        return 4;
    }
}



function calculateAmount(principle,monthsToRepay,interestRate){
    const applicationFee= 500;
    const p=principle;
    const interestPerMonth= (principle/100)*interestRate;
    const totalInterest= interestPerMonth*monthsToRepay;
    console.log("totalInterest",totalInterest);
    console.log("interestPerMonth",interestPerMonth);

     const x=totalInterest+applicationFee+parseInt(p);
    
    return x;
  
  }

// const userLoan=require('./userController');



// new loan request
module.exports.newLoanRequest= async function(req,res){

    

    try{

        const user = await User.findById(req.params.id);
        

    if (!user){
        return res.json(422, {
            message: "Invalid user "
        });
        
    }
         console.log(req.body);
        
        const principle=req.body.principle;
        const interestRate=calculateInterest(principle);
        
        const monthsToRepay=req.body.monthsToRepay;
        const status="NEW";
        const repaymentAmount=calculateAmount(principle,monthsToRepay,interestRate);
        const emi=repaymentAmount/monthsToRepay;
        const id=req.params.id;
        console.log(principle,interestRate,monthsToRepay,status,repaymentAmount);

    if(user.userType=='customer'){
       

        const newRequest=await Loan.create( { user:id, principle:principle,interest:interestRate,monthsToRepay:monthsToRepay,
        repaymentAmount:repaymentAmount,emi:emi,status:status});

        

        // console.log(newRequest);

        user.loans.unshift(newRequest);
		await user.save();

        return res.json(200, {
            message: 'loan request made successfully',
            
            
        })
    }

    if(user.userType=="agent" && user.isApproved==true){
    //   const name= req.body.name;
      const email= req.body.email;
       const tempUser= await User.findOne({email:email});
       if(tempUser){

        // return res.json(200, {
        //     message: 'loan request made successfully',
        //     id: tempUser._id
            
        // })
          const userId=tempUser._id;
        const newRequest=await Loan.create( { user:userId, principle:principle,interestRate:interestRate,monthsToRepay:monthsToRepay,
            repaymentAmount:repaymentAmount,emi:emi,status:status});
       
       tempUser.loans.unshift(newRequest);
       await tempUser.save();
        }
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

		
			

            if(user.userType=='admin'){

          Loan.findByIdAndUpdate(req.body.loanId, { status: 'APPROVED' }, function (err, docs) { 
                     if (err){ 
                    console.log(err) 
                       } 
                   else{ 
                      console.log("Updated User : ", docs); 
                       } 
            });
                return res.json(200, {
                    message: 'Loan Approved successfully',
                    
                });
            }
            return res.json(401, {
                message: 'Unuthorised user',
                
            });
       

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}


module.exports.rejectLoan=async function(req,res){

    try{
        let user = await User.findById(req.params.id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

		
			

            if(user.userType=='admin'){

          Loan.findByIdAndUpdate(req.body.loanId, { status: 'REJECTED' }, function (err, docs) { 
                     if (err){ 
                    console.log(err) 
                       } 
                   else{ 
                      console.log("Updated User : ", docs); 
                       } 
            });
                return res.json(200, {
                    message: 'Loan Rejected',
                    
                });
            }
            return res.json(401, {
                message: 'Unuthorised user',
                
            });
       

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}



module.exports.editLoan=async function(req,res){

    try{
        let user = await User.findById(req.params.id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

		
			

            if(user.userType=='agent' && user.isApproved==true){

              let loan=await Loan.findById(req.body.loanId);
              if(loan){
                if(loan.status!="APPROVED"){

                let date=new Date();

                let loanHistory={
                 loanId : loan._id,
                 previousStatus: loan.status,
                 previousPrinciple: loan.principle,
                 previousMonthsToRepay: loan.monthsToRepay,
                 previousEmi: loan.emi,
                 previousRepaymentAmount  : loan.repaymentAmount,
                 dateOfEdit : date
                }
                loan.history.unshift(loanHistory);
                await loan.save();
             
                    const principle=req.body.principle;
                    const monthsToRepay= req.body.monthsToRepay;
                    const interestRate=calculateInterest(principle);
                    const repaymentAmount=calculateAmount(principle,interestRate,monthsToRepay);
                    const emi=repaymentAmount/monthsToRepay;
                    const status="NEW";
                
                Loan.findByIdAndUpdate(req.body.loanId, { principle,interestRate,monthsToRepay,repaymentAmount,emi,status }, function (err, docs) { 
                    if (err){ 
                   console.log(err) 
                      } 
                  else{ 
                     console.log("Updated loan : ", docs); 
                      } 
           });
               return res.json(200, {
                   message: 'Loan edited!',
                   
               });
              }
             
              return res.json(401, {
                message: 'Loan already approved, cannot update, Sorry!',
                
            });
        
            }
            return res.json(401, {
                message: 'Loan does not exist',
                
            });
              
            }
        
            return res.json(401, {
                message: 'Unuthorised user',
                
            });
       

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}




module.exports.allLoans=async function(req,res){
      
    try{
        let user = await User.findById(req.params.id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

		
		
	  		
     
            if(user.userType=='customer'){
                let customerLoans = await Loan.find({user:req.params.id}).select("-user");                   
              
                
                
			   
                return res.json(200, {
                    message: 'here is the list of loans',
                    data:  customerLoans
                });
            }


            if(user.userType=="agent" && user.isApproved==true || user.userType=="admin"){
                let loans=await Loan.find().select("-user");
                    

                return res.json(200, {
                    message: 'here is the list of loans',
                    data:  loans
                });

            }

            return res.json(422, {
                message: 'Unauthorised user!',
                
            });
       

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}



// loans by filter
module.exports.LoansbyFilter=async function(req,res){
      
    try{
        let user = await User.findById(req.params.id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

		
		
			

            if(user.userType=='cutomer'){
                let customer = await Loan.find({user:req.params.id}).select("-user");
              
             
                
			   
                return res.json(200, {
                    message: 'here is the list of loans',
                    data:  customer.loans
                });
            }


            if(user.userType=="agent" && user.isApproved==true || user.userType=="admin"){
                let loans=await Loan.find({status:req.body.status});

                return res.json(200, {
                    message: 'here is the list of loans',
                    data:  loans
                });

            }

            return res.json(422, {
                message: 'Unauthorised user!',
                
            });
       

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}
