
const User=require('../../../models/user');
const Loan = require('../../../models/loan');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

// Register a new User
module.exports.userSignup = async function(req, res)  {
	try {
		const { name, email, password, userType,phone,confirmPassword } = req.body;
        // User should have unique email and phone number
        let user = await User.findOne({email: req.body.email});
        let user2 = await User.findOne({phone: req.body.phone});   
		// Check if user is already Registered
		if (user || user2) {
			return res.status(400).json({
				message:
					"This email/phone number is already registered, try with another email/phone or login instead",
			});
        }
        // check if confirm password and password match 
        if(confirmPassword!=password){
            return res.status(422).json({
				message:
					"Password and confirm-password not equal",
			});

        }

        // Check the length of the password(it should be greater than 7)
        if(password.length<7){
            return res.status(401).json({
				message:
					"The password length is too small",
			});

        }
           
        // Encrypt Password
           const salt = await bcrypt.genSalt(10);
           const hashedPwd = await bcrypt.hash(password, salt);

        // Initialize an array of loans that is empty   
           const loans=[];
        
        // An agent is initially not approved
        let isApproved=false;
        
        // If user type is agent then do the following and admin would decide whether to approve user or not 
        if(userType=="agent"){
            
            
            const newUser=await User.create( { name:name, email:email,password: hashedPwd,userType: userType,isApproved:isApproved,loans:loans,phone:phone });

            return res.status(201).json({
				message:
					"Thanks for applying. Kindly wait for the approval!",
			});
        }
        
       // Otherwise customer is initially approved
		isApproved=true;
        
		const newUser=await User.create( { name:name, email:email,password: hashedPwd,userType: userType,isApproved:isApproved,loans:loans,phone:phone });

		

		return res.status(201).json({
			message: `Registration successful`,
			data:  {
                token: jwt.sign(newUser.toJSON(), 'codeial', {expiresIn:  '1000000000'})
            },
            // id: user._id,
		});

	
	

	} catch (err) {
		console.log('********',err);
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
}

// Function for login for a user

module.exports.login = async function(req, res){

    try{

        // Check for user
        let user = await User.findOne({email: req.body.email});
             if (!user){
                return res.json(401, {
                 message: "Invalid Email or Password"
			   });
			
		}
        
        // Compare the password
        let pwdMatch = await bcrypt.compare(req.body.password, user.password);
			if (!pwdMatch){
				return res.status(401).json({ message: "Invalid Email or Password" });
            }

			
        // Check if user is approved
            if(user.isApproved==true){

                return res.json(200, {
                    message: 'Sign in successful, here is your token',
                    data:  {
                        token: jwt.sign(user.toJSON(), 'codeial', {expiresIn:  '2000000'})
                    
                    },
                    id: user._id,
                    
                    
                });
            }

            // If its the agent then send the following message
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




//Function to list users

module.exports.listUsers= async function(req,res){

    let user = await User.findById(req.user._id);

    try{
    if (!user){
        return res.json(422, {
            message: "Invalid user"
        });
        
    }
    // A customer cannot list users
    if(user.userType=='customer'){
        
        return res.json(401, {
            message: 'Not Authurised',
            
            
        })
    }
    // An agent can only list down customers and not other agents
    const customer=await User.find({userType:"customer"}).select("-password");
    

    if(user.userType=='agent'){

         return res.json(200, {
            message: 'Here are all the users',
            data:   customer
            
        });
    }

    // If its not an agent then its an admin and an admin can list down all the users

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

        // Check for user
        let user = await User.findById(req.user._id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}
          
         
        // Only an admin can approve an agent
        
            if(user.userType=='admin'){
                
                // We wouldnt want to show confidential information
                let agent = await User.find({isApproved:false}).select("-password");
                                  
                return res.json(200, {
                    message: 'here is the list of agent requests',
                    data:  agent
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

// Approve an agent

module.exports.approveAgent = async function(req, res){

    try{
        let user = await User.findById(req.user._id);
    // Check for user
        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
		}

		
		//only an admin can approve a user 

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
        let user = await User.findById(req.user._id);

        if (!user){
            return res.json(422, {
                message: "Invalid user "
			});
			
        }
        
        if(req.body.password!=req.body.confirmPassword){

            return res.status(422).json({
				message:
					"Password and confirm-password not equal",
			});
        }

         // Check the length of the password(it should be greater than 7)
         if(req.body.password.length<7){
            return res.status(422).json({
				message:
					"The password length is too small",
			});

        }

        
        
        //Encrypt new password 
        
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(req.body.password, salt);

            

          User.findByIdAndUpdate(req.user._id, { password: hashedPwd }, function (err, docs) { 
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
