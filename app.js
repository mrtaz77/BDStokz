const express = require('express');
const router = require('express-promise-router')();
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



module.exports = {app};