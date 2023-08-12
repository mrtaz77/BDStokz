// express : Fast, unopinionated, minimalist web framework for node.js
const express = require('express');
var app = express();

//Cross-Origin Resource Sharing : Connect/Express middleware 
var cors = require('cors');

//set up template engine
app.set('view engine','ejs')
app.use(cors());
app.options('*',cors());
app.use(express.json());

// static files
// app.use('/api',require('./route/api'))

module.exports = app;