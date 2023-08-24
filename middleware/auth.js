const jwt = require('jsonwebtoken');

const loginController = require('../controller/login');

const auth = async (req,res,next) => {
    req.user = null;
    // check if user has cookie token

    if(req.cookies.sessionToken){
        let token = req.cookies.sessionToken;
        // verify token was made by server
        jwt.verify(token,process.env.JWT_SECRET,async (err, decoded) =>{
            if(err){
                console.log(`ERROR while verifying token ${err.message}`);
                next(err);
            }

            else{
                const decodedName = decoded.name;
                let result = await loginController.getUserLoginInfoByName(decodedName);

                if(result.length === 0){
                    console.log(`Invalid cookie in auth`);
                }
                else{
                    let time = new Date();

                    req.user = {
                        USER_ID : result[0].USER_ID,
                        NAME : result[0].NAME,
                        EMAIL : result[0].EMAIL,
                        TYPE : result[0].TYPE
                    }
                }
                next();
            }
        });
    }else {
        next();
    }
}

module.exports = {
    auth
}