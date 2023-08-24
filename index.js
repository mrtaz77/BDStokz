const app = require('./app');

// DB configuration
require('dotenv').config();
const db = require('./config/database');
db.init();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
