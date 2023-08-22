const errHandler = (err, req, res, next) => {
    console.log("At middleware/errHandler.js");
    const errStatus = err.statusCode || 500;
    const errMessage = err.message || 'Something went wrong';
    console.log(errMessage)
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}

function notFound(req, res, next){
    // create and send error to next middleware -> errorhandler
    const error = new Error(`not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}


module.exports = {errHandler, notFound};
