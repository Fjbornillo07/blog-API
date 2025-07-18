const User = require('../models/User');
const auth = require('../auth');
const bcrypt = require('bcrypt');
const {errorHandler} = auth;

// User Registration

module.exports.addUser = (req, res) =>{
	
	const {email, username, password} = req.body;		
	
	if(!email || !email.includes("@")){
		return res.status(400).send({message:'Email Invalid'});
	}
	if (!password || password.length < 8) {
        return res.status(400).send({message: 'Password must be atleast 8 characters long'});
    }
    if(!username || typeof username !== 'string'){
    	return res.status(400).send({message:'Invalid username'})
    }

    let newUser = new User({
		email: email,
		username: username,
		password: bcrypt.hashSync(password,10)
	});

    return newUser.save()
    	   .then((result) => res.status(201).send({message:'User registered successfully', result})).catch(err => errorHandler(err,req,res));
}

module.exports.loginUser = (req,res) =>{

	 if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                // Send status 404
                return res.status(404).send({message : "No email found"});
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({ 
                        message : "User logged in successfully",
                        access : auth.createAccessToken(result)})
                } else {

                    //Send status 401
                    return res.status(401).send({message: "Email and password do not match"});
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
    } else{
        return res.status(400).send({message: "Invalid email"})
    }
}