
const User=require('../../../models/user');
const Loan = require('../../../models/loan');
const jwt = require('jsonwebtoken');
const crypto=require('crypto');
const Utils = require('./utils');
const { request } = require('http');
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
         
        const principle=req.body.principle;
        const interestRate=Utils.calculateInterest(principle);
        const monthsToRepay=req.body.timetorepay;
        const status="NEW";
        const repaymentAmount=Utils.calculateAmount(principle,monthsToRepay,interest);
        const emi=repaymentAmount/monthsToRepay;
        const id=req.params.id;

    if(user.userType=='customer'){
       

        const newRequest=await Loan.create( { user:id, principle:principle,interest:interestRate,monthsToRepay:monthsToRepay,
        repaymentAmount:repaymentAmount,emi:emi});

        user.loans.unshift(report);
		await user.save();

        return res.json(200, {
            message: 'loan request made successfully',
            
            
        })
    }

    if(user.userType=="agent" && user.isApproved==true){
      const name= req.body.name;
      const email= req.body.email;
       const tempUser= await User.findOne({email:email});
       if(tempUser){
        const newRequest=await Loan.create( { user:tempUser.user, principle:principle,interest:interestRate,monthsToRepay:monthsToRepay,
            repaymentAmount:repaymentAmount,emi:emi});
       }
       user.loans.unshift(report);
       await user.save();

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

          Loan.findByIdAndUpdate(req.body.loanId, { status: 'APPROVE' }, function (err, docs) { 
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

              let loan=await Loan.find(req.body.loanId);
              if(loan){
                if(loan.status!="APPROVED"){

                let obj={
                    ...req.body
                }
                delete obj[req.body.loadId];
                const{
                    principle,
                    monthsToRepay,
                    }=req.body;
                    const interestRate=calculateInterest(principle);
                    const repaymentAmount=calculateAmount(principle,interestRate,monthsToRepay);

                
                Loan.findByIdAndUpdate(req.body.loanId, { principle,interestRate,monthsToRepay,repaymentAmount }, function (err, docs) { 
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

		
		
			

            if(user.userType=='cutomer'){
                let customer = await User.findById(req.body.params).populate({
                    // Dont populate sensitive/redundant fields
                    path: "user",
                    select: "-password -__v",
                    
                }).polulate("-password -__v");
              
             
                
			   
                return res.json(200, {
                    message: 'here is the list of loans',
                    data:  customer.loans
                });
            }


            if(user.userType=="agent" && user.isApproved==true || user.userType=="admin"){
                let loans=await Loan.findOne().populate({
                    path:"user",
                    select: "-password -__v",
                });

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
// module.exports.LoansbyFilter=async function(req,res){
      
//     try{
//         let user = await User.findById(req.params.id);

//         if (!user){
//             return res.json(422, {
//                 message: "Invalid user "
// 			});
			
// 		}

		
		
			

//             if(user.userType=='cutomer'){
//                 let customer = await Loan.find({user:req.params.id}).populate({
//                     // Dont populate sensitive/redundant fields
//                     path: "user",
//                     select: "-password -__v",
                    
//                 });
              
//              let data={};
//              loan
                
			   
//                 return res.json(200, {
//                     message: 'here is the list of loans',
//                     data:  customer.loans
//                 });
//             }


//             if(user.userType=="agent" && user.isApproved==true || user.userType=="admin"){
//                 let loans=await Loan.findOne().populate({
//                     path:"user",
//                     select: "-password -__v",
//                 });

//                 return res.json(200, {
//                     message: 'here is the list of loans',
//                     data:  loans
//                 });

//             }

//             return res.json(422, {
//                 message: 'Unauthorised user!',
                
//             });
       

//     }catch(err){
//         console.log('********', err);
//         return res.json(500, {
//             message: "Internal Server Error"
//         });
//     }
// }
