const jwt = require('jsonwebtoken');

// function to login user into a session
const loginUser = async (res,name) => {
    // create token
    const payload = {
        name: name
    }

    let token = jwt.sign(payload, process.env.JWT_SECRET);

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