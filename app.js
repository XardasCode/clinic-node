const express = require('express');


require('./config/db');
require('./config/Assotiations');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(cookieSession({
    "name": "session",
    "secret": process.env.SESSION_SECRET,
    "maxAge": 3600000 // 1 hour
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Which headers are allowed
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // Which methods are allowed
        return res.status(200).json({});
    }
    next();
});

app.use('/api/v1/visits', require('./api/routes/visits'));
app.use('/api/v1/patients', require('./api/routes/patients'));
app.use('/api/v1/doctors', require('./api/routes/doctors'));
app.use('/api/v1/auth', require('./api/routes/auth'));

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404; // Not found
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500); // Internal server error
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;