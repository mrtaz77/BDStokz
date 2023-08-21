const express = require('express');
const morgan = require('morgan');
const cors = require('cors') ;

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

// using routes and linking them to routers 
// app.use('/api/login',require('./route/login'));
app.use('/api/data', require('./route/data'));

module.exports = app;
