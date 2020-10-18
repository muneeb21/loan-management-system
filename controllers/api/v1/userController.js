
const User=require('../../../models/user');



// Register a new User
module.exports.userSignup = async function(req, res)  {
	try {
		const { name, email, password, userType } = req.body;
		let user = await User.findOne({email: req.body.email});

		// Check if user is already Registered
		if (user) {
			return res.status(200).json({
				message:
					"This email is already registered, try with another email or login instead",
			});
		}

		
        //  Else register a new user
		const newUser=await User.create( { name, email, password });

		

		return res.status(200).json({
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