const express = require('express');
const router = express.Router({mergeParams: true});
const partController = require('../controller/participate');

router.post('/',[
    body('userId').notEmpty().withMessage('userId is required'),
    body('activityId').notEmpty().withMessage('activityId is required'),
    body('pmtStatus').notEmpty().withMessage('pmtStatus is required')
],async (req,res,next)=>{

    try{
        const result = await partController.getParticipation(req.body);
        if(result == null){
            const result = await partController.setParticipation(req.body);
            console.log(result);
            console.log(`${req.body.userId} registered successfully...`);
            res.json(result);
        }
        else{
            const result = await partController.updatePmtStatus(req.body);
            console.log(result);
            console.log(`${req.body.userId} pmtStatus updated successfully...`);
            res.json(result);
        }

    }catch(err){
        console.log(`Found ${err.message} in participate post...`);
        next(err);
    }

})

