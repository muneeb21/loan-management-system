
const User=require('../../../models/user');
const Loan = require('../../../models/loan');




// utility function for calculating principle

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

// utility function for calculating interest

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





// Function for making new loan request
module.exports.newLoanRequest= async function(req,res){

    

    try{
        //  if user does not exists then return
        
        const user = await User.findById(req.user._id);
        

           if (!user){
               return res.json(422, {
                      message: "Invalid user "
               });
        
    }
        
        // Check for principle, do not accept values less than 10000
        if(req.body.principle<10000){

            return res.json(422, {
                message: 'Enter a valid amount'
                
            })

        }

        // store the data of loan

        const principle=req.body.principle;
        const interestRate=calculateInterest(principle);
        
        const monthsToRepay=req.body.monthsToRepay;
        const status="NEW";
        const repaymentAmount=calculateAmount(principle,monthsToRepay,interestRate);
        const emi=repaymentAmount/monthsToRepay;
        const id=req.user._id;

        

        //  You can create a loan only if you are customer or you are an approved agent
           if(user.userType=='customer'){
       

               const newRequest=await Loan.create( { user:id, principle:principle,interest:interestRate,
                monthsToRepay:monthsToRepay,repaymentAmount:repaymentAmount,emi:emi,status:status});

        

    
        // Push the newly created loan in user

        user.loans.unshift(newRequest);
		await user.save();

        return res.json(200, {
            message: 'Loan request made successfully',
            data:{
                loan:newRequest
            }
                     
        })
    }

    // check for agent
        if(user.userType=="agent" && user.isApproved==true){
    
          const email= req.body.email;
          const tempUser= await User.findOne({email:email});
            if(tempUser){

        
                const userId=tempUser._id;
                const newRequest=await Loan.create( { user:userId, principle:principle,
                interestRate:interestRate,monthsToRepay:monthsToRepay,
                repaymentAmount:repaymentAmount,emi:emi,status:status});
       
                tempUser.loans.unshift(newRequest);
                await tempUser.save();
        
                return res.json(200, {
                            message: 'Loan request made successfully',
                            data: newRequest
        
                              });
       }
    }

    

    return res.json(422, {
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
        let user = await User.findById(req.user._id);
           
    // Check for user 
        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

		// Only admin can change the status of Loan

            if(user.userType=='admin'){

                Loan.findByIdAndUpdate(req.body.loanId, { status: 'APPROVED' }, function (err, docs) { 
                     if (err){ 
                         console.log(err) 
                        } 
                   else{ 
                        console.log("Updated data : ", docs); 
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
        // Check for user
        let user = await User.findById(req.user._id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

		
		// Only admin can reject a loan 

            if(user.userType=='admin'){
        // If user is admin then find the loan and update    
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
        let user = await User.findById(req.user._id);
        // check for the user
        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

		// Only an agent can edir a loan but he has to be approved himself
			
        if(user.userType=='agent' && user.isApproved==true){

              let loan=await Loan.findById(req.body.loanId);
              if(loan){
        //  Loan cannot be edited if it is approved 
                
                 if(loan.status!="APPROVED"){

                     let date=new Date();

        //  Maintain a history of the loan before editing that is create an object abd push it to the history array of loan
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
            //  Calculate new loan parameters and update
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
            // Return success after editting loan
                        return res.json(200, {
                             message: 'Loan edited!',
                   
                            });
              }
            // Else loan is already approved and cant edit it 
              return res.json(401, {
                message: 'Loan already approved, cannot update, Sorry!',
                
                 });
        
            }
        // Now either loan does not exist or user is unauthorised to edit
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



// Functions to list all loans
module.exports.allLoans=async function(req,res){
      
    try{
    // Check for user
        let user = await User.findById(req.user._id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

		
		
	  		
    //  If it is a customer then he can only list his own loans
            if(user.userType=='customer'){
                let customerLoans = await Loan.find({user:req.user._id}).select("-user");                  
                			   
                return res.json(200, {
                    message: 'Here is the list of loans',
                    data:  customerLoans
                });
            }

    // An agent or an admin can see all the loans
            if(user.userType=="agent" && user.isApproved==true || user.userType=="admin"){
                let loans=await Loan.find().select("-user");
                    

                return res.json(200, {
                    message: 'Here is the list of loans',
                    data:  loans
                });

            }
    // If an agent is still not approves then
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



// Function to get Loans by filter like status
module.exports.LoansbyFilter=async function(req,res){
      
    try{
   // check for user 
        let user = await User.findById(req.user._id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

	// If user is a customer then he can filter onlly his loans
            if(user.userType=='cutomer'){
                let customerLoans = await Loan.find({user:req.user._id},{status:req.body.status}).select("-user");
              
             
                return res.json(200, {
                    message: 'Here is the list of loans according to a status',
                    data:  customerLoans
                });
            }

    // An agent and an admin can list all the loans according to a status
            if(user.userType=="agent" && user.isApproved==true || user.userType=="admin"){
                let loans=await Loan.find({status:req.body.status});

                return res.json(200, {
                    message: 'Here is the list of loans according to a status',
                    data:  loans
                });

            }

            return res.json(422, {
                message: 'Unauthorised user or there are no loans to show!',
                
            });
       

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}
