
const User=require('../../../models/user');
const loan = require('../../../models/loan');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

// Register a new User
module.exports.userSignup = async function(req, res)  {
	try {
		const { name, email, password, userType } = req.body;
		let user = await User.findOne({email: req.body.email});

		// Check if user is already Registered
		if (user) {
			return res.status(400).json({
				message:
					"This email is already registered, try with another email or login instead",
			});
        }
           // Encrypt Password
           const salt = await bcrypt.genSalt(10);
           const hashedPwd = await bcrypt.hash(password, salt);

        const loans=[];
        const isApproved=false;
        if(userType=="agent"){
            // change object shorthand property
            const newUser=await User.create( { name:name, email:email,password: hashedPwd,userType: userType,lsApproved:isApproved,loans:loans });

            return res.status(201).json({
				message:
					"Thanks for applying. Kindly wait for the approval!",
			});
        }
        
// add condition
		isApproved=true;
        
		const newUser=await User.create( { name:name, email:email,password: hashedPwd,userType: userType,lsApproved:isApproved,loans:loans });

		

		return res.status(201).json({
			message: `Registration successful`,
			data:  {
                token: jwt.sign(newUser.toJSON(), 'codeial', {expiresIn:  '90000000000'})
            }
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
            return res.json(422, {
                message: "Invalid username "
			});
			
		}
        let pwdMatch = await bcrypt.compare(password, user.password);
			if (!pwdMatch){
				return res.status(401).json({ message: "Invalid Email or Password" });
            }

        

		// Comparing entered password with stored password
		
			

            if(user.isApproved==true){

                return res.json(200, {
                    message: 'Sign in successful',
                    data:  {
                        token: jwt.sign(user.toJSON(), 'codeial', {expiresIn:  '9000000000'})
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


// send data

module.exports.sendData= async function(req,res){

    let user = await User.findById( req.params.id);

    try{
    if (!user){
        return res.json(422, {
            message: "Invalid username "
        });
        
    }

    if(user.userType=='customer'){
        
        return res.json(200, {
            message: 'Here is the loan data ',
            data:   user.loans
            
        })
    }

    if(user.userType=='agent'){
        
        return res.json(200, {
            message: 'Here is the loan data',
            data:   user.loans
            
        });
    }
 
    return res.json(200, {
        message: 'Sign in successful',
        data:   user.loans
        
    });
    
    

        
    

}catch(err){
    console.log('********', err);
    return res.json(500, {
        message: "Internal Server Error"
    });
}

}


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
            message: 'Not Authurised ',
            
            
        })
    }

    const customer=User.find({userType:"cutomer"}).populate
    ("-password -__v","-loans -__v","-userType -__v","-isApproved -__v");

    if(user.userType=='agent'){

         return res.json(200, {
            message: 'Here is the loan data',
            data:   customer
            
        });
    }

    const agent=User.find({userType:"agent"}).populate
    ("-password -__v","-loans -__v","-userType -__v","-isApproved -__v");
    return res.json(200, {
        message: 'Here is the loan data',
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
                let agent = await User.find({isApproved:false}).populate({
                    // Dont populate sensitive/redundant fields
                    path: "user",
                    select: "-password -__v",
                    
                }).polulate("-password -__v");
              
             
                
			   
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

          Loan.findByIdAndUpdate(req.body.loanId, { isApproved: true }, function (err, docs) { 
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