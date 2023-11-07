const jwt = require('jsonwebtoken');

// function to login user into a session
const loginUser = async (res,payload) => {
    // create token
    
    let token = jwt.sign(payload, process.env.JWT_SECRET);

    // set token in cookie
    let options = {
        maxAge: 9000000, 
        httpOnly: true
    }
    res.cookie('userSessionToken', token, options);
}

module.exports = {
    loginUser
};

//process.env.JWT_SECRET