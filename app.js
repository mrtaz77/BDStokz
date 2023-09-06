const express = require('express');
const morgan = require('morgan');
const cors = require('cors') ;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const errHandler = require('./middleware/errHandler');
const {auth} = require('./middleware/auth');



const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

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
app.use(auth);

// using routes and linking them to routers 
app.use('/login',require('./route/login'));
app.use('/reg', require('./route/reg'));
app.use('/stock', require('./route/stock'));
app.use('/activity', require('./route/activity'));

// For testing purposes only
app.use('/admin', require('./route/admin'));
app.use('/user', require('./route/user'));
app.use('/order', require('./route/order'));

app.use(errHandler.notFound);
app.use(errHandler.errHandler);

module.exports = app;
