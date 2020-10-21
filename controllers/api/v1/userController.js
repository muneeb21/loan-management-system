
const User=require('../../../models/user');
const Loan = require('../../../models/loan');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

// Register a new User
module.exports.userSignup = async function(req, res)  {
	try {
		const { name, email, password, userType,phone,confirmPassword } = req.body;
		let user = await User.findOne({email: req.body.email});
        let user2 = await User.findOne({phone: req.body.phone});   
		// Check if user is already Registered
		if (user || user2) {
			return res.status(400).json({
				message:
					"This email/phone number is already registered, try with another email/phone or login instead",
			});
        }
         
        if(confirmPassword!=password){
            return res.status(422).json({
				message:
					"Password and confirm-password not equal",
			});

        }
        
           // Encrypt Password
           const salt = await bcrypt.genSalt(10);
           const hashedPwd = await bcrypt.hash(password, salt);

        const loans=[];
        let isApproved=false;
        if(userType=="agent"){
            // change object shorthand property
            const newUser=await User.create( { name:name, email:email,password: hashedPwd,userType: userType,isApproved:isApproved,loans:loans,phone:phone });

            return res.status(201).json({
				message:
					"Thanks for applying. Kindly wait for the approval!",
			});
        }
        
// add condition
		isApproved=true;
        
		const newUser=await User.create( { name:name, email:email,password: hashedPwd,userType: userType,isApproved:isApproved,loans:loans,phone:phone });

		

		return res.status(201).json({
			message: `Registration successful`,
			// data:  {
            //     token: jwt.sign(newUser.toJSON(), 'codeial', {expiresIn:  '1000000000'})
            // }
		});

	
	

	} catch (err) {
		console.log('********',err);
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
}

// login for a user

module.exports.login = async function(req, res){

    try{
        let user = await User.findOne({email: req.body.email});
        if (!user){
            return res.json(401, {
                message: "Invalid Email or Password"
			});
			
		}
        let pwdMatch = await bcrypt.compare(req.body.password, user.password);
			if (!pwdMatch){
				return res.status(401).json({ message: "Invalid Email or Password" });
            }

        

		// Comparing entered password with stored password
		
			

            if(user.isApproved==true){

                return res.json(200, {
                    message: 'Sign in successful, here is your token',
                    data:  {
                        token: jwt.sign(user.toJSON(), 'codeial', {expiresIn:  '10000000'})
                    
                    },
                    id: user._id,
                    
                    
                });
            }
            return res.json(202, {
                message: 'Your approval request is still pending',
                
            });
       

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}


// send data

// module.exports.sendData= async function(req,res){

//     let user = await User.findById( req.params.id).select("-password");

//     try{
//     if (!user){
//         return res.json(422, {
//             message: "Invalid username "
//         });
        
//     }

//     if(user.userType=='customer'){
        
//         return res.json(200, {
//             message: 'Here is the loan data ',
//             data:   user.loans
            
//         })
//     }

//     if(user.userType=='agent'){
        
//         return res.json(200, {
//             message: 'Here is the loan data',
//             data:   user.loans
            
//         });
//     }
 
//     return res.json(200, {
//         message: 'Sign in successful',
//         data:   user.loans
        
//     });
    
    

        
    

// }catch(err){
//     console.log('********', err);
//     return res.json(500, {
//         message: "Internal Server Error"
//     });
// }

// }


// list users

module.exports.listUsers= async function(req,res){

    let user = await User.findById(req.params.id);

    try{
    if (!user){
        return res.json(422, {
            message: "Invalid username "
        });
        
    }

    if(user.userType=='customer'){
        
        return res.json(401, {
            message: 'Not Authurised',
            
            
        })
    }

    const customer=await User.find({userType:"customer"}).select("-password");
    

    if(user.userType=='agent'){

         return res.json(200, {
            message: 'Here are all the users',
            data:   customer
            
        });
    }

    const agent=await User.find({userType:"agent"}).select("-password");
    return res.json(200, {
        message: 'Here are all the users',
        data:  {
            customers:customer,
            agents:agent
        }
        
    });
    
    

        
    

}catch(err){
    console.log('********', err);
    return res.json(500, {
        message: "Internal Server Error"
    });
}

}



// Agent approval requests

module.exports.agentRequestList=async function(req,res){

    try{
        let user = await User.findById(req.params.id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}
          
         
        
        
            if(user.userType=='admin'){
                let agent = await User.find({isApproved:false}).select("-password");
                    // Dont populate sensitive/redundant fields
                   
              
             
                
			   
                return res.json(200, {
                    message: 'here is the list of agent requests',
                    data:  agent
                });
            }


            i

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

// agent request approve

module.exports.approveAgent = async function(req, res){

    try{
        let user = await User.findById(req.params.id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

		
			

            if(user.userType=='admin'){

                const user=await User.findById(req.body.agentId);
                if(!user){
                    return res.json(404, {
                        message: 'Agent Not Found',
                        
                    });
                }

          User.findByIdAndUpdate(req.body.agentId, { isApproved: true }, function (err, docs) { 
                     if (err){ 
                    console.log(err) 
                       } 
                   else{ 
                      console.log("Updated User : ", docs); 
                       } 
            });
                return res.json(200, {
                    message: 'Agent Approved successfully',
                    
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



// update password

module.exports.updatePassword = async function(req, res){

    try{
        let user = await User.findById(req.params.id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
        }
        
        if(req.body.password!=req.body.confirmPassword){

            return res.status(400).json({
				message:
					"Password and confirm-password not equal",
			});
        }

        let pwdMatch = await bcrypt.compare(req.body.prevPassword, user.password);
			if (!pwdMatch){
				return res.status(401).json({ message: "wrong password" });
            }
		
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(req.body.password, salt);

            

          User.findByIdAndUpdate(req.params.id, { password: hashedPwd }, function (err, docs) { 
                     if (err){ 
                    console.log(err) 
                       } 
                   else{ 
                      console.log("Updated User : ", docs); 
                       } 
            });
                
            
            return res.json(200, {
                message: 'Password Updated Successfully',
                
            });
       

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}
