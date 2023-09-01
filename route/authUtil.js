const jwt = require('jsonwebtoken');

// function to login user into a session
const loginUser = async (res,name,usrtype) => {
    // create token
    const payload = {
        name: name,
        usrtype: usrtype
    }

    let token = jwt.sign(payload, "53r37_L3Ak3D");

    // set token in cookie
    let options = {
        maxAge: 900000, 
        httpOnly: true
    }
    res.cookie('userSessionToken', token, options);
}

module.exports = {
    loginUser
};

//process.env.JWT_SECRET