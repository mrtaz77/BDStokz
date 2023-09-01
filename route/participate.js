const express = require('express');
const router = express.Router({mergeParams: true});
const partController = require('../controller/participate');
const { body } = require('express-validator');


router.post('/',[
    body('userId').notEmpty().withMessage('userId is required'),
    body('activityId').notEmpty().withMessage('activityId is required')
],async (req,res,next)=>{
    try{
        const result = await partController.getParticipation(req.body);
        console.log(result);
        if(result[0] == null){
            const part = await partController.setParticipation(req.body);
            if(part != null){
                console.log(`${req.body.userId} registered successfully for ${req.body.activityId}...`);
                return res.json({ message: `${req.body.userId} registered successfully for ${req.body.activityId}...` });
            }else{
                return res.json({ message: `Invalid registration...` });
            }
        }
        else{
            return res.json({ message: `${req.body.userId} already registered for ${req.body.activityId}...` });
        }

    }catch(err){
        console.log(`Found ${err.message} in participate post...`);
        next(err);
    }
})

module.exports = router