const router = require('express-promise-router')();
const getToken = require('../controller/login');
const {body, validationResult} = require('express-validator');
const {UNAUTHORIZED,INTERNAL_SERVER_ERROR} = require('../controller/HttpStatus')


router.post('/',[
    body('name').notEmpty(),
    body('pwd').notEmpty()
], async (req, res) => {
    console.log(req.body);
    const result = validationResult(req);

    if(result.isEmpty() === false) {
        return res.send({errors: result.array()});
    }

    try {
        const { user, accessToken } = await getToken(req.body);
    
        if (accessToken === null) {
            res.status(UNAUTHORIZED).json({ message: 'Unauthorized' });
        } else {
            console.log(accessToken, user);
            res.json({
                token: accessToken,
                user: user
            });
        }
    } catch (error) {
        console.error(`An error occurred during authentication: ${error}`);
        res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}
)

