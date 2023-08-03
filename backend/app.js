const express = require('express');
var app = express();
var cors = require('cors');

//set up template engine
app.set('view engine','ejs')
app.use(cors());
app.use(express.json());

// static files
app.use('/assets',express.static('./public/assets'))


//listen to port
app.listen(3000, () => console.log("App is listening on port 3000"));