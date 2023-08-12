var app =  require('./app');

require('./config/stockDb').connect();

const port = 3000;

app.listen(port,()=>{
    console.log('Server active on port '+port);
});