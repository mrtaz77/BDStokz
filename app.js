const express = require('express');
const morgan = require('morgan');
const cors = require('cors') ;

const errHandler = require('./middleware/errHandler');
const auth = require('./middleware/auth');



const app = express();

app.use(morgan('dev'));
app.use(cors(
    {
        origin: '*',
        methods: "GET,POST,PUT,DELETE, PATCH",
        credentials: true,
        maxAge: 36000,
    }
));
app.use(express.json());
app.set('view engine', 'ejs');

// using routes and linking them to routers 
app.use('/login',require('./route/login'));
app.use('/reg', require('./route/reg'));
app.use('/stock', require('./route/stock'));
app.use('/activity', require('./route/activity'));

// For testing purposes only
app.use('/admin', require('./route/admin'));
app.use('/user', require('./route/user'));

app.use(errHandler.notFound);
app.use(errHandler.errHandler);

module.exports = app;
